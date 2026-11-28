import { createApp } from './app.js';
import { loadEnv } from './config/env.js';

let env;
try {
  env = loadEnv();
} catch (error) {
  // A missing setting is a set-up mistake, not a crash: show one clear line instead of a stack trace.
  console.error(error.message);
  process.exit(1);
}

// Express 5 passes a start-up error (for example a port already in use) to this callback.
createApp().listen(env.port, (error) => {
  if (error) throw error;
  console.log(`Vehicle 360 API listening on http://localhost:${env.port}`);
});
