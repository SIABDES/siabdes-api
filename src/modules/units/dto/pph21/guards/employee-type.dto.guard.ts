import {
  Pph21NonEmployeeType,
  Pph21NonPermanentMonthlyType,
  Pph21NonPermanentNotMonthlyType,
  Pph21PermanentEmployeeType,
  Pph21SeveranceOutrightType,
  Pph21SeverancePeriodicalType,
} from '~modules/units/types';
import { AddUnitEmployeePph21Dto } from '../add.dto';
import { UpdateUnitEmployeePph21Dto } from '../update.dto';

export function isPermanentEmployee(
  dto: AddUnitEmployeePph21Dto | UpdateUnitEmployeePph21Dto,
): dto is Pph21PermanentEmployeeType {
  return dto.employee_type === 'PERMANENT_MONTHLY';
}

export function isNonEmployee(
  dto: AddUnitEmployeePph21Dto | UpdateUnitEmployeePph21Dto,
): dto is Pph21NonEmployeeType {
  return dto.employee_type === 'NON_EMPLOYEE';
}

export function isSeveranceOutright(
  dto: AddUnitEmployeePph21Dto | UpdateUnitEmployeePph21Dto,
): dto is Pph21SeveranceOutrightType {
  return dto.employee_type === 'SEVERANCE_OUTRIGHT';
}

export function isSeverancePeriodical(
  dto: AddUnitEmployeePph21Dto | UpdateUnitEmployeePph21Dto,
): dto is Pph21SeverancePeriodicalType {
  return dto.employee_type === 'SEVERANCE_PERIODICAL';
}

export function isNonPermanentMonthly(
  dto: AddUnitEmployeePph21Dto | UpdateUnitEmployeePph21Dto,
): dto is Pph21NonPermanentMonthlyType {
  return dto.employee_type === 'NON_PERMANENT_MONTHLY';
}

export function isNonPermanentNotMonthly(
  dto: AddUnitEmployeePph21Dto | UpdateUnitEmployeePph21Dto,
): dto is Pph21NonPermanentNotMonthlyType {
  return dto.employee_type === 'NON_PERMANENT_NOT_MONTHLY';
}
