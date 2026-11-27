---
name: endpoint
description: Add one API endpoint in the project pattern: migration if needed, shared schema, repository, service, route and tests. Use as /endpoint POST /api/sell-requests/:id/accept.
disable-model-invocation: true
---
Add this endpoint: $ARGUMENTS

Follow CLAUDE.md and apps/api/CLAUDE.md. Work in this order.
1. Say which requirement it covers and who may call it (the role and the branch rule). If this is not clear, stop and ask.
2. If a table or a column is needed, write a new numbered migration. Never edit an old one.
3. Add or reuse the Zod schema in packages/shared/src/schemas.js and any new words in constants.js.
4. Write the repository function (SQL only), then the service function (rules, one transaction, changeStatus, notify, activity log), then the route (3 to 5 lines, requireRole, validate).
5. Write the tests: a normal path, a wrong role, another branch and bad input. When the rule is clear, write the test first and watch it fail for the right reason.
6. Run npm test and npm run format. Show me the result.
7. Finish with a short summary: the files changed, the new route, and what is not covered.
