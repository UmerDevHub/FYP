import { INSPECTION_STATUS, ROLE, VEHICLE_STATUS } from '@v360/shared/constants';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../../app/AuthProvider.jsx';
import { EmptyState } from '../../components/feedback.jsx';
import { InspectionStatusBadge } from '../../components/statusBadges.jsx';
import { Button, Spinner } from '../../components/ui.jsx';
import { PlateBadge } from '../../components/vehicle.jsx';
import { formatDate } from '../../lib/format.js';
import { useBranchVehicles, useInspections, useStartInspection } from './inspectionHooks.js';

const TABS = [
  { status: INSPECTION_STATUS.DRAFT, label: 'Draft' },
  { status: INSPECTION_STATUS.SUBMITTED, label: 'Submitted' },
  { status: INSPECTION_STATUS.RETURNED, label: 'Returned' },
  { status: '', label: 'All' },
];

function tabClasses(isActive) {
  const underline = isActive ? 'border-plate font-semibold' : 'border-transparent';
  return `inline-flex min-h-target items-center border-b-2 px-3 ${underline}`;
}

function LoadingLine({ text }) {
  return (
    <p className="mt-4 flex items-center gap-2 text-muted" role="status">
      <Spinner /> {text}
    </p>
  );
}

// FR-IN-01: the received cars of the branch. Sales staff start an inspection from here.
function CarsWaiting() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const receivedCars = useBranchVehicles(VEHICLE_STATUS.RECEIVED);
  const startInspection = useStartInspection();

  function start(vehicleId) {
    startInspection.mutate(vehicleId, {
      onSuccess: (answer) => navigate(`/staff/inspections/${answer.data.id}`),
    });
  }

  if (receivedCars.isPending) return <LoadingLine text="Loading the cars." />;
  if (receivedCars.isError || receivedCars.data.length === 0) return null;

  return (
    <section className="mt-6">
      <h2 className="text-section">Cars waiting for an inspection</h2>
      {startInspection.isError && (
        <p role="alert" className="mt-2 font-semibold text-fail">
          {startInspection.error.message}
        </p>
      )}
      <ul className="mt-2 divide-y divide-line border-y border-line">
        {receivedCars.data.map((car) => (
          <li key={car.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <span className="flex flex-wrap items-center gap-3">
              <PlateBadge registrationNumber={car.registrationNo} />
              {car.year} {car.make} {car.model}, received {formatDate(car.receivedAt)}
            </span>
            {user.role === ROLE.SALES_STAFF && (
              <Button isBusy={startInspection.isPending} onClick={() => start(car.id)}>
                Start inspection
              </Button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

// The inspection queue of the branch, with a status filter kept in the address.
export default function InspectionsPage() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status') ?? INSPECTION_STATUS.DRAFT;
  const inspections = useInspections(status);

  return (
    <div>
      <h1 className="text-title">Inspections</h1>
      <CarsWaiting />
      <nav aria-label="Filter by status" className="mt-8 flex flex-wrap border-b border-line">
        {TABS.map((tab) => (
          <NavLink
            key={tab.label}
            to={`/staff/inspections?status=${tab.status}`}
            className={() => tabClasses(tab.status === status)}
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
      {inspections.isPending && <LoadingLine text="Loading the inspections." />}
      {inspections.isError && (
        <p role="alert" className="mt-4 font-semibold text-fail">
          We could not load the inspections. Reload the page to try again.
        </p>
      )}
      {inspections.isSuccess && inspections.data.length === 0 && (
        <div className="mt-4">
          <EmptyState message="No inspections here." />
        </div>
      )}
      {inspections.isSuccess && inspections.data.length > 0 && (
        <ul className="mt-2 divide-y divide-line">
          {inspections.data.map((inspection) => (
            <li key={inspection.id}>
              <Link
                to={`/staff/inspections/${inspection.id}`}
                className="flex flex-wrap items-center gap-3 py-3"
              >
                <PlateBadge registrationNumber={inspection.registrationNo} />
                <span className="font-semibold">
                  {inspection.year} {inspection.make} {inspection.model}
                </span>
                <InspectionStatusBadge status={inspection.status} />
                <span className="text-small text-muted">
                  By {inspection.inspectorName}, started {formatDate(inspection.createdAt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
