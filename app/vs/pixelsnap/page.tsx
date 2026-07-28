import type { Metadata } from 'next'
import { PixelsnapPage } from '@/features/vs/pixelsnap'

export const metadata: Metadata = {
  title: 'pixelcoords vs PixelSnap 2 — free, cross-platform',
  description:
    'PixelSnap is a polished $39 macOS measuring tool. pixelcoords is free, MIT, runs on macOS, Windows, and Linux, and outputs machine-usable coordinates, crops, and click code — an honest comparison.',
  alternates: { canonical: '/vs/pixelsnap' },
  openGraph: { type: 'website', url: '/vs/pixelsnap' },
  twitter: { card: 'summary_large_image' },
}

export default function Page() {
  return <PixelsnapPage />
}
