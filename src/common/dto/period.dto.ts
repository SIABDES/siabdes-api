import { createZodDto } from 'nestjs-zod';
import { CommonPeriodSchema } from '~common/schemas';

export class PeriodDto extends createZodDto(CommonPeriodSchema) {}

export class OptionalPeriodDto extends createZodDto(
  CommonPeriodSchema.optional(),
) {}
