import 'dotenv/config';
// Vercel's Express auto-detection scans entrypoint candidates (app, index,
// server, main) for a file importing the framework directly — this import
// is what makes it recognize server.js (not createApp.js) as the entrypoint.
import 'express';
import { createApp } from './createApp.js';

const app = createApp();

// Vercel imports this module for its `default export` and never calls
// listen() itself — it wraps the app as a Function. Only bind a real port
// when running outside that environment (local dev, `npm start`).
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`EVJAI API server listening on http://localhost:${PORT}`);
  });
}

export default app;
