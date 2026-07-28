import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

// The tool's coordinate-chip motif as an inline micro-label: section kickers,
// literal coordinates, and the comparison table's verified stamps.
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
}

export function CoordChip({ children, tone, className }: CoordChipProps) {
  return <span className={chip({ tone, className })}>{children}</span>
}
