import { CodeBlock } from '@/components/code-block'
import { CoordChip } from '@/components/coord-chip'
import { InstallBlock } from '@/components/install-block'
import { Faq } from './faq'

// Task-first tutorial: the built-in answers come FIRST and are genuinely
// useful — the honesty brand doing SEO work. pixelcoords enters where the
// built-ins stop. Every claim holds for the tool's docs (OUTPUT.md's
// coordinate-spaces section; TROUBLESHOOTING's Wayland framing), hedges
// reproduced.
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
        <CoordChip ariaHidden tone="preview">
          {chip}
        </CoordChip>
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
          <CoordChip ariaHidden tone="committed">
            beyond
          </CoordChip>
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

      <Faq />

      <InstallBlock variant="full" />
    </div>
  )
}
