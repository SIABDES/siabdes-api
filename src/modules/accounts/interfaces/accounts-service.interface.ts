import { PaginationDto } from '~common/dto';
import { AccountsFiltersDto } from '../dto';
import {
  AccountsFindAllResponse,
  AccountsFindAllSubgroupsResponse,
} from '../types/responses';
import { Account } from '@prisma/client';

export interface IAccountsService {
  findById(id: number): Promise<Account>;

  findAll(
    filters: AccountsFiltersDto,
    unitId?: string,
    pagination?: PaginationDto,
  ): Promise<AccountsFindAllResponse>;

  findAllSubgroups(): Promise<AccountsFindAllSubgroupsResponse>;
}
