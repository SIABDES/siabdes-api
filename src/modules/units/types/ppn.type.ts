import { PpnTaxItemType, PpnTaxObject } from '@prisma/client';

export type PpnObjectItem = {
  id: string;
  name: string;
  type: PpnTaxItemType;
  quantity: number;
  price: number;
  discount: number;
  total_price: number;
  dpp: number;
  // tariff: number;
  ppn: number;
};

export type PpnTax = {
  id: string;
  given_to: string;
  transaction_date: Date;
  transaction_number: string;
  tax_object: PpnTaxObject;
  objects: PpnObjectItem[];
};
