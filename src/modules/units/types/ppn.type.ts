import {
  PpnTaxItemType,
  PpnTaxObject,
  PpnTransactionType,
} from '@prisma/client';

export type PpnObjectItem = {
  id: string;
  name: string;
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
  item_type: PpnTaxItemType;
  transaction_type: PpnTransactionType;
  transaction_date: Date;
  transaction_number: string;
  tax_object: PpnTaxObject;
  objects: PpnObjectItem[];
};
