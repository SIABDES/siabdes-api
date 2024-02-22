import { z } from 'nestjs-zod/z';
import { UnitEmployeeBaseSchema } from '~modules/v1/units/types';

export const UpdateUnitEmployeeSchema = UnitEmployeeBaseSchema;

export type UpdateUnitEmployeeDto = z.infer<typeof UnitEmployeeBaseSchema>;
