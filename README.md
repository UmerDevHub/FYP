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
3. Set up the two databases (see "The databases" below).
4. Copy `apps/api/.env.example` to `apps/api/.env`. In `apps/api/.env`, put your own database addresses and replace each `CHANGE_ME`. Never commit this file.
5. Create the tables and the demo data:
   ```
   npm run demo:reset
   ```

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

The tests use the test database in `TEST_DATABASE_URL`. They create its tables by themselves and empty them before each test file. They refuse to run unless the database name ends in `_test`.

To check and format the code:

```
npm run lint
npm run format
```

## The databases

You need two PostgreSQL databases: one for development and one for tests. The test database name must end in `_test`.

**Each person needs their own test database.** The tests empty every table, so two people running tests on the same database at the same time break each other's runs.

### With Supabase (what Umer uses)

1. In Supabase, open your project, then Connect. Copy the **session pooler** address (port 5432), not the transaction pooler (port 6543): migrations need the session mode.
2. Use that address as `DATABASE_URL`. The database name at the end is `postgres`.
3. Create the test database once. In Supabase, open the SQL Editor and run:
   ```
   CREATE DATABASE vehicle360_test;
   ```
4. Use the same address as `TEST_DATABASE_URL`, with `/vehicle360_test` at the end instead of `/postgres`.

Tests on Supabase need the internet and are a little slower than on your own laptop.

### With PostgreSQL on your laptop

Create `vehicle360_dev` and `vehicle360_test` in pgAdmin (right-click Databases, then Create, then Database), or in PowerShell (change `18` to your PostgreSQL version; type your password when asked):

```
& "C:\Program Files\PostgreSQL\18\bin\createdb.exe" -U postgres vehicle360_dev
& "C:\Program Files\PostgreSQL\18\bin\createdb.exe" -U postgres vehicle360_test
```

## Folders

- `apps/api`: the server (Node.js and Express).
- `apps/web`: the screens (React and Vite).
- `packages/shared`: limits, statuses and validation used by both.
- `docs`: requirements, slice files and progress notes. The full folder map is in `docs/architecture.md`.

## Demo accounts

`npm run demo:reset` empties the development database, creates the tables and adds three branches and five accounts. It can be run as often as you like. It never runs on a test database or in production.

Every demo account has the password `Vehicle360demo`. It is for the development database only.

| Account                 | E-mail                   |
| ----------------------- | ------------------------ |
| Admin                   | admin@vehicle360.test    |
| Manager of Branch 1     | manager1@vehicle360.test |
| Sales staff of Branch 1 | staff1@vehicle360.test   |
| Sales staff of Branch 2 | staff2@vehicle360.test   |
| Customer                | customer@vehicle360.test |

The branch names are placeholders until AK Motors gives the real ones.

## Rules for Claude

Claude follows `CLAUDE.md` and the folder `CLAUDE.md` files in `apps/api`, `apps/web` and `packages/shared`.
