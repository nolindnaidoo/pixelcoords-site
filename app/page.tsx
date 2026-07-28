import { CRATES_URL, GITHUB_URL, TAGLINE } from '@/lib/site'
import { Code } from '@/ui/code'

// Interim home — replaced by features/home in the next change. Kept minimal
// but honest so the deployed site is never boilerplate.
export default function Home() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col items-start justify-center gap-8 px-6 py-16">
      <div className="flex flex-col gap-3">
        <p className="font-mono text-sm text-preview">pixelcoords</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{TAGLINE}</h1>
        <p className="text-lg text-foreground/70 dark:text-foreground/55">
          Every screen tool that measures pixels ends at a human&apos;s eyeball. pixelcoords starts
          from a different premise — the real consumer of a coordinate is a machine.
        </p>
      </div>
      <Code className="font-mono text-base">cargo install pixelcoords</Code>
      <nav className="flex flex-wrap gap-4 font-mono text-sm">
        <a
          className="rounded border border-border-token px-4 py-2.5 hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-preview"
          href={GITHUB_URL}
        >
          GitHub
        </a>
        <a
          className="rounded border border-border-token px-4 py-2.5 hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-preview"
          href={CRATES_URL}
        >
          crates.io
        </a>
      </nav>
    </div>
  )
}
