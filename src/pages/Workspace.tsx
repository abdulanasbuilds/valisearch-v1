import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSupabase } from '@/lib/supabase'
import { useUserStore } from '@/store/useUserStore'
import { useAnalysisStore } from '@/store/useAnalysisStore'
import { AuthGateModal } from '@/components/auth/AuthGateModal'
import { WorkspaceNavbar } from '@/components/workspace/WorkspaceNavbar'
import { sanitizeIdea } from '@/lib/sanitize'
import { formatDistanceToNow } from 'date-fns'
import { Sparkles, ChevronRight, Clock } from 'lucide-react'
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
  const { runAnalysis, isAnalyzing } = useAnalysisStore()
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
    fetchAnalyses()
    fetchCredits()
  }, [isAuthenticated])

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

  const handleValidate = async () => {
    if (idea.trim().length < 20) {
      toast.error('Please describe your idea in more detail.')
      return
    }
    if (!isAuthenticated) {
      setShowAuthGate(true)
      return
    }
    navigate('/analyze')
    await runAnalysis(sanitizeIdea(idea))
  }

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-muted-foreground'
    if (score >= 70) return 'text-green-400'
    if (score >= 50) return 'text-amber-400'
    return 'text-red-400'
  }

  const getScoreBg = (score: number | null) => {
    if (!score) return 'bg-white/[0.04]'
    if (score >= 70) return 'bg-green-500/10'
    if (score >= 50) return 'bg-amber-500/10'
    return 'bg-red-500/10'
  }

  const firstName = user?.email?.split('@')[0] ?? 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen bg-background">
      <WorkspaceNavbar credits={credits} />

      <div className="max-w-5xl mx-auto px-4 pt-12 pb-24">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">{greeting}, {firstName}. {' '} {hour < 12 ? '☀️' : hour < 17 ? '⚡' : '🌙'}</h1>
          <p className="text-muted-foreground text-sm">
            {credits > 0 ? `You have ${credits} credit${credits !== 1 ? 's' : ''} remaining.` : 'You have no credits remaining. '}
            {credits === 0 && <button onClick={() => navigate('/workspace?upgrade=true')} className="text-primary hover:underline ml-1">Upgrade to continue →</button>}
          </p>
        </div>

        <div className="bg-[#111111] border border-white/[0.08] rounded-2xl p-6 mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Validate a new idea</span>
          </div>
          <textarea
            value={idea}
            onChange={e => setIdea(e.target.value.slice(0, 2000))}
            placeholder="Describe your startup idea..."
            rows={3}
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground/40 resize-none outline-none focus:border-primary/40 transition-colors mb-3"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground/40">{idea.length} / 2000</span>
            <button onClick={handleValidate} disabled={idea.trim().length < 20 || isAnalyzing} className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
              {isAnalyzing ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
              {isAnalyzing ? 'Analysing...' : 'Validate idea →'}
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" /> Your analyses <span className="text-muted-foreground font-normal text-sm">({analyses.length})</span>
            </h2>
          </div>

          {isLoading ? (
            <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/[0.03] rounded-xl animate-pulse" />)}</div>
          ) : analyses.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-white/[0.08] rounded-2xl">
              <div className="text-4xl mb-3">💡</div>
              <h3 className="text-base font-semibold text-foreground mb-1">No analyses yet</h3>
              <p className="text-sm text-muted-foreground mb-5">Validate your first startup idea above</p>
            </div>
          ) : (
            <div className="space-y-2">
              {analyses.map(analysis => (
                <button key={analysis.id} onClick={() => navigate(`/workspace/${analysis.id}`)} className="w-full flex items-center gap-4 p-4 bg-[#111111] border border-white/[0.06] rounded-xl hover:border-white/[0.12] hover:bg-white/[0.03] transition-all text-left group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg ${getScoreBg(analysis.overall_score)} ${getScoreColor(analysis.overall_score)}`}>
                    {analysis.overall_score ?? '—'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{analysis.ideas?.title || analysis.ideas?.idea_text?.slice(0, 60) || 'Untitled idea'}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}{analysis.data_source === 'mock' && ' · sample data'}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAuthGate && (
        <AuthGateModal idea={idea} onClose={() => setShowAuthGate(false)} onAuthSuccess={() => {}} />
      )}
    </div>
  )
}