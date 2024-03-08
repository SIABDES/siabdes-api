import { z } from 'nestjs-zod/z';
import { Pph21V2Schema } from '../../schemas';

export type AddPph21V2Dto = z.infer<typeof Pph21V2Schema>;
