import { SELL_REQUEST_STATUS } from '@v360/shared/constants';
import { Link, useLocation } from 'react-router';
import { EmptyState } from '../../components/feedback.jsx';
import { SellRequestStatusBadge } from '../../components/statusBadges.jsx';
import { Spinner } from '../../components/ui.jsx';
import { formatDate, formatMileage, formatPrice } from '../../lib/format.js';
import { useMySellRequests } from './sellHooks.js';

const BUTTON_LINK_CLASSES =
  'inline-flex min-h-target items-center rounded-control bg-petrol px-4 font-heading text-card font-semibold text-paper';

// What the customer should know about each status, in one sentence.
function NextStep({ sellRequest }) {
  if (sellRequest.status === SELL_REQUEST_STATUS.ACCEPTED) {
    return (
      <p className="mt-1 font-semibold">
        Bring the car to {sellRequest.branchName} by {formatDate(sellRequest.expiresAt)}.
      </p>
    );
  }
  if (sellRequest.status === SELL_REQUEST_STATUS.REJECTED) {
    return <p className="mt-1">Reason: {sellRequest.decisionReason}</p>;
  }
  return null;
}

// FR-CU-12: the customer's own requests, also after they are finished.
export default function MyRequestsPage() {
  const location = useLocation();
  const myRequests = useMySellRequests();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-title">My requests</h1>
      {location.state?.message && (
        <p role="status" className="mt-4 font-semibold text-pass">
          {location.state.message}
        </p>
      )}
      {myRequests.isPending && (
        <p className="mt-6 flex items-center gap-2 text-muted" role="status">
          <Spinner /> Loading your requests.
        </p>
      )}
      {myRequests.isError && (
        <p role="alert" className="mt-6 font-semibold text-fail">
          We could not load your requests. Reload the page to try again.
        </p>
      )}
      {myRequests.isSuccess && myRequests.data.length === 0 && (
        <div className="mt-6">
          <EmptyState
            message="You have no requests yet."
            action={
              <Link to="/sell" className={BUTTON_LINK_CLASSES}>
                Send your first sell request
              </Link>
            }
          />
        </div>
      )}
      {myRequests.isSuccess && myRequests.data.length > 0 && (
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {myRequests.data.map((sellRequest) => (
            <li key={sellRequest.id} className="py-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">
                  {sellRequest.year} {sellRequest.make} {sellRequest.model}
                </span>
                <SellRequestStatusBadge status={sellRequest.status} />
              </div>
              <p className="mt-1 text-small text-muted">
                {sellRequest.branchName}. {formatMileage(sellRequest.mileageKm)}. You asked{' '}
                {formatPrice(sellRequest.expectedPrice)}. Sent on{' '}
                {formatDate(sellRequest.createdAt)}.
              </p>
              <NextStep sellRequest={sellRequest} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
