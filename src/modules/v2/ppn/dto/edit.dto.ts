import { createZodDto } from 'nestjs-zod';
import { MutationPpnV2Schema } from '../schemas';

export const EditPpnV2Schema = MutationPpnV2Schema;

export class EditPpnV2Dto extends createZodDto(EditPpnV2Schema) {}
