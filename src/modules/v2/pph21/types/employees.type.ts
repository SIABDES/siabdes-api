import { Pph21PtkpStatus, UnitEmployeeType } from '@prisma/client';
import { BaseEmployeeV2Type, TerV2Type } from '../schemas';

export type EmployeePph21V2Ptkp = {
  status: Pph21PtkpStatus;
  boundary_salary: number;
};

export type EmployeeDetailsV2Type = BaseEmployeeV2Type & {
  id: string;
  created_at: Date;
  ptkp: EmployeePph21V2Ptkp;
  ter?: TerV2Type;
};

export type EmployeeOverviewV2Type = {
  id: string;
  name: string;
  nik: string;
  npwp?: string;
  employee_type: UnitEmployeeType;
};
