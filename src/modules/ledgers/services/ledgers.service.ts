import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationDto } from '~common/dto';
import { PrismaService } from '~lib/prisma/prisma.service';
import { AccountsService } from '~modules/accounts/services';
import {
  GetLedgerFiltersDto,
  GetLedgerPayloadDto,
  GetLedgerSortDto,
} from '../dto';
import { ILedgersService } from '../interfaces';
import { LedgerTransactionDetails } from '../types';
import { GetLedgerResponse } from '../types/responses';

@Injectable()
export class LedgersService implements ILedgersService {
  constructor(
    private prisma: PrismaService,
    private readonly accountsService: AccountsService,
  ) {}

  async getLedger(
    unitId: string,
    payload: GetLedgerPayloadDto,
    sort: GetLedgerSortDto,
    filters: GetLedgerFiltersDto,
    pagination?: PaginationDto,
  ): Promise<GetLedgerResponse> {
    const account = await this.accountsService.findById(filters.account_id);

    const journalItems = await this.prisma.journalItem.findMany({
      cursor: pagination?.cursor
        ? { id: String(pagination.cursor) }
        : undefined,
      take: pagination?.limit,
      skip: pagination?.cursor ? 1 : undefined,
      orderBy: {
        journal: {
          occuredAt:
            sort.sort_by === 'occured_at' ? sort?.sort_direction : undefined,
          description:
            sort.sort_by === 'description' ? sort?.sort_direction : undefined,
        },
      },
      where: {
        accountId: filters.account_id,
        amount: {
          gte: filters?.min_amount,
          lte: filters?.max_amount,
        },
        journal: {
          bumdesUnitId: unitId,
          occuredAt: {
            gte: filters?.start_occured_at,
            lte: filters?.end_occured_at,
          },
        },
      },
      include: {
        journal: {
          select: { occuredAt: true, description: true },
        },
      },
    });

    let balance = new Prisma.Decimal(payload.previous_balance ?? 0);

    const transactions: LedgerTransactionDetails[] = [];

    // result.journals.forEach((journal) => {
    //   journal.data_transactions.forEach((item) => {
    //     balance +=
    //       account.isCredit === item.is_credit ? item.amount : -item.amount;

    //     transactions.push({
    //       amount: item.amount,
    //       is_credit: item.is_credit,
    //       occured_at: journal.occured_at,
    //       description: journal.description,
    //       account_name: account.name,
    //       calculation_result: balance,
    //     });
    //   });
    // });

    journalItems.forEach((item) => {
      balance = balance.add(
        account.isCredit === item.isCredit
          ? item.amount
          : item.amount.negated(),
      );

      transactions.push({
        id: item.id,
        amount: item.amount,
        is_credit: item.isCredit,
        occured_at: item.journal.occuredAt,
        description: item.journal.description,
        account_name: account.name,
        calculation_result: balance.toNumber(),
      });
    });

    return {
      account_name: account.name,
      account_ref: account.ref,
      account_is_credit: account.isCredit,
      result_balance: balance.toNumber(),
      _count: transactions.length,
      next_cursor: transactions[transactions.length - 1]?.id,
      transactions,
    };
  }
}
