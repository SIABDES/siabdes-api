import { z } from 'nestjs-zod/z';
import {
  CommonPaginationSchema,
  IdsWithPaginationSchema,
} from '~common/schemas';

export const GetManyBumdesV2Schema = CommonPaginationSchema.merge(
  IdsWithPaginationSchema.omit({
    bumdes_id: true,
    unit_id: true,
  }),
).extend({
  name: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),

  organization_leader: z.string().min(1).optional(),
  organization_secretary: z.string().min(1).optional(),
  organization_treasurer: z.string().min(1).optional(),

  address_province: z.string().min(1).optional(),
  address_regency: z.string().min(1).optional(),
  address_district: z.string().min(1).optional(),
  address_village: z.string().min(1).optional(),
  address_postal_code: z.string().min(1).optional(),
});

export type GetManyBumdesV2Type = z.infer<typeof GetManyBumdesV2Schema>;
