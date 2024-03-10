import { createZodDto } from 'nestjs-zod';
import { GetManyJournalsV2Schema } from '../../schemas';

export class GetManyJournalsV2Dto extends createZodDto(
  GetManyJournalsV2Schema.optional(),
) {}
