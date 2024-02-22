import {
  FemaleUnitEmployeeType,
  MaleUnitEmployeeType,
} from '~modules/units/types';
import { MutationUnitEmployeeDto } from '..';

export function isMale(
  dto: MutationUnitEmployeeDto,
): dto is MaleUnitEmployeeType {
  return dto.gender === 'MALE';
}

export function isFemale(
  dto: MutationUnitEmployeeDto,
): dto is FemaleUnitEmployeeType {
  return dto.gender === 'FEMALE';
}
