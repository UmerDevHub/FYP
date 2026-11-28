import { SELL_REQUEST_STATUS, VEHICLE_STATUS } from '@v360/shared/constants';

// FR-AC-02 and NFR-CR-01: the only status changes the system allows. Any other change is refused.
// Each line reads "from this status, the record may move to these statuses".

// SRDS Table 5.6.
export const SELL_REQUEST_TRANSITIONS = {
  [SELL_REQUEST_STATUS.PENDING]: [SELL_REQUEST_STATUS.ACCEPTED, SELL_REQUEST_STATUS.REJECTED],
  [SELL_REQUEST_STATUS.ACCEPTED]: [SELL_REQUEST_STATUS.COMPLETED, SELL_REQUEST_STATUS.EXPIRED],
};

// SRDS Table 5.5 (the rows of the 35%). Booked, sold and delivered are built later.
export const VEHICLE_TRANSITIONS = {
  [VEHICLE_STATUS.RECEIVED]: [VEHICLE_STATUS.UNDER_INSPECTION],
  [VEHICLE_STATUS.UNDER_INSPECTION]: [
    VEHICLE_STATUS.READY_FOR_SALE,
    VEHICLE_STATUS.RECONDITIONING,
    VEHICLE_STATUS.REJECTED,
  ],
  [VEHICLE_STATUS.RECONDITIONING]: [VEHICLE_STATUS.READY_FOR_SALE],
};

export function isTransitionAllowed(transitions, fromStatus, toStatus) {
  const allowedNextStatuses = transitions[fromStatus];
  if (!allowedNextStatuses) return false;
  return allowedNextStatuses.includes(toStatus);
}
