import { bearerAuth } from 'hono/bearer-auth';
import { cors } from 'hono/cors';

import configureOpenAPI from '@/lib/configure_open_api';
import createApp from '@/lib/create_app';
import { VerifyToken } from '@/middlewares/auth';
import routes from '@/routes/index.route';
import { serveStatic } from '@hono/node-server/serve-static';

import env from './env';

const app = createApp();

configureOpenAPI(app);

// ! don't put a trailing slash
export const basePath = '/v1';

// app.use('/static/*', serveStatic({ root: './static' }));

app.use(`${basePath}/*`, cors({
  origin: ['http://localhost:3005', 'http://localhost:3000', 'http://103.147.163.46:4020'],
  maxAge: 600,
  credentials: true,
}));

if (env.NODE_ENV !== 'development') {
  app.use(`${basePath}/*`, bearerAuth({
    verifyToken: VerifyToken,
  }));
}

routes.forEach((route) => {
  app.route(basePath, route);
});

export type AppType = typeof routes[number];

export default app;
