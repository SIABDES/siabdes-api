import { createZodDto } from 'nestjs-zod';
import { GetManyBumdesV2Schema } from '../../schemas';

export class GetManyBumdesV2Dto extends createZodDto(GetManyBumdesV2Schema) {}
