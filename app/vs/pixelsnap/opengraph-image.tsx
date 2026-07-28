import { OG_SIZE, ogCard } from '@/lib/og'

export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'pixelcoords vs PixelSnap 2'

export default function OpengraphImage() {
  return ogCard({ kicker: 'comparison', title: 'pixelcoords vs PixelSnap 2' })
}
