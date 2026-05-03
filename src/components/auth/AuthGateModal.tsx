import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getSupabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Zap } from 'lucide-react'

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
    password: z.string().min(8, 'At least 8 characters'),
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
  } = useForm<FormData>({ resolver: zodResolver(schema) as Parameters<typeof useForm>[0]['resolver'] })

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
        localStorage.setItem(PENDING_IDEA_KEY, idea.trim())
        
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        })
        if (error) throw error

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors">
          <X className="w-4 h-4 text-zinc-400" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-zinc-100" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">ValiSearch</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">
            {tab === 'signup' ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-sm text-zinc-500">
            {tab === 'signup' ? 'Sign up to see your analysis results' : 'Sign in to continue'}
          </p>
        </div>

        {idea && idea.trim().length > 0 && (
          <div className="mb-5 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-1">Your idea</p>
            <p className="text-sm text-zinc-300 line-clamp-2">
              {idea.slice(0, 100)}{idea.length > 100 ? '...' : ''}
            </p>
          </div>
        )}

        <div className="flex mb-5 bg-zinc-800 rounded-lg p-1">
          {(['signup', 'signin'] as const).map((t) => (
            <button 
              key={t} 
              onClick={() => { setTab(t); reset() }} 
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${tab === t ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {t === 'signup' ? 'Sign up' : 'Sign in'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <input 
              {...register('email')} 
              type="email" 
              placeholder="Email address" 
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm placeholder:text-zinc-500 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors" 
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message as string}</p>}
          </div>
          <div>
            <input 
              {...register('password')} 
              type="password" 
              placeholder="Password" 
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm placeholder:text-zinc-500 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors" 
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message as string}</p>}
          </div>
          {tab === 'signup' && (
            <div>
              <input 
                {...register('confirm')} 
                type="password" 
                placeholder="Confirm password" 
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm placeholder:text-zinc-500 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors" 
              />
              {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm.message as string}</p>}
            </div>
          )}
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full py-3 bg-zinc-100 text-zinc-900 font-semibold rounded-lg text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {tab === 'signup' ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-600 mt-4">
          15 free analyses included. No credit card required.
        </p>
      </div>
    </div>
  )
}