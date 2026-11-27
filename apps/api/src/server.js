import { createApp } from './app.js';

const port = Number(process.env.PORT) || 3000;

createApp().listen(port, () => {
  console.log(`Vehicle 360 API listening on http://localhost:${port}`);
});
