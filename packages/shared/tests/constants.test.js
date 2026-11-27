import { describe, expect, it } from 'vitest';
import { LIMITS } from '../src/constants.js';

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
});
