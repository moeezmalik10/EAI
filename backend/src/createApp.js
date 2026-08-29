import express from 'express';
import cors from 'cors';

import articlesRoutes from './routes/articles.js';
import issuesRoutes from './routes/issues.js';
import volumesRoutes from './routes/volumes.js';
import editorialBoardRoutes from './routes/editorialBoard.js';
import submissionsRoutes from './routes/submissions.js';
import searchRoutes from './routes/search.js';
import adminRoutes from './routes/admin.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      },
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  app.use('/api/articles', articlesRoutes);
  app.use('/api/issues', issuesRoutes);
  app.use('/api/volumes', volumesRoutes);
  app.use('/api/editorial-board', editorialBoardRoutes);
  app.use('/api/submissions', submissionsRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/admin', adminRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
