# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Final Year Project (FYP) monorepo: React 18 + Vite client, Node.js/Express API, Python FastAPI service (intended for ML/data/compute work), PostgreSQL 16. It is currently a starter skeleton — most folders (`controllers/`, `models/`, `pages/`, etc.) are empty placeholders; only health-check endpoints exist.

## Commands

Run from the repo root (Windows dev machine; root scripts use `cmd` syntax).

```bash
npm run install:all   # root + client + server-node npm installs (does NOT install Python deps)
npm run dev           # all 3 services via concurrently: Node :5000, FastAPI :8000, React :3000
npm run dev:client    # Vite dev server
npm run dev:node      # nodemon src/index.js
npm run dev:python    # uses server-python/venv if present, else system python; uvicorn with reload
npm run db:up         # only the postgres container (docker compose)
npm run db:down
npm run docker:up     # full stack in Docker (--build)
npm run docker:down
```

- Python deps: `cd server-python && venv\Scripts\pip install -r requirements.txt`
- Client production build: `cd client && npm run build`
- FastAPI Swagger UI: http://localhost:8000/docs

There is **no test runner, linter, or formatter configured** in any package yet. If adding tests, use pytest (+ httpx `TestClient`) for `server-python` and Vitest for `client`, and add the scripts to the respective package.json / requirements.

## Architecture

```
React client ──nodeApi (JWT Bearer)──▶ Node/Express :5000 ──pg Pool──▶ PostgreSQL :5432
      └──────────fastApi─────────────▶ FastAPI :8000 ──SQLAlchemy──▶ (same DB)
                         Node ◀──FASTAPI_URL / NODE_API_URL──▶ FastAPI
```

- **Both backends share one Postgres database.** Node uses raw SQL via `query()` from `server-node/src/config/db.js`; FastAPI uses SQLAlchemy (`Base`, `get_db` dependency in `server-python/app/database.py`). Schema is not owned by an ORM — decide which side owns a table and keep DDL in `database/`.
- **Node is the auth gateway** (has `jsonwebtoken`, `bcryptjs`). The client's `nodeApi` axios instance (`client/src/services/api.js`) attaches `localStorage.token` as a Bearer header; the `fastApi` instance does **not** send the token.
- Node is ES modules (`"type": "module"`) — use `import` and include `.js` extensions in relative imports. New routes are registered in `server-node/src/index.js` **before** the `notFound`/`errorHandler` middleware. Errors: throw/`next(err)` with an optional `err.statusCode`; responses use `{ success, message }`.
- FastAPI routers go in `app/routers/` and are mounted in `app/main.py`. Settings come from `app/config.py` (pydantic-settings, reads `server-python/.env`). `database.py` rewrites `postgresql://` URLs to `postgresql+psycopg2://`, and `get_db` yields `None` if the engine failed to initialise — handlers must tolerate that.

## Gotchas

- **URL prefix mismatch:** the client's `fastApi` baseURL ends in `/api`, but FastAPI's health route is at `/health` with no prefix. Mount new FastAPI routers with `prefix="/api/..."` so they match the client. Node serves health at both `/health` and `/api/health`; Node app routes should live under `/api`.
- **Env files are per-service:** root `.env`, `client/.env`, `server-node/.env`, `server-python/.env`. Each service reads its own file from its own working directory. The variable names differ between files (root uses `NODE_PORT`/`FASTAPI_INTERNAL_URL`, while services and docker-compose use `PORT`/`FASTAPI_URL`/`NODE_API_URL`). Client vars must be prefixed `VITE_`.
- **DB init:** docker-compose mounts only `database/init.sql` into `docker-entrypoint-initdb.d`, and it runs only when the `postgres_data` volume is first created. `database/schema.sql` is **not** applied automatically. To re-run init, use `docker compose down -v` (this destroys data).
- CORS is wide open on both backends (`*`); `JWT_SECRET` has a hard-coded default in docker-compose.
