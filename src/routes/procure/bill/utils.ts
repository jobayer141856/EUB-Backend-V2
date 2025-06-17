import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
// import { z } from 'zod';

import { dateTimePattern } from '@/utils';

import { bank } from '../schema';

//* crud
export const selectSchema = createSelectSchema(bank);

export const insertSchema = createInsertSchema(
  bank,
  {
    uuid: schema => schema.uuid.length(21),
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
  name: true,
  swift_code: true,
  created_at: true,
  created_by: true,
}).partial({
  address: true,
  routing_no: true,
  account_no: true,
  updated_at: true,
  remarks: true,
});

export const patchSchema = insertSchema.partial();
