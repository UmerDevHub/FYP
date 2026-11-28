import { Field, Textarea } from '../../components/ui.jsx';

// FR-IN-03 and FR-IN-04: mileage, the document check with notes, and damage and repaint notes.
// notes: { mileageKm, documentsVerified, documentNotes, damageNotes }
// onChange(name, value) saves one of them in the form.
export default function NotesSection({ notes, onChange, isEditable }) {
  return (
    <section className="mt-8 flex flex-col gap-4">
      <h2 className="text-section">Mileage, documents and damage</h2>
      <Field
        label="Mileage in km, as on the odometer"
        inputMode="numeric"
        value={notes.mileageKm}
        disabled={!isEditable}
        onChange={(event) => onChange('mileageKm', event.target.value)}
      />
      <label className="flex min-h-target items-center gap-3 font-semibold">
        <input
          type="checkbox"
          checked={notes.documentsVerified}
          disabled={!isEditable}
          onChange={(event) => onChange('documentsVerified', event.target.checked)}
          className="size-6"
        />
        The car documents are checked and match the car
      </label>
      <Textarea
        label="Notes about the documents"
        value={notes.documentNotes}
        disabled={!isEditable}
        onChange={(event) => onChange('documentNotes', event.target.value)}
      />
      <Textarea
        label="Visible damage and repaint"
        hint="Write where and what, for example: Rear bumper repainted."
        value={notes.damageNotes}
        disabled={!isEditable}
        onChange={(event) => onChange('damageNotes', event.target.value)}
      />
    </section>
  );
}
