import { z } from 'zod';
import { BumdesIdsSchema } from './bumdes.dto';

export const CommonFilePathSchema = BumdesIdsSchema.required()
  .extend({
    key: z.string().optional(),
  })
  .readonly();

export type CommonFilePathDto = z.infer<typeof CommonFilePathSchema>;
