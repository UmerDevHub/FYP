export const LIMITS = {
  // A-03: an accepted sell request expires if the seller does not arrive within 7 days.
  SELL_REQUEST_EXPIRY_DAYS: 7,
  // A-06: at least 4 inspection photos are needed to submit an inspection.
  MIN_INSPECTION_PHOTOS: 4,
  // A-18: a user is locked for a short time after five failed logins.
  FAILED_LOGINS_BEFORE_LOCK: 5,
};
