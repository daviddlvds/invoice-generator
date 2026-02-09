import express from 'express';
import { registerRouter } from './router';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

console.log('[app.ts] App created');

registerRouter(app);

app.use(errorMiddleware);

export default app;
