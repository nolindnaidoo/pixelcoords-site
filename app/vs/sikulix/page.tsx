import type { Metadata } from 'next'
import { SikulixPage } from '@/features/vs/sikulix'

export const metadata: Metadata = {
  title: { absolute: 'pixelcoords vs SikuliX' },
  description:
    'SikuliX is a visual automation runtime that sees and acts. pixelcoords produces the ground truth your existing stack consumes: exact coordinates, assert exit codes, and drift re-location — no JVM.',
  alternates: { canonical: '/vs/sikulix' },
  openGraph: { type: 'website', url: '/vs/sikulix' },
  twitter: { card: 'summary_large_image' },
}

export default function Page() {
  return <SikulixPage />
}
