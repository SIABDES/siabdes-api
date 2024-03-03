import { z } from 'zod';

export const BumdesIdsSchema = z.object({
  bumdes_id: z.string().optional(),
  unit_id: z.string().optional(),
});

export type BumdesIdsDto = z.infer<typeof BumdesIdsSchema>;
