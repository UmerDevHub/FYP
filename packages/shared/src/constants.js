// The words and numbers the whole system uses. Import them; never type them again elsewhere.

// Use ROLE.SALES_STAFF in code, so a role word is never typed twice.
export const ROLE = {
  CUSTOMER: 'customer',
  SALES_STAFF: 'sales_staff',
  BRANCH_MANAGER: 'branch_manager',
  ADMIN: 'admin',
};
export const ROLES = Object.values(ROLE);

// A-03 and Table 5.6.
export const SELL_REQUEST_STATUSES = ['pending', 'accepted', 'rejected', 'expired', 'completed'];

// FR-AC-01, plus rejected (A-02). booked, sold and delivered are built later.
export const VEHICLE_STATUSES = [
  'received',
  'under_inspection',
  'reconditioning',
  'ready_for_sale',
  'booked',
  'sold',
  'delivered',
  'rejected',
];

// Table 5.7.
export const INSPECTION_STATUSES = ['draft', 'submitted', 'approved', 'returned', 'rejected'];

// Assumption: the SRDS does not list fuel or transmission types.
export const FUEL_TYPES = ['petrol', 'diesel', 'hybrid', 'electric', 'cng'];
export const TRANSMISSIONS = ['manual', 'automatic'];

export const LIMITS = {
  // A-03: an accepted sell request expires if the seller does not arrive within 7 days.
  SELL_REQUEST_EXPIRY_DAYS: 7,
  // A-06: at least 4 inspection photos are needed to submit an inspection.
  MIN_INSPECTION_PHOTOS: 4,
  // A-18: a user is locked for a short time after five failed logins.
  FAILED_LOGINS_BEFORE_LOCK: 5,
  // FR-IN-05: only JPG and PNG files up to 5 MB.
  MAX_PHOTO_SIZE_MB: 5,
  // Proposal (FR-IV-05): ageing groups 0 to 30, 31 to 60, 61 to 90 and over 90 days.
  AGEING_DAYS: [30, 60, 90],

  // Login (S2). All Proposals: the SRDS says "short-lived", "a short time" and "a fixed time".
  ACCESS_TOKEN_MINUTES: 15,
  REFRESH_TOKEN_DAYS: 7,
  BCRYPT_COST: 12,
  // A-18 says "a short time"; 15 minutes is the Proposal.
  LOCK_MINUTES: 15,
  RESET_LINK_MINUTES: 60,
  PASSWORD_MIN_LENGTH: 8,
  // bcrypt reads only the first 72 bytes of a password.
  PASSWORD_MAX_LENGTH: 72,
  // NFR-SC-06 asks for a rate limit; 20 requests per 15 minutes per address is the Proposal.
  AUTH_RATE_LIMIT_REQUESTS: 20,
  AUTH_RATE_LIMIT_MINUTES: 15,
};
