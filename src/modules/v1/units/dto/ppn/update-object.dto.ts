import { createZodDto } from 'nestjs-zod';
import { MutationPpnObjectBaseSchema } from './mutation-base.dto';

export const UpdatePpnObjectSchema = MutationPpnObjectBaseSchema;

export class UpdatePpnObjectDto extends createZodDto(UpdatePpnObjectSchema) {}
