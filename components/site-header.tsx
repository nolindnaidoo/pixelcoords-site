import { ThemeToggle } from '@/components/theme-toggle'
import { CRATES_URL, GITHUB_URL } from '@/lib/site'

// #install is same-page: every content page renders its own install section,
// so the link never navigates away. flex-wrap + tight gaps keep the row
// inside a 320px viewport (overflow there would be clipped, not scrollable).
export function SiteHeader() {
  return (
    <header className="border-b border-border-token">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-0 px-4 py-2 sm:px-6">
        <a href="/" className="py-2 font-mono text-sm font-semibold">
          pixelcoords
        </a>
        <nav
          aria-label="Primary"
          className="flex flex-wrap items-center gap-x-3 font-mono text-sm text-foreground/70 dark:text-foreground/55"
        >
          <a className="py-2 hover:text-foreground" href={GITHUB_URL}>
            GitHub
          </a>
          <a className="py-2 hover:text-foreground" href={CRATES_URL}>
            crates.io
          </a>
          <a className="py-2 text-committed hover:text-foreground" href="#install">
            Install
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
