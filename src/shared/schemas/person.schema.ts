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
  .optional();

export const personFilterSchema = z.object({
  lastName: z.string().optional(),
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  gender: z.coerce.boolean().optional(),
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
});
