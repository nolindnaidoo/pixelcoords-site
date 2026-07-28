import type { ReactNode } from 'react'
import { CoordChip } from '@/components/coord-chip'
import { CopyButton } from '@/components/copy-button'

// Monospace block on a HUD-panel surface. Wide content scrolls inside the
// block, never the page. `copy` puts the command on the clipboard verbatim —
// only pass it single commands, not annotated multi-line samples.
type CodeBlockProps = {
  readonly children: ReactNode
  /** Accessible name for the scrollable region — must be unique per page. */
  readonly ariaLabel: string
  readonly label?: string
  readonly copy?: string
  readonly className?: string
}

export function CodeBlock({ children, ariaLabel, label, copy, className }: CodeBlockProps) {
  return (
    <div className={className}>
      {label === undefined ? null : (
        <div className="mb-2">
          <CoordChip tone="preview">{label}</CoordChip>
        </div>
      )}
      <div className="flex items-start gap-2 rounded-lg border border-border-token bg-surface p-4">
        <pre
          role="group"
          tabIndex={0}
          aria-label={ariaLabel}
          className="flex-1 overflow-x-auto font-mono text-sm leading-6"
        >
          <code>{children}</code>
        </pre>
        {copy === undefined ? null : <CopyButton text={copy} />}
      </div>
    </div>
  )
}
