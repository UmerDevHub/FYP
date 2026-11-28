import knex from 'knex';
import knexConfig from '../knexfile.js';
import { loadEnv } from '../src/config/env.js';

// The tests empty every table. They must never touch a database that holds real or demo data.
export async function setup() {
  const databaseName = new URL(loadEnv().testDatabaseUrl).pathname.slice(1);
  if (!databaseName.endsWith('_test')) {
    throw new Error(
      `The tests refuse to run on "${databaseName}": TEST_DATABASE_URL must name a database that ends in _test.`,
    );
  }

  const db = knex(knexConfig.test);
  await db.migrate.latest();
  await db.destroy();
}
