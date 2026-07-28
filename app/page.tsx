import type { Metadata } from 'next'
import { HomePage } from '@/features/home/home-page'
import { pageMetadata } from '@/lib/pages'

export const metadata: Metadata = pageMetadata('/')

export default function Home() {
  return <HomePage />
}
