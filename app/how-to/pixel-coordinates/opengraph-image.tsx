import { OG_SIZE, ogCard } from '@/lib/og'
import { pageByPath } from '@/lib/pages'

export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'How to get pixel coordinates on macOS, Windows, and Linux'

const page = pageByPath('/how-to/pixel-coordinates')

export default function OpengraphImage() {
  return ogCard({ kicker: page.ogKicker, title: page.ogTitle })
}
