import { PaginationResponse } from '~common/responses';
import { WtbAccountItem } from '../wtb-item.type';

export type GetWtbResponse = PaginationResponse & {
  accounts: WtbAccountItem[];
};
