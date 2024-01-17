import { AddUnitEmployeePph21Dto } from './add.dto';
import { UpdateUnitEmployeePph21Dto } from './update.dto';

export * from './guards';

export * from './add.dto';
export * from './update.dto';

export type Pph21MutationDto =
  | AddUnitEmployeePph21Dto
  | UpdateUnitEmployeePph21Dto;
