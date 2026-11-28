import { describe, expect, it } from 'vitest';
import {
  INSPECTION_STATUSES,
  LIMITS,
  ROLES,
  SELL_REQUEST_STATUSES,
  VEHICLE_STATUSES,
} from '../src/constants.js';

describe('roles and statuses use the SRDS words', () => {
  it('has the four roles', () => {
    expect(ROLES).toEqual(['customer', 'sales_staff', 'branch_manager', 'admin']);
  });

  it('a sell request is Pending, Accepted, Rejected, Expired or Completed (A-03)', () => {
    expect(SELL_REQUEST_STATUSES).toEqual([
      'pending',
      'accepted',
      'rejected',
      'expired',
      'completed',
    ]);
  });

  it('a vehicle moves through the FR-AC-01 statuses plus Rejected (A-02)', () => {
    expect(VEHICLE_STATUSES).toEqual([
      'received',
      'under_inspection',
      'reconditioning',
      'ready_for_sale',
      'booked',
      'sold',
      'delivered',
      'rejected',
    ]);
  });

  it('an inspection is Draft, Submitted, Approved, Returned or Rejected (Table 5.7)', () => {
    expect(INSPECTION_STATUSES).toEqual(['draft', 'submitted', 'approved', 'returned', 'rejected']);
  });
});

describe('LIMITS', () => {
  it('an accepted sell request expires after 7 days (A-03)', () => {
    expect(LIMITS.SELL_REQUEST_EXPIRY_DAYS).toBe(7);
  });

  it('an inspection needs at least 4 photos to be submitted (A-06)', () => {
    expect(LIMITS.MIN_INSPECTION_PHOTOS).toBe(4);
  });

  it('a user is locked after 5 failed logins (A-18)', () => {
    expect(LIMITS.FAILED_LOGINS_BEFORE_LOCK).toBe(5);
  });

  it('a photo may be up to 5 MB (FR-IN-05)', () => {
    expect(LIMITS.MAX_PHOTO_SIZE_MB).toBe(5);
  });

  it('the ageing groups end at 30, 60 and 90 days', () => {
    expect(LIMITS.AGEING_DAYS).toEqual([30, 60, 90]);
  });
});
