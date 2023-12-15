import { PaginationResponse } from '~common/types/responses';
import { WtbAccountItem } from '../wtb-item.type';

export type GetWtbResponse = PaginationResponse & {
  accounts: WtbAccountItem[];
};
