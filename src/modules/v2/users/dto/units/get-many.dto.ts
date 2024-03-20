import { createZodDto } from 'nestjs-zod';
import { GetManyUnitV2Schema } from '../../schemas';

export class GetManyUnitsV2Dto extends createZodDto(GetManyUnitV2Schema) {}
