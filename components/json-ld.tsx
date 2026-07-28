// Structured data. JSON.stringify output is safe for a script tag as long as
// the data contains no user input — everything here is authored constants.
export function JsonLd({ data }: { readonly data: Record<string, unknown> }) {
  return (
    // biome-ignore lint/security/noDangerouslySetInnerHtml: authored constants only
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}
