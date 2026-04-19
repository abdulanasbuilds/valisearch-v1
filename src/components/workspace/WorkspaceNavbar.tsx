import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/useUserStore'
import { LogOut, Zap, Settings } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface WorkspaceNavbarProps {
  credits: number
}

export function WorkspaceNavbar({ credits }: WorkspaceNavbarProps) {
  const navigate = useNavigate()
  const { user, signOut } = useUserStore()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="border-b border-white/[0.06] bg-[#0A0A0A]/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <button onClick={() => navigate('/workspace')} className="text-base font-bold text-foreground hover:text-primary transition-colors">
          ValiSearch
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground">{credits}</span>
            <span className="text-xs text-muted-foreground">credits</span>
          </div>

          {credits < 5 && (
            <button onClick={() => navigate('/workspace?upgrade=true')} className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors">
              Upgrade
            </button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold hover:bg-primary/30 transition-colors">
                {user?.email?.[0].toUpperCase() ?? 'U'}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 bg-[#161616] border-white/[0.08]">
              <div className="px-3 py-2">
                <p className="text-xs font-medium text-foreground truncate">{user?.email}</p>
              </div>
              <DropdownMenuSeparator className="bg-white/[0.06]" />
              <DropdownMenuItem onClick={() => navigate('/settings')} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                <Settings className="w-4 h-4 mr-2" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} className="text-sm text-red-400 hover:text-red-300 cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}