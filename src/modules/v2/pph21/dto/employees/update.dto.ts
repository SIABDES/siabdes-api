import { z } from 'zod';
import { EmployeeV2Schema } from '../../schemas';

export const UpdateEmployeeV2Schema = EmployeeV2Schema;

export type UpdateEmployeeV2Dto = z.infer<typeof UpdateEmployeeV2Schema>;
