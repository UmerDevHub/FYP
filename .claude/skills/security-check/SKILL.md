---
name: security-check
description: Check a change or module for missing role or branch checks, private data in public answers, unsafe uploads, weak login handling and secrets. Reports only. Use as /security-check inspections.
disable-model-invocation: true
---
Review this for security: $ARGUMENTS

Read docs/srds-35.md (section 12) and the rules in CLAUDE.md. Do not edit files. For each point answer OK, Problem or Not applicable.
1. Every protected route has requireRole and the right branch check. Staff of another branch get 403. Deny by default.
2. Role, branch and user id come from the token and the database, never from the body or the query.
3. Public endpoints never return acquisition price, commission, acquisition type, manager remarks, password hashes, tokens or (until Q7 is answered) registration and chassis numbers. Public queries name their columns.
4. SQL uses parameters only. No user input is joined into SQL text.
5. Uploads: size, real type by the first bytes, random names, stored outside the code folder, deleted if the database write fails.
6. Passwords and tokens are hashed, never logged and never returned. Refresh tokens are rotated and a reused token cancels the family.
7. Error messages do not reveal whether an e-mail exists, or any internal detail.
8. Login, reset, refresh and upload routes have a rate limit.
9. Changes to several tables run in one transaction.
10. No secret is in the code, in a log or in a committed file.

Answer with Problems first (most serious first: where, how it could be misused, the fix, and the test that would catch it), then Checked and fine.
