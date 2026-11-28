import { INSPECTION_STATUS, SELL_REQUEST_STATUS, VEHICLE_STATUS } from '@v360/shared/constants';
import { Badge } from './ui.jsx';

// NFR-US-03: a status is always shown as a word; the colour only supports it.
const SELL_REQUEST_BADGES = {
  [SELL_REQUEST_STATUS.PENDING]: { label: 'Pending', tone: 'neutral' },
  [SELL_REQUEST_STATUS.ACCEPTED]: { label: 'Accepted', tone: 'info' },
  [SELL_REQUEST_STATUS.REJECTED]: { label: 'Not accepted', tone: 'fail' },
  [SELL_REQUEST_STATUS.EXPIRED]: { label: 'Expired', tone: 'warn' },
  [SELL_REQUEST_STATUS.COMPLETED]: { label: 'Car arrived', tone: 'pass' },
};

export function SellRequestStatusBadge({ status }) {
  const badge = SELL_REQUEST_BADGES[status];
  return <Badge tone={badge.tone}>{badge.label}</Badge>;
}

const INSPECTION_BADGES = {
  [INSPECTION_STATUS.DRAFT]: { label: 'Draft', tone: 'neutral' },
  [INSPECTION_STATUS.SUBMITTED]: { label: 'Submitted', tone: 'info' },
  [INSPECTION_STATUS.APPROVED]: { label: 'Approved', tone: 'pass' },
  [INSPECTION_STATUS.RETURNED]: { label: 'Returned', tone: 'warn' },
  [INSPECTION_STATUS.REJECTED]: { label: 'Rejected', tone: 'fail' },
};

export function InspectionStatusBadge({ status }) {
  const badge = INSPECTION_BADGES[status];
  return <Badge tone={badge.tone}>{badge.label}</Badge>;
}

const VEHICLE_BADGES = {
  [VEHICLE_STATUS.RECEIVED]: { label: 'Received', tone: 'neutral' },
  [VEHICLE_STATUS.UNDER_INSPECTION]: { label: 'Under inspection', tone: 'info' },
  [VEHICLE_STATUS.RECONDITIONING]: { label: 'Reconditioning', tone: 'warn' },
  [VEHICLE_STATUS.READY_FOR_SALE]: { label: 'Ready for sale', tone: 'pass' },
  [VEHICLE_STATUS.BOOKED]: { label: 'Booked', tone: 'info' },
  [VEHICLE_STATUS.SOLD]: { label: 'Sold', tone: 'neutral' },
  [VEHICLE_STATUS.DELIVERED]: { label: 'Delivered', tone: 'neutral' },
  [VEHICLE_STATUS.REJECTED]: { label: 'Rejected', tone: 'fail' },
};

export function VehicleStatusBadge({ status }) {
  const badge = VEHICLE_BADGES[status];
  return <Badge tone={badge.tone}>{badge.label}</Badge>;
}
