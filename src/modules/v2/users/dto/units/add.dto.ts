import { createZodDto } from 'nestjs-zod';
import { CreateUnitV2Schema } from '../../schemas';

export class AddUnitV2Dto extends createZodDto(CreateUnitV2Schema) {}
