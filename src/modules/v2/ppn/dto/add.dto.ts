import { createZodDto } from 'nestjs-zod';
import { MutationPpnV2Schema } from '../schemas';

const AddPpnV2Schema = MutationPpnV2Schema;

export class AddPpnV2Dto extends createZodDto(AddPpnV2Schema) {}
