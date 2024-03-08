import { createZodDto } from 'nestjs-zod';
import { GetManyPph21V2Schema } from '../../schemas';

export class GetManyPph21V2Dto extends createZodDto(
  GetManyPph21V2Schema.optional(),
) {}
