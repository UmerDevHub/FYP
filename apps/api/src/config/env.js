const REQUIRED_NAMES = [
  'PORT',
  'WEB_ORIGIN',
  'DATABASE_URL',
  'TEST_DATABASE_URL',
  'JWT_ACCESS_SECRET',
];

// Checks a set of environment values and returns them as one plain object.
export function loadEnv(source) {
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

function loadEnvOrStop() {
  try {
    return loadEnv(process.env);
  } catch (error) {
    // A missing setting is a set-up mistake, not a crash: show one clear line instead of a stack trace.
    console.error(error.message);
    process.exit(1);
  }
}

// The only place that reads the environment. Every other file imports this object.
export const env = loadEnvOrStop();
