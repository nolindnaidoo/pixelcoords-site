'use client'

import { useEffect } from 'react'
import { reportError } from '@/lib/error'

// Root boundary: replaces the entire document when the root layout itself
// crashes. No providers exist here, so it is deliberately dark-literal with
// inline styles — the house pattern for the one page that cannot theme.
export default function GlobalError({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string }
  readonly reset: () => void
}) {
  useEffect(() => {
    reportError(error, { source: 'error-boundary.root' })
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          color: '#ededed',
          fontFamily: 'ui-monospace, monospace',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
          <h1 style={{ margin: 0, fontSize: 24 }}>pixelcoords — something broke</h1>
          <p style={{ margin: 0, color: '#9a9a9a' }}>
            The page failed to render. Reload, or try again:
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              alignSelf: 'flex-start',
              minHeight: 44,
              padding: '0 20px',
              background: 'transparent',
              color: '#ededed',
              border: '1px solid rgba(255,255,255,.14)',
              borderRadius: 4,
              cursor: 'pointer',
              font: 'inherit',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
