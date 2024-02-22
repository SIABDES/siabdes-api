import { UnitEmployeeGender, UnitEmployeeType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const GetEmployeesFilterSchema = z.object({
  nik: z.string().optional(),
  name: z.string().optional(),
  npwp: z.string().optional(),
  gender: z
    .enum([UnitEmployeeGender.FEMALE, UnitEmployeeGender.MALE])
    .optional(),
  employee_type: z
    .enum([
      UnitEmployeeType.PERMANENT_MONTHLY,
      UnitEmployeeType.NON_EMPLOYEE,
      UnitEmployeeType.SEVERANCE_OUTRIGHT,
      UnitEmployeeType.SEVERANCE_PERIODICAL,
      UnitEmployeeType.OTHER_ACTIVITY_MEMBER,
      UnitEmployeeType.OTHER_SUPERVISOR_NON_EMPLOYEE,
      UnitEmployeeType.NON_PERMANENT_MONTHLY,
      UnitEmployeeType.NON_PERMANENT_NOT_MONTHLY,
    ])
    .optional(),
});

export class GetEmployeesFilterDto extends createZodDto(
  GetEmployeesFilterSchema.optional(),
) {}
