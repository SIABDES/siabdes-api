import { PpnTaxWithTotalPpnAndDpp } from '../..';

export type GetPpnTaxesResponse = {
  _count: number;
  taxes: PpnTaxWithTotalPpnAndDpp[];
};
