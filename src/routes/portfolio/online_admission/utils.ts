import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { datePattern, dateTimePattern } from '@/utils';

import { online_admission } from '../schema';

//* crud

export const selectSchema = createSelectSchema(online_admission);

export const insertSchema = createInsertSchema(
  online_admission,
  {
    uuid: schema => schema.uuid.length(21),
    program_uuid: schema => schema.program_uuid.length(21),
    applicant_name: schema => schema.applicant_name.min(5),
    father_name: schema => schema.father_name.min(5),
    mother_name: schema => schema.mother_name.min(5),
    local_guardian: schema => schema.local_guardian.min(5),
    date_of_birth: schema => schema.date_of_birth.regex(datePattern, {
      message: 'date_of_birth must be in the format "YYYY-MM-DD"',
    }),
    phone_number: schema => schema.phone_number.min(11),
    bkash: schema => schema.bkash.min(11),
    ssc_passing_year: schema => schema.ssc_passing_year.min(4),
    hsc_passing_year: schema => schema.hsc_passing_year.min(4),
    created_at: schema => schema.created_at.regex(dateTimePattern, {
      message: 'created_at must be in the format "YYYY-MM-DD HH:MM:SS"',
    }),
    updated_at: schema => schema.updated_at.regex(dateTimePattern, {
      message: 'updated_at must be in the format "YYYY-MM-DD HH:MM:SS"',
    }),
    ssc_gpa: z.number(),
    hsc_gpa: z.number(),
    bsc_cgpa: z.number().optional(),
  },
).required({
  uuid: true,
  semester: true,
  program_uuid: true,
  applicant_name: true,
  father_name: true,
  mother_name: true,
  local_guardian: true,
  date_of_birth: true,
  nationality: true,
  blood_group: true,
  email: true,
  gender: true,
  marital_status: true,
  present_address: true,
  village: true,
  post_office: true,
  thana: true,
  district: true,
  ssc_group: true,
  ssc_grade: true,
  ssc_gpa: true,
  ssc_board: true,
  ssc_passing_year: true,
  ssc_institute: true,
  hsc_group: true,
  hsc_grade: true,
  hsc_gpa: true,
  hsc_board: true,
  hsc_passing_year: true,
  hsc_institute: true,
  created_at: true,
  bkash: true,
}).partial({
  phone_number: true,
  bsc_name: true,
  bsc_cgpa: true,
  bsc_passing_year: true,
  bsc_institute: true,
  updated_at: true,
  remarks: true,
});

export const patchSchema = insertSchema.partial();
