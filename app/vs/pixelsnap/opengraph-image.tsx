import { OG_SIZE, ogCard } from '@/lib/og'
import { pageByPath } from '@/lib/pages'

export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'pixelcoords vs PixelSnap 2'

const page = pageByPath('/vs/pixelsnap')

export default function OpengraphImage() {
  return ogCard({ kicker: page.ogKicker, title: page.ogTitle })
}
