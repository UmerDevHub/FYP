// The UI kit: every screen is built from these parts. Styles use the tokens in index.css only.
import { LoaderCircle } from 'lucide-react';
import { useId } from 'react';

// ---------- Button ----------

const BUTTON_VARIANTS = {
  primary: 'bg-petrol text-paper hover:brightness-125',
  accent: 'bg-plate text-ink hover:brightness-95',
  secondary: 'border border-line bg-paper text-petrol hover:bg-petrol-tint',
  danger: 'bg-fail text-paper hover:brightness-110',
};

// type="button" by default, so a button inside a form never sends the form by accident.
export function Button({
  variant = 'primary',
  type = 'button',
  isBusy = false,
  disabled = false,
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isBusy}
      aria-busy={isBusy}
      className={`inline-flex min-h-target items-center justify-center gap-2 rounded-control px-4 font-heading text-card font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${BUTTON_VARIANTS[variant]}`}
      {...props}
    >
      {isBusy && <Spinner />}
      {children}
    </button>
  );
}

export function Spinner() {
  return <LoaderCircle aria-hidden="true" className="size-6 animate-spin" />;
}

// ---------- Field, Select, Textarea ----------

function controlClasses(error) {
  const border = error ? 'border-fail' : 'border-line';
  return `min-h-target w-full rounded-control border ${border} bg-paper px-3 text-body text-ink disabled:cursor-not-allowed disabled:opacity-60`;
}

// Gives a control its id and links its hint and error to it, so screen readers read them too.
function useFieldIds(hint, error) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined;
  return { id, hintId, errorId, describedBy };
}

function FieldText({ ids, hint, error }) {
  return (
    <>
      {hint && (
        <p id={ids.hintId} className="text-small text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={ids.errorId} className="text-small font-semibold text-fail">
          {error}
        </p>
      )}
    </>
  );
}

export function Field({ label, hint, error, ...inputProps }) {
  const ids = useFieldIds(hint, error);
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={ids.id} className="font-semibold">
        {label}
      </label>
      <input
        id={ids.id}
        aria-describedby={ids.describedBy}
        aria-invalid={Boolean(error)}
        className={controlClasses(error)}
        {...inputProps}
      />
      <FieldText ids={ids} hint={hint} error={error} />
    </div>
  );
}

// options: [{ value, label }]
export function Select({ label, hint, error, options, ...selectProps }) {
  const ids = useFieldIds(hint, error);
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={ids.id} className="font-semibold">
        {label}
      </label>
      <select
        id={ids.id}
        aria-describedby={ids.describedBy}
        aria-invalid={Boolean(error)}
        className={controlClasses(error)}
        {...selectProps}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldText ids={ids} hint={hint} error={error} />
    </div>
  );
}

export function Textarea({ label, hint, error, ...textareaProps }) {
  const ids = useFieldIds(hint, error);
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={ids.id} className="font-semibold">
        {label}
      </label>
      <textarea
        id={ids.id}
        rows={4}
        aria-describedby={ids.describedBy}
        aria-invalid={Boolean(error)}
        className={`${controlClasses(error)} py-2`}
        {...textareaProps}
      />
      <FieldText ids={ids} hint={hint} error={error} />
    </div>
  );
}

// ---------- Badge and Card ----------

// A status is always a word; the colour only supports it.
const BADGE_TONES = {
  neutral: 'border-line text-muted',
  info: 'border-info text-info',
  pass: 'border-pass text-pass',
  warn: 'border-warn text-warn',
  fail: 'border-fail text-fail',
};

export function Badge({ tone = 'neutral', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-control border px-2 text-small font-semibold ${BADGE_TONES[tone]}`}
    >
      {children}
    </span>
  );
}

// Only for objects, such as a car. Everything else uses plain rows and lines.
export function Card({ children }) {
  return <article className="rounded-control border border-line bg-paper">{children}</article>;
}
