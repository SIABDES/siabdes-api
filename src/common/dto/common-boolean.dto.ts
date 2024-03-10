import { z } from 'zod';

export const StringToBoolSchema = z
  .string()
  .toLowerCase()
  .transform((x) => x === 'true')
  .pipe(z.boolean());
