import Decimal from 'decimal.js';

export enum WtbCategoryV2 {
  INCOME_STATEMENT = 'INCOME_STATEMENT', // Laporan Laba Rugi
  FINANCIAL_STATE = 'FINANCIAL_STATE', // Laporan Posisi Keuangan
  CALK = 'CALK', // Laporan Catatan Atas Laporan Keuangan (CALK)
  ALL = 'ALL', // Semua
}

export type WtbAccountRefV2 = {
  group_ref: string;
  complete_ref: string;
};

export type WtbAccountDetailsV2 = {
  id: number;
  name: string;
  is_credit: boolean;
  is_posisi_keuangan: boolean;
  ref: WtbAccountRefV2;
};

export type WtbContentV2 = {
  credit: number;
  debit: number;
};

export type WtbContentDecimalV2 = {
  credit: Decimal;
  debit: Decimal;
};

export type WtbCalculationsResultV2 = {
  neraca_saldo: WtbContentV2;
  penyesuaian: WtbContentV2;
  neraca_setelahnya: WtbContentV2;
  laba_rugi: WtbContentV2;
  posisi_keuangan: WtbContentV2;
};

export type WtbAccountCalculationV2 = {
  account: WtbAccountDetailsV2;
  result: WtbCalculationsResultV2;
};
