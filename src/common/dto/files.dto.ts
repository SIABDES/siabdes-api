import { createZodDto } from 'nestjs-zod';
import { CommonFilePathSchema } from '~common/schemas';

export class CommonFilePathDto extends createZodDto(CommonFilePathSchema) {}
