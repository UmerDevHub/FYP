import { ApiError } from '../lib/ApiError.js';

export function notFound(req, res, next) {
  next(new ApiError(404, 'This address does not exist.'));
}

// A database rule that the user broke, mapped to a plain message. The constraint name never leaves the server.
const CONSTRAINT_ERRORS = {
  users_email_unique: [
    409,
    'An account with this e-mail already exists. Log in, or use another e-mail.',
  ],
  vehicles_registration_unique: [
    409,
    'This registration number is already used by another vehicle.',
  ],
  vehicles_chassis_unique: [409, 'This chassis number is already used by another vehicle.'],
  vehicles_sell_request_id_key: [409, 'A car has already arrived for this sell request.'],
};

function toApiError(error) {
  if (error instanceof ApiError) return error;
  if (CONSTRAINT_ERRORS[error.constraint]) {
    const [statusCode, message] = CONSTRAINT_ERRORS[error.constraint];
    return new ApiError(statusCode, message);
  }
  // express.json() marks a body that is not valid JSON with this type: the client sent it wrong.
  if (error.type === 'entity.parse.failed') {
    return new ApiError(400, 'The request body is not valid JSON.');
  }
  // Anything else is our fault. The real error goes to the log only: it can hold SQL or file paths.
  console.error(error);
  return new ApiError(500, 'The server could not finish this request. Try again in a minute.');
}

// The one error handler: every error leaves the API as { error: { message, details } }.
// Express knows this is an error handler because it has four parameters, so next must stay.
// eslint-disable-next-line no-unused-vars
export function errorHandler(error, req, res, next) {
  const apiError = toApiError(error);
  res.status(apiError.statusCode).json({
    error: { message: apiError.message, details: apiError.details },
  });
}
