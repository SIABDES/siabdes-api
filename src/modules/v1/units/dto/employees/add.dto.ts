import { z } from 'nestjs-zod/z';
import {
  FemaleUnitEmployeeSchema,
  MaleUnitEmployeeSchema,
} from '~modules/v1/units/types';

export const AddUnitEmployeeSchema = z.union([
  MaleUnitEmployeeSchema,
  FemaleUnitEmployeeSchema,
]);

export type AddUnitEmployeeDto = z.infer<typeof AddUnitEmployeeSchema>;
