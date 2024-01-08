import {
  UnitEmployeeChildrenAmount,
  UnitEmployeeGender,
  UnitEmployeeMarriageStatus,
  UnitEmployeeNpwpStatus,
  UnitEmployeeStatus,
  UnitEmployeeType,
} from '@prisma/client';

export type UnitEmployee = {
  id: string;
  name: string;
  nik: string;
  npwp: string | undefined;
  npwp_status: UnitEmployeeNpwpStatus;
  gender: UnitEmployeeGender;
  employee_type: UnitEmployeeType;
  employee_status: UnitEmployeeStatus;
  start_working_at: Date;
  marriage_status: UnitEmployeeMarriageStatus;
  children_amount: UnitEmployeeChildrenAmount;
};

export type UnitEmployeeOverview = {
  id: string;
  name: string;
  nik: string;
  employee_type: UnitEmployeeType;
};
