import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const WtbPayloadSchema = z.object({});

export class WtbPayloadDto extends createZodDto(WtbPayloadSchema) {}
