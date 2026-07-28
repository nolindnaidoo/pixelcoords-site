import { competitorBySlug } from '@/lib/competitors'
import { VsPage } from './vs-page'

const competitor = competitorBySlug('pixelsnap')

export function PixelsnapPage() {
  return (
    <VsPage
      competitor={competitor}
      framing="A polished paid mac tool for designers, and a free cross-platform tool for machines."
      verdict={
        <p>
          PixelSnap is genuinely excellent at what it does: its edge-snapping makes measuring a
          design on screen feel effortless, and for a designer measuring specs all day, $39 is a
          fair price for that craft. pixelcoords doesn&apos;t compete on measuring feel — it
          competes on what the measurement becomes. Where PixelSnap ends at dimensions on your
          screen, pixelcoords produces session.json, labeled crops, click code, and verification a
          script can run. And if you searched for PixelSnap on Windows or Linux: it&apos;s
          macOS-only, and pixelcoords isn&apos;t.
        </p>
      }
      whenThem={[
        'You measure designs on a Mac all day and want the smoothest measuring experience that exists — the edge-snapping is the best in this category.',
        'You want dimensions burned into screenshots for design handoff.',
        'A one-time $39 for a daily-driver design tool is an easy yes for you.',
      ]}
      whenUs={[
        "You're on Windows or Linux — PixelSnap doesn't run there.",
        'You want free and open source (MIT), with no license to manage.',
        'The output needs to be data: coordinates in three spaces with DPI scale, crops, cutouts, click code.',
        'You need verification and drift-healing — assert exit codes for CI, find for when the UI moves.',
      ]}
    />
  )
}
