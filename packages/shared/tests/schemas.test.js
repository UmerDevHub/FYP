import { describe, expect, it } from 'vitest';
import {
  emailSchema,
  nameSchema,
  pagingSchema,
  passwordSchema,
  phoneSchema,
  loginSchema,
  registerSchema,
} from '../src/schemas.js';

function isAccepted(schema, value) {
  return schema.safeParse(value).success;
}

describe('emailSchema', () => {
  it('accepts an e-mail and stores it in lower case', () => {
    expect(emailSchema.parse('  Ali@Example.com ')).toBe('ali@example.com');
  });

  it('accepts 254 characters and refuses 255', () => {
    expect(isAccepted(emailSchema, `${'a'.repeat(242)}@example.com`)).toBe(true);
    expect(isAccepted(emailSchema, `${'a'.repeat(243)}@example.com`)).toBe(false);
  });

  it('refuses an address without @', () => {
    expect(isAccepted(emailSchema, 'ali.example.com')).toBe(false);
  });
});

describe('passwordSchema', () => {
  it('accepts 8 characters and refuses 7', () => {
    expect(isAccepted(passwordSchema, 'abcdef12')).toBe(true);
    expect(isAccepted(passwordSchema, 'abcde12')).toBe(false);
  });

  it('accepts 72 characters and refuses 73', () => {
    expect(isAccepted(passwordSchema, `${'a'.repeat(71)}1`)).toBe(true);
    expect(isAccepted(passwordSchema, `${'a'.repeat(72)}1`)).toBe(false);
  });

  it('needs a letter and a number', () => {
    expect(isAccepted(passwordSchema, 'abcdefgh')).toBe(false);
    expect(isAccepted(passwordSchema, '12345678')).toBe(false);
  });
});

describe('phoneSchema', () => {
  it('accepts a mobile number with or without the dash and stores it without', () => {
    expect(phoneSchema.parse('0300-1234567')).toBe('03001234567');
    expect(phoneSchema.parse('03001234567')).toBe('03001234567');
  });

  it('refuses one digit too few and one digit too many', () => {
    expect(isAccepted(phoneSchema, '0300123456')).toBe(false);
    expect(isAccepted(phoneSchema, '030012345678')).toBe(false);
  });

  it('refuses a number that does not start with 03 or holds letters', () => {
    expect(isAccepted(phoneSchema, '04001234567')).toBe(false);
    expect(isAccepted(phoneSchema, '0300abc4567')).toBe(false);
  });
});

describe('pagingSchema', () => {
  it('uses page 1 and 12 cars a page when nothing is given', () => {
    expect(pagingSchema.parse({})).toEqual({ page: 1, limit: 12 });
  });

  it('reads the numbers from the address text', () => {
    expect(pagingSchema.parse({ page: '2', limit: '20' })).toEqual({ page: 2, limit: 20 });
  });

  it('accepts page 1 and refuses page 0', () => {
    expect(isAccepted(pagingSchema, { page: '1' })).toBe(true);
    expect(isAccepted(pagingSchema, { page: '0' })).toBe(false);
  });

  it('accepts a limit from 1 to 50 and refuses 0 and 51', () => {
    expect(isAccepted(pagingSchema, { limit: '1' })).toBe(true);
    expect(isAccepted(pagingSchema, { limit: '50' })).toBe(true);
    expect(isAccepted(pagingSchema, { limit: '0' })).toBe(false);
    expect(isAccepted(pagingSchema, { limit: '51' })).toBe(false);
  });
});

describe('nameSchema', () => {
  it('accepts 2 characters and refuses 1', () => {
    expect(isAccepted(nameSchema, 'Al')).toBe(true);
    expect(isAccepted(nameSchema, 'A')).toBe(false);
  });

  it('accepts 100 characters and refuses 101', () => {
    expect(isAccepted(nameSchema, 'a'.repeat(100))).toBe(true);
    expect(isAccepted(nameSchema, 'a'.repeat(101))).toBe(false);
  });
});

describe('registerSchema', () => {
  const validForm = {
    name: 'Ali Khan',
    email: 'Ali@Example.com',
    phone: '0300-1234567',
    password: 'abcdef12',
  };

  it('accepts a complete form and cleans the e-mail and phone', () => {
    expect(registerSchema.parse(validForm)).toEqual({
      name: 'Ali Khan',
      email: 'ali@example.com',
      phone: '03001234567',
      password: 'abcdef12',
    });
  });

  it('drops a role sent with the form (FR-AU-01: always Customer)', () => {
    expect(registerSchema.parse({ ...validForm, role: 'admin' })).not.toHaveProperty('role');
  });

  it('needs every field', () => {
    expect(isAccepted(registerSchema, { ...validForm, phone: undefined })).toBe(false);
  });
});

describe('loginSchema', () => {
  it('accepts an e-mail and any password that is not empty', () => {
    expect(loginSchema.parse({ email: 'Ali@Example.com', password: 'x' })).toEqual({
      email: 'ali@example.com',
      password: 'x',
    });
  });

  it('refuses an empty password', () => {
    expect(isAccepted(loginSchema, { email: 'ali@example.com', password: '' })).toBe(false);
  });
});
