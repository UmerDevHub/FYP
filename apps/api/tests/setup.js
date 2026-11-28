import { afterAll, beforeAll } from 'vitest';
import { testDb } from './helpers.js';

// Each test file starts with empty tables, so tests never depend on each other's data.
beforeAll(async () => {
  // Second lock after globalSetup: ask the connected database its own name before emptying anything.
  const nameResult = await testDb.raw('SELECT current_database() AS name');
  const databaseName = nameResult.rows[0].name;
  if (!databaseName.endsWith('_test')) {
    throw new Error(`The tests refuse to empty "${databaseName}": it does not end in _test.`);
  }

  const result = await testDb.raw(`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public' AND tablename NOT LIKE 'knex_%'
  `);
  const tableNames = result.rows.map((row) => `"${row.tablename}"`).join(', ');
  await testDb.raw(`TRUNCATE ${tableNames} RESTART IDENTITY CASCADE`);
});

afterAll(async () => {
  await testDb.destroy();
});
