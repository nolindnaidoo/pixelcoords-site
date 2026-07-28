import { competitorBySlug } from '@/lib/competitors'
import { VsPage } from './vs-page'

const competitor = competitorBySlug('sikulix')

export function SikulixPage() {
  return (
    <VsPage
      competitor={competitor}
      framing="Different categories with one honest overlap: both use template matching to find things on screen."
      verdict={
        <p>
          SikuliX is a complete visual automation runtime — it watches the screen, scripts
          decisions, and drives your mouse and keyboard, with an IDE and OCR built in. pixelcoords
          deliberately does none of that: it never clicks anything. It produces the ground truth
          automation consumes — human-marked regions as exact coordinates, with verification
          (assert) and drift re-location (find) using the same template-matching idea, scoped to
          regions you marked. If you want one tool to both see and act, that&apos;s SikuliX&apos;s
          category. If you already have a stack that acts — pyautogui, xdotool, a computer-use agent
          — pixelcoords is the measurement half, without a JVM. Worth knowing when comparing:
          SikuliX&apos;s original development was archived in early 2026 and continues under the
          OculiX fork.
        </p>
      }
      whenThem={[
        'You want a self-contained see-and-act automation environment with its own scripting and IDE.',
        'You need OCR in the same tool — a pixelcoords non-goal, stated in the open.',
        'Continuous visual search across the whole screen is the job, not marked regions.',
      ]}
      whenUs={[
        'Your automation stack already exists and needs trustworthy coordinates, not another runtime.',
        'You want one small native binary — no JVM, no Java versions.',
        'CI needs exit codes: assert scores points against human-marked ground truth.',
        'You want the marking itself to be first-class: five shape tools, labels, crops, editable saved sessions.',
      ]}
    />
  )
}
