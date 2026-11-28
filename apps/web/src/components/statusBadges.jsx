import { SELL_REQUEST_STATUS } from '@v360/shared/constants';
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
