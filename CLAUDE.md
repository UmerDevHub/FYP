# Vehicle 360: rules for Claude

## What this is
Vehicle 360 is a multi-branch car dealership system for AK Motors (final year project, COMSATS Wah).
We build the first 35%: sell request, arrival, inspection, manager approval, repairs, public listing, stock list and the expiry job. Login and accounts come on top of it.
Two people build it: Umer (server) and Habib (screens). Both must be able to explain every file in the viva.
Stack: React and Vite in apps/web, Node.js and Express in apps/api, PostgreSQL, plain JavaScript with ES modules.

## Where to read more (open these when needed; they are not loaded for you)
- docs/srds-35.md: the requirements of the 35%. Names, statuses and rules come from it. If something is missing there, ask me. Never invent a requirement.
- docs/progress.md: what is done, decisions, what is next. Read it at the start of every session.
- docs/slices/S0.md to S9.md: one file per slice. I attach the one we are working on. Stay inside its scope.
- docs/architecture.md, docs/data-model.md, docs/api-contract.md, docs/design.md: read the one that fits the task.
- docs/acceptance.md: the 40 acceptance cases (AT-01 to AT-40). docs/prompt-log.md: one line for every prompt that changed the project.

## Commands
- npm run dev starts everything. npm run dev:api and npm run dev:web start one part.
- npm test runs all tests (needs the PostgreSQL test database, see README.md).
- npm run lint and npm run format check and format the code.
- npm run migrate, npm run seed and npm run demo:reset work on the development database.
- npm run job:expire runs the expiry job once by hand.

## How to work
- One slice at a time. Do not build anything that is outside the slice file.
- Plan first for anything bigger than one file. Wait for my approval before you write code.
- Small steps. After each step the app still starts and the tests pass.
- Before you say a step is done, run npm test and npm run format and show me the result.
- Show me what changed. Explain anything I might not understand in simple English.
- If a requirement is unclear, ask. Label every guess Assumption and every idea of yours Proposal.
- Do not add features I did not ask for. Do not tidy code that is not part of the task.
- When I correct you twice for the same thing, suggest one short rule and the file it belongs in.

## Skills
- human-ui, human-code and plain-copy apply by themselves when you build screens, write code or write words.
- I start the others by name: /slice, /slice-finish, /endpoint, /screen, /migration, /test-first, /review-diff, /srds-check, /slop-check, /security-check, /demo-prep, /context-check.

## Architecture rules
- Server modules live in apps/api/src/modules/<name>/ as <name>.routes.js, <name>.service.js and <name>.repository.js.
- Routes call services. Services call repositories. Only repositories write SQL.
- A route handler is 3 to 5 lines: validate, call one service function, send the result.
- Services hold the business rules and open the database transactions.
- Every status change goes through changeStatus. Never update a status column directly.
- The server checks the role and the branch on every protected route. Deny by default.
- Role, branch and user id come from the token and the database, never from the request body.
- Public answers contain only public fields.

## Nothing typed twice
- Roles, statuses and numbers that are decisions (7 days, 4 photos, 5 failed logins) live in packages/shared. Import them.
- Validation rules are Zod schemas in packages/shared. The server and the forms use the same schema.
- Screens use the UI kit, one API client, one format helper and the design tokens. Never copy a component or a function: reuse it or extend it.

## Code style
- The simplest code that works. No abstraction until the same thing is needed a third time.
- A function does one thing and fits on one screen (about 30 lines). A file stays under about 200 lines.
- A function name starts with a verb. A true-or-false name starts with is, has or can. Names come from the SRDS.
- Comments explain why, never what. No new library without asking me and giving the reason.

## Never
- Never edit a migration that is already committed, the SRDS or a .env file.
- Never type a role, a status or a limit in two places.
- Never skip the role check or the branch check.
- Never log passwords, tokens or whole request bodies. Never commit secrets.
- Never run a command that deletes data outside the development database.
