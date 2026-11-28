import { env } from './src/config/env.js';

// The plain configuration for migrations and seeds: no camelCase conversion, so
// migration files use the real snake_case column names.
const shared = {
  client: 'pg',
  migrations: { directory: './db/migrations' },
  seeds: { directory: './db/seeds' },
};

export default {
  development: { ...shared, connection: env.databaseUrl },
  test: { ...shared, connection: env.testDatabaseUrl },
};
