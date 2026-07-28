import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

// Shared OG card: the selection motif framing the page title, rendered in the
// tool's own JetBrains Mono (buffer-loaded — ImageResponse can't use
// next/font). Flexbox-only CSS; PNGs are emitted at build under static
// export. Every route's opengraph-image.tsx calls this with its own text.
const SIZE = { width: 1200, height: 630 }

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
    background: '#00a0ff',
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
          padding: 64,
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
            color: '#00ff66',
            fontSize: 24,
            padding: '0 16px',
          }}
        >
          {kicker}
        </div>
        <div style={{ color: '#ededed', fontSize: 56, lineHeight: 1.25 }}>{title}</div>
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            right: 32,
            color: '#ffb000',
            fontSize: 22,
          }}
        >
          1200x630
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 32,
            color: '#ededed',
            fontSize: 22,
          }}
        >
          pixelcoords
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
