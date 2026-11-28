import { ROLE } from '@v360/shared/constants';
import { Link, NavLink } from 'react-router';
import { useAuth } from './AuthProvider.jsx';

const STAFF_ROLES = [ROLE.SALES_STAFF, ROLE.BRANCH_MANAGER, ROLE.ADMIN];

// Everyone sees the public links. A customer also sees their account; staff see their area.
function getMenuLinks(role) {
  const links = [
    { to: '/', label: 'Cars' },
    { to: '/sell', label: 'Sell your car' },
  ];
  if (role === ROLE.CUSTOMER) {
    links.push({ to: '/my-requests', label: 'My requests' });
    links.push({ to: '/account', label: 'My account' });
  }
  if (STAFF_ROLES.includes(role)) links.push({ to: '/staff', label: 'Staff area' });
  // A plain link, no bell or counter: the slice leaves the unread count out (see progress.md).
  if (role) links.push({ to: '/notifications', label: 'Notifications' });
  return links;
}

// The active link gets the one small yellow mark the design allows.
function menuLinkClasses({ isActive }) {
  const underline = isActive ? 'border-plate' : 'border-transparent';
  return `flex min-h-target items-center border-b-2 px-2 ${underline}`;
}

export default function Header() {
  const { user, logOut } = useAuth();

  return (
    <header className="bg-petrol text-paper">
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-6 px-4">
        <Link to="/" className="flex min-h-target items-center font-heading text-card font-bold">
          Vehicle 360
        </Link>
        <nav aria-label="Main menu">
          <ul className="flex flex-wrap gap-x-2">
            {getMenuLinks(user?.role).map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end className={menuLinkClasses}>
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li>
              {user ? (
                <button type="button" onClick={logOut} className={menuLinkClasses({})}>
                  Log out
                </button>
              ) : (
                <NavLink to="/login" className={menuLinkClasses}>
                  Log in
                </NavLink>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
