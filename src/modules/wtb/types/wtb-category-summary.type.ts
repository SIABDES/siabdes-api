import { WtbAccountItemDetails } from './wtb-item.type';

export type WtbCategorySummaryType = {
  neraca_saldo: WtbAccountItemDetails;
  penyesuaian: WtbAccountItemDetails;
  neraca_setelahnya: WtbAccountItemDetails;
  laba_rugi: WtbAccountItemDetails;
  posisi_keuangan: WtbAccountItemDetails;
};
