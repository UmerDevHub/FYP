import { z } from 'zod';
import { ApiError } from '../lib/ApiError.js';

// Checks req.body, req.query or req.params with a Zod schema and puts the clean values in
// req.valid. req.query is read-only in Express 5, so the clean values never go back into it.
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      throw new ApiError(400, 'Check the fields marked in red.', fieldErrors);
    }
    req.valid = { ...req.valid, [source]: result.data };
    next();
  };
}
