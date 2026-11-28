# Prompt log

One short line for every prompt that changed the project. This is the honest record of how AI was used. It helps the viva ("show me how you built this") and the report (the statement on use of AI). Keep each line short.

How to use: after a prompt that changed code, add a line. Both partners write in this file. Do not write the full prompt: write the prompt number from the book (for example S4-03) or one sentence.

| Date | Who | Slice | Prompt | What changed | Checked by me how |
|---|---|---|---|---|---|
| 2026-11-28 | Umer | S0 | Own prompt (not the book's S0 prompts) | Claude replaced the old skeleton with the pack layout from the slice file: workspaces, API with /api/health, one web page, lint, format, README | Ran npm test, lint, format and npm run dev; opened the page |
| 2026-11-28 | Umer | S0 | Own prompt: "fix these" (gaps against S0-04 to S0-12) | Shared package @v360/shared with LIMITS and tests, eqeqeq, .gitkeep folders, --if-present scripts, React Router and Tailwind, vehicle360_dev, README sections, API port 3100, listen error shown | Read each step's result, ran npm test and lint, called /api/health directly and through the web app |
| 2026-11-28 | Umer | S1 | S1-03 | env.js checks PORT, WEB_ORIGIN, both database URLs and JWT_ACCESS_SECRET at start-up; server.js uses it | Ran npm test; started the API with and without .env |
| 2026-11-28 | Umer | S1 | S1-04 | Knex 3.3.0 and pg 8.23.1; knexfile.js (plain) and src/config/db.js (camelCase, bigint to number, money as text); migrate and seed scripts | Ran npm run migrate on Supabase; checked an id, a price and a column name |
| 2026-11-28 | Umer | S1 | S1-05 | Tests first, then ApiError, one error handler with notFound, validate() into req.valid, Zod 4.6.7; bad JSON gives 400 (Proposal) | Saw the tests fail before the code; ran npm test, lint, format |
| 2026-11-28 | Umer | S1 | S1-06 | Tests first, then shared roles, statuses (SRDS words), fuel and transmission types, full LIMITS, and email, password, phone and paging schemas | Saw 19 tests fail first; ran npm test (31 pass), lint, format |
| 2026-11-28 | Umer | S1 | S1-07 | Migration 001: six tables in plain SQL, user_role enum from shared, unique lower-case e-mail, branch rule, unique branch name, down step | Ran it on Supabase, tried bad rows (all refused), rolled back and ran again; local test DB refused the password |
| 2026-11-28 | Umer | S1 | S1-08 | Seed: 3 placeholder branches, 5 demo accounts with one bcrypt hash; refuses _test and production; demo:reset; README demo accounts | Ran demo:reset twice on Supabase; saw hashes only; production guard refused; _test guard not run yet (local password) |
| 2026-11-28 | Umer | S1 | S1-09 | Test set-up: globalSetup checks the _test name and migrates once; setup.js empties tables before each file; makeBranch and makeUser helpers; example test; vehicle360_test created in Supabase | Ran npm test (33 pass); a non-_test name refused; the seed refused the test database |
| 2026-11-28 | Umer | S1 | S1-10 | GET /api/branches (public: id, name, city of active branches), no service file; env object and one shared db connection, tests locked to the _test database | Tests first (3 failed with 404), then 36 pass; opened /api/branches in the browser |
| 2026-11-28 | Umer | S1 | S1-11 | Design tokens in index.css (Tailwind 4 @theme, built-in values removed), @fontsource fonts, focus outline, temporary /tokens page | Compared the 12 colours with design.md in the browser; fonts load from localhost only; build has no built-in colours |
| 2026-11-28 | Umer | S1 | S1-12 | UI kit part one in components/ui.jsx: Button (4 variants, busy, disabled), Field, Select, Textarea, Badge, Card; lucide-react; 44 px target token | Checked in the browser: every control 44 px or more, labels and errors linked, focus ring visible with Tab |
