import { createZodDto } from 'nestjs-zod';
import { AddJournalV2Schema } from '../../schemas';

export class AddJournalV2Dto extends createZodDto(AddJournalV2Schema) {}
