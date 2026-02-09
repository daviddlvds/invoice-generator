import app from './app';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const port = Number(process.env.PORT ?? 3001);

app.listen(port, () => {
  console.log(`[server.ts] Listening on http://localhost:${port} env=${process.env.NODE_ENV}`);
});
