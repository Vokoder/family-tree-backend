import { MISSING_QUERY_PARAMETERS } from '#constants/errors.constants.ts';
import z from 'zod';

const keywordsSchema = z
  .union([
    z.string().transform((val) =>
      val
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    ),
    z.array(z.string()).transform((arr) => arr.flatMap((v) => v.split(',').map((s) => s.trim())).filter(Boolean)),
  ])
  .transform((arr) => (arr && arr.length > 0 ? arr : undefined))
  .optional();

export const personFilterSchema = z.object({
  lastName: z.string().optional(),
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  gender: z.preprocess((val) => val === 'true' || (val === 'false' ? false : val), z.coerce.boolean().optional()),
  dateOfBirthday: z.coerce.date().optional(),
  placeOfBirthday: z.string().optional(),
  dateOfDeath: z.coerce.date().optional(),
  placeOfDeath: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  ownerId: z.string().optional(),
  biography: z.string().optional(),
  keywords: keywordsSchema,
  contactInformation: z.string().optional(),
  page: z.preprocess(
    (val) => (val !== undefined && val !== null ? Number(val) : undefined),
    z.number().int().positive().optional(),
  ),
  pageSize: z.preprocess(
    (val) => (val !== undefined && val !== null ? Number(val) : undefined),
    z.number().int().positive().optional(),
  ),
});

export const getPersonsByIdsSchema = z.object({
  uid: z.string(),
});
