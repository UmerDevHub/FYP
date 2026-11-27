# Shared package rules (packages/shared)

These rules are read only when you work in this folder.

- constants.js holds roles, statuses, fuel types, transmissions and LIMITS (7 days, 4 photos, 5 failed logins, 5 MB). Nothing else.
- schemas.js holds the Zod schemas for request bodies, query strings and forms. The server and the React forms import the same schema.
- Error messages in a schema are plain sentences for the person who sees them ("Enter the year.").
- Roles and statuses are lowercase words with underscores (ready_for_sale, branch_manager). The database enums use the same words.
- Nothing here may import from apps/api or apps/web.
- Every schema has unit tests for the smallest and the largest allowed value and one beyond each.
