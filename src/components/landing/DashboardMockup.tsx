export function DashboardMockup() {
  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 perspective-1000">
      {/* Background Glow - Layered */}
      <div className="absolute -inset-20 bg-blue-600/10 blur-[140px] rounded-[10rem] -z-10 opacity-30" />
      <div className="absolute -inset-10 bg-purple-600/5 blur-[100px] rounded-[5rem] -z-10 opacity-20" />
      
      {/* Browser chrome / App Window */}
      <div className="rounded-[24px] overflow-hidden border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.8)] bg-[#0C0C0E] backdrop-blur-3xl transform transition-transform duration-700 hover:scale-[1.01]">
        
        {/* Top bar - Refined */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#121214] border-b border-white/[0.05]">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-zinc-800 border border-white/5" />
            <div className="w-3 h-3 rounded-full bg-zinc-800 border border-white/5" />
            <div className="w-3 h-3 rounded-full bg-zinc-800 border border-white/5" />
          </div>
          <div className="flex-1 mx-16 max-w-xl bg-[#080808] border border-white/[0.05] rounded-xl px-5 py-2 flex items-center justify-between group cursor-text">
            <span className="text-[11px] text-zinc-500 font-bold tracking-widest uppercase">valisearch / workspace / alpha-project</span>
            <div className="w-4 h-4 rounded bg-zinc-900 border border-white/5" />
          </div>
          <div className="flex gap-5 items-center">
            <div className="w-24 h-2 bg-zinc-900 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-zinc-700" />
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-900 border border-white/10 shadow-lg" />
          </div>
        </div>
        
        {/* Dashboard content */}
        <div className="flex h-[620px]">
          
          {/* Sidebar - Pro Layout */}
          <div className="w-64 border-r border-white/[0.04] bg-[#0A0A0A]/40 p-6 flex flex-col gap-2 flex-shrink-0 hidden lg:flex">
            <div className="px-3 py-4 text-[10px] text-zinc-600 uppercase tracking-[0.3em] font-black mb-4">
              Intelligence
            </div>
            {[
              { label: 'Market Dynamics', active: true, icon: '⚡' },
              { label: 'Competitive Moat', active: false, icon: '🛡️' },
              { label: 'Persona Mapping', active: false, icon: '🎯' },
              { label: 'Risk Assessment', active: false, icon: '⚠️' },
              { label: 'GTM Strategy', active: false, icon: '🛰️' },
            ].map((item) => (
              <div
                key={item.label}
                className={`px-4 py-3 rounded-xl text-[12px] font-bold cursor-pointer transition-all duration-300 flex items-center gap-4
                  ${item.active 
                    ? 'bg-white/[0.05] text-white border border-white/10 shadow-lg' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'
                  }`}
              >
                <span className={`text-sm ${item.active ? 'opacity-100' : 'opacity-40 grayscale'}`}>{item.icon}</span>
                {item.label}
              </div>
            ))}
            
            <div className="mt-auto p-6 rounded-3xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 shadow-xl">
              <div className="text-[12px] font-black text-white mb-2 uppercase tracking-wider">Scale Plan</div>
              <p className="text-[11px] text-zinc-500 leading-relaxed mb-4 font-medium">Unlock deep-tier research and export to Linear / Notion.</p>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden mb-4">
                <div className="h-full w-3/4 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              </div>
              <button className="w-full py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-zinc-200 transition-colors">
                Upgrade
              </button>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex-1 p-12 overflow-hidden bg-[#0A0A0A]">
            <div className="flex items-start justify-between mb-12">
              <div>
                <h2 className="text-4xl font-black text-white tracking-tighter mb-3">Market Viability</h2>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">Score 75</span>
                  <p className="text-[13px] text-zinc-600 font-medium">Updated 4 mins ago across 42 sources</p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0A0A0A] bg-zinc-800 shadow-xl" />
                  ))}
                </div>
                <button className="bg-white text-black px-6 py-2.5 rounded-2xl text-[13px] font-black uppercase tracking-widest hover:scale-[1.05] transition-all shadow-xl active:scale-95">
                  Share
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Main Score Card */}
              <div className="lg:col-span-2 border border-white/5 rounded-[32px] bg-gradient-to-br from-white/[0.04] to-transparent p-10 flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl">
                <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full group-hover:bg-blue-600/20 transition-all duration-1000" />
                <div className="relative w-48 h-48 mb-8">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="4"/>
                    <circle cx="50" cy="50" r="44" fill="none" stroke="url(#card-gradient)" strokeWidth="6" strokeDasharray="276" strokeDashoffset="69" strokeLinecap="round" className="drop-shadow-[0_0_12px_rgba(59,130,246,0.3)]"/>
                    <defs>
                      <linearGradient id="card-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-7xl font-black text-white leading-none tracking-tighter">75</span>
                    <span className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.3em] mt-3">Index</span>
                  </div>
                </div>
                <div className="text-2xl font-black text-white mb-2 tracking-tight">Strong Potential</div>
                <div className="text-[11px] font-black text-blue-500/80 uppercase tracking-[0.3em] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)]" />
                  Alpha Verified
                </div>
              </div>

              {/* Detail Metrics */}
              <div className="lg:col-span-3 grid grid-cols-2 gap-6">
                {[
                  { label: 'TAM Estimation', value: '$4.2B', trend: '↑ 12% YoY', color: 'text-green-400' },
                  { label: 'Competitive Heat', value: 'Medium', trend: '4 Entry Gaps', color: 'text-blue-400' },
                  { label: 'Moat Strength', value: 'High', trend: 'IP Defensible', color: 'text-purple-400' },
                  { label: 'Time to Market', value: '8wks', trend: 'MVP Optimized', color: 'text-amber-400' }
                ].map((stat, i) => (
                  <div key={i} className="border border-white/5 rounded-[28px] bg-white/[0.02] p-8 flex flex-col justify-between hover:bg-white/[0.04] transition-all duration-300 cursor-default group shadow-lg">
                    <div className="text-[11px] text-zinc-600 font-black uppercase tracking-[0.2em] mb-4 group-hover:text-zinc-400 transition-colors">{stat.label}</div>
                    <div>
                      <div className="text-3xl font-black text-white mb-2 tracking-tighter">{stat.value}</div>
                      <div className={`text-[11px] font-black ${stat.color} tracking-widest uppercase`}>{stat.trend}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights strip - Refined */}
            <div className="mt-10 border border-white/5 rounded-[32px] bg-[#111113] p-8 flex items-start gap-8 group hover:border-white/10 transition-all cursor-default shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-110 transition-all duration-500 shadow-inner">
                <span className="text-white text-3xl font-thin">✧</span>
              </div>
              <div className="relative z-10">
                <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-3 flex items-center gap-3">
                  Synthesis Intelligence
                  <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)] animate-pulse" />
                </h4>
                <p className="text-[16px] text-zinc-500 leading-relaxed max-w-2xl font-medium">
                  Analysis indicates a <span className="text-white">92% match</span> between current market sentiment and your value proposition. Recommended entry via <span className="text-blue-400">Vertical AI</span> integration before Q3 saturation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}