import { Pph21TaxOverview } from '../../pph21.type';

export type GetUnitEmployeeTaxesResponse = {
  _count: number;
  taxes: Pph21TaxOverview[];
};
