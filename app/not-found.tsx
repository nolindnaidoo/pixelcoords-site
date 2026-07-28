import type { Metadata } from 'next'
import { CoordChip } from '@/components/coord-chip'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
}

const PAGES = [
  { label: 'Home', href: '/' },
  { label: 'vs PowerToys Screen Ruler', href: '/vs/powertoys-screen-ruler' },
  { label: 'vs PixelSnap', href: '/vs/pixelsnap' },
  { label: 'vs SikuliX', href: '/vs/sikulix' },
  { label: 'How to get pixel coordinates', href: '/how-to/pixel-coordinates' },
] as const

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-24">
      <CoordChip ariaHidden tone="target" className="self-start">
        404 — outside every region
      </CoordChip>
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-foreground/70 dark:text-foreground/55">
        This point misses every marked region. The whole site is five pages:
      </p>
      <nav aria-label="Site pages" className="flex flex-col gap-1 font-mono text-sm">
        {PAGES.map(page => (
          <a
            key={page.href}
            className="py-2 underline decoration-border-token underline-offset-4 hover:decoration-foreground"
            href={page.href}
          >
            {page.label}
          </a>
        ))}
      </nav>
    </div>
  )
}
