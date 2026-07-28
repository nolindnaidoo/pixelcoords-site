'use client'

import { useEffect, useRef, useState } from 'react'
import { reportError } from '@/lib/error'

// The copy leaf. Degrades cleanly without JS (the command text beside it is
// always selectable) and guards the environments where the Clipboard API is
// absent (non-secure contexts, older browsers) — property access there would
// throw synchronously, before any promise exists to catch.
export function CopyButton({ text }: { readonly text: string }) {
  const [hasCopied, setHasCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const handlePress = () => {
    if (typeof navigator === 'undefined' || navigator.clipboard === undefined) {
      reportError(new Error('Clipboard API unavailable'), { source: 'copy-button.unsupported' })
      return
    }
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setHasCopied(true)
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => setHasCopied(false), 1500)
      })
      .catch(error => reportError(error, { source: 'copy-button.write' }))
  }

  return (
    <button
      type="button"
      onClick={handlePress}
      className="min-h-11 rounded border border-border-token px-3 font-mono text-xs text-foreground/70 hover:bg-surface dark:text-foreground/55"
    >
      {hasCopied ? 'copied' : 'copy'}
      <span className="sr-only"> {text} to clipboard</span>
      <span role="status" className="sr-only">
        {hasCopied ? 'Copied to clipboard' : ''}
      </span>
    </button>
  )
}
