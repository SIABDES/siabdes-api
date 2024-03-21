import { createZodDto } from 'nestjs-zod';
import { AddBumdesV2Schema } from '../../schemas';

export class AddBumdesV2Dto extends createZodDto(AddBumdesV2Schema) {}
