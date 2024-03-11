import { z } from 'nestjs-zod/z';

export const StringToBoolSchema = z
  .string()
  .toLowerCase()
  .transform((x) => x === 'true')
  .pipe(z.boolean())
  .or(z.boolean());
