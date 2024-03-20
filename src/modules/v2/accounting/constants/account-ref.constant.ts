// export const ACCOUNT_REF_PATTERN = /^[1-9]\d{0,2}-[1-9]\d{1}[0-9]{2}$/;

import { WtbCategoryV2 } from '../types';

export const ACCOUNT_REF_REGEX = /^[1-9]-[0-9]{4}$/;

export const WTB_CATEGORY_GROUP_REFS: Record<WtbCategoryV2, string[]> = {
  // Laba Rugi
  INCOME_STATEMENT: ['4', '5', '6', '7', '8'],

  // Posisi Keuangan
  FINANCIAL_STATE: ['1', '2', '3'],

  // Catatan Atas Laporan Keuangan (CALK)
  CALK: ['1', '2', '3', '4', '5', '6', '7', '8'],

  // Semua
  ALL: ['1', '2', '3', '4', '5', '6', '7', '8'],
} as const;
