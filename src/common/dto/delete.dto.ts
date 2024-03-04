import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CommonDeleteSchema = z.object({
  hard_delete: z
    .boolean()
    .or(
      z
        .string()
        .transform((v) => v.toLowerCase() === 'true')
        .pipe(z.boolean()),
    )
    .default(false)
    .optional(),
  force: z
    .boolean()
    .or(
      z
        .string()
        .transform((v) => v.toLowerCase() === 'true')
        .pipe(z.boolean()),
    )
    .default(false)
    .optional(),
});

export class CommonDeleteDto extends createZodDto(CommonDeleteSchema) {}
export class OptionalCommonDeleteDto extends createZodDto(
  CommonDeleteSchema.optional(),
) {}

export type CommonDeleteType = z.infer<typeof CommonDeleteSchema>;
