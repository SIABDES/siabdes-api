import { z } from 'nestjs-zod/z';
import { Pph21MutationSchema } from '~modules/units/types';

export const AddUnitEmployeePph21Schema = Pph21MutationSchema;

export type AddUnitEmployeePph21Dto = z.infer<
  typeof AddUnitEmployeePph21Schema
>;
