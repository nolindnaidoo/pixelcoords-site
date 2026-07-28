import type { ReactNode } from 'react'
import { ComparisonTable } from '@/components/comparison-table'
import { CoordChip } from '@/components/coord-chip'
import { DemoVideo } from '@/components/demo-video'
import { InstallBlock } from '@/components/install-block'
import { SelectionFrame } from '@/components/selection-frame'
import type { Competitor } from '@/lib/competitors'

// The settled /vs section order. Verdict and when-lists argue philosophy only
// (durable, undated); every version-specific claim renders from the
// quarantine data with its stamp.
type VsPageProps = {
  readonly competitor: Competitor
  readonly framing: string
  readonly verdict: ReactNode
  readonly whenThem: readonly string[]
  readonly whenUs: readonly string[]
}

export function VsPage({ competitor, framing, verdict, whenThem, whenUs }: VsPageProps) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-12 sm:py-16">
      <header className="flex flex-col gap-3">
        <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight tracking-tight">
          pixelcoords vs {competitor.name}
        </h1>
        <p className="max-w-2xl text-lg text-foreground/70 dark:text-foreground/55">{framing}</p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="flex items-center gap-3 text-2xl font-semibold">
          <CoordChip ariaHidden tone="preview">
            verdict
          </CoordChip>
          The short version
        </h2>
        <div className="max-w-3xl rounded-lg border border-border-token bg-surface p-5 leading-7">
          {verdict}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="flex items-center gap-3 text-2xl font-semibold">
          <CoordChip ariaHidden tone="preview">
            side by side
          </CoordChip>
          Feature for feature
        </h2>
        <ComparisonTable competitors={[competitor]} />
      </section>

      <div className="grid gap-8 sm:grid-cols-2">
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">When to pick {competitor.name}</h2>
          <ul className="flex list-disc flex-col gap-2 pl-5 leading-7">
            {whenThem.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">When to pick pixelcoords</h2>
          <ul className="flex list-disc flex-col gap-2 pl-5 leading-7">
            {whenUs.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="flex items-center gap-3 text-2xl font-semibold">
          <CoordChip ariaHidden tone="committed">
            demo
          </CoordChip>
          Thirty seconds of pixelcoords
        </h2>
        <SelectionFrame label="demo — 30s" tone="committed">
          <DemoVideo className="block h-auto w-full" />
        </SelectionFrame>
      </section>

      <InstallBlock variant="compact" />
    </div>
  )
}
