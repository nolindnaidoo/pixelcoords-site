import { CoordChip } from '@/components/coord-chip'
import {
  type Cell,
  type Competitor,
  PIXELCOORDS_CELLS,
  ROW_KEYS,
  ROW_LABELS,
  type RowKey,
} from '@/lib/competitors'

// Renders the quarantine data — this component and lib/competitors.ts are the
// ONLY places version-specific competitor claims may appear. Competitor wins
// get the same positive check treatment as ours; absences are a neutral "—",
// never a red X. The dated stamps below the table are non-negotiable.
type ComparisonTableProps = {
  readonly competitors: readonly Competitor[]
  readonly rows?: readonly RowKey[]
  readonly linkCompetitors?: boolean
}

function CellContent({ cell }: { readonly cell: Cell }) {
  if (cell.value === '—') {
    return (
      <span>
        <span aria-hidden>—</span>
        <span className="sr-only">not offered</span>
      </span>
    )
  }
  return (
    <div className="flex flex-col gap-1">
      <span className={cell.wins === true ? 'text-committed' : undefined}>
        {cell.wins === true ? <span aria-hidden>{'✓ '}</span> : null}
        {cell.value}
      </span>
      {cell.note === undefined ? null : (
        <span className="text-xs text-foreground/70 dark:text-foreground/55">{cell.note}</span>
      )}
    </div>
  )
}

export function ComparisonTable({ competitors, rows, linkCompetitors }: ComparisonTableProps) {
  const rowKeys = rows ?? ROW_KEYS
  return (
    <div className="flex flex-col gap-3">
      <div
        tabIndex={0}
        role="region"
        aria-label="Feature comparison"
        className="overflow-x-auto rounded-lg border border-border-token"
      >
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border-token bg-surface text-left">
              <th
                scope="col"
                className="p-3 font-mono text-xs font-normal text-foreground/70 dark:text-foreground/55"
              >
                <span className="sr-only">Feature</span>
              </th>
              <th scope="col" className="p-3 font-semibold">
                pixelcoords
              </th>
              {competitors.map(competitor => (
                <th key={competitor.slug} scope="col" className="p-3 font-semibold">
                  {linkCompetitors === true ? (
                    <a
                      className="underline decoration-border-token underline-offset-4 hover:decoration-foreground"
                      href={`/vs/${competitor.slug}`}
                    >
                      {competitor.name}
                    </a>
                  ) : (
                    competitor.name
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowKeys.map(key => (
              <tr key={key} className="border-b border-border-token last:border-b-0 align-top">
                <th
                  scope="row"
                  className="p-3 text-left font-mono text-xs font-normal text-foreground/70 dark:text-foreground/55"
                >
                  {ROW_LABELS[key]}
                </th>
                <td className="p-3">
                  <CellContent cell={PIXELCOORDS_CELLS[key]} />
                </td>
                {competitors.map(competitor => (
                  <td key={competitor.slug} className="p-3">
                    <CellContent cell={competitor.cells[key]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap gap-2">
        {competitors.map(competitor => (
          <CoordChip key={competitor.slug} tone="target">
            verified against {competitor.name} v{competitor.verifiedAgainst.version},{' '}
            {competitor.verifiedAgainst.date}
          </CoordChip>
        ))}
      </div>
    </div>
  )
}
