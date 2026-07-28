import { OG_SIZE, ogCard } from '@/lib/og'

export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'How to get pixel coordinates on macOS, Windows, and Linux'

export default function OpengraphImage() {
  return ogCard({ kicker: 'how-to', title: 'Pixel coordinates on macOS, Windows, and Linux' })
}
