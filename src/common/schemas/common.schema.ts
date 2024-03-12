import { z } from 'nestjs-zod/z';
import { FileResourceLocation } from '~common/types';
import { StringToBoolSchema } from './utils.schema';

export const CommonDeleteSchema = z.object({
  hard_delete: StringToBoolSchema.default(false).optional(),
  force: StringToBoolSchema.default(false).optional(),
});

export const CommonPaginationSchema = z.object({
  cursor: z.string().or(z.coerce.number()).optional(),
  limit: z.coerce.number().int().positive().optional(),
});

export const CommonPeriodSchema = z.object({
  period_years: z.coerce.number().int().min(1900).optional(),
  period_month: z.coerce.number().int().min(1).max(12).optional(),
});

export const IdsSchema = z.object({
  bumdes_id: z.string().optional(),
  unit_id: z.string().optional(),
  kabupaten_id: z.string().optional(),
  kecamatan_id: z.string().optional(),
});

export const CommonFilePathSchema = IdsSchema.extend({
  key: z.string().min(1),
  resource: z.nativeEnum(FileResourceLocation),
})
  .required({
    bumdes_id: true,
    unit_id: true,
  })
  .readonly();

export const IdsWithPaginationSchema = IdsSchema.merge(CommonPaginationSchema);
