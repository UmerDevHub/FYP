import { describe, expect, it } from 'vitest';
import { loadEnv } from '../src/config/env.js';

const completeEnv = {
  PORT: '3100',
  WEB_ORIGIN: 'http://localhost:5173',
  DATABASE_URL: 'postgres://user:fake@localhost:5432/vehicle360_dev',
  TEST_DATABASE_URL: 'postgres://user:fake@localhost:5432/vehicle360_test',
  JWT_ACCESS_SECRET: 'fake-secret',
};

describe('loadEnv', () => {
  it('returns the settings when every value is present', () => {
    const env = loadEnv(completeEnv);

    expect(env.port).toBe(3100);
    expect(env.databaseUrl).toBe(completeEnv.DATABASE_URL);
  });

  it('names the missing value in one clear message', () => {
    const incompleteEnv = { ...completeEnv, DATABASE_URL: '' };

    expect(() => loadEnv(incompleteEnv)).toThrow(
      'Missing environment value: DATABASE_URL. Add it to apps/api/.env',
    );
  });
});
