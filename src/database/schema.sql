-- ValiSearch — Complete PostgreSQL Schema
-- Run in Supabase SQL Editor to set up the database.
-- ═══════════════════════════════════════════════════════════

create extension if not exists "uuid-ossp";

-- ─── Profiles (extends Supabase auth.users) ─────────────────────────────────

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  plan text not null default 'free',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- ─── Credits ────────────────────────────────────────────────────────────────

create table if not exists public.credits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  balance integer not null default 15,
  updated_at timestamptz not null default now()
);

create unique index if not exists credits_user_id_unique on public.credits(user_id);

alter table public.credits enable row level security;

create policy "Users can view own credits"
  on public.credits for select to authenticated
  using (auth.uid() = user_id);

create policy "Users can update own credits"
  on public.credits for update to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own credits"
  on public.credits for insert to authenticated
  with check (auth.uid() = user_id);

-- ─── Credit Transactions ────────────────────────────────────────────────────

create table if not exists public.credit_transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount integer not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create index if not exists credit_tx_user_id_idx on public.credit_transactions(user_id);

alter table public.credit_transactions enable row level security;

create policy "Users can view own transactions"
  on public.credit_transactions for select to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own transactions"
  on public.credit_transactions for insert to authenticated
  with check (auth.uid() = user_id);

-- ─── Ideas ──────────────────────────────────────────────────────────────────

create table if not exists public.ideas (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  idea_text text not null,
  title text,
  created_at timestamptz not null default now()
);

create index if not exists ideas_user_id_idx on public.ideas(user_id);

alter table public.ideas enable row level security;

create policy "Users can view own ideas"
  on public.ideas for select to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own ideas"
  on public.ideas for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Users can delete own ideas"
  on public.ideas for delete to authenticated
  using (auth.uid() = user_id);

-- ─── Analysis ───────────────────────────────────────────────────────────────

create table if not exists public.analysis (
  id uuid primary key default uuid_generate_v4(),
  idea_id uuid not null references public.ideas(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  result_json jsonb not null,
  data_source text not null default 'mock',
  tokens_used integer default 0,
  created_at timestamptz not null default now()
);

create index if not exists analysis_idea_id_idx on public.analysis(idea_id);
create index if not exists analysis_user_id_idx on public.analysis(user_id);

alter table public.analysis enable row level security;

create policy "Users can view own analyses"
  on public.analysis for select to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own analyses"
  on public.analysis for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Users can delete own analyses"
  on public.analysis for delete to authenticated
  using (auth.uid() = user_id);

-- ─── Subscriptions ─────────────────────────────────────────────────────────

create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text not null default 'free',
  status text not null default 'active',
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists subs_user_id_unique on public.subscriptions(user_id);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscription"
  on public.subscriptions for select to authenticated
  using (auth.uid() = user_id);

-- ─── User Roles (separate table per security best practices) ────────────────

create type public.app_role as enum ('admin', 'moderator', 'user');

create table if not exists public.user_roles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null default 'user',
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- ─── Auto-create profile + credits on signup ────────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );

  insert into public.credits (user_id, balance)
  values (new.id, 15);

  insert into public.user_roles (user_id, role)
  values (new.id, 'user');

  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
