import type { Metadata } from 'next'
import { SikulixPage } from '@/features/vs/sikulix'
import { pageMetadata } from '@/lib/pages'

export const metadata: Metadata = pageMetadata('/vs/sikulix')

export default function Page() {
  return <SikulixPage />
}
