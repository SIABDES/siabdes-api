import { UnitEmployeeType } from '@prisma/client';
import { z } from 'zod';

export const AllEmployeeTypeEnumSchema = z.enum(
  [
    UnitEmployeeType.PERMANENT_MONTHLY,
    UnitEmployeeType.NON_EMPLOYEE,
    UnitEmployeeType.NON_PERMANENT_MONTHLY,
    UnitEmployeeType.NON_PERMANENT_NOT_MONTHLY,
    UnitEmployeeType.OTHER_ACTIVITY_MEMBER,
    UnitEmployeeType.OTHER_SUPERVISOR_NON_EMPLOYEE,
    UnitEmployeeType.SEVERANCE_OUTRIGHT,
    UnitEmployeeType.SEVERANCE_PERIODICAL,
  ],
  {
    invalid_type_error: 'Tipe karyawan tidak valid',
    required_error: 'Tipe karyawan tidak boleh kosong',
  },
);
