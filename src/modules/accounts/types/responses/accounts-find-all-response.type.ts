import { AccountDetails } from '../account-details.type';

export type AccountsFindAllResponse = {
  _count: number;
  accounts: AccountDetails[];
};
