import { CRATES_URL, DOCS_BASE_URL, GITHUB_URL } from '@/lib/site'

const SITE_LINKS = [
  { label: 'vs PowerToys Screen Ruler', href: '/vs/powertoys-screen-ruler' },
  { label: 'vs PixelSnap', href: '/vs/pixelsnap' },
  { label: 'vs SikuliX', href: '/vs/sikulix' },
  { label: 'Get pixel coordinates', href: '/how-to/pixel-coordinates' },
] as const

const DOC_LINKS = [
  { label: 'CLI reference', href: `${DOCS_BASE_URL}/CLI.md` },
  { label: 'Output schema', href: `${DOCS_BASE_URL}/OUTPUT.md` },
  { label: 'Configuration', href: `${DOCS_BASE_URL}/CONFIGURATION.md` },
  { label: 'Troubleshooting', href: `${DOCS_BASE_URL}/TROUBLESHOOTING.md` },
] as const

export function SiteFooter() {
  return (
    <footer className="border-t border-border-token">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-8 text-sm text-foreground/70 dark:text-foreground/55">
        <nav aria-label="Compare" className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs">
          {SITE_LINKS.map(link => (
            <a key={link.href} className="py-2 hover:text-foreground" href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs">
          <a className="py-2 hover:text-foreground" href={GITHUB_URL}>
            GitHub
          </a>
          <a className="py-2 hover:text-foreground" href={CRATES_URL}>
            crates.io
          </a>
          {DOC_LINKS.map(link => (
            <a key={link.href} className="py-2 hover:text-foreground" href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <p className="font-mono text-xs">
          MIT licensed. This table is kept honest — claims match runs.
        </p>
      </div>
    </footer>
  )
}
