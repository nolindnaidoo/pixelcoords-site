'use client'

import { useState } from 'react'
import { reportError } from '@/lib/error'

// The one interactive leaf. Degrades cleanly without JS — the command text
// beside it is always selectable.
export function CopyButton({ text }: { readonly text: string }) {
  const [hasCopied, setHasCopied] = useState(false)

  const handlePress = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setHasCopied(true)
        setTimeout(() => setHasCopied(false), 1500)
      })
      .catch(error => reportError(error, { source: 'copy-button.write' }))
  }

  return (
    <button
      type="button"
      onClick={handlePress}
      className="min-h-11 rounded border border-border-token px-3 font-mono text-xs text-foreground/70 hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-preview dark:text-foreground/55"
      aria-label={`Copy: ${text}`}
    >
      {hasCopied ? 'copied' : 'copy'}
    </button>
  )
}
