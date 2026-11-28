import { LIMITS } from '@v360/shared/constants';
import { rateLimit } from 'express-rate-limit';
import { ApiError } from '../lib/ApiError.js';

// NFR-SC-06: login, register and forgot-password allow a few requests per address, so nobody can
// try thousands of passwords. Each app gets its own counter (createApp builds a new one).
export function createAuthRateLimit() {
  return rateLimit({
    windowMs: LIMITS.AUTH_RATE_LIMIT_MINUTES * 60 * 1000,
    limit: LIMITS.AUTH_RATE_LIMIT_REQUESTS,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (req, res, next) => {
      next(
        new ApiError(
          429,
          `Too many attempts from this address. Try again in ${LIMITS.AUTH_RATE_LIMIT_MINUTES} minutes.`,
        ),
      );
    },
  });
}
