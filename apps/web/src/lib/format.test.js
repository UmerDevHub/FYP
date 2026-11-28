import { describe, expect, it } from 'vitest';
import { formatDate, formatMileage, formatPrice } from './format.js';

describe('formatPrice', () => {
  it('shows rupees with thousands separators', () => {
    expect(formatPrice('5400000.00')).toBe('Rs 5,400,000');
  });

  it('shows zero as Rs 0', () => {
    expect(formatPrice('0')).toBe('Rs 0');
  });

  it('shows nothing for an empty value', () => {
    expect(formatPrice(null)).toBe('');
    expect(formatPrice('')).toBe('');
  });
});

describe('formatDate', () => {
  it('shows the date in Pakistan time (A-04)', () => {
    // 20:30 in UTC on 13 March is already 01:30 on 14 March in Pakistan.
    expect(formatDate('2027-03-13T20:30:00Z')).toBe('14 March 2027');
  });

  it('shows nothing for an empty value', () => {
    expect(formatDate(null)).toBe('');
  });
});

describe('formatMileage', () => {
  it('shows kilometres with thousands separators', () => {
    expect(formatMileage(74000)).toBe('74,000 km');
  });

  it('shows zero as 0 km', () => {
    expect(formatMileage(0)).toBe('0 km');
  });

  it('shows nothing for an empty value', () => {
    expect(formatMileage(null)).toBe('');
  });
});
