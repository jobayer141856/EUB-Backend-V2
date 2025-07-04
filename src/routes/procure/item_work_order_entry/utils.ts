import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';

import { dateTimePattern } from '@/utils';

import { item_work_order_entry } from '../schema';

//* crud
export const selectSchema = createSelectSchema(item_work_order_entry);

export const insertSchema = createInsertSchema(
  item_work_order_entry,
  {
    uuid: schema => schema.uuid.length(21),
    item_work_order_uuid: schema => schema.item_work_order_uuid.length(21),
    item_uuid: schema => schema.item_uuid.length(21),
    request_quantity: z.number().positive(),
    provided_quantity: z.number().positive(),
    unit_price: z.number().optional().default(0),
    created_by: schema => schema.created_by.length(21),
    created_at: schema => schema.created_at.regex(dateTimePattern, {
      message: 'created_at must be in the format "YYYY-MM-DD HH:MM:SS"',
    }),
    updated_at: schema => schema.updated_at.regex(dateTimePattern, {
      message: 'updated_at must be in the format "YYYY-MM-DD HH:MM:SS"',
    }),

  },
).required({
  uuid: true,
  request_quantity: true,
  created_at: true,
  created_by: true,
}).partial({
  item_work_order_uuid: true,
  item_uuid: true,
  provided_quantity: true,
  unit_price: true,
  updated_at: true,
  remarks: true,
  index: true,
});

export const patchSchema = insertSchema.partial();
