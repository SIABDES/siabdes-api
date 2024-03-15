import { createZodDto } from 'nestjs-zod';
import { GetLedgersV2Schema } from '../../schemas';

export class GetLedgersV2Dto extends createZodDto(GetLedgersV2Schema) {}
