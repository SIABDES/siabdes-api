import { BaseEmployeeV2Type } from '../schemas';

export type EmployeeDetailsV2Type = BaseEmployeeV2Type & {
  id: string;
  created_at: Date;
};
