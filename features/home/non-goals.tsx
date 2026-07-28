import { CoordChip } from '@/components/coord-chip'

// Near-verbatim from the tool README. The punched-out styling is the
// cutout-inverse joke: what's deliberately not here.
const NON_GOALS = [
  { name: 'OCR', reason: 'text extraction is a different product' },
  { name: 'Live (unfrozen) measurement', reason: 'the freeze is the thesis' },
  { name: 'Annotation', reason: "arrows and blur are a screenshot editor's job" },
  {
    name: 'Recording / GIF capture',
    reason: 'the product is the frozen instant, not the timeline',
  },
  { name: 'Cloud, accounts, sharing', reason: 'offline by design, permanently' },
] as const

export function NonGoals() {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="flex items-center gap-3 text-2xl font-semibold">
        <CoordChip tone="preview">cutout-inverse</CoordChip>
        Non-goals
      </h2>
      <p>Knowing what a tool is means knowing what it isn&apos;t. These are settled:</p>
      <ul className="flex flex-col gap-2 rounded-lg border border-dashed border-border-token p-4">
        {NON_GOALS.map(item => (
          <li key={item.name} className="flex flex-wrap items-baseline gap-x-2 text-sm">
            <span className="font-semibold">{item.name}</span>
            <span className="text-foreground/70 dark:text-foreground/55">— {item.reason}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
