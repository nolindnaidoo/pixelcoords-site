import type { Metadata } from 'next'
import { HomePage } from '@/features/home/home-page'

export const metadata: Metadata = {
  description:
    'Freeze your screen, mark regions with five shape tools, and get machine-usable output: versioned JSON coordinates, labeled crops, click code, verification, and self-healing re-location. Free, MIT, macOS/Windows/Linux.',
  alternates: { canonical: '/' },
  openGraph: { type: 'website', url: '/' },
  twitter: { card: 'summary_large_image' },
}

export default function Home() {
  return <HomePage />
}
