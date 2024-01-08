import { z } from 'nestjs-zod/z';

export const StringNumberSchema = z.string().transform((val) => Number(val));

export const StringNumberNonNegativeSchema = StringNumberSchema.pipe(
  z.number().nonnegative(),
);

export const StringNumberIntNonNegativeSchema = StringNumberSchema.pipe(
  z.number().int().nonnegative(),
);

export const StringNumberIntPositiveSchema = StringNumberSchema.pipe(
  z.number().int().positive(),
);
