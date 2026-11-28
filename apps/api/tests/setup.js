import { afterAll, beforeAll } from 'vitest';
import { testDb } from './helpers.js';

// Each test file starts with empty tables, so tests never depend on each other's data.
beforeAll(async () => {
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
