import { ROLE } from '@v360/shared/constants';
import { NavLink, Outlet } from 'react-router';
import { useAuth } from './AuthProvider.jsx';
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

// The staff menu grows slice by slice. Only sales staff record arrivals (FR-SS-01).
function getStaffLinks(role) {
  const links = [{ to: '/staff/sell-requests', label: 'Sell requests' }];
  if (role === ROLE.SALES_STAFF) {
    links.push({ to: '/staff/arrivals/new', label: 'Record a walk-in' });
  }
  return links;
}

function staffLinkClasses({ isActive }) {
  const weight = isActive ? 'font-semibold text-petrol' : 'text-ink';
  return `flex min-h-target items-center ${weight}`;
}

// Staff pages: a menu on the side on a desktop, on top on a tablet.
export function StaffLayout() {
  const { user } = useAuth();
  return (
    <>
      <Header />
      <div className="mx-auto flex max-w-page flex-col px-4 lg:flex-row lg:gap-8">
        <nav
          aria-label="Staff menu"
          className="border-b border-line py-4 lg:shrink-0 lg:border-r lg:border-b-0 lg:pr-8"
        >
          <ul className="flex flex-wrap gap-x-4 lg:flex-col">
            {getStaffLinks(user?.role).map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={staffLinkClasses}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <main className="flex-1 py-8">
          <Outlet />
        </main>
      </div>
    </>
  );
}
