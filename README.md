# Vehicle 360

A multi-branch car dealership system for AK Motors. Final year project, COMSATS University Islamabad, Wah Campus.
Built by Umer Nisar (server) and Habib Ullah (screens). Supervisor: Ms. Samia Zafar.

This first part builds the 35% of the system described in `docs/srds-35.md`, plus login and accounts.

## What you need

- Node.js 24 (the version is in `.nvmrc`). Check with `node -v`.
- Git.
- PostgreSQL 16 or newer, running on your laptop.

## Install

```
npm install
```

## Set up the databases

You need two databases: one for development and one for tests. The test database name must end in `_test`.

1. Open a terminal and run these two commands. Type your PostgreSQL password when asked.
   ```
   & "C:\Program Files\PostgreSQL\18\bin\createdb.exe" -U postgres vehicle360
   & "C:\Program Files\PostgreSQL\18\bin\createdb.exe" -U postgres vehicle360_test
   ```
   Change `18` to your PostgreSQL version.
2. Copy `apps/api/.env.example` to `apps/api/.env`.
3. In `apps/api/.env`, replace `CHANGE_ME` with your PostgreSQL password. Never commit this file.

The API does not connect to the database yet. That starts in slice S1.

## Run

```
npm run dev
```

- Web app: http://localhost:5173
- API: http://localhost:3000/api/health

`npm run dev:api` and `npm run dev:web` start one part.

## Test and check

```
npm test
npm run lint
npm run format
```

## Folders

- `apps/api`: the server (Node.js and Express).
- `apps/web`: the screens (React and Vite).
- `packages/shared`: roles, statuses, limits and validation used by both.
- `docs`: requirements, architecture, data model, API contract, design, slice files and progress notes.
- `.claude`: the project skills and Claude's settings.

## Demo accounts

Added in slice S1.
