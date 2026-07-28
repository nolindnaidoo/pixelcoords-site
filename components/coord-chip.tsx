import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

// The tool's coordinate-chip motif as an inline micro-label: section kickers,
// literal coordinates, and the comparison table's verified stamps. Kickers
// rendered inside headings must pass `ariaHidden` so the chip text does not
// pollute the heading's accessible name ("macos macOS").
const chip = tv({
  base: 'inline-flex items-center gap-1 rounded border border-border-token bg-surface px-1.5 py-0.5 font-mono text-xs',
  variants: {
    tone: {
      neutral: 'text-foreground/70 dark:text-foreground/55',
      preview: 'text-preview',
      committed: 'text-committed',
      target: 'text-target',
    },
  },
  defaultVariants: { tone: 'neutral' },
})

type CoordChipProps = {
  readonly children: ReactNode
  readonly tone?: 'neutral' | 'preview' | 'committed' | 'target'
  readonly className?: string
  readonly ariaHidden?: boolean
}

export function CoordChip({ children, tone, className, ariaHidden }: CoordChipProps) {
  return (
    <span
      aria-hidden={ariaHidden === true ? true : undefined}
      className={chip({ tone, className })}
    >
      {children}
    </span>
  )
}
