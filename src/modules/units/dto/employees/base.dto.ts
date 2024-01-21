import { z } from 'zod';
import {
  MaleUnitEmployeeSchema,
  FemaleUnitEmployeeSchema,
} from '~modules/units/types';

export const UnitEmployeeSchema = z.discriminatedUnion('gender', [
  MaleUnitEmployeeSchema,
  FemaleUnitEmployeeSchema,
]);

export type UnitEmployeeBaseDto = z.infer<typeof UnitEmployeeSchema>;
