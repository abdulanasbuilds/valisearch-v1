import { useState, useEffect } from 'react'
import { Play } from 'lucide-react'

const LOOM_URL_PATH = '/videos/loom-url.txt'

export function DemoVideo() {
  const [loomUrl, setLoomUrl] = useState<string | null>(null)
  const [showVideo, setShowVideo] = useState(false)

  useEffect(() => {
    fetch(LOOM_URL_PATH)
      .then(r => r.text())
      .then(url => {
        const trimmed = url.trim()
        if (trimmed.startsWith('http')) {
          setLoomUrl(trimmed)
        }
      })
      .catch(() => {
        // No video URL yet — show placeholder
      })
  }, [])

  // Convert Loom share URL to embed URL
  const embedUrl = loomUrl
    ?.replace('www.loom.com/share/', 'www.loom.com/embed/')
    ?.replace('loom.com/share/', 'loom.com/embed/')

  return (
    <section className="py-24 px-4 reveal">
      <div className="max-w-5xl mx-auto">
        
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-[11px] font-semibold uppercase 
            tracking-widest text-[#6C47FF] mb-3">
            DEMO
          </p>
          <h2 className="text-4xl font-bold text-white mb-4">
            See it in action
          </h2>
          <p className="text-white/60 text-lg max-w-xl 
            mx-auto">
            Watch how a raw startup idea becomes a complete 
            intelligence report in under 30 seconds.
          </p>
        </div>

        {/* Video container */}
        <div className="relative rounded-2xl overflow-hidden 
          border border-white/10 shadow-2xl shadow-black/60 
          bg-[#0D0D0D]">
          
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-5 py-3.5 
            bg-[#161616] border-b border-white/[0.06]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]"/>
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]"/>
              <div className="w-3 h-3 rounded-full bg-[#28C840]"/>
            </div>
            <div className="flex-1 mx-4 bg-[#1C1C1C] rounded-md 
              px-3 py-1 text-xs text-white/30 font-mono">
              valisearch.app — Live Demo
            </div>
          </div>

          {/* Video or placeholder */}
          {showVideo && embedUrl ? (
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={`${embedUrl}?autoplay=1&hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true`}
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                allow="autoplay; fullscreen"
                title="ValiSearch Demo"
              />
            </div>
          ) : (
            /* Placeholder or Real WebP Recording */
            <div 
              className="relative aspect-video flex items-center 
                justify-center cursor-pointer group bg-[#0A0A0A]"
              onClick={() => {
                if (embedUrl) setShowVideo(true)
              }}
            >
              {/* Real screen recording background */}
              <div className="absolute inset-0 overflow-hidden">
                <img 
                  src="/videos/demo.webp" 
                  alt="ValiSearch Demo Recording" 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>

              {/* Play button (only if Loom exists) */}
              {embedUrl && (
                <div className={`relative z-10 flex flex-col 
                  items-center gap-4 transition-transform duration-200
                  group-hover:scale-105`}>
                  <div className={`w-20 h-20 rounded-full 
                    bg-[#6C47FF]/90 flex items-center justify-center
                    shadow-xl shadow-[#6C47FF]/30
                    group-hover:bg-[#6C47FF]`}>
                    <Play className="w-8 h-8 text-white 
                      fill-white ml-1" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold text-lg drop-shadow-lg">
                      Watch Loom Demo
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats below video */}
        <div className="grid grid-cols-3 gap-6 mt-8">
          {[
            { value: '30 sec', label: 'Average analysis time' },
            { value: '18', label: 'Intelligence sections' },
            { value: '100%', label: 'Private — never shared' },
          ].map((stat) => (
            <div key={stat.label} 
              className="text-center">
              <div className="text-2xl font-bold text-white">
                {stat.value}
              </div>
              <div className="text-sm text-white/50 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
