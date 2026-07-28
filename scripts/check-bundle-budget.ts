import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

// Client-JS weight gate — the bundle-size analogue of the tool repo's
// coverage floor. Current baseline: ~642 KB raw (Next 16 + React 19
// framework plus three small client leaves). The budget holds ~9% headroom;
// raising it is a deliberate act with a written reason, not drift.
const BUDGET_BYTES = 700_000
const CHUNKS_DIR = join(process.cwd(), 'out/_next/static/chunks')

function walk(dir: string): readonly string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return walk(path)
    return entry.name.endsWith('.js') ? [path] : []
  })
}

const files = walk(CHUNKS_DIR)
const total = files.reduce((sum, file) => sum + statSync(file).size, 0)
const report = `client JS: ${(total / 1000).toFixed(1)} kB across ${files.length} chunks (budget ${BUDGET_BYTES / 1000} kB)`

if (total > BUDGET_BYTES) {
  console.error(`BUDGET EXCEEDED — ${report}`)
  process.exit(1)
}
console.log(report)
