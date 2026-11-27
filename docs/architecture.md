# Architecture and folders

One Git repository (monorepo). npm workspaces connect the parts. REST over HTTPS, JSON in and out.
The server is a modular monolith: one Express app, one module per business area.

## Layers (server)
- routes: the URL, the allowed roles, the validation and a handler of 3 to 5 lines (the controller).
- service: the business rules. Loads data, checks owner, branch and status, opens the transaction, calls repositories, sends notifications.
- repository: SQL only. No decisions.
- A request: browser, then route (authenticate, requireRole, validate), then service, then repository, then database. Errors are thrown as ApiError and handled in one place.

## Folders
```
vehicle360/
  CLAUDE.md, README.md, package.json (workspaces: apps/*, packages/*)
  .claude/            settings.json, skills/
  docs/               srds-35.md, progress.md, slices/, this file and its friends
  apps/
    api/              knexfile.js, db/migrations, db/seeds, tests/
      src/            app.js, server.js, config/, lib/, middleware/, jobs/, modules/
        modules/      auth, sell-requests, vehicles, inspections, repairs, notifications, branches
    web/src/          main.jsx, app/ (router), lib/, components/, features/ (auth, vehicles, sell, staff, manager)
  packages/shared/src constants.js, schemas.js
```

## Where does this code go?
| I need to write | It goes in |
|---|---|
| A word the system uses (role, status, fuel type) | packages/shared/src/constants.js |
| A number that is a decision (7 days, 4 photos, 5 failed logins) | LIMITS in the same file |
| A rule for a form or request body | packages/shared/src/schemas.js |
| An allowed status change | apps/api/src/config/transitions.js |
| A business rule | the module's *.service.js |
| SQL | the module's *.repository.js |
| A URL and who may call it | the module's *.routes.js |
| Work on a timer | apps/api/src/jobs/ (the job) and scheduler.js (the hourly timer) |
| A notification or an audit row | lib/notify.js and lib/activityLog.js, called from services |
| A table or column | a new numbered SQL migration in apps/api/db/migrations |
| A button, input or badge | apps/web/src/components/ui.jsx |
| A screen | apps/web/src/features/<area>/ |
| A call to the API | apps/web/src/lib/api.js |
| How a price or date is shown | apps/web/src/lib/format.js |
| A colour or a font | the design tokens in apps/web/src/index.css |

## Single doors (one function for one important action)
- changeStatus: checks transitions.js, updates the row, writes the status history row and the audit row, in one transaction.
- notify: creates the in-app message and, where the SRDS says so, the e-mail.
- logActivity: writes the audit row.
- assertBranchAccess: may this user touch this branch's record?
- files: save, read and delete uploaded files.
- format.js (web): price, date and number display.

## Naming
- Tables and columns: snake_case, plural table names. JavaScript and JSON: camelCase. The database helper translates once.
- URLs: lowercase plural nouns with hyphens (/api/sell-requests). An action may end in a verb (/api/inspections/12/submit).
- Status and role values: lowercase with underscores. Constants: UPPER_SNAKE_CASE.
- React components and their files: PascalCase. Other files: camelCase with the layer (sellRequests.service.js).

## Answers and codes
- List { data, meta: { page, limit, total, totalPages } }. One item { data }. Error { error: { message, details } }.
- 200 read or update, 201 create, 204 empty, 400, 401, 403, 404, 409, 429, 500 (generic message, the real error goes to the log).
- Paging: ?page=2&limit=12 (limit at most 50). One query parameter per filter. Bad values give 400 with a field error.

## Login (on top of the 35%)
- Access token: signed JWT with user id, role and branch. 15 minutes (Proposal). Kept in browser memory only.
- Refresh token: random string. 7 days (Proposal). httpOnly cookie. Stored hashed with a family id. Renewed on every use. If an old one is used again, the whole family is cancelled (NFR-SC-04).
- Passwords: bcrypt cost 12 (Proposal). Five failed logins lock the account for a short time (A-18); 15 minutes is a Proposal.

## Style limits (Proposal)
- Handler 3 to 5 lines. Function about 30 lines. File under about 200 lines.
- No abstraction before the third use. Comments say why, not what.
