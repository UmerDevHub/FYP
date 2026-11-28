# Prompt log

One short line for every prompt that changed the project. This is the honest record of how AI was used. It helps the viva ("show me how you built this") and the report (the statement on use of AI). Keep each line short.

How to use: after a prompt that changed code, add a line. Both partners write in this file. Do not write the full prompt: write the prompt number from the book (for example S4-03) or one sentence.

| Date | Who | Slice | Prompt | What changed | Checked by me how |
|---|---|---|---|---|---|
| 2026-11-28 | Umer | S0 | Own prompt (not the book's S0 prompts) | Claude replaced the old skeleton with the pack layout from the slice file: workspaces, API with /api/health, one web page, lint, format, README | Ran npm test, lint, format and npm run dev; opened the page |
| 2026-11-28 | Umer | S0 | Own prompt: "fix these" (gaps against S0-04 to S0-12) | Shared package @v360/shared with LIMITS and tests, eqeqeq, .gitkeep folders, --if-present scripts, React Router and Tailwind, vehicle360_dev, README sections, API port 3100, listen error shown | Read each step's result, ran npm test and lint, called /api/health directly and through the web app |
| 2026-11-28 | Umer | S1 | S1-03 | env.js checks PORT, WEB_ORIGIN, both database URLs and JWT_ACCESS_SECRET at start-up; server.js uses it | Ran npm test; started the API with and without .env |
| 2026-11-28 | Umer | S1 | S1-04 | Knex 3.3.0 and pg 8.23.1; knexfile.js (plain) and src/config/db.js (camelCase, bigint to number, money as text); migrate and seed scripts | Ran npm run migrate on Supabase; checked an id, a price and a column name |
