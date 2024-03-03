import { MutationPpnV2Type, PpnObjectItemType } from '../schemas';

export type PpnObjectItemDetailsV2 = PpnObjectItemType & {
  id: string;
};

export type PpnDetailsV2 = Omit<MutationPpnV2Type, 'object_items'> & {
  id: string;
  created_at: Date;
  object_items: PpnObjectItemDetailsV2[];
};

export type PpnOverviewV2 = Omit<
  PpnDetailsV2,
  'object_items' | 'created_at'
> & {
  total_dpp: number;
  total_ppn: number;
  object_names?: string[];
};
