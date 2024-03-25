import { createZodDto } from 'nestjs-zod';
import { GetLedgersV2Schema } from '../../schemas';

export class GetLedgersV2Dto extends createZodDto(GetLedgersV2Schema) {}

export class GetAllLedgersV2Dto extends createZodDto(
  GetLedgersV2Schema.omit({
    account_id: true,
  }),
) {}
