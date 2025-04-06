import { createRouter } from '@/lib/create_app';

import * as handlers from './handlers';
import * as routes from './routes';

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.patch, handlers.patch)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.getOneDetails, handlers.getOneDetails)
  .openapi(routes.remove, handlers.remove);

export default router;
