import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { dateTimePattern } from '@/utils';

import { vendor } from '../schema';

//* crud
export const selectSchema = createSelectSchema(vendor);

export const insertSchema = createInsertSchema(
  vendor,
  {
    uuid: schema => schema.uuid.length(21),
    created_by: schema => schema.created_by.length(21),
    created_at: schema => schema.created_at.regex(dateTimePattern, {
      message: 'created_at must be in the format "YYYY-MM-DD HH:MM:SS"',
    }),
    updated_at: schema => schema.updated_at.regex(dateTimePattern, {
      message: 'updated_at must be in the format "YYYY-MM-DD HH:MM:SS"',
    }),
    starting_date: schema => schema.starting_date.regex(dateTimePattern, {
      message: 'starting_date must be in the format "YYYY-MM-DD HH:MM:SS"',
    }),
    ending_date: schema => schema.ending_date.regex(dateTimePattern, {
      message: 'ending_date must be in the format "YYYY-MM-DD HH:MM:SS"',
    }),
  },
).required({
  uuid: true,
  name: true,
  phone: true,
  created_at: true,
  created_by: true,
  starting_date: true,
  address: true,
  purpose: true,
  product_type: true,

}).partial({
  ending_date: true,
  updated_at: true,
  remarks: true,
}).omit({
  id: true,
});

export const patchSchema = insertSchema.partial();
