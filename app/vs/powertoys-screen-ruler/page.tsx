import type { Metadata } from 'next'
import { PowertoysPage } from '@/features/vs/powertoys-screen-ruler'
import { pageMetadata } from '@/lib/pages'

export const metadata: Metadata = pageMetadata('/vs/powertoys-screen-ruler')

export default function Page() {
  return <PowertoysPage />
}
