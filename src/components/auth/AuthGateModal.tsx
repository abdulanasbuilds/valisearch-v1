import { useState } from 'react'
import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getSupabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface AuthGateModalProps {
  idea: string
  onClose: () => void
  onAuthSuccess: () => void
}

const PENDING_IDEA_KEY = 'valisearch_pending_idea'

export function AuthGateModal({
  idea,
  onClose,
  onAuthSuccess,
}: AuthGateModalProps) {
  const [tab, setTab] = useState<'signup' | 'signin'>('signup')
  const [isLoading, setIsLoading] = useState(false)

  const signupSchema = z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Min 8 characters'),
    confirm: z.string(),
  }).refine(d => d.password === d.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  })

  const signinSchema = z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(1, 'Enter your password'),
  })

  const schema = tab === 'signup' ? signupSchema : signinSchema

  type FormData = z.infer<typeof signupSchema> & z.infer<typeof signinSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<FormData>({ resolver: zodResolver(schema) as any })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const supabase = getSupabase()
      if (!supabase) throw new Error('Supabase not configured')

      if (tab === 'signup') {
        localStorage.setItem(PENDING_IDEA_KEY, idea.trim())
        
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error

        toast.success('Check your email to confirm your account!')
        onAuthSuccess()

      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        })
        if (error) throw error

        localStorage.setItem(PENDING_IDEA_KEY, idea.trim())
        toast.success('Welcome back!')
        onAuthSuccess()
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-[440px] bg-[#111111] border border-white/[0.08] rounded-2xl p-8 shadow-2xl relative animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.10] transition-colors">
          <X className="w-4 h-4 text-white/60" />
        </button>

        <div className="mb-6">
          <div className="text-sm font-semibold text-primary mb-3 tracking-wide">✦ VALISEARCH</div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            {tab === 'signup' ? 'Your analysis is ready to run.' : 'Welcome back.'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {tab === 'signup' ? 'Create a free account to see your results.' : 'Sign in to continue with your analysis.'}
          </p>
        </div>

        {idea && (
          <div className="mb-5 p-3 rounded-lg bg-primary/[0.08] border border-primary/20">
            <p className="text-xs text-primary/70 uppercase tracking-widest font-medium mb-1">Your idea</p>
            <p className="text-sm text-foreground/80 line-clamp-2">
              {idea.slice(0, 120)}{idea.length > 120 ? '...' : ''}
            </p>
          </div>
        )}

        <div className="flex mb-5 bg-white/[0.04] rounded-lg p-1">
          {(['signup', 'signin'] as const).map((t) => (
            <button key={t} onClick={() => { setTab(t); reset() }} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${tab === t ? 'bg-white/[0.08] text-foreground' : 'text-muted-foreground'}`}>
              {t === 'signup' ? 'Sign up' : 'Sign in'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <input {...register('email')} type="email" placeholder="Email address" className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-foreground text-sm placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors" />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message as string}</p>}
          </div>
          <div>
            <input {...register('password')} type="password" placeholder="Password" className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-foreground text-sm placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors" />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message as string}</p>}
          </div>
          {tab === 'signup' && (
            <div>
              <input {...register('confirm')} type="password" placeholder="Confirm password" className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-foreground text-sm placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors" />
              {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm.message as string}</p>}
            </div>
          )}
          <button type="submit" disabled={isLoading} className="w-full py-3 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1">
            {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
            {tab === 'signup' ? 'Create account & validate →' : 'Sign in & validate →'}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground/50 mt-4">🔒 Free forever. No card needed. 15 validations included.</p>
      </div>
    </div>
  )
}