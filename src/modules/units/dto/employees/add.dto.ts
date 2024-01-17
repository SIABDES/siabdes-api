import {
  UnitEmployeeChildrenAmount,
  UnitEmployeeGender,
  UnitEmployeeMarriageStatus,
  UnitEmployeeNpwpStatus,
  UnitEmployeeStatus,
  UnitEmployeeType,
} from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const AddUnitEmployeeSchema = z.object({
  name: z.string(),
  gender: z.enum([UnitEmployeeGender.MALE, UnitEmployeeGender.FEMALE]),
  nik: z.string(),
  start_working_at: z.dateString(),
  npwp: z.string().optional(),
  npwp_status: z.enum([
    UnitEmployeeNpwpStatus.MERGED_WITH_HUSBAND,
    UnitEmployeeNpwpStatus.SEPARATED_WITH_HUSBAND,
  ]),
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

export class AddUnitEmployeeDto extends createZodDto(AddUnitEmployeeSchema) {}
