import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';

import { dateTimePattern } from '@/utils';

import { item } from '../schema';

//* crud
export const selectSchema = createSelectSchema(item);

export const insertSchema = createInsertSchema(
  item,
  {
    uuid: schema => schema.uuid.length(21),
    purchase_cost_center_uuid: schema => schema.purchase_cost_center_uuid.length(21),
    sub_purchase_cost_center_uuid: schema => schema.sub_purchase_cost_center_uuid.length(21),
    vendor_price: z.number().optional().default(0),
    created_by: schema => schema.created_by.length(21),
    created_at: schema => schema.created_at.regex(dateTimePattern, {
      message: 'created_at must be in the format "YYYY-MM-DD HH:MM:SS"',
    }),
    updated_at: schema => schema.updated_at.regex(dateTimePattern, {
      message: 'updated_at must be in the format "YYYY-MM-DD HH:MM:SS"',
    }),
    threshold: z.number().optional().default(0),
    lead_time: z.number().optional().default(0),
  },
).required({
  uuid: true,
  purchase_cost_center_uuid: true,
  name: true,
  created_at: true,
  created_by: true,
}).partial({
  sub_purchase_cost_center_uuid: true,
  index: true,
  quantity: true,
  vendor_price: true,
  price_validity: true,
  updated_at: true,
  remarks: true,
  unit: true,
  threshold: true,
  lead_time: true,
});

export const patchSchema = insertSchema.partial();
