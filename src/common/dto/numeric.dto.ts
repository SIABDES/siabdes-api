import { z } from 'nestjs-zod/z';

export const NumberNonNegativeSchema = z.number().nonnegative();

export const NumberIntNonNegativeSchema = z.number().int().nonnegative();

export const NumberIntPositiveSchema = z.number().int().positive();

export const StringNumberSchema = z.string().transform((val) => Number(val));

export const StringNumberNonNegativeSchema = StringNumberSchema.pipe(
  NumberNonNegativeSchema,
);

export const StringNumberIntNonNegativeSchema = StringNumberSchema.pipe(
  NumberIntNonNegativeSchema,
);

export const StringNumberIntPositiveSchema = StringNumberSchema.pipe(
  NumberIntPositiveSchema,
);
