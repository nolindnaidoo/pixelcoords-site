import { DemoVideo } from '@/components/demo-video'
import { SelectionFrame } from '@/components/selection-frame'
import { GITHUB_URL, TAGLINE } from '@/lib/site'

// Copy is the tool README's, verbatim — the site stages it, never forks it.
export function Hero() {
  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="max-w-3xl text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-tight tracking-tight">
          {TAGLINE}
        </h1>
        <p className="font-mono text-sm text-foreground/70 dark:text-foreground/55">
          Rectangles, ellipses, triangles, N-gons, freehand — rotate, label, verify, regenerate
        </p>
        <p className="max-w-2xl text-lg leading-8">
          Every screen tool that measures pixels ends at a human&apos;s eyeball: a ruler shows you a
          number, a screenshot app draws an arrow, a mouse tracker prints a position you copy by
          hand. pixelcoords starts from a different premise —{' '}
          <strong>the real consumer of a coordinate is a machine.</strong>
        </p>
        <div className="flex flex-wrap gap-4 font-mono text-sm">
          <a
            className="rounded bg-foreground px-5 py-3 text-background hover:opacity-90"
            href="#install"
          >
            Install
          </a>
          <a
            className="rounded border border-border-token px-5 py-3 hover:bg-surface"
            href={GITHUB_URL}
          >
            GitHub
          </a>
        </div>
      </div>
      <SelectionFrame label="demo — 30s" tone="committed">
        <DemoVideo className="block h-auto w-full" />
      </SelectionFrame>
    </section>
  )
}
