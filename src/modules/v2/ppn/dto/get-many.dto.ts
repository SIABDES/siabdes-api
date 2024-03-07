import { createZodDto } from 'nestjs-zod';
import { GetManyPpnV2Schema } from '../schemas';

export class GetManyPpnV2Dto extends createZodDto(GetManyPpnV2Schema) {}

export class OptionalGetManyPpnV2Dto extends createZodDto(
  GetManyPpnV2Schema.optional(),
) {}
