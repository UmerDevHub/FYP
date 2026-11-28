// UI kit, part two: things that tell the person what happened (split out of ui.jsx, see docs/progress.md).
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

// The browser's own <dialog> traps focus, closes on Escape and gives focus back when it closes.
export function Dialog({ isOpen, onClose, title, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="dialog-title"
      className="m-auto w-full max-w-lg rounded-control border border-line bg-paper p-6 text-ink shadow-dialog backdrop:bg-ink/40 open:animate-[dialog-open_150ms_ease-out]"
    >
      <h2 id="dialog-title" className="text-section">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </dialog>
  );
}

// One sentence about what is missing and the next step, for example a button.
export function EmptyState({ message, action }) {
  return (
    <div className="flex flex-col items-start gap-4 border-t border-line py-8">
      <p>{message}</p>
      {action}
    </div>
  );
}

const TOAST_SECONDS = 5;

// One short message after an action ("Sell request sent."). It closes by itself or with the button.
export function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, TOAST_SECONDS * 1000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="status"
      className="fixed right-4 bottom-4 left-4 flex items-center justify-between gap-4 rounded-control bg-ink px-4 py-3 text-paper sm:left-auto sm:max-w-sm"
    >
      <p>{message}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close message"
        className="flex size-target items-center justify-center rounded-control"
      >
        <X aria-hidden="true" className="size-6" />
      </button>
    </div>
  );
}
