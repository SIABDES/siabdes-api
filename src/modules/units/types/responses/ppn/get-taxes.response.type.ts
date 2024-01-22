import { PpnTaxWithTotalPpn } from '../..';

export type GetPpnTaxesResponse = {
  _count: number;
  taxes: PpnTaxWithTotalPpn[];
};
