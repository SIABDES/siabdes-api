import {
  Pph21PtkpStatus,
  Pph21TerType,
  UnitEmployeeChildrenAmount,
  UnitEmployeeGender,
  UnitEmployeeMarriageStatus,
  UnitEmployeeNpwpStatus,
  UnitEmployeeStatus,
  UnitEmployeeType,
} from '@prisma/client';
import { z } from 'nestjs-zod/z';

export type UnitEmployeePtkp = {
  status: Pph21PtkpStatus;
  boundary_salary: number;
};

export type UnitEmployeeTer = {
  type: Pph21TerType;
  percentage: number;
};

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
  ptkp: UnitEmployeePtkp;
  ter?: UnitEmployeeTer;
};

export type UnitEmployeeOverview = {
  id: string;
  name: string;
  nik: string;
  npwp: string;
  employee_type: UnitEmployeeType;
};

export const UnitEmployeeBaseSchema = z.object({
  name: z.string(),
  nik: z.string(),
  start_working_at: z.dateString(),
  npwp: z.string().optional(),
  gender: z.enum([UnitEmployeeGender.MALE, UnitEmployeeGender.FEMALE]),
  marriage_status: z.enum([
    UnitEmployeeMarriageStatus.MARRIED,
    UnitEmployeeMarriageStatus.NOT_MARRIED,
  ]),
  children_amount: z.enum([
    UnitEmployeeChildrenAmount.NONE,
    UnitEmployeeChildrenAmount.ONE,
    UnitEmployeeChildrenAmount.TWO,
    UnitEmployeeChildrenAmount.THREE,
  ]),
  employee_status: z.enum([UnitEmployeeStatus.NEW, UnitEmployeeStatus.OLD]),
  employee_type: z.enum([
    UnitEmployeeType.PERMANENT_MONTHLY,
    UnitEmployeeType.NON_PERMANENT_MONTHLY,
    UnitEmployeeType.NON_PERMANENT_NOT_MONTHLY,
    UnitEmployeeType.SEVERANCE_OUTRIGHT,
    UnitEmployeeType.SEVERANCE_PERIODICAL,
    UnitEmployeeType.OTHER_SUPERVISOR_NON_EMPLOYEE,
    UnitEmployeeType.OTHER_ACTIVITY_MEMBER,
    UnitEmployeeType.NON_EMPLOYEE,
  ]),
});

export const UnitEmployeeNpwpStatusSchema = z.object({
  marriage_status: z.literal(UnitEmployeeMarriageStatus.MARRIED),
  npwp_status: z.enum([
    UnitEmployeeNpwpStatus.MERGED_WITH_HUSBAND,
    UnitEmployeeNpwpStatus.SEPARATED_WITH_HUSBAND,
  ]),
});

export const MaleUnitEmployeeSchema = UnitEmployeeBaseSchema.extend({
  gender: z.literal(UnitEmployeeGender.MALE),
});

export const FemaleUnitEmployeeSchema = UnitEmployeeBaseSchema.extend({
  gender: z.literal(UnitEmployeeGender.FEMALE),
}).merge(UnitEmployeeNpwpStatusSchema);

export type MaleUnitEmployeeType = z.infer<typeof MaleUnitEmployeeSchema>;
export type FemaleUnitEmployeeType = z.infer<typeof FemaleUnitEmployeeSchema>;
