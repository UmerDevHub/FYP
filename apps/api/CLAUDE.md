# Server rules (apps/api)

These rules are read only when you work in this folder. They add to the root CLAUDE.md.

## Shape
- Module pattern: modules/<name>/<name>.routes.js, .service.js and .repository.js. Copy the first finished module.
- A small module with no real rule (the branch list) may skip the service. Write the exception in docs/progress.md.
- The handler inside the routes file is the controller: 3 to 5 lines.
- Static paths (/vehicles/manage, /vehicles/arrivals, /vehicles/stock) come before /vehicles/:id in the routes file.

## Answers
- A list is { data, meta }. One item is { data }. An error is { error: { message, details } }.
- Status codes: 400 bad input, 401 not logged in, 403 not allowed, 404 not found, 409 conflict or wrong status, 429 too many attempts.
- Staff of another branch get 403, not 404.
- Throw ApiError for expected problems. One error handler turns every error into the same shape.
- Map each database constraint name to one friendly message in the error handler.

## Input
- Validate with the shared Zod schema. Put the cleaned values in req.valid. Do not assign to req.query (read-only in Express 5).
- Convert an empty optional number box to "no value" before the schema, or it becomes 0.
- Uploads: check the first bytes of the file, not the file name. Save and read through the files helper only.

## Database
- A schema change is a new numbered migration file. Roles and statuses are enum types.
- Put every rule in the database as a constraint or an index. Use parameterised queries only.
- bigint ids are parsed to numbers once, in the database setup. Money (numeric) stays text.
- Pass one array to select(). Test that the cover photo arrives in the vehicle list.
- Run migrations and seeds with the plain database config, not the camelCase one.

## Side effects
- Notifications and audit rows are written by services (lib/notify.js, lib/activityLog.js), never by routes.
- Pass "now" into any function that depends on time, so a test can choose the time.

## Tests
- Tests use the real _test PostgreSQL database. Stop if the database name does not end in _test.
- Every endpoint gets a normal test and a refusal test. Name each test as a sentence from the SRDS.
- Use the helpers in apps/api/tests for users, vehicles and logins. Do not repeat set-up code.
