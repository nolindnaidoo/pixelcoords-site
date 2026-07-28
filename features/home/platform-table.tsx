import { CoordChip } from '@/components/coord-chip'

// The tool README's platform table, hedges included — reproduce the hedges,
// not just the wins.
const PLATFORMS = [
  { name: 'macOS', state: 'Supported — primary development platform' },
  { name: 'Windows', state: 'Supported — verified by hand on Windows 11' },
  { name: 'Linux (X11)', state: 'Supported — verified by hand on GNOME 46; every feature works' },
  {
    name: 'Linux (Wayland)',
    state:
      'Screen coordinates + --pick window marking — verified by hand on GNOME 46; no windows / --target (the protocol withholds window geometry)',
  },
] as const

export function PlatformTable() {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="flex items-center gap-3 text-2xl font-semibold">
        <CoordChip ariaHidden tone="preview">
          platforms
        </CoordChip>
        Platform status
      </h2>
      <div
        tabIndex={0}
        role="region"
        aria-label="Platform status"
        className="overflow-x-auto rounded-lg border border-border-token"
      >
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <tbody>
            {PLATFORMS.map(platform => (
              <tr
                key={platform.name}
                className="border-b border-border-token align-top last:border-b-0"
              >
                <th scope="row" className="w-40 p-3 text-left font-mono text-xs font-normal">
                  {platform.name}
                </th>
                <td className="p-3">{platform.state}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-foreground/70 dark:text-foreground/55">
        Multi-monitor and mixed-DPI layouts are exercised by tests but not yet verified on real
        hardware. This table is kept honest — claims match runs.
      </p>
    </section>
  )
}
