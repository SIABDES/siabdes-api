import { Injectable } from '@nestjs/common';
import { PaginationDto } from '~common/dto';
import { PrismaService } from '~lib/prisma/prisma.service';
import { JournalsService } from '~modules/journals/services';
import {
  GetLedgerFiltersDto,
  GetLedgerPayloadDto,
  GetLedgerSortDto,
} from '../dto';
import { ILedgersService } from '../interfaces';
import { GetLedgerResponse } from '../types/responses';
import { AccountsService } from '~modules/accounts/services';
import { LedgerTransactionDetails } from '../types';

@Injectable()
export class LedgersService implements ILedgersService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly journalsService: JournalsService,
  ) {}

  async getLedger(
    unitId: string,
    payload: GetLedgerPayloadDto,
    sort: GetLedgerSortDto,
    filters: GetLedgerFiltersDto,
    pagination?: PaginationDto,
  ): Promise<GetLedgerResponse> {
    const account = await this.accountsService.findById(filters.account_id);

    const result = await this.journalsService.getJournals(
      unitId,
      sort,
      { ...filters, is_detailed: true },
      pagination,
    );

    let balance = payload.previous_balance ?? 0;

    const transactions: LedgerTransactionDetails[] = [];

    result.journals.forEach((journal) => {
      journal.data_transactions.forEach((item) => {
        balance +=
          account.isCredit === item.is_credit ? item.amount : -item.amount;

        transactions.push({
          amount: item.amount,
          is_credit: item.is_credit,
          occured_at: journal.occured_at,
          description: journal.description,
          account_name: account.name,
          calculation_result: balance,
        });
      });
    });

    return {
      account_name: account.name,
      account_ref: account.ref,
      account_is_credit: account.isCredit,
      _count: transactions.length,
      transactions,
    };
  }
}
