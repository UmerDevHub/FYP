import knex from 'knex';
import pg from 'pg';
import { env } from './env.js';

// bigint ids arrive from pg as text; parse them to numbers once, here. Our ids stay far below 2^53.
// numeric (money) has no parser, so it stays text and is never rounded by floating point.
const BIGINT_TYPE_ID = 20;
pg.types.setTypeParser(BIGINT_TYPE_ID, (value) => Number(value));

function toCamelCase(name) {
  return name.replace(/_([a-z0-9])/g, (_match, letter) => letter.toUpperCase());
}

function toSnakeCase(name) {
  return name.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function convertRowToCamelCase(row) {
  if (row === null || typeof row !== 'object' || Array.isArray(row)) return row;
  return Object.fromEntries(Object.entries(row).map(([key, value]) => [toCamelCase(key), value]));
}

// The app's connection: JavaScript uses camelCase, the database snake_case. Knex translates once.
export function createDb(connectionUrl) {
  return knex({
    client: 'pg',
    connection: connectionUrl,
    wrapIdentifier: (value, wrapOriginal) => wrapOriginal(toSnakeCase(value)),
    postProcessResponse: (result) =>
      Array.isArray(result) ? result.map(convertRowToCamelCase) : convertRowToCamelCase(result),
  });
}

// The one connection the app uses. Vitest sets NODE_ENV to test, so tests never reach the development data.
export const db = createDb(env.nodeEnv === 'test' ? env.testDatabaseUrl : env.databaseUrl);
