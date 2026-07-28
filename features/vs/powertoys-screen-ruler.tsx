import { competitorBySlug } from '@/lib/competitors'
import { VsPage } from './vs-page'

const competitor = competitorBySlug('powertoys-screen-ruler')

export function PowertoysPage() {
  return (
    <VsPage
      competitor={competitor}
      framing="Both are free. The difference is what happens after you measure."
      verdict={
        <p>
          Screen Ruler is a good tool doing a different job. It measures — bounding boxes, spacing,
          distances — and hands the number to you. That is where it ends by design: a ruler&apos;s
          consumer is your eyeball. pixelcoords assumes the consumer is a machine, so measuring is
          where it starts — regions become saved, labeled data with coordinates a script can read,
          verify with an exit code, and re-find after the UI moves. If you occasionally need to know
          how wide something is, Screen Ruler is already on your machine and excellent. If a number
          ever leaves your screen and enters a script, you want the tool built for that trip.
        </p>
      }
      whenThem={[
        'You want a quick measurement while you work, read once and forgotten.',
        "It ships with PowerToys — if that's installed, the ruler is a hotkey away.",
        'You want live measuring over a moving screen — pixelcoords deliberately freezes first, and live measurement is a stated non-goal.',
        "You're on Windows and Microsoft-maintained matters to your org.",
      ]}
      whenUs={[
        'The coordinate feeds automation: pyautogui, cliclick, xdotool, CI, or a computer-use agent.',
        'You need regions, not just distances — five shape tools, rotation, labels, crops.',
        'You want the measurement to survive: sessions save, reopen, verify (assert), and re-locate after drift (find).',
        "You're on macOS or Linux — Screen Ruler is Windows-only.",
      ]}
    />
  )
}
