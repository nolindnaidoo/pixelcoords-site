import { CoordChip } from '@/components/coord-chip'

// The tool's own loop, from docs/CLI.md: mark → assert → emit → find →
// resume. Each beat shows the command and a real (condensed) artifact.
const BEATS = [
  {
    step: '01',
    command: 'pixelcoords',
    line: 'Freeze, mark, save a session.',
    artifact: `{ "schema": 1,
  "selections": [{ "shape": "rect", "label": "submit",
    "px": { "x": 812, "y": 440, "w": 96, "h": 40 } }] }`,
  },
  {
    step: '02',
    command: 'pixelcoords assert --point 812,440 --label submit',
    line: 'Score points against it. The exit code is the API: 0 hit, 1 miss, 2 malformed.',
    artifact: `{ "hit": true, "space": "global" }   # exit 0`,
  },
  {
    step: '03',
    command: 'pixelcoords emit --format pyautogui',
    line: 'Click code in the target tool’s own coordinate convention.',
    artifact: `pyautogui.click(812, 460)  # submit`,
  },
  {
    step: '04',
    command: 'pixelcoords find',
    line: 'The UI drifted? Every region re-located by its saved crop.',
    artifact: `{ "found": true, "score": 0.998,
  "delta": { "dx": 0, "dy": -120 } }`,
  },
  {
    step: '05',
    command: 'pixelcoords resume',
    line: 'Reopen any session and keep editing; saves update it in place.',
    artifact: `session.json  screenshot-0.png  crop-0-submit.png  → editable again`,
  },
] as const

export function FeatureLoop() {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="flex items-center gap-3 text-2xl font-semibold">
        <CoordChip ariaHidden tone="preview">
          loop
        </CoordChip>
        The tool is a loop
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {BEATS.map(beat => (
          <div
            key={beat.step}
            className="flex min-w-0 flex-col gap-2 rounded-lg border border-border-token bg-surface p-4"
          >
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xs text-target">{beat.step}</span>
              <code className="min-w-0 break-all font-mono text-sm text-foreground">
                {beat.command}
              </code>
            </div>
            <p className="text-sm text-foreground/70 dark:text-foreground/55">{beat.line}</p>
            <pre
              role="group"
              tabIndex={0}
              aria-label={`${beat.command} output`}
              className="overflow-x-auto rounded bg-background p-2 font-mono text-xs leading-5 text-committed"
            >
              {beat.artifact}
            </pre>
          </div>
        ))}
      </div>
    </section>
  )
}
