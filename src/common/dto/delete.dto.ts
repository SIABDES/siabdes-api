import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CommonDeleteSchema = z.object({
  hard_delete: z.boolean().default(false).optional(),
  force: z.boolean().default(false).optional(),
});

export class CommonDeleteDto extends createZodDto(CommonDeleteSchema) {}
export class OptionalCommonDeleteDto extends createZodDto(
  CommonDeleteSchema.optional(),
) {}

export type CommonDeleteType = z.infer<typeof CommonDeleteSchema>;
