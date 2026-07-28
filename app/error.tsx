'use client'

import { useEffect } from 'react'
import { reportError } from '@/lib/error'

// Segment error boundary: catches render errors below the root layout, so
// the header/footer chrome survives. Reset re-renders the segment.
export default function ErrorBoundary({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string }
  readonly reset: () => void
}) {
  useEffect(() => {
    reportError(error, { source: 'error-boundary.segment' })
  }, [error])

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Something broke</h1>
      <p className="text-foreground/70 dark:text-foreground/55">
        A rendering error on this page — not your fault, and reloading usually clears it.
      </p>
      <button
        type="button"
        onClick={reset}
        className="min-h-11 self-start rounded border border-border-token px-5 font-mono text-sm hover:bg-surface"
      >
        Try again
      </button>
    </div>
  )
}
