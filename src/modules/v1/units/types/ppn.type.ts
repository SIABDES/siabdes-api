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
};

export type PpnTaxWithEvidence = PpnTax & {
  transaction_evidence: string;
};

export type PpnTaxForGetMany = PpnTax & {
  total_ppn: number;
  total_dpp: number;
  object_names: string[];
};

export type PpnTaxDetailed = PpnTax & {
  objects: PpnObjectItem[];
};
