import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Makes src/config/db.js connect to TEST_DATABASE_URL, even when .env says development.
    env: { NODE_ENV: 'test' },
    // Runs once: checks the database name and runs the migrations.
    globalSetup: './tests/globalSetup.js',
    // Runs before each test file: empties the tables.
    setupFiles: ['./tests/setup.js'],
    // All test files share one database, so they run one after another.
    fileParallelism: false,
  },
});
