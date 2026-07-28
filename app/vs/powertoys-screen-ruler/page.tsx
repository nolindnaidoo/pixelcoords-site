import type { Metadata } from 'next'
import { PowertoysPage } from '@/features/vs/powertoys-screen-ruler'

export const metadata: Metadata = {
  title: 'pixelcoords vs PowerToys Screen Ruler',
  description:
    'Both free. Screen Ruler measures and hands you the number; pixelcoords turns regions into machine-usable coordinates, crops, click code, and verification — on macOS, Windows, and Linux.',
  alternates: { canonical: '/vs/powertoys-screen-ruler' },
  openGraph: { type: 'website', url: '/vs/powertoys-screen-ruler' },
  twitter: { card: 'summary_large_image' },
}

export default function Page() {
  return <PowertoysPage />
}
