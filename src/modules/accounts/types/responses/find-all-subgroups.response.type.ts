import { AccountSubgroupDetails } from '..';

export type AccountsFindAllSubgroupsResponse = {
  _count: number;
  subgroups: AccountSubgroupDetails[];
};
