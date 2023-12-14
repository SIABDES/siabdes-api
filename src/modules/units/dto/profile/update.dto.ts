import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const UpdateUnitSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().min(1),
  third_party_partners: z.array(z.string().min(1)).min(1).optional(),
  description: z.string().min(1),
  founded_at: z.dateString().or(z.date()).optional(),
  organization: z.object({
    leader: z.string().min(1),
    members: z.array(z.string().min(1)).optional(),
  }),
});

export class UpdateUnitProfileDto extends createZodDto(UpdateUnitSchema) {}
