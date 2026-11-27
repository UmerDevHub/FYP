# Progress notes

Claude reads this file at the start of every session and updates it at the end of every slice.
Keep each line short. Newest slice on top inside each section.

## Now
- Current slice: S0 (in progress on Umer's laptop)
- Next step: Umer creates the two databases and apps/api/.env, commits and pushes; Habib does the fresh-clone check.

## Done
- S0 (Umer's laptop): pack layout in place; npm test, lint and format pass; npm run dev shows "Vehicle 360".

## Versions (S0, 28 November 2026)
- Node 24.12.0, npm 11.6.2, PostgreSQL 18 (Umer's laptop).
- express 5.3.0, react 19.3.1, vite 8.4.0, @vitejs/plugin-react 6.3.0, vitest 5.1.2, supertest 7.3.2.
- eslint 10.16.0, prettier 3.10.1, concurrently 10.0.7.

## Decisions
Write what was decided and why, in one line each. Mark the source: SRDS, Proposal, or Assumption.
- S0: the old FastAPI service is saved on branch archive/python-service and removed; not in the 35% (Proposal).
- S0: Docker files removed; development uses local PostgreSQL (Proposal).
- S0: the 19 generic skills removed; only the 15 Vehicle 360 skills stay (Proposal).
- S0: concurrently starts the API and the web app together; it is not on the approved library list (Proposal).
- S0: no dotenv; Node 24 reads apps/api/.env with --env-file-if-exists (Proposal).
- S0: Vite proxies /api to the API in development, so no CORS rule is needed yet (Proposal).
- S0: migrate, seed, demo:reset and job:expire are placeholders until S1 and S8 (Assumption).

## Open questions
Questions for the supervisor or for AK Motors. Do not guess these in code.
- Registration and chassis numbers on public pages: hidden until answered (question Q7 of the main playbook).

## Rules added to CLAUDE.md files
One line per rule, with the date and the mistake that caused it.
- (nothing yet)

## Exceptions to the patterns
Every exception must be written here so that it stays an exception.
- (nothing yet)

## Notes for the final report
- (nothing yet)
