import { NavLink, Outlet } from 'react-router';
import Header from './Header.jsx';

// Public pages: mobile first, one column.
export function PublicLayout() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-page px-4 py-8">
        <Outlet />
      </main>
    </>
  );
}

// Customer pages: the same frame as the public pages, for a logged-in customer.
export function CustomerLayout() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-page px-4 py-8">
        <Outlet />
      </main>
    </>
  );
}

// Staff pages: a menu on the side on a desktop, on top on a tablet.
export function StaffLayout() {
  return (
    <>
      <Header />
      <div className="mx-auto flex max-w-page flex-col px-4 lg:flex-row lg:gap-8">
        <nav
          aria-label="Staff menu"
          className="border-b border-line py-4 lg:shrink-0 lg:border-r lg:border-b-0 lg:pr-8"
        >
          <ul className="flex gap-2 lg:flex-col">
            <li>
              <NavLink to="/staff" end className="flex min-h-target items-center font-semibold">
                Overview
              </NavLink>
            </li>
          </ul>
        </nav>
        <main className="flex-1 py-8">
          <Outlet />
        </main>
      </div>
    </>
  );
}
