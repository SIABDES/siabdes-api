import { UnitEmployeeOverview } from '../..';

export type GetUnitEmployeesResponse = {
  _count: number;
  employees: UnitEmployeeOverview[];
};
