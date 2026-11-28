# Progress notes

Claude reads this file at the start of every session and updates it at the end of every slice.
Keep each line short. Newest slice on top inside each section.

## Now
- Current slice: S0 (in progress)
- Next step: Umer creates vehicle360_dev, vehicle360_test and apps/api/.env; then commit, push and merge; then Habib runs S0-13 (fresh clone).

## Done
- S0 in progress: pack layout, empty API with /api/health on port 3100, one web page, shared LIMITS; npm test, lint and format pass on Umer's laptop.

## Decisions
Write what was decided and why, in one line each. Mark the source: SRDS, Proposal, or Assumption.
- S0: versions from package-lock.json: Node 24.12.0 (.nvmrc 24), express 5.3.0, vite 8.4.0, react 19.3.1, react-router 8.5.3, tailwindcss 4.3.5, vitest 5.1.2 (Proposal).
- S1: development and test databases are on Supabase (PostgreSQL), so PostgreSQL 18 on the laptop is not used (Proposal).
- S0: the API runs on port 3100, because port 3000 is used by another project on Umer's laptop; prompt E-03 says 3000, use 3100 (Proposal).
- S0: LIMITS: 7 days to arrive (A-03), 4 inspection photos (A-06), 5 failed logins (A-18) (SRDS).
- S0: the old FastAPI service is saved on branch archive/python-service and removed; not in the 35% (Proposal).
- S0: Docker files removed; development uses local PostgreSQL (Proposal).
- S0: the 19 generic skills removed; only the 15 Vehicle 360 skills stay (Proposal).
- S0: concurrently starts the API and the web app together; it is not on the approved library list (Proposal).
- S0: ESLint uses the globals package so process and document are known names; no other ESLint plugin (Proposal).
- S0: no dotenv; Node 24 reads apps/api/.env with --env-file-if-exists (Proposal).
- S0: Vite proxies /api to the API in development, so no CORS rule is needed yet (Proposal).
- S0: migrate, seed, demo:reset and job:expire call the API scripts with --if-present; S1 and S8 add them (Proposal).
- S1: a request body that is not valid JSON gives 400, not 500 (Proposal).
- S1: fuel types petrol, diesel, hybrid, electric, cng and transmissions manual, automatic; the SRDS lists none (Assumption).
- S1: password 8 to 72 characters with a letter and a number (Proposal, SRDS section 13).
- S1: phone numbers are saved as 03 plus 9 digits, without the dash (Proposal).
- S1: paging is 12 a page by default, at most 50 (Proposal, api-contract.md).
- S1: users has name and phone (FR-AU-01 needs them; data-model.md does not list them) (SRDS).
- S1: customers and admins have no branch; sales staff and managers must have one (Assumption: data-model.md says "role and branch_id agree").
- S1: bcryptjs 3.0.3 hashes passwords (cost 12); pure JavaScript, so no C++ build tools on Windows (Proposal).
- S1: seed branch names Branch 1 to 3 (Wah Cantt, Rawalpindi, Islamabad) are placeholders (Assumption).
- S1: the test database vehicle360_test lives in Supabase, not on the laptop; tests are slower and need the internet (Proposal; Umer has no local PostgreSQL password).
- S1: a size token --spacing-target (44 px) for the smallest tap target, because the spacing scale has no 44 (Proposal, design.md asks for 44 px).
- S1: lib/format.js was built in S1-13, before S1-14, because the PriceTag shows its price through it (Proposal).
- S1: shared constants also export ROLE (ROLE.SALES_STAFF and so on), so the screens never type a role word; ROLES is unchanged (Proposal). Habib: packages/shared changed.

## Open questions
Questions for the supervisor or for AK Motors. Do not guess these in code.
- Registration and chassis numbers on public pages: hidden until answered (question Q7 of the main playbook).

## Rules added to CLAUDE.md files
One line per rule, with the date and the mistake that caused it.
- (nothing yet)

## Exceptions to the patterns
Every exception must be written here so that it stays an exception.
- S1: the branches module has no service file: it only lists active branches, with no business rule (apps/api/CLAUDE.md allows this).
- S1: the UI kit is three files, not one: ui.jsx (buttons, fields, badge, card), feedback.jsx (Dialog, EmptyState, Toast) and vehicle.jsx (PriceTag, PlateBadge), so each stays under 250 lines (Umer chose this in S1-12).

## Notes for the final report
- S0: Express 5 passes a start-up error such as a port in use to the listen callback; ignoring it made the API stop without a message. server.js now throws it.
