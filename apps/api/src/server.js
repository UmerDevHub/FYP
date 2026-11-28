import { createApp } from './app.js';

const port = Number(process.env.PORT) || 3100;

// Express 5 passes a start-up error (for example a port already in use) to this callback.
createApp().listen(port, (error) => {
  if (error) throw error;
  console.log(`Vehicle 360 API listening on http://localhost:${port}`);
});
