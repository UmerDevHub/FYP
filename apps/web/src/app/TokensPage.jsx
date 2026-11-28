// Temporary (S1-11, S1-12): shows every token and the first kit parts. The /kit page (S1-16) replaces it.
import { useState } from 'react';
import { Dialog, EmptyState, Toast } from '../components/feedback.jsx';
import { Badge, Button, Card, Field, Select, Textarea } from '../components/ui.jsx';
import { PlateBadge, PriceTag } from '../components/vehicle.jsx';

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isToastShown, setIsToastShown] = useState(false);

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

      <h2 className="mt-8 text-section">Kit, part one</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button>Send sell request</Button>
        <Button variant="accent">Approve and list</Button>
        <Button variant="secondary">Save draft</Button>
        <Button variant="danger">Reject request</Button>
        <Button isBusy>Saving</Button>
        <Button disabled>Approve and list</Button>
      </div>
      <div className="mt-6 grid max-w-page gap-4 sm:grid-cols-2">
        <Field label="Year" hint="The year the car was made." />
        <Field label="Year" defaultValue="2031" error="Enter a year up to 2027." />
        <Select
          label="Branch"
          options={[
            { value: '1', label: 'Branch 1' },
            { value: '2', label: 'Branch 2' },
          ]}
        />
        <Field label="Registration number" disabled defaultValue="LEA-1234" />
        <Textarea label="Description" hint="Say what the buyer should know." />
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <Badge>Pending</Badge>
        <Badge tone="info">Accepted</Badge>
        <Badge tone="pass">Good</Badge>
        <Badge tone="warn">Fair</Badge>
        <Badge tone="fail">Poor</Badge>
      </div>
      <div className="mt-6 max-w-page">
        <Card>
          <p className="p-4">A card is only for an object, such as a car.</p>
        </Card>
      </div>

      <h2 className="mt-8 text-section">Kit, part two</h2>
      <div className="mt-4 flex flex-wrap items-center gap-6">
        <PriceTag price="5400000.00" />
        <PriceTag price="5400000.00" size="detail" />
        <PlateBadge registrationNumber="LEA-1234" />
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="danger" onClick={() => setIsDialogOpen(true)}>
          Reject request
        </Button>
        <Button variant="secondary" onClick={() => setIsToastShown(true)}>
          Show a message
        </Button>
      </div>
      <EmptyState
        message="You have no requests yet. Send your first sell request."
        action={<Button>Send sell request</Button>}
      />
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Reject this request?"
      >
        <Textarea label="Reason" hint="The customer sees this reason." />
        <div className="mt-4 flex gap-3">
          <Button variant="danger" onClick={() => setIsDialogOpen(false)}>
            Reject request
          </Button>
          <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
            Go back
          </Button>
        </div>
      </Dialog>
      {isToastShown && (
        <Toast message="Sell request sent." onClose={() => setIsToastShown(false)} />
      )}
    </main>
  );
}
