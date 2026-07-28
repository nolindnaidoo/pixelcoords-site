// The 30-second demo loop. Explicit dimensions keep CLS at zero; the poster
// is the LCP element. autoPlay requires muted + playsInline (browser policy).
export function DemoVideo({ className }: { readonly className?: string }) {
  return (
    <video
      className={className}
      poster="/demo-poster.jpg"
      width={1200}
      height={868}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
    >
      <source src="/demo.mp4" type="video/mp4" />
      Thirty seconds of pixelcoords: freeze a window, mark shapes, save machine-readable
      coordinates.
    </video>
  )
}
