import { OG_SIZE, ogCard } from '@/lib/og'

export const dynamic = 'force-static'
export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'pixelcoords — freeze your screen, mark regions, get machine-usable coordinates'

export default function OpengraphImage() {
  return ogCard({
    kicker: 'pixelcoords',
    title: 'Freeze your screen, mark regions, get pixel-exact coordinates and crops',
  })
}
