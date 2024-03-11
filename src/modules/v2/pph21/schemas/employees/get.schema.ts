import {
  UnitEmployeeChildrenAmount,
  UnitEmployeeGender,
  UnitEmployeeMarriageStatus,
  UnitEmployeeStatus,
  UnitEmployeeType,
} from '@prisma/client';
import { z } from 'nestjs-zod/z';
import { IdsWithPaginationSchema } from '~common/schemas';

export const GetManyEmployeesSchema = IdsWithPaginationSchema.extend({
  nik: z.string().optional(),
  name: z.string().optional(),
  npwp: z.string().optional(),
  marriage_status: z
    .enum([
      UnitEmployeeMarriageStatus.MARRIED,
      UnitEmployeeMarriageStatus.NOT_MARRIED,
    ])
    .optional(),
  gender: z
    .enum([UnitEmployeeGender.MALE, UnitEmployeeGender.FEMALE])
    .optional(),
  min_start_working_at: z.dateString().optional(),
  max_start_working_at: z.dateString().optional(),
  employee_type: z
    .enum([
      UnitEmployeeType.PERMANENT_MONTHLY,
      UnitEmployeeType.NON_EMPLOYEE,
      UnitEmployeeType.NON_PERMANENT_MONTHLY,
      UnitEmployeeType.NON_PERMANENT_NOT_MONTHLY,
      UnitEmployeeType.OTHER_ACTIVITY_MEMBER,
      UnitEmployeeType.OTHER_SUPERVISOR_NON_EMPLOYEE,
      UnitEmployeeType.SEVERANCE_OUTRIGHT,
      UnitEmployeeType.SEVERANCE_PERIODICAL,
    ])
    .optional(),
  employee_status: z
    .enum([UnitEmployeeStatus.NEW, UnitEmployeeStatus.OLD])
    .optional(),
  children_amount: z
    .enum([
      UnitEmployeeChildrenAmount.NONE,
      UnitEmployeeChildrenAmount.ONE,
      UnitEmployeeChildrenAmount.TWO,
      UnitEmployeeChildrenAmount.THREE,
    ])
    .optional(),
});
