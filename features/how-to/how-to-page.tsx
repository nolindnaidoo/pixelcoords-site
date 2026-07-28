import { CodeBlock } from '@/components/code-block'
import { CoordChip } from '@/components/coord-chip'
import { InstallBlock } from '@/components/install-block'
import { JsonLd } from '@/components/json-ld'

// Task-first tutorial: the built-in answers come FIRST and are genuinely
// useful — the honesty brand doing SEO work. pixelcoords enters where the
// built-ins stop. Every claim holds for the tool's docs (OUTPUT.md's
// coordinate-spaces section; TROUBLESHOOTING's Wayland framing), hedges
// reproduced.
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

function OsSection({
  chip,
  title,
  children,
}: {
  readonly chip: string
  readonly title: string
  readonly children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="flex items-center gap-3 text-2xl font-semibold">
        <CoordChip tone="preview">{chip}</CoordChip>
        {title}
      </h2>
      {children}
    </section>
  )
}

export function HowToPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-12 px-6 py-12 sm:py-16">
      <header className="flex flex-col gap-4">
        <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight tracking-tight">
          How to get pixel coordinates on macOS, Windows, and Linux
        </h1>
        <p className="text-lg leading-8">
          Every OS has a built-in way to read a coordinate — they&apos;re below, and for a one-off
          they&apos;re all you need. The part that bites is that modern screens have <em>two</em>{' '}
          coordinate systems: <strong>physical pixels</strong> (the screenshot&apos;s own grid) and{' '}
          <strong>logical points</strong> (what many click APIs use). On a 2× Retina display, the
          pixel at (1624, 880) in a screenshot is the point (812, 440) to a click API — mix them up
          and every click lands in the wrong quadrant. Whatever tool you use, know which space its
          number lives in.
        </p>
      </header>

      <OsSection chip="macos" title="macOS">
        <p>
          Built in: press <kbd className="font-mono text-sm">Cmd+Shift+4</kbd>. The screenshot
          crosshair follows your cursor with live coordinates (logical points); press Esc to cancel
          without taking a screenshot. That&apos;s the fastest one-off answer on a Mac.
        </p>
        <p>
          The pitfall: screenshots on Retina are captured in physical pixels at 2× the crosshair
          numbers, so a coordinate read from a screenshot in an editor won&apos;t match. For
          coordinates that survive — saved, labeled, converted per display — freeze the screen
          instead:
        </p>
        <CodeBlock ariaLabel="macOS commands">
          {`pixelcoords                        # freeze, mark the spot, S saves
pixelcoords emit --session <dir> --format cliclick    # logical points
pixelcoords emit --session <dir> --format pyautogui   # logical on macOS`}
        </CodeBlock>
        <p className="text-sm text-foreground/70 dark:text-foreground/55">
          macOS asks for Screen Recording permission on first run; the session records each
          monitor&apos;s scale so conversions are per-display, correct on mixed-DPI setups.
        </p>
      </OsSection>

      <OsSection chip="windows" title="Windows">
        <p>
          Built in: PowerToys&apos; Mouse Utilities and Screen Ruler give quick on-screen numbers —
          genuinely good for a fast read (
          <a
            className="underline decoration-border-token underline-offset-4 hover:decoration-foreground"
            href="/vs/powertoys-screen-ruler"
          >
            full comparison
          </a>
          ).
        </p>
        <p>
          The pitfall: per-monitor DPI scaling. A 150% display makes physical and logical disagree
          by half again, and every monitor can differ. pixelcoords records each monitor&apos;s true
          scale factor in session.json (it declares per-monitor DPI awareness before capturing, so
          the number is exact, not virtualized):
        </p>
        <CodeBlock ariaLabel="Windows commands">
          {`pixelcoords
pixelcoords emit --session <dir> --format pyautogui   # physical px on Windows`}
        </CodeBlock>
        <p className="text-sm text-foreground/70 dark:text-foreground/55">
          Honesty note from the tool&apos;s own docs: the pyautogui-on-Windows convention follows
          its documented DPI-aware behavior and has not yet been verified on hardware.
        </p>
      </OsSection>

      <OsSection chip="linux" title="Linux">
        <p>
          Built in on X11: <code className="font-mono text-sm">xdotool getmouselocation</code>{' '}
          prints the live cursor position in physical pixels — the classic answer, still the right
          one for a one-off.
        </p>
        <p>
          The pitfall is Wayland: its security design withholds global coordinates and window
          geometry from applications, so live trackers can&apos;t exist there. A frozen-snapshot
          overlay is the model Wayland permits — pixelcoords freezes through the desktop portal, and{' '}
          <code className="font-mono text-sm">--pick</code> marks a single window with
          window-relative coordinates:
        </p>
        <CodeBlock ariaLabel="Linux commands">
          {`pixelcoords                        # X11: everything works, incl. --target
pixelcoords --pick                 # Wayland: mark one picked window
pixelcoords emit --session <dir> --format xdotool     # physical px`}
        </CodeBlock>
      </OsSection>

      <section className="flex flex-col gap-3">
        <h2 className="flex items-center gap-3 text-2xl font-semibold">
          <CoordChip tone="committed">beyond</CoordChip>
          When a number isn&apos;t enough
        </h2>
        <p className="leading-7">
          A coordinate you read once answers today&apos;s question. If the same spot matters
          tomorrow — in a script, a test, an agent — you want it saved with its context: which
          monitor, what scale, what the region looked like. That&apos;s the pixelcoords session:
          mark once, then <code className="font-mono text-sm">assert</code> verifies points with
          exit codes, and <code className="font-mono text-sm">find</code> re-locates regions after
          the UI drifts. The{' '}
          <a
            className="underline decoration-border-token underline-offset-4 hover:decoration-foreground"
            href="/"
          >
            front page
          </a>{' '}
          shows the whole loop in sixty seconds.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="flex items-center gap-3 text-2xl font-semibold">
          <CoordChip tone="preview">faq</CoordChip>
          Questions people actually ask
        </h2>
        <div className="flex flex-col gap-2">
          {FAQ.map(entry => (
            <details
              key={entry.question}
              className="group rounded-lg border border-border-token bg-surface p-4"
            >
              <summary className="cursor-pointer font-semibold marker:text-preview">
                {entry.question}
              </summary>
              <p className="pt-3 leading-7 text-foreground/70 dark:text-foreground/55">
                {entry.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <InstallBlock variant="full" />
      <JsonLd data={FAQ_JSON_LD} />
    </div>
  )
}
