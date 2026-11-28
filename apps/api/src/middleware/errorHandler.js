import { ApiError } from '../lib/ApiError.js';

export function notFound(req, res, next) {
  next(new ApiError(404, 'This address does not exist.'));
}

function toApiError(error) {
  if (error instanceof ApiError) return error;
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
