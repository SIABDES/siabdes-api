import { AddUnitEmployeeDto, UpdateUnitEmployeeDto } from '..';

export * from './add.dto';
export * from './update.dto';
export * from './get-filter.dto';
export * from './base.dto';

export type MutationUnitEmployeeDto =
  | AddUnitEmployeeDto
  | UpdateUnitEmployeeDto;
