import { createZodDto } from 'nestjs-zod';
import { GetManyEmployeesSchema } from '../../schemas';

export class GetManyEmployeesV2Dto extends createZodDto(
  GetManyEmployeesSchema.optional(),
) {}
