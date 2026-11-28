// Development only (/kit): every part of the UI kit in every state. Later screens must look like
// they were built from these parts. Hover: move the mouse over a control. Focus: press Tab.
import { useState } from 'react';
import { Dialog, EmptyState, Toast } from '../components/feedback.jsx';
import { Badge, Button, Card, Field, Select, Spinner, Textarea } from '../components/ui.jsx';
import { PlateBadge, PriceTag } from '../components/vehicle.jsx';

// Tailwind only builds classes it finds written out in full, so each class is spelled here.
const SWATCHES = [
  ['petrol', 'bg-petrol'],
  ['plate', 'bg-plate'],
  ['ink', 'bg-ink'],
  ['muted', 'bg-muted'],
  ['paper', 'bg-paper'],
  ['line', 'bg-line'],
  ['petrol-tint', 'bg-petrol-tint'],
  ['plate-tint', 'bg-plate-tint'],
  ['pass', 'bg-pass'],
  ['warn', 'bg-warn'],
  ['fail', 'bg-fail'],
  ['info', 'bg-info'],
];

const BRANCH_OPTIONS = [
  { value: '1', label: 'Branch 1' },
  { value: '2', label: 'Branch 2' },
];

function KitSection({ title, children }) {
  return (
    <section className="border-t border-line py-8">
      <h2 className="text-section">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function KitPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isToastShown, setIsToastShown] = useState(false);

  return (
    <main className="mx-auto max-w-page px-4 py-8">
      <h1 className="text-title">UI kit</h1>
      <p className="mt-2 text-muted">
        To see hover, move the mouse over a control. To see focus, press Tab.
      </p>

      <KitSection title="Colours">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {SWATCHES.map(([name, className]) => (
            <li key={name}>
              <div className={`h-12 rounded-control border border-line ${className}`} />
              <p className="mt-1 text-small">{name}</p>
            </li>
          ))}
        </ul>
      </KitSection>

      <KitSection title="Text">
        <p className="font-heading text-title text-petrol">Page title 36 px</p>
        <p className="font-heading text-section text-petrol">Section 26 px</p>
        <p className="font-heading text-card text-petrol">Card title 20 px</p>
        <p>Body 17 px. Lines stay under about 75 characters so they are easy to read.</p>
        <p className="text-small text-muted">Small 14 px</p>
      </KitSection>

      <KitSection title="Buttons">
        <div className="flex flex-wrap gap-3">
          <Button>Send sell request</Button>
          <Button variant="accent">Approve and list</Button>
          <Button variant="secondary">Save draft</Button>
          <Button variant="danger">Reject request</Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button isBusy>Saving</Button>
          <Button disabled>Submit inspection</Button>
          <p className="text-small text-muted">Disabled: answer every checklist item first.</p>
        </div>
      </KitSection>

      <KitSection title="Form fields">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Year" hint="The year the car was made." />
          <Field label="Year" defaultValue="2031" error="Enter a year up to 2027." />
          <Field label="Registration number" defaultValue="LEA-1234" disabled />
          <Select label="Branch" options={BRANCH_OPTIONS} />
          <Select label="Branch" options={BRANCH_OPTIONS} error="Choose a branch." />
          <Select label="Branch" options={BRANCH_OPTIONS} disabled />
          <Textarea label="Description" hint="Say what the buyer should know." />
          <Textarea label="Description" error="Write at least one sentence." />
        </div>
      </KitSection>

      <KitSection title="Badges and spinner">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Pending</Badge>
          <Badge tone="info">Accepted</Badge>
          <Badge tone="pass">Good</Badge>
          <Badge tone="warn">Fair</Badge>
          <Badge tone="fail">Poor</Badge>
          <span className="text-petrol">
            <Spinner />
          </span>
        </div>
      </KitSection>

      <KitSection title="Card">
        <Card>
          <p className="p-4">A card is only for an object, such as a car.</p>
        </Card>
      </KitSection>

      <KitSection title="Price tag and number plate">
        <div className="flex flex-wrap items-center gap-6">
          <PriceTag price="5400000.00" />
          <PriceTag price="5400000.00" size="detail" />
          <PlateBadge registrationNumber="LEA-1234" />
        </div>
      </KitSection>

      <KitSection title="Dialog and message">
        <div className="flex flex-wrap gap-3">
          <Button variant="danger" onClick={() => setIsDialogOpen(true)}>
            Reject request
          </Button>
          <Button variant="secondary" onClick={() => setIsToastShown(true)}>
            Show a message
          </Button>
        </div>
      </KitSection>

      <KitSection title="Empty state">
        <EmptyState
          message="You have no requests yet. Send your first sell request."
          action={<Button>Send sell request</Button>}
        />
      </KitSection>

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Reject this request?"
      >
        <Textarea label="Reason" hint="The customer sees this reason." />
        <div className="mt-4 flex flex-wrap gap-3">
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
