import { CodeBlock } from '@/components/code-block'
import { ComparisonTable } from '@/components/comparison-table'
import { CoordChip } from '@/components/coord-chip'
import { InstallBlock } from '@/components/install-block'
import { JsonLd } from '@/components/json-ld'
import { COMPETITORS } from '@/lib/competitors'
import { CRATES_URL, GITHUB_URL, RELEASES_URL, SITE_URL, TAGLINE, TOOL_VERSION } from '@/lib/site'
import { FeatureLoop } from './feature-loop'
import { Hero } from './hero'
import { NonGoals } from './non-goals'
import { PlatformTable } from './platform-table'

const SIXTY_SECONDS = `pixelcoords                      # screen freezes; drag shapes, A labels, S saves
# → Downloads/pixelcoords-captures/<timestamp>/
#   session.json  screenshot-0.png  cutout-primary-0.png  cutout-inverse-0.png  crop-0-submit.png

pixelcoords assert --session <dir> --point 812,440 --label submit
# exit 0: that point is inside the region you labeled "submit"

pixelcoords emit --session <dir> --format pyautogui
# ready-to-paste click code, coordinate conventions already handled

pixelcoords find --session <dir>
# the UI moved? every region re-located by its saved crop, deltas included

pixelcoords resume                # pick any saved session, keep editing it`

const SAVE_TREE = `pixelcoords-captures/20260728-182121-117/
├── session.json              # versioned schema: three coordinate spaces, DPI scale
├── screenshot-0.png          # one full frozen capture per monitor
├── cutout-primary-0.png      # the frame with only the selections visible
├── cutout-inverse-0.png      # the exact complement: selections punched out
└── crop-0-submit.png         # one labeled crop per selection`

const SOFTWARE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'pixelcoords',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'macOS, Windows, Linux',
  softwareVersion: TOOL_VERSION,
  description: TAGLINE,
  license: 'https://opensource.org/license/mit/',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  author: { '@type': 'Person', name: 'nolindnaidoo', url: 'https://github.com/nolindnaidoo' },
  url: SITE_URL,
  downloadUrl: RELEASES_URL,
  sameAs: [GITHUB_URL, CRATES_URL],
}

export function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 py-12 sm:py-16">
      <Hero />
      <section className="flex flex-col gap-4">
        <h2 className="flex items-center gap-3 text-2xl font-semibold">
          <CoordChip ariaHidden tone="preview">
            60s
          </CoordChip>
          Sixty seconds
        </h2>
        <CodeBlock ariaLabel="Sixty-second tour">{SIXTY_SECONDS}</CodeBlock>
      </section>
      <FeatureLoop />
      <section className="flex flex-col gap-4">
        <h2 className="flex items-center gap-3 text-2xl font-semibold">
          <CoordChip ariaHidden tone="preview">
            outputs
          </CoordChip>
          What a save writes
        </h2>
        <CodeBlock ariaLabel="Files a save writes">{SAVE_TREE}</CodeBlock>
        <p className="max-w-2xl text-sm text-foreground/70 dark:text-foreground/55">
          Crops isolate each region; the cutout pair keeps every region in place on transparency —
          together they reassemble the screenshot. Files pixelcoords didn&apos;t write are never
          touched.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="flex items-center gap-3 text-2xl font-semibold">
          <CoordChip ariaHidden tone="preview">
            comparison
          </CoordChip>
          Where it stands
        </h2>
        <ComparisonTable competitors={COMPETITORS} linkCompetitors />
      </section>
      <NonGoals />
      <PlatformTable />
      <div className="flex flex-col gap-4">
        <InstallBlock variant="full" />
        <p className="max-w-2xl">
          No account, no network, no toolkit — one small native binary for macOS, Windows, and
          Linux. MIT-licensed, because the aim was to build the best tool in this category and give
          it away.
        </p>
      </div>
      <JsonLd data={SOFTWARE_JSON_LD} />
    </div>
  )
}
