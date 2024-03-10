import { createZodDto } from 'nestjs-zod';
import { UpdateJournalV2Schema } from '../../schemas';

export class UpdateJournalV2Dto extends createZodDto(UpdateJournalV2Schema) {}
