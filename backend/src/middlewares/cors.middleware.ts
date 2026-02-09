import type { Request, Response, NextFunction } from 'express';

export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log('[middlewares/cors.middleware.ts] CORS middleware');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, APITOKEN');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
}
