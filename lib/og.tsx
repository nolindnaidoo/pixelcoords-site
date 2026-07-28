import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

// Shared OG card: the selection motif framing the page title, the tool's
// shape vocabulary drawn as inline SVG (Satori renders svg elements; CSS here
// is flexbox-only), a machine-output JSON line for the thesis, and a Rust
// chip. Fonts are buffer-loaded — ImageResponse can't use next/font. PNGs
// emit at build under static export; every route's opengraph-image.tsx calls
// this with its own text. A stable copy of the home card also ships as
// /social.png for repo social previews (see MAINTENANCE.md).
const SIZE = { width: 1200, height: 630 }

const GREEN = '#00ff66'
const BLUE = '#00a0ff'
const AMBER = '#ffb000'
const RUST = '#f74c00'

function Shapes() {
  return (
    <svg
      aria-hidden="true"
      width="200"
      height="360"
      viewBox="0 0 200 360"
      fill="none"
      style={{ position: 'absolute', right: 56, top: 100 }}
    >
      <rect x="30" y="10" width="140" height="80" stroke={GREEN} strokeWidth="3" />
      <ellipse cx="100" cy="150" rx="70" ry="40" stroke={GREEN} strokeWidth="3" />
      <polygon points="100,205 170,275 30,275" stroke={GREEN} strokeWidth="3" fill="none" />
      <polygon
        points="100,295 135,315 135,345 100,363 65,345 65,315"
        stroke={GREEN}
        strokeWidth="3"
        fill="none"
      />
    </svg>
  )
}

export async function ogCard({
  kicker,
  title,
}: {
  readonly kicker: string
  readonly title: string
}) {
  const fontPath = join(process.cwd(), 'app/fonts/JetBrainsMono-Regular.ttf')
  const mono = await readFile(fontPath).catch(() => {
    throw new Error(`OG card font missing: ${fontPath} — vendored TTF moved or deleted`)
  })
  const handle = {
    position: 'absolute' as const,
    width: 18,
    height: 18,
    background: BLUE,
  }
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: '#0a0a0a',
        padding: 60,
        fontFamily: 'JetBrains Mono',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          border: '4px dashed #00a0ff',
          padding: '64px 280px 64px 64px',
        }}
      >
        <div style={{ ...handle, top: -11, left: -11 }} />
        <div style={{ ...handle, top: -11, right: -11 }} />
        <div style={{ ...handle, bottom: -11, left: -11 }} />
        <div style={{ ...handle, bottom: -11, right: -11 }} />
        <div
          style={{
            position: 'absolute',
            top: -18,
            left: 48,
            background: '#0a0a0a',
            color: GREEN,
            fontSize: 24,
            padding: '0 16px',
          }}
        >
          {kicker}
        </div>
        <Shapes />
        <div style={{ color: '#ededed', fontSize: 54, lineHeight: 1.25 }}>{title}</div>
        <div style={{ display: 'flex', marginTop: 28, color: GREEN, fontSize: 22 }}>
          {'{ "px": { "x": 812, "y": 440 } }  # built for machines'}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 32,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            color: '#ededed',
            fontSize: 22,
          }}
        >
          pixelcoords
          <div
            style={{
              display: 'flex',
              border: `2px solid ${RUST}`,
              color: RUST,
              borderRadius: 6,
              padding: '2px 12px',
              fontSize: 18,
            }}
          >
            Rust
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            right: 32,
            color: AMBER,
            fontSize: 22,
          }}
        >
          1200x630
        </div>
      </div>
    </div>,
    {
      ...SIZE,
      fonts: [{ name: 'JetBrains Mono', data: mono, weight: 400, style: 'normal' }],
    },
  )
}

export const OG_SIZE = SIZE
