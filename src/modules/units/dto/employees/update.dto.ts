import { z } from 'nestjs-zod/z';
import { UnitEmployeeBaseSchema } from '~modules/units/types';

export const UpdateUnitEmployeeSchema = UnitEmployeeBaseSchema;

export type UpdateUnitEmployeeDto = z.infer<typeof UnitEmployeeBaseSchema>;
