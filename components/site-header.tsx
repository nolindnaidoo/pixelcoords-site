import { CRATES_URL, GITHUB_URL } from '@/lib/site'

export function SiteHeader() {
  return (
    <header className="border-b border-border-token">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <a href="/" className="font-mono text-sm font-semibold">
          pixelcoords
        </a>
        <nav
          aria-label="Primary"
          className="flex items-center gap-5 font-mono text-sm text-foreground/70 dark:text-foreground/55"
        >
          <a className="py-2 hover:text-foreground" href={GITHUB_URL}>
            GitHub
          </a>
          <a className="py-2 hover:text-foreground" href={CRATES_URL}>
            crates.io
          </a>
          <a className="py-2 text-committed hover:text-foreground" href="/#install">
            Install
          </a>
        </nav>
      </div>
    </header>
  )
}
