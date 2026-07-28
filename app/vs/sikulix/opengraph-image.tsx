import { OG_SIZE, ogCard } from '@/lib/og'
import { pageByPath } from '@/lib/pages'

export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'pixelcoords vs SikuliX'

const page = pageByPath('/vs/sikulix')

export default function OpengraphImage() {
  return ogCard({ kicker: page.ogKicker, title: page.ogTitle })
}
