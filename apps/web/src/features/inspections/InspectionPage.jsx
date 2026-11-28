import { INSPECTION_STATUS, LIMITS, ROLE } from '@v360/shared/constants';
import { useState } from 'react';
import { useParams } from 'react-router';
import { useAuth } from '../../app/AuthProvider.jsx';
import { Toast } from '../../components/feedback.jsx';
import { InspectionStatusBadge } from '../../components/statusBadges.jsx';
import { Button, Spinner } from '../../components/ui.jsx';
import { PlateBadge } from '../../components/vehicle.jsx';
import { formatDateTime } from '../../lib/format.js';
import ChecklistSection from './ChecklistSection.jsx';
import { useInspection, useSaveDraft, useSubmitInspection } from './inspectionHooks.js';
import NotesSection from './NotesSection.jsx';
import PhotosSection from './PhotosSection.jsx';

// The saved answers, in the shape the form uses: { [checklistItemId]: { result, remarks } }.
function answersFromResults(results) {
  const answers = {};
  for (const result of results) {
    answers[result.checklistItemId] = { result: result.result, remarks: result.remarks ?? '' };
  }
  return answers;
}

// The answers, in the shape the server wants (only items that have an answer).
function resultsFromAnswers(answers) {
  const results = [];
  for (const [itemId, answer] of Object.entries(answers)) {
    if (answer.result) {
      results.push({
        checklistItemId: Number(itemId),
        result: answer.result,
        remarks: answer.remarks,
      });
    }
  }
  return results;
}

function InspectionForm({ inspection, isEditable }) {
  const [answers, setAnswers] = useState(answersFromResults(inspection.results));
  const [notes, setNotes] = useState({
    mileageKm: inspection.mileageKm ?? '',
    documentsVerified: inspection.documentsVerified,
    documentNotes: inspection.documentNotes ?? '',
    damageNotes: inspection.damageNotes ?? '',
  });
  const [toastMessage, setToastMessage] = useState(null);
  const saveDraft = useSaveDraft(inspection.id);
  const submitInspection = useSubmitInspection(inspection.id);

  function updateAnswer(itemId, answer) {
    setAnswers({ ...answers, [itemId]: answer });
  }

  function updateNote(name, value) {
    setNotes({ ...notes, [name]: value });
  }

  function makeDraft() {
    return { ...notes, results: resultsFromAnswers(answers) };
  }

  function save() {
    saveDraft.mutate(makeDraft(), { onSuccess: () => setToastMessage('Draft saved.') });
  }

  // The latest answers are saved first, then the inspection is submitted.
  function submit() {
    saveDraft.mutate(makeDraft(), {
      onSuccess: () =>
        submitInspection.mutate(undefined, {
          onSuccess: () => setToastMessage('Inspection submitted. The manager has been told.'),
        }),
    });
  }

  const answeredCount = resultsFromAnswers(answers).length;
  const missing = submitInspection.error?.details?.missing;

  return (
    <>
      <p className="mt-4 font-semibold" role="status">
        {answeredCount} of {inspection.checklist.length} checks done. {inspection.photos.length} of
        at least {LIMITS.MIN_INSPECTION_PHOTOS} photos added.
      </p>
      <ChecklistSection
        checklist={inspection.checklist}
        answers={answers}
        onAnswer={updateAnswer}
        isEditable={isEditable}
      />
      <NotesSection notes={notes} onChange={updateNote} isEditable={isEditable} />
      <PhotosSection inspection={inspection} isEditable={isEditable} />
      {isEditable && (
        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6">
          {missing && (
            <div role="alert" className="text-fail">
              <p className="font-semibold">{submitInspection.error.message}</p>
              <ul className="mt-1 list-disc pl-6">
                {missing.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          )}
          {submitInspection.isError && !missing && (
            <p role="alert" className="font-semibold text-fail">
              {submitInspection.error.message}
            </p>
          )}
          {saveDraft.isError && (
            <p role="alert" className="font-semibold text-fail">
              {saveDraft.error.message}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" isBusy={saveDraft.isPending} onClick={save}>
              Save draft
            </Button>
            <Button isBusy={submitInspection.isPending} onClick={submit}>
              Submit inspection
            </Button>
          </div>
        </div>
      )}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </>
  );
}

// FR-IN-01 to FR-IN-08: one inspection. The inspector edits it while it is a draft or returned;
// everyone else of the branch reads it.
export default function InspectionPage() {
  const { inspectionId } = useParams();
  const { user } = useAuth();
  const inspection = useInspection(inspectionId);

  if (inspection.isPending) {
    return (
      <p className="flex items-center gap-2 text-muted" role="status">
        <Spinner /> Loading the inspection.
      </p>
    );
  }
  if (inspection.isError) {
    return (
      <p role="alert" className="font-semibold text-fail">
        {inspection.error.message}
      </p>
    );
  }

  const data = inspection.data;
  const isOpen =
    data.status === INSPECTION_STATUS.DRAFT || data.status === INSPECTION_STATUS.RETURNED;
  const isEditable = isOpen && user.role === ROLE.SALES_STAFF && data.inspectorId === user.id;

  return (
    <div className="max-w-3xl">
      <h1 className="text-title">
        Inspection of the {data.year} {data.make} {data.model}
      </h1>
      <p className="mt-2 flex flex-wrap items-center gap-3">
        <PlateBadge registrationNumber={data.registrationNo} />
        <InspectionStatusBadge status={data.status} />
        <span className="text-muted">By {data.inspectorName}</span>
      </p>
      {data.status === INSPECTION_STATUS.RETURNED && (
        <p className="mt-4 border-l-4 border-warn bg-plate-tint p-4" role="status">
          <span className="font-semibold">The manager returned this inspection: </span>
          {data.reviewRemarks}
        </p>
      )}
      {/* key: when the status changes (for example after submit), the form starts again from the
          server's data. While the status stays the same, the person's unsaved answers stay. */}
      <InspectionForm key={data.status} inspection={data} isEditable={isEditable} />
      {data.events.length > 0 && (
        <section className="mt-8">
          <h2 className="text-section">History</h2>
          <ul className="mt-2 text-small">
            {data.events.map((event) => (
              <li key={`${event.action}-${event.createdAt}`}>
                {formatDateTime(event.createdAt)}: {event.action} by {event.userName}
                {event.remarks && `. ${event.remarks}`}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
