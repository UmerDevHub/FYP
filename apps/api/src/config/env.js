const REQUIRED_NAMES = [
  'PORT',
  'WEB_ORIGIN',
  'DATABASE_URL',
  'TEST_DATABASE_URL',
  'JWT_ACCESS_SECRET',
];

// The only place that reads the environment. Everything else imports the object this returns.
export function loadEnv(source = process.env) {
  const missingNames = REQUIRED_NAMES.filter((name) => !source[name]);
  if (missingNames.length > 0) {
    throw new Error(
      `Missing environment value: ${missingNames.join(', ')}. Add it to apps/api/.env (see apps/api/.env.example).`,
    );
  }

  return Object.freeze({
    port: Number(source.PORT),
    nodeEnv: source.NODE_ENV ?? 'development',
    webOrigin: source.WEB_ORIGIN,
    databaseUrl: source.DATABASE_URL,
    testDatabaseUrl: source.TEST_DATABASE_URL,
    jwtAccessSecret: source.JWT_ACCESS_SECRET,
  });
}
