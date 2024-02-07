import { PpnTaxDetailed, PpnTaxForGetMany } from '../..';

export type GetPpnTaxesResponse = {
  _count: number;
  taxes: PpnTaxForGetMany[] | PpnTaxDetailed[];
};
