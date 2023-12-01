import { Account } from '@prisma/client';
import { PaginationDto } from '~common/dto';
import { AccountsFiltersDto } from '../dto';
import { AccountsFindAllResponse } from '../types/responses';

export interface IAccountsService {
  findAll(
    filters: AccountsFiltersDto,
    unitId?: string,
    pagination?: PaginationDto,
  ): Promise<AccountsFindAllResponse>;

  findById(id: number): Promise<Account>;
}
