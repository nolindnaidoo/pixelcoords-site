import { CoordChip } from '@/components/coord-chip'
import { JsonLd } from '@/components/json-ld'

// The FAQ answers mirrored into FAQPage JSON-LD (Google requires the visible
// text to correspond). Each question carries a slug id so rich-result
// visitors can deep-link.
export const FAQ = [
  {
    question: 'Why don’t my screenshot coordinates match my click coordinates on a Retina display?',
    answer:
      'HiDPI screens have two coordinate systems: physical pixels (the screenshot’s grid) and logical points (what most click APIs use on macOS). On a 2× Retina display a screenshot pixel at (1624, 880) is the logical point (812, 440). Divide by the display’s scale factor — or use a tool that records the scale per monitor and converts for you.',
  },
  {
    question: 'How do I get the pixel coordinates of my mouse on macOS?',
    answer:
      'Press Cmd+Shift+4 — the screenshot crosshair shows live cursor coordinates in logical points; press Esc to cancel without capturing. For coordinates you can save, verify, and hand to a script, freeze the screen with pixelcoords and mark the spot.',
  },
  {
    question: 'How do I get screen pixel coordinates on Wayland?',
    answer:
      'Wayland’s security design withholds global coordinates and window geometry from applications, so live trackers can’t work. A frozen-snapshot overlay is the model Wayland permits: pixelcoords freezes via the desktop portal, and --pick marks a single window with window-relative coordinates.',
  },
  {
    question: 'How do I get coordinates in the right format for pyautogui?',
    answer:
      'pyautogui speaks logical points on macOS and physical pixels on Windows and X11. pixelcoords emit --format pyautogui applies the right convention per monitor from the recorded DPI scale. The Windows pyautogui convention follows its documented behavior and has not yet been verified on hardware.',
  },
  {
    question: 'How can a script verify a point is inside a screen region?',
    answer:
      'Mark the region once, then run pixelcoords assert --session <dir> --point X,Y --label name. The exit code is the API: 0 hit, 1 miss, 2 malformed question — CI and computer-use agents can gate on it.',
  },
] as const

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(entry => ({
    '@type': 'Question',
    name: entry.question,
    acceptedAnswer: { '@type': 'Answer', text: entry.answer },
  })),
}

function slugify(question: string): string {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

export function Faq() {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="flex items-center gap-3 text-2xl font-semibold">
        <CoordChip ariaHidden tone="preview">
          faq
        </CoordChip>
        Questions people actually ask
      </h2>
      <div className="flex flex-col gap-2">
        {FAQ.map(entry => (
          <details
            key={entry.question}
            id={slugify(entry.question)}
            className="group scroll-mt-8 rounded-lg border border-border-token bg-surface p-4"
          >
            <summary className="cursor-pointer py-1 font-semibold marker:text-preview">
              {entry.question}
            </summary>
            <p className="pt-3 leading-7 text-foreground/70 dark:text-foreground/55">
              {entry.answer}
            </p>
          </details>
        ))}
      </div>
      <JsonLd data={FAQ_JSON_LD} />
    </section>
  )
}
