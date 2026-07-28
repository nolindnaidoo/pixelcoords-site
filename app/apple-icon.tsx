import { ImageResponse } from 'next/og'

// Same selection motif as icon.tsx at Apple's touch-icon size, with a
// committed-green label handle for a touch of the tool's second color.
export const dynamic = 'force-static'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

const HANDLE = 22

function Handle({ position }: { readonly position: Record<string, number> }) {
  return (
    <div
      style={{
        position: 'absolute',
        width: HANDLE,
        height: HANDLE,
        background: '#00a0ff',
        ...position,
      }}
    />
  )
}

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: '#0a0a0a',
        padding: 30,
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          position: 'relative',
          border: '6px dashed #00a0ff',
        }}
      >
        <Handle position={{ top: -11, left: -11 }} />
        <Handle position={{ top: -11, right: -11 }} />
        <Handle position={{ bottom: -11, left: -11 }} />
        <Handle position={{ bottom: -11, right: -11 }} />
      </div>
    </div>,
    { ...size },
  )
}
