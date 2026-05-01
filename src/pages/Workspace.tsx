import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSupabase } from '@/lib/supabase'
import { useUserStore } from '@/store/useUserStore'
import { useAnalysisStore } from '@/store/useAnalysisStore'
import { AuthGateModal } from '@/components/auth/AuthGateModal'
import { WorkspaceNavbar } from '@/components/workspace/WorkspaceNavbar'
import { sanitizeIdea } from '@/lib/sanitize'
import { formatDistanceToNow } from 'date-fns'
import { Zap, ChevronRight, Clock, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface AnalysisRecord {
  id: string
  created_at: string
  overall_score: number | null
  data_source: string
  ideas: { idea_text: string; title: string }
}

export default function Workspace() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useUserStore()
  const { runAnalysis, isAnalyzing, setIdea: setStoreIdea } = useAnalysisStore()
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [idea, setIdea] = useState('')
  const [showAuthGate, setShowAuthGate] = useState(false)
  const [credits, setCredits] = useState(15)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?returnUrl=/workspace')
      return
    }
    const supabase = getSupabase()
    
    const fetchAnalyses = async () => {
      setIsLoading(true)
      try {
        if (!supabase) throw new Error('Supabase not configured')
        
        const { data, error } = await supabase
          .from('analysis')
          .select('id, created_at, overall_score, data_source, ideas(idea_text, title)')
          .eq('user_id', user!.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setAnalyses(data ?? [])
      } catch (err) {
        console.error('Failed to fetch analyses:', err)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchCredits = async () => {
      if (!supabase) return
      const { data } = await supabase.from('credits').select('balance').eq('user_id', user!.id).single()
      if (data) setCredits(data.balance)
    }

    fetchAnalyses()
    fetchCredits()
  }, [isAuthenticated, navigate, user])

  const handleValidate = async (type: 'quick' | 'full') => {
    if (idea.trim().length < 15) {
      toast.error('Please describe your idea in more detail.')
      return
    }
    if (!isAuthenticated) {
      setShowAuthGate(true)
      return
    }
    const sanitized = sanitizeIdea(idea)
    setStoreIdea(sanitized)
    navigate('/analyze')
    await runAnalysis(sanitized, type)
  }

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-zinc-500'
    if (score >= 70) return 'text-green-400'
    if (score >= 50) return 'text-amber-400'
    return 'text-red-400'
  }

  const getScoreBg = (score: number | null) => {
    if (!score) return 'bg-zinc-800'
    if (score >= 70) return 'bg-green-500/10 text-green-400'
    if (score >= 50) return 'bg-amber-500/10 text-amber-400'
    return 'bg-red-500/10 text-red-400'
  }

  const firstName = user?.email?.split('@')[0] ?? 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen bg-zinc-950">
      <WorkspaceNavbar credits={credits} />

      <div className="max-w-2xl mx-auto px-4 pt-8 pb-24">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">{greeting}, {firstName}.</h1>
          <p className="text-zinc-500 text-sm">
            {credits > 0 ? `You have ${credits} credit${credits !== 1 ? 's' : ''} remaining.` : 'No credits left. '}
            {credits === 0 && <button onClick={() => navigate('/workspace?upgrade=true')} className="text-zinc-400 hover:underline ml-1">Upgrade</button>}
          </p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-zinc-400" />
            <span className="text-sm font-semibold text-white">Validate a new idea</span>
          </div>
          <textarea
            value={idea}
            onChange={e => setIdea(e.target.value.slice(0, 2000))}
            placeholder="Describe your startup idea..."
            rows={3}
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-zinc-500 resize-none outline-none focus:border-zinc-600 transition-colors mb-3"
          />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs text-zinc-500">{idea.length} / 2000</span>
            <div className="flex w-full sm:w-auto gap-2">
              <button 
                onClick={() => handleValidate('quick')} 
                disabled={idea.trim().length < 15 || isAnalyzing} 
                className="flex-1 sm:flex-none px-4 py-2.5 bg-zinc-800 border border-zinc-700 text-white text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                Quick (1 credit)
              </button>
              <button 
                onClick={() => handleValidate('full')} 
                disabled={idea.trim().length < 15 || isAnalyzing} 
                className="flex-1 sm:flex-none px-4 py-2.5 bg-zinc-100 text-zinc-900 text-sm font-semibold rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                Full (2 credits)
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Your analyses <span className="font-normal text-zinc-500">({analyses.length})</span>
            </h2>
          </div>

          {isLoading ? (
            <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-zinc-900/50 rounded-xl animate-pulse" />)}</div>
          ) : analyses.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl">
              <h3 className="text-base font-semibold text-zinc-300 mb-1">No analyses yet</h3>
              <p className="text-sm text-zinc-500 mb-2">Validate your first startup idea above</p>
            </div>
          ) : (
            <div className="space-y-2">
              {analyses.map(analysis => (
                <button key={analysis.id} onClick={() => navigate(`/workspace/${analysis.id}`)} className="w-full flex items-center gap-3 p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-700 hover:bg-zinc-900 transition-all text-left group">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm ${getScoreBg(analysis.overall_score)}`}>
                    {analysis.overall_score ?? '-'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{analysis.ideas?.title || analysis.ideas?.idea_text?.slice(0, 50) || 'Untitled idea'}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}{analysis.data_source === 'mock' && ' (sample)'}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAuthGate && (
        <AuthGateModal idea={idea} onClose={() => setShowAuthGate(false)} onAuthSuccess={() => setShowAuthGate(false)} />
      )}
    </div>
  )
}