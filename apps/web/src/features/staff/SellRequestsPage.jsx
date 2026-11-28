import { ROLE, SELL_REQUEST_STATUS } from '@v360/shared/constants';
import { Link, NavLink, useLocation, useSearchParams } from 'react-router';
import { useAuth } from '../../app/AuthProvider.jsx';
import { EmptyState } from '../../components/feedback.jsx';
import { SellRequestStatusBadge } from '../../components/statusBadges.jsx';
import { Spinner } from '../../components/ui.jsx';
import { formatDate, formatMileage, formatPrice } from '../../lib/format.js';
import SellRequestActions from './SellRequestActions.jsx';
import { useBranchSellRequests } from './staffHooks.js';

// The tabs keep the chosen status in the address (?status=accepted), so a reload keeps it.
const TABS = [
  { status: SELL_REQUEST_STATUS.PENDING, label: 'Pending' },
  { status: SELL_REQUEST_STATUS.ACCEPTED, label: 'Accepted' },
  { status: '', label: 'All' },
];

function tabClasses(isActive) {
  const underline = isActive ? 'border-plate font-semibold' : 'border-transparent';
  return `inline-flex min-h-target items-center border-b-2 px-3 ${underline}`;
}

function SellRequestRow({ sellRequest, role }) {
  return (
    <li className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">
            {sellRequest.year} {sellRequest.make} {sellRequest.model}
          </span>
          <SellRequestStatusBadge status={sellRequest.status} />
        </div>
        <p className="mt-1">
          {sellRequest.customerName}, {sellRequest.customerPhone}. Asks{' '}
          {formatPrice(sellRequest.expectedPrice)}. {formatMileage(sellRequest.mileageKm)}.
        </p>
        <p className="text-small text-muted">
          Sent on {formatDate(sellRequest.createdAt)}.
          {sellRequest.status === SELL_REQUEST_STATUS.ACCEPTED &&
            ` Must arrive by ${formatDate(sellRequest.expiresAt)}.`}
        </p>
        {sellRequest.description && <p className="mt-1 text-small">{sellRequest.description}</p>}
      </div>
      <SellRequestActions sellRequest={sellRequest} role={role} />
    </li>
  );
}

// FR-SS-08 and FR-BM-01: the sell requests of the user's own branch.
export default function SellRequestsPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status') ?? SELL_REQUEST_STATUS.PENDING;
  const sellRequests = useBranchSellRequests(status);

  return (
    <div>
      <h1 className="text-title">Sell requests</h1>
      {location.state?.message && (
        <p role="status" className="mt-4 font-semibold text-pass">
          {location.state.message}
        </p>
      )}
      <nav aria-label="Filter by status" className="mt-4 flex border-b border-line">
        {TABS.map((tab) => (
          <NavLink
            key={tab.label}
            to={`/staff/sell-requests?status=${tab.status}`}
            className={() => tabClasses(tab.status === status)}
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
      {sellRequests.isPending && (
        <p className="mt-6 flex items-center gap-2 text-muted" role="status">
          <Spinner /> Loading the sell requests.
        </p>
      )}
      {sellRequests.isError && (
        <p role="alert" className="mt-6 font-semibold text-fail">
          We could not load the sell requests. Reload the page to try again.
        </p>
      )}
      {sellRequests.isSuccess && sellRequests.data.length === 0 && (
        <div className="mt-6">
          <EmptyState
            message="No sell requests here."
            action={
              user.role === ROLE.SALES_STAFF && (
                <Link to="/staff/arrivals/new" className="font-semibold text-petrol underline">
                  Record a walk-in arrival
                </Link>
              )
            }
          />
        </div>
      )}
      {sellRequests.isSuccess && sellRequests.data.length > 0 && (
        <ul className="mt-2 divide-y divide-line">
          {sellRequests.data.map((sellRequest) => (
            <SellRequestRow key={sellRequest.id} sellRequest={sellRequest} role={user.role} />
          ))}
        </ul>
      )}
    </div>
  );
}
