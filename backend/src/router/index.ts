import type { Express } from 'express';
import express from 'express';
import { registerRoutesFromConfig } from './routes.config';
import { corsMiddleware } from '../middlewares/cors.middleware';

export function registerRouter(app: Express) {
  console.log('[router/index.ts] Registering global middlewares...');

  app.use(express.urlencoded({ extended: true, limit: '5mb' }));
  app.use(express.json({ limit: '5mb' }));

  app.use(corsMiddleware);

  app.get('/api/health', (_req, res) => {
    console.log('[router/index.ts] GET /api/health');
    res.json({ ok: true });
  });

  registerRoutesFromConfig(app);

  console.log('[router/index.ts] Router registration complete');
}
