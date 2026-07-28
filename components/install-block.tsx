import { CodeBlock } from '@/components/code-block'
import { CoordChip } from '@/components/coord-chip'
import { RELEASES_URL } from '@/lib/site'

// Two rows, no tabs: the cargo route and the prebuilt-binary route. `full`
// adds the platform notes from the tool README.
export function InstallBlock({ variant }: { readonly variant: 'full' | 'compact' }) {
  return (
    <section id="install" className="flex scroll-mt-8 flex-col gap-4">
      <h2 className="flex items-center gap-3 text-2xl font-semibold">
        <CoordChip ariaHidden tone="preview">
          install
        </CoordChip>
        Two ways in
      </h2>
      <CodeBlock ariaLabel="Install command" copy="cargo install pixelcoords">
        cargo install pixelcoords
      </CodeBlock>
      <p>
        Or skip the toolchain:{' '}
        <a
          className="underline decoration-border-token underline-offset-4 hover:decoration-foreground"
          href={RELEASES_URL}
        >
          prebuilt binaries for macOS, Windows, and Linux
        </a>{' '}
        — download, unpack, run.
      </p>
      {variant === 'compact' ? null : (
        <div className="flex flex-col gap-2 text-sm text-foreground/70 dark:text-foreground/55">
          <p>Rust 1.88+ for the cargo route. On Linux, build dependencies first:</p>
          <CodeBlock ariaLabel="Linux build dependencies">
            {
              'sudo apt-get install -y libxcb1-dev libxcb-randr0-dev libpipewire-0.3-dev \\\n  libclang-dev libegl1-mesa-dev libgbm-dev pkg-config'
            }
          </CodeBlock>
          <p>macOS asks for Screen Recording permission on first run.</p>
        </div>
      )}
    </section>
  )
}
