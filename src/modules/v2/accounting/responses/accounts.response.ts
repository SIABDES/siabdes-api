import { PaginationResponse } from '~common/responses';
import { AccountOverviewV2, AccountSubGroupOverviewV2 } from '../types';

export type GetAccountsV2Response = PaginationResponse & {
  _count: number;
  accounts: AccountOverviewV2[];
};

export type GetSubGroupAccountsV2Response = PaginationResponse & {
  _count: number;
  subgroups: AccountSubGroupOverviewV2[];
};
