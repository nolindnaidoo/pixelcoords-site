import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

// The tool's selection rectangle as a wrapper: dashed outline, four solid
// corner handles, optional label chip riding the top border — exactly how the
// overlay renders a labeled region. Decorative; the handles are aria-hidden.
const frame = tv({
  slots: {
    root: 'relative border-[1.5px] border-dashed',
    handle: 'absolute h-[7px] w-[7px]',
    label: 'absolute -top-2.5 left-3 px-1.5 font-mono text-xs leading-5',
  },
  variants: {
    tone: {
      preview: {
        root: 'border-preview',
        handle: 'bg-preview',
        label: 'bg-background text-preview',
      },
      committed: {
        root: 'border-committed',
        handle: 'bg-committed',
        label: 'bg-background text-committed',
      },
      target: { root: 'border-target', handle: 'bg-target', label: 'bg-background text-target' },
    },
  },
  defaultVariants: { tone: 'preview' },
})

type SelectionFrameProps = {
  readonly children: ReactNode
  readonly label?: string
  readonly tone?: 'preview' | 'committed' | 'target'
  readonly className?: string
}

const CORNERS = [
  { top: -4, left: -4 },
  { top: -4, right: -4 },
  { bottom: -4, left: -4 },
  { bottom: -4, right: -4 },
] as const

export function SelectionFrame({ children, label, tone, className }: SelectionFrameProps) {
  const { root, handle, label: labelSlot } = frame({ tone })
  return (
    <div className={root({ className })}>
      {CORNERS.map(position => (
        <span
          key={Object.keys(position).join('-')}
          aria-hidden
          className={handle()}
          style={position}
        />
      ))}
      {label === undefined ? null : (
        <span aria-hidden className={labelSlot()}>
          {label}
        </span>
      )}
      {children}
    </div>
  )
}
