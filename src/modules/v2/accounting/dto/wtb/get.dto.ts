import { createZodDto } from 'nestjs-zod';
import { GetWtbV2Schema } from '../../schemas';

export class GetWtbV2Dto extends createZodDto(GetWtbV2Schema) {}
