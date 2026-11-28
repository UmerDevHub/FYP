// Zod schemas for request bodies, query strings and forms, shared by the server and the screens.
import { z } from 'zod';
import { LIMITS } from './constants.js';

// Stored in lower case, so one address can never make two accounts. 254 is the e-mail standard's maximum.
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, 'Enter an e-mail address of at most 254 characters.')
  .pipe(z.email('Enter a valid e-mail address, for example ali@example.com.'));

// Proposal: 8 to 72 characters with a letter and a number.
export const passwordSchema = z
  .string()
  .min(LIMITS.PASSWORD_MIN_LENGTH, `Use at least ${LIMITS.PASSWORD_MIN_LENGTH} characters.`)
  .max(LIMITS.PASSWORD_MAX_LENGTH, `Use at most ${LIMITS.PASSWORD_MAX_LENGTH} characters.`)
  .regex(/[A-Za-z]/, 'Use at least one letter.')
  .regex(/[0-9]/, 'Use at least one number.');

// A Pakistani mobile number: 03, then 9 digits. The dash in 0300-1234567 is removed before saving.
export const phoneSchema = z
  .string()
  .trim()
  .transform((value) => value.replace('-', ''))
  .pipe(z.string().regex(/^03\d{9}$/, 'Enter a mobile number, for example 0300-1234567.'));

// Query strings arrive as text, so the numbers are converted. Proposal: 12 cars a page by default.
export const pagingSchema = z.object({
  page: z.coerce.number().int().min(1, 'The page starts at 1.').default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1, 'Show at least 1 item a page.')
    .max(50, 'Show at most 50 items a page.')
    .default(12),
});

export const nameSchema = z
  .string()
  .trim()
  .min(2, 'Enter your name.')
  .max(100, 'Use at most 100 characters for your name.');

// FR-AU-01: name, e-mail, phone and password. A role is not part of the form: anything else sent is dropped.
export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
});
