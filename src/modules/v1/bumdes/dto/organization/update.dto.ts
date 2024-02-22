import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const UpdateBumdesOrganizationSchema = z.object({
  consultant: z.string().optional(),
  core: z.object({
    leader: z.string().min(1),
    secretary: z.string().min(1),
    treasurer: z.string().min(1),
  }),
  supervisor: z
    .object({
      leader: z.string().min(1).optional(),
      secretary: z.string().min(1).optional(),
      treasurer: z.string().min(1).optional(),
    })
    .optional(),
});

export class UpdateBumdesOrganizationDto extends createZodDto(
  UpdateBumdesOrganizationSchema,
) {}
