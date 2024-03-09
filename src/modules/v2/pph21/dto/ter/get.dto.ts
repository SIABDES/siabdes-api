import { createZodDto } from 'nestjs-zod';
import { GetTerV2Schema } from '../../schemas';

export class GetTerV2Dto extends createZodDto(GetTerV2Schema) {}
