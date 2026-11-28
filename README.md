# Vehicle 360

## What this is

Vehicle 360 is a multi-branch car dealership system for AK Motors, built as a final year project at COMSATS University Islamabad, Wah Campus, by Umer Nisar (server) and Habib Ullah (screens). This first part builds the 35% of the system described in `docs/srds-35.md`, plus login and accounts.

## What you need

- Node.js 24, the version in `.nvmrc`. Check with `node -v`.
- Git.
- PostgreSQL 16 or newer, running on your laptop.

## Install

1. Clone the repository and open its folder.
2. Install the packages:
   ```
   npm install
   ```
3. Create the two databases (see "Create the databases" below).
4. Copy `apps/api/.env.example` to `apps/api/.env`. In `apps/api/.env`, replace each `CHANGE_ME` with your own value. Never commit this file.

## Run

```
npm run dev
```

- Web app: http://localhost:5173
- API: http://localhost:3100/api/health

`npm run dev:api` and `npm run dev:web` start one part.

## Test

```
npm test
```

In slice S0 the tests need nothing else. From slice S1 they need the test database `vehicle360_test`.

To check and format the code:

```
npm run lint
npm run format
```

## Create the databases

You need two databases: `vehicle360_dev` for development and `vehicle360_test` for tests. The test database name must end in `_test`.

With pgAdmin:

1. Open pgAdmin and, in the Object Explorer on the left, open Servers and then your PostgreSQL server. Enter your password if asked.
2. Right-click Databases, then choose Create, then Database.
3. In Database, type `vehicle360_dev` and click Save.
4. Repeat for `vehicle360_test`.

With psql tools in PowerShell (change `18` to your PostgreSQL version; type your password when asked):

```
& "C:\Program Files\PostgreSQL\18\bin\createdb.exe" -U postgres vehicle360_dev
& "C:\Program Files\PostgreSQL\18\bin\createdb.exe" -U postgres vehicle360_test
```

## Folders

- `apps/api`: the server (Node.js and Express).
- `apps/web`: the screens (React and Vite).
- `packages/shared`: limits, statuses and validation used by both.
- `docs`: requirements, slice files and progress notes. The full folder map is in `docs/architecture.md`.

## Rules for Claude

Claude follows `CLAUDE.md` and the folder `CLAUDE.md` files in `apps/api`, `apps/web` and `packages/shared`.
