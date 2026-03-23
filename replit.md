# ValiSearch

A startup idea validation app that analyzes ideas using AI and generates structured reports covering market research, competitors, product strategy, monetization, branding, and go-to-market plans.

## Architecture

**Pure frontend** — React 18 + Vite + TypeScript. No backend server.

- **Framework**: React + Vite (port 5000)
- **Routing**: React Router v6
- **State**: Zustand
- **UI**: shadcn/ui + Tailwind CSS + Radix UI
- **Data fetching**: TanStack Query

## Key Directories

- `src/pages/` — Route-level pages (Index, Analyze, Dashboard, NotFound)
- `src/components/` — UI components (dashboard sections, landing page, shadcn/ui)
- `src/services/` — API service layer (`api.ts` calls backend or falls back to mock data)
- `src/store/` — Zustand global state (`useAnalysisStore`)
- `src/lib/ai/` — AI provider chain (OpenRouter → Groq → Gemini → OpenAI → Claude)
- `src/lib/api-clients.ts` — External API clients (Brave Search, SerpAPI, Clearbit, etc.)
- `src/types/analysis.ts` — Shared TypeScript types
- `src/config/env.ts` — Environment variable config

## How It Works

1. User enters a startup idea on the landing page (`/`)
2. The app navigates to `/analyze` and runs `analyzeIdea()` from `src/services/api.ts`
3. If `VITE_API_BASE_URL` is set, it calls a real backend endpoint; otherwise it uses mock data
4. Results are stored in Zustand and displayed on the `/dashboard` page

## Environment Variables

See `.env.example` for a full list. Key ones:

- `VITE_API_BASE_URL` — Backend API URL (optional; falls back to mock data if not set)
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` — For Supabase backend
- AI keys: `OPENROUTER_API_KEY`, `GROQ_API_KEY`, `GEMINI_API_KEY`, etc. (server-side only)

## Development

```bash
npm run dev    # Start dev server on port 5000
npm run build  # Build for production
npm run test   # Run unit tests
```

## Deployment

Static site deployment. Build output goes to `dist/`.
