import { z } from 'nestjs-zod/z';
import { Pph21MutationSchema } from '~modules/v1/units/types';

export const UpdateUnitEmployeePph21Schema = Pph21MutationSchema;

export type UpdateUnitEmployeePph21Dto = z.infer<
  typeof UpdateUnitEmployeePph21Schema
>;
