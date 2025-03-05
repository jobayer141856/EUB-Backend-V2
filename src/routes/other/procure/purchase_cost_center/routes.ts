import * as HSCode from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';

import { createRoute, z } from '@hono/zod-openapi';

const tags = ['other'];

export const valueLabel = createRoute({
  path: '/other/procure/purchase-cost-center/value/label',
  method: 'get',
  tags,
  request: {
    query: z.object({
      access: z.string().optional(),
    }),
  },
  responses: {
    [HSCode.OK]: jsonContent(
      z.object({
        value: z.string(),
        label: z.string(),
      }),
      'The valueLabel of purchase_cost_center',
    ),
  },
});

export type ValueLabelRoute = typeof valueLabel;
