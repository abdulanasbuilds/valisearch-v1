import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSupabase } from '@/lib/supabase'
import { useAnalysisStore } from '@/store/useAnalysisStore'
import { toast } from 'sonner'

const PENDING_IDEA_KEY = 'valisearch_pending_idea'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { runAnalysis } = useAnalysisStore()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = getSupabase()
        if (!supabase) throw new Error('Supabase not configured')
        
        const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.search)

        if (error) {
          console.error('Auth callback error:', error)
          navigate('/login?error=confirmation_failed')
          return
        }

        if (!data.session) {
          navigate('/login')
          return
        }

        const pendingIdea = localStorage.getItem(PENDING_IDEA_KEY)

        if (pendingIdea && pendingIdea.trim().length > 0) {
          localStorage.removeItem(PENDING_IDEA_KEY)
          toast.success('Analysis ready!')
          navigate('/analyze')
          setTimeout(async () => {
            await runAnalysis(pendingIdea.trim())
          }, 300)
        } else {
          navigate('/workspace')
        }
      } catch (err) {
        console.error('Callback error:', err)
        navigate('/login')
      }
    }

    handleCallback()
  }, [navigate, runAnalysis])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      <p className="text-muted-foreground text-sm">Confirming your account...</p>
    </div>
  )
}