import { Account } from '@prisma/client';
import { OptionalPaginationDto } from '~common/dto';
import { AccountsFiltersDto } from '../dto';
import {
  AccountsFindAllResponse,
  AccountsFindAllSubgroupsResponse,
} from '../types/responses';

export interface IAccountsService {
  findById(id: number): Promise<Account>;

  findAll(
    filters: AccountsFiltersDto,
    unitId?: string,
    pagination?: OptionalPaginationDto,
  ): Promise<AccountsFindAllResponse>;

  findAllSubgroups(): Promise<AccountsFindAllSubgroupsResponse>;
}
