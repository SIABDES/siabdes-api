import { BumdesUnitBusinessType } from '@prisma/client';
import { z } from 'nestjs-zod/z';
import { IdsSchema } from '~common/schemas';

export const GetManyUnitV2Schema = IdsSchema.omit({ unit_id: true }).extend({
  business_type: z.nativeEnum(BumdesUnitBusinessType).optional(),
});
