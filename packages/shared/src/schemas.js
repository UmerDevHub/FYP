// Zod schemas for request bodies, query strings and forms, shared by the server and the screens.
import { z } from 'zod';
import { FUEL_TYPES, LIMITS, SELL_REQUEST_STATUSES, TRANSMISSIONS } from './constants.js';

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

// Login checks only that something was typed: the password rules are for new passwords, not old ones.
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Enter your password.'),
});

export const forgotPasswordSchema = z.object({ email: emailSchema });

// The token comes from the link in the e-mail. The new password follows the same rules as at register.
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'This link is not complete. Open the link from the e-mail again.'),
  password: passwordSchema,
});

// FR-AU-05: a user may change only their name and phone. Anything else sent is dropped.
export const updateMeSchema = z.object({ name: nameSchema, phone: phoneSchema });

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Enter your old password.'),
  newPassword: passwordSchema,
});

// An id in the address, such as /api/notifications/12/read.
export const idParamSchema = z.object({
  id: z.coerce.number().int().min(1, 'This address has no valid number.'),
});

// ---------- S3: sell requests and arrival ----------

// A number box in a form sends text, and an empty box sends "". Without this step "" would turn
// into 0 and pass as a real value (a common mistake in the book), so "" becomes "no value".
function emptyToUndefined(value) {
  if (value === '') return undefined;
  return value;
}

function wholeNumber(message, min, max) {
  return z.preprocess(
    emptyToUndefined,
    z.coerce.number({ error: message }).int(message).min(min, message).max(max, message),
  );
}

const nextYear = new Date().getFullYear() + 1;

const carMakeSchema = z.string().trim().min(1, 'Enter the make, for example Toyota.').max(50);
const carModelSchema = z.string().trim().min(1, 'Enter the model, for example Corolla.').max(50);
const carYearSchema = wholeNumber(`Enter a year from 1950 to ${nextYear}.`, 1950, nextYear);
const mileageSchema = wholeNumber('Enter the mileage in km, for example 74000.', 0, 2000000);
const descriptionSchema = z.string().trim().max(1000, 'Use at most 1000 characters.').optional();

// FR-CU-11: branch, make, model, year, mileage, expected price and description.
export const sellRequestSchema = z.object({
  branchId: wholeNumber('Choose a branch.', 1, Number.MAX_SAFE_INTEGER),
  make: carMakeSchema,
  model: carModelSchema,
  year: carYearSchema,
  mileageKm: mileageSchema,
  expectedPrice: wholeNumber(
    'Enter the price you expect in rupees, for example 2500000.',
    1,
    1000000000,
  ),
  description: descriptionSchema,
});

// FR-BM-01: a rejection needs a reason, which the customer sees.
export const rejectSellRequestSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(5, 'Write the reason for the customer.')
    .max(500, 'Use at most 500 characters.'),
});

// ?status=pending on the staff list. No status means every status.
export const sellRequestListSchema = z.object({
  status: z.enum(SELL_REQUEST_STATUSES, { error: 'Choose a status from the list.' }).optional(),
});

// Registration and chassis numbers are saved in one form (upper case, no spaces at the ends),
// so "lea-123" and "LEA-123" count as the same car (a common mistake in the book).
function upperCaseText(min, max, message) {
  return z.string().trim().toUpperCase().min(min, message).max(max, message);
}

// FR-SS-01: the arrival of a car, from an accepted sell request or as a walk-in (no request).
export const arrivalSchema = z.object({
  sellRequestId: z.preprocess(emptyToUndefined, z.coerce.number().int().min(1).optional()),
  make: carMakeSchema,
  model: carModelSchema,
  year: carYearSchema,
  mileageKm: mileageSchema,
  fuelType: z.enum(FUEL_TYPES, { error: 'Choose the fuel type.' }),
  transmission: z.enum(TRANSMISSIONS, { error: 'Choose the transmission.' }),
  colour: z.string().trim().min(1, 'Enter the colour.').max(30),
  registrationNo: upperCaseText(2, 15, 'Enter the registration number, for example LEA-1234.'),
  chassisNo: upperCaseText(5, 30, 'Enter the chassis number from the car documents.'),
  description: descriptionSchema,
});
