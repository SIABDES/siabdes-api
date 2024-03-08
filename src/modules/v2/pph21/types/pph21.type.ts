import {
  Pph21PtkpStatus,
  UnitEmployeeGender,
  UnitEmployeeStatus,
  UnitEmployeeType,
} from '@prisma/client';
import { Pph21BaseV2Type } from '../schemas';

export type Pph21DetailsV2Type = Pph21BaseV2Type & {
  id: string;
  created_at: Date;
  name: string;
  gender: UnitEmployeeGender;
  nik: string;
  has_npwp: boolean;
  npwp?: string;
  ptkp_status: Pph21PtkpStatus;
  ter_category: string | null;
};

export type Pph21OverviewV2Type = {
  id: string;
  employee_id: string;
  employee_type: UnitEmployeeType;
  name: string;
  nik: string;
  npwp?: string;
  period_years: number;
  period_month: number;
  status: UnitEmployeeStatus;
  gross_salary: number;
  pph21: number;
};
