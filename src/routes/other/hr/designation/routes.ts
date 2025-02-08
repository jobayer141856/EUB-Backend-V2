import * as HSCode from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';

import { createRoute, z } from '@hono/zod-openapi';

const tags = ['other'];

export const valueLabel = createRoute({
  path: '/other/hr/designation',
  method: 'get',
  tags,
  responses: {
    [HSCode.OK]: jsonContent(
      z.object({
        uuid: z.string(),
        name: z.string(),
      }),
      'The valueLabel of designation',
    ),
  },
});

export type ValueLabelRoute = typeof valueLabel;
