import { INSPECTION_RESULT } from '@v360/shared/constants';
import { Field } from '../../components/ui.jsx';

// The four answers of FR-IN-02. A status is always a word, never only a colour.
const RESULT_CHOICES = [
  { value: INSPECTION_RESULT.GOOD, label: 'Good' },
  { value: INSPECTION_RESULT.FAIR, label: 'Fair' },
  { value: INSPECTION_RESULT.POOR, label: 'Poor' },
  { value: INSPECTION_RESULT.NOT_APPLICABLE, label: 'Not applicable' },
];

function resultLabel(result) {
  const choice = RESULT_CHOICES.find((item) => item.value === result);
  if (!choice) return 'No answer';
  return choice.label;
}

// Groups the checklist items by category, keeping their order.
function groupByCategory(checklist) {
  const groups = [];
  for (const item of checklist) {
    let group = groups.find((existing) => existing.category === item.category);
    if (!group) {
      group = { category: item.category, items: [] };
      groups.push(group);
    }
    group.items.push(item);
  }
  return groups;
}

// One-tap buttons, at least 44 px high, so the form works on a tablet (docs/design.md).
function ResultButtons({ item, answer, onAnswer }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={item.name}>
      {RESULT_CHOICES.map((choice) => {
        const isChosen = answer.result === choice.value;
        const look = isChosen
          ? 'border-petrol bg-petrol text-paper'
          : 'border-line bg-paper text-ink';
        return (
          <button
            key={choice.value}
            type="button"
            aria-pressed={isChosen}
            onClick={() => onAnswer(item.id, { ...answer, result: choice.value })}
            className={`min-h-target rounded-control border px-4 font-semibold ${look}`}
          >
            {choice.label}
          </button>
        );
      })}
    </div>
  );
}

function ChecklistItem({ item, answer, onAnswer, isEditable }) {
  const needsRemark =
    answer.result === INSPECTION_RESULT.FAIR || answer.result === INSPECTION_RESULT.POOR;

  if (!isEditable) {
    return (
      <li className="flex flex-wrap justify-between gap-2 py-3">
        <span>{item.name}</span>
        <span className="font-semibold">
          {resultLabel(answer.result)}
          {answer.remarks && <span className="font-normal">: {answer.remarks}</span>}
        </span>
      </li>
    );
  }

  return (
    <li className="flex flex-col gap-2 py-3">
      <span className="font-semibold">{item.name}</span>
      <ResultButtons item={item} answer={answer} onAnswer={onAnswer} />
      {needsRemark && (
        <Field
          label={`What did you see? (${item.name})`}
          value={answer.remarks ?? ''}
          onChange={(event) => onAnswer(item.id, { ...answer, remarks: event.target.value })}
        />
      )}
    </li>
  );
}

// answers: { [checklistItemId]: { result, remarks } }
export default function ChecklistSection({ checklist, answers, onAnswer, isEditable }) {
  return (
    <section className="mt-8">
      <h2 className="text-section">Checklist</h2>
      {groupByCategory(checklist).map((group) => (
        <div key={group.category} className="mt-4">
          <h3 className="text-card">{group.category}</h3>
          <ul className="divide-y divide-line border-y border-line">
            {group.items.map((item) => (
              <ChecklistItem
                key={item.id}
                item={item}
                answer={answers[item.id] ?? {}}
                onAnswer={onAnswer}
                isEditable={isEditable}
              />
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
