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
    <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <button onClick={() => navigate('/workspace')} className="text-base font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5" />
          ValiSearch
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg">
            <Zap className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-xs font-semibold text-white">{credits}</span>
            <span className="text-xs text-zinc-500">credits</span>
          </div>

          {credits < 3 && (
            <button onClick={() => navigate('/workspace?upgrade=true')} className="px-3 py-1.5 bg-zinc-100 text-zinc-900 text-xs font-semibold rounded-lg hover:bg-zinc-200 transition-colors">
              Upgrade
            </button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 text-sm font-bold hover:bg-zinc-700 transition-colors">
                {user?.email?.[0].toUpperCase() ?? 'U'}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 bg-zinc-900 border-zinc-800">
              <div className="px-3 py-2">
                <p className="text-xs font-medium text-white truncate">{user?.email}</p>
              </div>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem onClick={() => navigate('/settings')} className="text-sm text-zinc-400 hover:text-white cursor-pointer">
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