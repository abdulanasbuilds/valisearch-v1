import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSupabase } from '@/lib/supabase'
import { useUserStore } from '@/store/useUserStore'
import { useAnalysisStore } from '@/store/useAnalysisStore'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { GettingStartedChecklist } from '@/components/dashboard/GettingStartedChecklist'
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'
import { sanitizeIdea } from '@/lib/sanitize'
import { formatDistanceToNow } from 'date-fns'
import { Zap, ChevronRight, Clock, Loader2, Sparkles, Plus, History, Wallet, Search, TrendingUp, Target, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface AnalysisRecord {
  id: string
  created_at: string
  overall_score: number | null
  data_source: string
  ideas: { idea_text: string; title: string }
}

export default function Workspace() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading: authLoading, profile } = useUserStore()
  const { runAnalysis, isAnalyzing, setIdea: setStoreIdea } = useAnalysisStore()
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [idea, setIdea] = useState('')
  const [credits, setCredits] = useState(15)
  const ideaRef = useRef<HTMLTextAreaElement>(null)

  const STARTER_TEMPLATES = [
    { title: "AI tool for solo founders", text: "An AI assistant that helps solo SaaS founders write marketing copy, run customer interviews, and prioritize their roadmap." },
    { title: "Niche marketplace", text: "A marketplace connecting independent ceramic artists with interior designers looking for one-of-a-kind pieces for client projects." },
    { title: "B2B vertical SaaS", text: "An all-in-one operations platform for independent dental practices: scheduling, billing, patient records, and insurance claims." },
  ]

  // Redirect to onboarding if user hasn't completed it
  useEffect(() => {
    if (profile && !profile.onboarding_completed) {
      navigate('/onboarding', { replace: true })
    }
  }, [profile, navigate])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?returnUrl=/workspace')
      return
    }
    if (!user) return
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
        setAnalyses((data ?? []) as unknown as AnalysisRecord[])
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
      toast.error('Help us out! Describe your idea in at least 15 characters.')
      return
    }
    const sanitized = sanitizeIdea(idea)
    setStoreIdea(sanitized)
    await runAnalysis(sanitized, type)
    const id = useAnalysisStore.getState().lastAnalysisId
    navigate(id ? `/workspace/${id}` : '/dashboard/overview')
  }

  const getScoreBg = (score: number | null) => {
    if (!score) return 'bg-zinc-800'
    if (score >= 70) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    if (score >= 50) return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    return 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  }

  const firstName = user?.email?.split('@')[0] ?? 'builder'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  if (authLoading || !user) {
    return <DashboardLayout><DashboardSkeleton /></DashboardLayout>
  }

  return (
    <DashboardLayout credits={credits}>
      <div className="max-w-6xl mx-auto w-full">
        {/* Welcome Section */}
        <section className="mb-8 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3 break-words">
                {greeting}, {firstName}.
              </h1>
              <p className="text-muted-foreground font-medium text-base sm:text-lg">
                The engine is primed. What idea are we decoding today?
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 bg-card/70 border border-border/60 px-4 sm:px-5 py-3 rounded-2xl backdrop-blur-md w-full md:w-auto">
              <Wallet className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-bold text-white">{credits} Credits available</span>
              <button className="ml-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors bg-white/5 px-2 py-1 rounded-md border border-white/10">Top up</button>
            </div>
          </motion.div>
        </section>

        {/* Bento stats grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mb-8 sm:mb-10">
          <BentoStat label="Reports" value={analyses.length} icon={History} accent="text-white" />
          <BentoStat
            label="Avg Score"
            value={
              analyses.length
                ? Math.round(
                    analyses.reduce((s, a) => s + (a.overall_score || 0), 0) / analyses.length
                  )
                : '—'
            }
            icon={Target}
            accent="text-emerald-400"
          />
          <BentoStat label="Credits" value={credits} icon={Zap} accent="text-amber-400" />
          <BentoStat
            label="Plan"
            value={profile?.plan?.toUpperCase() || 'FREE'}
            icon={TrendingUp}
            accent="text-cyan-400"
          />
        </section>

        {/* Getting Started Checklist */}
        <GettingStartedChecklist
          hasAnalyzed={analyses.length > 0}
          onFocusInput={() => ideaRef.current?.focus()}
        />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Idea Input */}
          <div className="lg:col-span-8 space-y-10">
            <div className="glass-panel rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden group grain-bg border-white/[0.1]">
              <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none group-focus-within:opacity-30 transition-all duration-700">
                <Sparkles className="w-32 h-32 text-white" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-2xl shadow-zinc-900/50">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight">Intelligence Box</h2>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Neural Processing active</p>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    ref={ideaRef}
                    value={idea}
                    onChange={e => setIdea(e.target.value.slice(0, 2000))}
                    placeholder="Paste your raw startup idea here... Be as detailed as possible. Mention your target audience, revenue model, and core feature set for deeper analysis."
                    rows={7}
                    className="w-full bg-black/40 border border-white/[0.08] rounded-2xl sm:rounded-3xl px-4 sm:px-8 py-5 sm:py-7 text-white text-base sm:text-lg placeholder:text-zinc-700 resize-none outline-none focus:border-white/20 focus:bg-black/60 transition-all mb-6 font-medium leading-relaxed"
                  />
                  {idea.length > 0 && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Draft Saved</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6">
                  <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                    <span className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.2em]">{idea.length} <span className="opacity-40">/</span> 2000</span>
                    <div className="h-1 flex-1 sm:w-24 bg-zinc-900 rounded-full overflow-hidden">
                       <motion.div 
                        className="h-full bg-zinc-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(idea.length / 2000) * 100}%` }}
                       />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:flex gap-3 sm:gap-4 w-full sm:w-auto">
                    <button 
                      onClick={() => handleValidate('quick')} 
                      disabled={idea.trim().length < 15 || isAnalyzing || credits < 1} 
                      className="w-full sm:w-auto px-6 sm:px-8 py-4 bg-zinc-900 border border-white/10 text-white text-sm font-black rounded-2xl hover:bg-zinc-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 kinetic-hover"
                    >
                      {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                      Quick Scan
                    </button>
                    <button 
                      onClick={() => handleValidate('full')} 
                      disabled={idea.trim().length < 15 || isAnalyzing || credits < 2} 
                      className="w-full sm:w-auto px-6 sm:px-10 py-4 bg-white text-black text-sm font-black rounded-2xl hover:bg-zinc-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-2xl shadow-white/5 active:scale-95 kinetic-hover"
                    >
                      {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                      Deep Intelligence
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Starter Templates */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Starter Templates</h3>
                <span className="text-[10px] font-bold text-zinc-600">Click to fill</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {STARTER_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.title}
                    onClick={() => { setIdea(tpl.text); ideaRef.current?.focus(); }}
                    className="text-left p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/20 hover:bg-white/[0.05] transition-all group"
                  >
                    <h4 className="text-sm font-black text-white mb-2 tracking-tight">{tpl.title}</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3 group-hover:text-zinc-400 transition-colors">{tpl.text}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: History */}
          <div className="lg:col-span-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
                <History className="w-4 h-4" /> Intelligence History
              </h2>
              <span className="text-[10px] font-black text-zinc-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">{analyses.length} Reports</span>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-24 bg-white/[0.02] rounded-[24px] animate-pulse border border-white/[0.05]" />
                  ))}
                </div>
              ) : analyses.length === 0 ? (
                <div className="text-center py-24 bg-white/[0.01] border border-dashed border-white/10 rounded-[32px] grain-bg">
                  <div className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center mx-auto mb-6">
                    <History className="w-8 h-8 text-zinc-800" />
                  </div>
                  <h3 className="text-lg font-black text-zinc-400 mb-2">Neural Cache Empty</h3>
                  <p className="text-sm text-zinc-600 px-12 leading-relaxed">Your validation history will appear here once you run your first analysis.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {analyses.map(analysis => (
                    <motion.button 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={analysis.id} 
                      onClick={() => navigate(`/workspace/${analysis.id}`)} 
                      className="w-full flex items-center gap-5 p-5 bg-white/[0.02] border border-white/[0.05] rounded-[24px] hover:border-white/20 hover:bg-white/[0.04] transition-all text-left group relative overflow-hidden"
                    >
                      <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 border ${getScoreBg(analysis.overall_score)} shadow-2xl`}>
                        <span className="text-[9px] font-black uppercase opacity-60">Score</span>
                        <span className="text-xl font-black tracking-tighter leading-none">{analysis.overall_score ?? '-'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[16px] font-black text-white truncate group-hover:text-white transition-colors tracking-tight">
                          {analysis.ideas?.title || analysis.ideas?.idea_text?.slice(0, 50) || 'Untitled Analysis'}
                        </p>
                        <p className="text-[11px] font-bold text-zinc-600 mt-1.5 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-800 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
function BentoStat({ label, value, icon: Icon, accent }: { label: string; value: any; icon: any; accent: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 hover:bg-white/[0.05] hover:border-white/10 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{label}</span>
        <Icon className={`w-3.5 h-3.5 ${accent}`} />
      </div>
      <div className="text-2xl font-black tracking-tighter text-white">{value}</div>
    </div>
  )
}
