import { OG_SIZE, ogCard } from '@/lib/og'
import { pageByPath } from '@/lib/pages'

export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'pixelcoords — freeze your screen, mark regions, get machine-usable coordinates'

const page = pageByPath('/')

export default function OpengraphImage() {
  return ogCard({ kicker: page.ogKicker, title: page.ogTitle })
}
