// Temporary (S1-11): shows every token so it can be compared with docs/design.md. Remove after the check.
// Tailwind only builds classes it finds written out in full, so each class is spelled here.
const SWATCHES = [
  { name: 'petrol', className: 'bg-petrol' },
  { name: 'plate', className: 'bg-plate' },
  { name: 'ink', className: 'bg-ink' },
  { name: 'muted', className: 'bg-muted' },
  { name: 'paper', className: 'bg-paper' },
  { name: 'line', className: 'bg-line' },
  { name: 'petrol-tint', className: 'bg-petrol-tint' },
  { name: 'plate-tint', className: 'bg-plate-tint' },
  { name: 'pass', className: 'bg-pass' },
  { name: 'warn', className: 'bg-warn' },
  { name: 'fail', className: 'bg-fail' },
  { name: 'info', className: 'bg-info' },
];

export default function TokensPage() {
  return (
    <main className="mx-auto max-w-page px-4 py-8">
      <h1 className="text-title">Design tokens</h1>

      <h2 className="mt-8 text-section">Colours</h2>
      <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {SWATCHES.map((swatch) => (
          <li key={swatch.name}>
            <div className={`h-12 rounded-control border border-line ${swatch.className}`} />
            <p className="mt-1 text-small">{swatch.name}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-8 text-section">Text sizes</h2>
      <p className="mt-4 font-heading text-title">Page title 36 px</p>
      <p className="font-heading text-section">Section 26 px</p>
      <p className="font-heading text-card">Card title 20 px</p>
      <p className="text-body">Body 17 px in Source Sans 3, line height 1.55.</p>
      <p className="text-small text-muted">Small 14 px, muted</p>
      <p className="font-heading text-price font-bold">Rs 5,400,000 (price 24 px)</p>
      <p className="font-heading text-price-large font-bold">Rs 5,400,000 (price 36 px)</p>
    </main>
  );
}
