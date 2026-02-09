import type { Express } from 'express';
import invoiceRoutes from '../routes/invoice.routes';

const RutaPrincipal = '/api';

type RouteConfig = {
  ruta: string;
  controlador: any;
};

const Rutas: RouteConfig[] = [
  { ruta: '/invoices', controlador: invoiceRoutes },
];

export function registerRoutesFromConfig(app: Express) {
  console.log('[router/routes.config.ts] Registering routes from config');

  Rutas.forEach((r) => {
    console.log(`[router/routes.config.ts] Mounting ${RutaPrincipal}${r.ruta}`);
    app.use(`${RutaPrincipal}${r.ruta}`, r.controlador);
  });
}
