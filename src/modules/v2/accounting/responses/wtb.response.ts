import { PaginationResponse } from '~common/responses';
import {
  WtbAccountCalculationV2,
  WtbCalculationsResultV2,
  WtbCategoryV2,
} from '../types';

export type GetWtbV2Response = PaginationResponse & {
  start_occurred_at: Date;
  end_occurred_at: Date;
  group_refs?: string[];
  category?: WtbCategoryV2;
  accounts: WtbAccountCalculationV2[];
};

export type GetWtbSummaryV2Response = {
  sum: WtbCalculationsResultV2;
  laba_rugi_bersih: {
    laba_rugi: {
      credit: number;
      debit: number;
    };
    posisi_keuangan: {
      credit: number;
      debit: number;
    };
  };
  total: WtbCalculationsResultV2;
};
