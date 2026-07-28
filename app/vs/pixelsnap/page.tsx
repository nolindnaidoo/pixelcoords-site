import type { Metadata } from 'next'
import { PixelsnapPage } from '@/features/vs/pixelsnap'
import { pageMetadata } from '@/lib/pages'

export const metadata: Metadata = pageMetadata('/vs/pixelsnap')

export default function Page() {
  return <PixelsnapPage />
}
