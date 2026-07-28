'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

// Sun/moon toggle: the site follows the OS until the first click, then the
// explicit choice persists (next-themes localStorage). The server cannot know
// the resolved theme under static export, so an inert placeholder renders
// until mount — same footprint, no hydration mismatch. The effect keeps the
// browser-chrome theme-color in step with a manual override, which the
// media-query-only meta tags cannot do on their own.
const THEME_COLORS = { light: '#fafafa', dark: '#0a0a0a' } as const

function SunIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M8 1v1.5M8 13.5V15M15 8h-1.5M2.5 8H1m11.95-4.95-1.06 1.06M4.11 11.89l-1.06 1.06m9.9 0-1.06-1.06M4.11 4.11 3.05 3.05"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        d="M13.5 9.5A6 6 0 0 1 6.5 2.5a6 6 0 1 0 7 7Z"
      />
    </svg>
  )
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => setIsMounted(true), [])

  useEffect(() => {
    if (!isMounted) return
    if (resolvedTheme !== 'light' && resolvedTheme !== 'dark') return
    for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
      meta.setAttribute('content', THEME_COLORS[resolvedTheme])
    }
  }, [isMounted, resolvedTheme])

  if (!isMounted) {
    return <span aria-hidden className="inline-block h-11 w-11" />
  }

  const isDark = resolvedTheme === 'dark'
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex h-11 w-11 items-center justify-center rounded border border-border-token hover:bg-surface"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
      <span className="sr-only">{isDark ? 'Switch to light theme' : 'Switch to dark theme'}</span>
    </button>
  )
}
