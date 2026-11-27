---
name: migration
description: Add a database migration the safe way: numbered plain SQL, a constraint for every rule, indexes only where a screen needs them, seed updates, and a run on the development and test databases.
disable-model-invocation: true
---
Write the migration for: $ARGUMENTS

1. Read docs/data-model.md and the SRDS requirement it comes from. List the rules that the database must enforce.
2. Create one new numbered migration file. Never edit a migration that is already committed.
3. Use snake_case, plural table names, bigint identity keys, numeric(12,2) for money, timestamptz for time, and enum types for roles and statuses.
4. Write every rule as a constraint or an index: unique, check, partial unique, foreign key. Use partial unique indexes on non-deleted rows where the SRDS says so.
5. Add an index only if a screen or the expiry job needs it. Say which one.
6. Write the down step so that the migration can be undone.
7. Update the seed if the slice needs data. Keep seed data out of migrations.
8. Run the migration on the development database and on the test database, then run it again on a fresh database. Show me the output.
9. List each rule and the constraint that enforces it, so that I can check them one by one.
