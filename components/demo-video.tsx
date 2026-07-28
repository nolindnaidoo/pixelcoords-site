'use client'

import { useEffect, useRef, useState } from 'react'
import { reportError } from '@/lib/error'

// The 30-second demo loop, WCAG-conformant: no autoplay attribute — playback
// starts on mount ONLY when the visitor has no reduced-motion preference
// (2.2.2 / motion), a real pause/play control is always present, and a
// <details> transcript provides the text alternative (1.2.1). Explicit
// dimensions keep CLS at zero; the poster is the LCP element.
export function DemoVideo({ className }: { readonly className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (video === null) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (prefersReduced.matches) return
    video
      .play()
      .then(() => setIsPlaying(true))
      .catch(error => reportError(error, { source: 'demo-video.autoplay' }))
  }, [])

  const handleToggle = () => {
    const video = videoRef.current
    if (video === null) return
    if (!video.paused) {
      video.pause()
      setIsPlaying(false)
      return
    }
    video
      .play()
      .then(() => setIsPlaying(true))
      .catch(error => reportError(error, { source: 'demo-video.play' }))
  }

  return (
    <div className="flex flex-col">
      {/* The poster is the LCP element on every page that embeds the demo —
          React 19 hoists this link into <head> at prerender. */}
      <link rel="preload" as="image" href="/demo-poster.jpg" fetchPriority="high" />
      <div className="relative">
        <video
          ref={videoRef}
          className={className}
          poster="/demo-poster.jpg"
          width={1200}
          height={868}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="30-second demo: freeze a window, mark shapes, save machine-readable coordinates"
        >
          <source src="/demo.mp4" type="video/mp4" />
          Thirty seconds of pixelcoords: freeze a window, mark shapes, save machine-readable
          coordinates.
        </video>
        <button
          type="button"
          onClick={handleToggle}
          className="absolute bottom-3 right-3 flex h-11 min-w-11 items-center justify-center rounded border border-border-token bg-background/90 px-3 font-mono text-xs"
        >
          {isPlaying ? 'pause' : 'play'}
          <span className="sr-only"> demo video</span>
        </button>
      </div>
      <details className="mt-2 text-sm text-foreground/70 dark:text-foreground/55">
        <summary className="cursor-pointer font-mono text-xs">What happens in this demo</summary>
        <p className="pt-2 leading-6">
          A private browser window on the Google homepage is frozen by pixelcoords with an amber
          outline marking the targeted window. Four shapes are drawn over the page — a rectangle, an
          ellipse, a triangle, and a hexagon — in committed green, then a freehand region in preview
          blue with the live coordinate chip showing its position and size. The control panel lists
          every key. The session is saved, and the demo ends on the resulting session.json open in a
          browser: schema, monitors, target window, and one record per marked selection.
        </p>
      </details>
    </div>
  )
}
