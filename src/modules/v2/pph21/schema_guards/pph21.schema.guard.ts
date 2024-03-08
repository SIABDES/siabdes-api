import { UnitEmployeeType } from '@prisma/client';
import {
  Pph21NonPermanentMonthlyV2Type,
  Pph21NormalEmployeeV2SType,
  Pph21PermanentEmployeeV2Type,
  Pph21V2Type,
} from '../schemas';

export function isPermanentEmployee(
  data: Pph21V2Type,
): data is Pph21PermanentEmployeeV2Type {
  return data.employee_type === UnitEmployeeType.PERMANENT_MONTHLY;
}

export function isNonPermanentMonthlyEmployee(
  data: Pph21V2Type,
): data is Pph21NonPermanentMonthlyV2Type {
  return data.employee_type === UnitEmployeeType.NON_PERMANENT_MONTHLY;
}

export function isNormalEmployee(
  data: Pph21V2Type,
): data is Pph21NormalEmployeeV2SType {
  return !isPermanentEmployee(data) && !isNonPermanentMonthlyEmployee(data);
}
