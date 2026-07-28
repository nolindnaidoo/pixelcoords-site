import type { Metadata } from 'next'
import { HowToPage } from '@/features/how-to/how-to-page'

export const metadata: Metadata = {
  title: 'How to get pixel coordinates on macOS, Windows, and Linux',
  description:
    'The built-in way on each OS, the physical-vs-logical DPI trap that breaks scripts, and how to get coordinates a machine can use — saved, verified, and converted per display.',
  alternates: { canonical: '/how-to/pixel-coordinates' },
  openGraph: { type: 'website', url: '/how-to/pixel-coordinates' },
  twitter: { card: 'summary_large_image' },
}

export default function Page() {
  return <HowToPage />
}
