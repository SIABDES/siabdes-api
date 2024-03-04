import { EmployeeDetailsV2Type } from '../types';

export type AddEmployeeV2Response = {
  id: string;
  created_at: Date;
};

export type GetEmployeeByIdV2Response = EmployeeDetailsV2Type;

export type GetManyEmployeesV2Response = {
  _count: number;
  employees: EmployeeDetailsV2Type[];
};

export type UpdateEmployeeV2Response = {
  id: string;
  updated_at: Date;
};

export type DeleteEmployeeV2Response = {
  id: string;
  hard_delete: boolean;
  deleted_at: Date;
};
