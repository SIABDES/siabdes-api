import { WtbCategorySummaryType } from '../wtb-category-summary.type';
import { WtbAccountItemDetails } from '../wtb-item.type';

export type GetWtbSummaryResponse = {
  sum: WtbCategorySummaryType;
  laba_rugi_bersih: {
    laba_rugi: WtbAccountItemDetails;
    posisi_keuangan: WtbAccountItemDetails;
  };
  total: WtbCategorySummaryType;
};
