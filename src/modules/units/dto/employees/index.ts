import { AddUnitEmployeeDto, UpdateUnitEmployeeDto } from '..';

export * from './add.dto';
export * from './update.dto';

export type MutationUnitEmployeeDto =
  | AddUnitEmployeeDto
  | UpdateUnitEmployeeDto;
