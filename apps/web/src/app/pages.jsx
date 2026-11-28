import { Link } from 'react-router';

// S1 has no real screens: each layout shows one page that only says which layout it is.
export function LayoutNamePage({ layoutName }) {
  return <h1 className="text-title">{layoutName} layout</h1>;
}

export function NotFoundPage() {
  return (
    <main className="mx-auto max-w-page px-4 py-8">
      <h1 className="text-title">This page does not exist</h1>
      <p className="mt-4">Check the address, or go back to the list of cars.</p>
      <Link
        to="/"
        className="mt-4 inline-flex min-h-target items-center font-semibold text-petrol underline"
      >
        Go to the cars
      </Link>
    </main>
  );
}

// Shown when a page breaks while loading. The details stay in the browser console.
export function ErrorPage() {
  return (
    <main className="mx-auto max-w-page px-4 py-8">
      <h1 className="text-title">This page could not load</h1>
      <p className="mt-4">Reload the page. If it happens again, try again in a few minutes.</p>
      <a
        href="/"
        className="mt-4 inline-flex min-h-target items-center font-semibold text-petrol underline"
      >
        Go to the cars
      </a>
    </main>
  );
}
