import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSupabase } from '@/lib/supabase'
import { useUserStore } from '@/store/useUserStore'
import { useAnalysisStore } from '@/store/useAnalysisStore'
import Dashboard from '@/pages/Dashboard'
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'

export default function WorkspaceAnalysis() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useUserStore()
  const { setAnalysis, analysis } = useAnalysisStore()
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id || !user) return

    const loadAnalysis = async () => {
      setIsLoading(true)
      try {
        const supabase = getSupabase()
        if (!supabase) throw new Error('Supabase not configured')
        
        const { data, error } = await supabase
          .from('analysis')
          .select('*, ideas(idea_text, title)')
          .eq('id', id)
          .eq('user_id', user.id)
          .single()

        if (error || !data) {
          setNotFound(true)
          return
        }

        setAnalysis(data.result_json)
      } catch (err) {
        setNotFound(true)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadAnalysis()
  }, [id, user, setAnalysis])

  if (isLoading) return <DashboardSkeleton />

  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Analysis not found or access denied.</p>
          <button onClick={() => navigate('/workspace')} className="text-primary hover:underline text-sm">← Back to workspace</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="border-b border-white/[0.06] px-4 py-3 bg-[#0A0A0A]">
        <button onClick={() => navigate('/workspace')} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">← Back to workspace</button>
      </div>
      <Dashboard />
    </div>
  )
}