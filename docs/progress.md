# Progress notes

Claude reads this file at the start of every session and updates it at the end of every slice.
Keep each line short. Newest slice on top inside each section.

## Now
- Current slice: S4 done (28 November 2026). Next: S5 Approval and listing.
- Before a real server: lib/mailer.js must stop printing reset links (they hold a secret token) and send real e-mail.
- S0 is still open for Habib: S0-13 fresh clone.

## Done
- S4 done: migration 003 and the 24 checklist items, files helper (first bytes, random names, uploads folder), inspections (start, save draft, add photo with progress, submit with the list of what is missing, manager notified), GET /api/vehicles/manage; screens Inspections (cars waiting, queue with tabs) and the inspection form (checklist, notes, photos, history). No tests (Umer's decision).
- S3 done: migration 002, transitions.js and changeStatus, sell requests (send, my list, branch list, accept with 7-day expiry, reject with reason, notifications), arrival from a request or walk-in in one transaction; screens Sell your car, My requests, staff Sell requests (tabs, accept, reject dialog) and the arrival form with the plate. No tests (Umer's decision).
- S2 done: register, login with lock, refresh with rotation, logout, forgot and reset password, my account, change password, notifications; AuthProvider, guards, Log in, Register, Forgot, Reset, My account and Notifications pages. Tests stopped at S2-15 by Umer's decision.
- S1 done: env check, Knex and Supabase connection, ApiError and one error handler, shared roles, statuses, LIMITS and schemas, migration 001 (6 tables), seed and demo:reset, tests on vehicle360_test, GET /api/branches, design tokens and fonts, UI kit (ui.jsx, feedback.jsx, vehicle.jsx), format.js, api.js, three layouts, /kit. 49 tests pass.
- S0 on Umer's laptop: pack layout, API on port 3100, one web page; Habib's fresh clone (S0-13) not done yet.

## Decisions
Write what was decided and why, in one line each. Mark the source: SRDS, Proposal, or Assumption.
- S0: versions from package-lock.json: Node 24.12.0 (.nvmrc 24), express 5.3.0, vite 8.4.0, react 19.3.1, react-router 8.5.3, tailwindcss 4.3.5, vitest 5.1.2 (Proposal).
- S1: development and test databases are on Supabase (PostgreSQL), so PostgreSQL 18 on the laptop is not used (Proposal).
- S1: versions from package-lock.json: knex 3.3.0, pg 8.23.1, zod 4.6.7, bcryptjs 3.0.3, lucide-react 1.82.0, @fontsource packages for Barlow Semi Condensed and Source Sans 3 (Proposal).
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
- The real branch names and cities of AK Motors (the seed uses placeholders).
- Fuel and transmission types (the SRDS lists none; S1 uses an Assumption).
- NFR-MT-01: is a separate controller file wanted, or is the 3 to 5 line handler in the routes file enough?
- Proposal from S1-19, not applied: show the 404 page inside the public layout, so the menu is there.
- FR-NT-01 says "show the unread count" and "mark one or all as read", but slice S2 says no counter and the API has only "mark one". Umer chose to follow the slice for now; ask the supervisor.
- A-18 limit: after five wrong passwords only a real account gets the "locked" message, so someone trying five times can learn that an e-mail has an account. The lock is what the SRDS asks for; ask the supervisor if this is acceptable.
- S2-02 question 3: two browser tabs that refresh at the same moment send the same cookie; the second looks like a reused token and ends the login. Decide in S2-11 (screens) how to stop it.
- S1-18: .claude/settings.json now also denies Read and Edit of apps/api/.env (Umer approved).
- S2: login numbers in LIMITS: access token 15 minutes, refresh token 7 days, bcrypt cost 12, lock 15 minutes, reset link 60 minutes, password 8 to 72 (Proposal, slice S2).
- S2: jsonwebtoken 9.0.3 for the access token (HS256 only); the refresh token is a random string stored as a SHA-256 hash (Proposal, architecture.md).
- S2: login answers 401 with one message for a wrong e-mail, a wrong password and an inactive account; a locked account answers 429 with the minutes left (Proposal, architecture.md codes).
- S2: API tests may take up to 30 seconds each, because the test database is in Supabase and bcrypt is slow on purpose (Proposal).
- S2: cookie-parser 1.4.7 reads the refresh cookie; refresh tokens rotate in their family, a reused token cancels the family, and the token row is locked during a refresh (slice S2, NFR-SC-04).
- S2: helmet 8.3.0, cors 2.8.6 (only WEB_ORIGIN, with credentials) and express-rate-limit 8.7.5 (20 requests per 15 minutes on login and register; forgot-password in S2-08) (Proposal, slice S2).
- S2: staff of another branch get 403 "This record belongs to another branch."; a customer is refused by assertBranchAccess too (deny by default) (slice S2, apps/api/CLAUDE.md).
- S2: lib/mailer.js prints e-mails to the server console and keeps them in memory; real sending is not built. Reset links last 60 minutes, work once and end every login of the user (slice S2).
- S2: another user's notification answers 404, not 403, so nobody learns that it exists (slice S2-09 asked to choose). Change password ends every other login and keeps the device that asked (Proposal).
- S2: the web keeps the access token in memory only; after a reload one refresh call (restoreSession) brings the user back. Log out reloads the app at the home page, which also clears every page's memory (Proposal).
- S2: react-hook-form 7.92.0, @hookform/resolvers 7.0.9 (the forms use the shared Zod schemas) and @tanstack/react-query 5.108.4. api.js only refreshes after a 401 when a token was sent, so a wrong login shows the server's own message (Proposal).
- S2: when the server cannot be reached or answers something that is not JSON, the screen says "We could not reach the server. Check your connection and try again." instead of browser text (Proposal, plain-copy). The menu has a plain "Notifications" link, no counter (slice S2-14).
- From S2-15 on: Umer decided to write and run no more automated tests and to skip browser walk-throughs, to save time. The existing tests stay. Risk: NFR-TS-01 asks for tests of every status change, and the book says never cut tests (Umer's decision).
- S4: GET /api/vehicles/manage was built in S4 (planned for S5), because staff need the received cars to start an inspection (Proposal).
- S4: photos are sent one at a time, so each shows its own progress; the inspection form does not yet ask before leaving with unsaved answers (Proposal: add in S9).
- Code style (Umer): beginner friendly; fewer lines are good, but no clever one-line shortcuts. Prefer a plain if.
- S3: the server writes dates in messages through lib/formatForPeople.js (Pakistan time); staff lists show the customer's name, phone and e-mail because staff need them for the work (NFR-SC-08).

## Rules added to CLAUDE.md files
One line per rule, with the date and the mistake that caused it.
- (nothing yet)

## Exceptions to the patterns
Every exception must be written here so that it stays an exception.
- S1: the branches module has no service file: it only lists active branches, with no business rule (apps/api/CLAUDE.md allows this).
- S1: the UI kit is three files, not one: ui.jsx (buttons, fields, badge, card), feedback.jsx (Dialog, EmptyState, Toast) and vehicle.jsx (PriceTag, PlateBadge), so each stays under 250 lines (Umer chose this in S1-12).
- S2: the auth module has two service files: auth.service.js (register, login, refresh, logout) and password.service.js (forgot, reset, change password), so each stays under 200 lines.

## Notes for the final report
- S0: Express 5 passes a start-up error such as a port in use to the listen callback; ignoring it made the API stop without a message. server.js now throws it.
