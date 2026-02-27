import z from 'zod';

export const relationFilterSchema = z.object({
  sourcePersonId: z.string().optional(),
  targetPersonId: z.string().optional(),
  relationId: z.string().optional(),
  ownerId: z.string().optional(),
});
