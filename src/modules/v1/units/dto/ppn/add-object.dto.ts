import { createZodDto } from 'nestjs-zod';
import { MutationPpnObjectBaseSchema } from './mutation-base.dto';

export const AddPpnObjectSchema = MutationPpnObjectBaseSchema;

export class AddPpnObjectDto extends createZodDto(AddPpnObjectSchema) {}
