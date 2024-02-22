import { Pph21TaxOverview } from '../../pph21.type';

export type GetUnitEmployeeTaxesResponse = {
  _count: number;
  _total: {
    gross_salary: number;
    pph1: number;
    net_salary: number;
  };
  taxes: Pph21TaxOverview[];
};
