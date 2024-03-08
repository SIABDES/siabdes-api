import { z } from 'zod';
import { Pph21V2Schema } from '../../schemas';

export type EditPph21V2Dto = z.infer<typeof Pph21V2Schema>;
