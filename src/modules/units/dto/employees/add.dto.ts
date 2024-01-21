import { z } from 'nestjs-zod/z';
import { UnitEmployeeBaseSchema } from '~modules/units/types';

export const AddUnitEmployeeSchema = UnitEmployeeBaseSchema;

export type AddUnitEmployeeDto = z.infer<typeof AddUnitEmployeeSchema>;
