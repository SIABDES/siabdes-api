import { z } from 'zod';
import { EmployeeV2Schema } from '../../schemas';

export const AddEmployeeV2Schema = EmployeeV2Schema;

export type AddEmployeeV2Dto = z.infer<typeof AddEmployeeV2Schema>;
