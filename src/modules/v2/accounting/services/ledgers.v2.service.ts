import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import Decimal from 'decimal.js';
import { PrismaService } from '~lib/prisma/prisma.service';
import { GetAllLedgersV2Dto, GetLedgersV2Dto } from '../dto';
import {
  calculateLedgerFinalBalance,
  calculateLedgerJournalItems,
} from '../helpers';
import { LedgersV2Repository } from '../repositories';
import {
  GetAllLedgersV2Response,
  GetLedgersFinalBalanceV2Response,
  GetLedgersV2Response,
} from '../responses';
import {
  LedgerAccountInfoWithTransactions,
  LedgersFindJournalItemsResult,
} from '../types';

@Injectable()
export class LedgersV2Service {
  constructor(
    private readonly ledgersRepository: LedgersV2Repository,
    private prisma: PrismaService,
  ) {}

  async getLedgers(dto: GetLedgersV2Dto): Promise<GetLedgersV2Response> {
    const { account_id, unit_id } = dto;

    if (!unit_id) throw new BadRequestException('Unit ID is required');
    if (!account_id)
      throw new BadRequestException('Account ID or Ref is required');

    const account = await this.ledgersRepository.findAccount({
      account_id,
      unit_id,
      dto,
    });

    const journalItems = await this.ledgersRepository.findJournalItems({
      account_id,
      unit_id,
      dto,
    });

    const { resultBalance, transactions } = calculateLedgerJournalItems(
      new Decimal(dto.last_balance || 0),
      account,
      journalItems,
    );

    return {
      last_balance: dto.last_balance || 0,
      result_balance: resultBalance.toNumber(),
      account_is_credit: account.isCredit,
      _count: journalItems.length,
      next_cursor: journalItems[journalItems.length - 1]?.id,
      transactions,
    };
  }

  async getLedgerFinalBalance(
    dto: GetLedgersV2Dto,
  ): Promise<GetLedgersFinalBalanceV2Response> {
    const { unit_id, account_id, start_occurred_at, end_occurred_at } = dto;

    if (!unit_id) throw new BadRequestException('Unit ID is required');
    if (!account_id) throw new BadRequestException('Account ID is required');

    if (!start_occurred_at || !end_occurred_at)
      throw new BadRequestException(
        'Required fields "start_occurred_at" and "end_occurred_at"',
      );

    const account = await this.ledgersRepository.findAccount({
      account_id,
      unit_id,
      dto,
    });

    const journals = await this.ledgersRepository.findJournals({
      account_id,
      unit_id,
      dto,
    });

    const journalItems = journals.flatMap((journal) => journal.items);

    const finalBalance = calculateLedgerFinalBalance(account, journalItems);

    return {
      account_id: account.id,
      account_name: account.name,
      account_ref: account.ref,
      account_group_ref: account.groupRef,
      account_subgroup_ref: account.subgroupRef,
      account_is_credit: account.isCredit,
      start_occurred_at,
      end_occurred_at,
      journals_count: journals.length,
      items_count: journalItems.length,
      final_balance: finalBalance.toNumber(),
    };
  }

  async getAllLedgers(
    dto: GetAllLedgersV2Dto,
  ): Promise<GetAllLedgersV2Response> {
    const { unit_id, business_type, start_occurred_at, end_occurred_at } = dto;

    if (!unit_id) throw new BadRequestException('Unit ID is required');
    if (!start_occurred_at || !end_occurred_at)
      throw new BadRequestException(
        'Required fields "start_occurred_at" and "end_occurred_at"',
      );

    const accounts = await this.prisma.account.findMany({
      where: {
        businessTypes: { has: business_type },
        OR: [
          {
            type: AccountType.GLOBAL,
          },
          {
            type: AccountType.CUSTOM,
            unitOwnerId: unit_id,
          },
        ],
      },
      select: {
        id: true,
        name: true,
        ref: true,
        groupRef: true,
        subgroupRef: true,
        isCredit: true,
        journalItems: {
          orderBy: {
            journal: {
              occurredAt: 'asc',
            },
          },
          where: {
            journal: {
              bumdesUnitId: { equals: unit_id },
              occurredAt: {
                gte: start_occurred_at,
                lte: end_occurred_at,
              },
            },
          },
          include: {
            journal: true,
          },
        },
      },
    });

    const resultAccounts: LedgerAccountInfoWithTransactions[] = accounts.map(
      (account) => {
        const journalItems: LedgersFindJournalItemsResult =
          account.journalItems.map((journalItem) => {
            return {
              id: journalItem.id,
              isCredit: journalItem.isCredit,
              amount: journalItem.amount,
              journal: {
                description: journalItem.journal.description,
                occurredAt: journalItem.journal.occurredAt,
              },
            };
          });

        const { resultBalance, transactions } = calculateLedgerJournalItems(
          new Decimal(0),
          account,
          journalItems,
        );

        return {
          account_id: account.id,
          account_name: account.name,
          account_ref: account.ref,
          account_group_ref: account.groupRef,
          account_subgroup_ref: account.subgroupRef,
          account_is_credit: account.isCredit,
          transaction_count: journalItems.length,
          result_balance: resultBalance.toNumber(),
          transactions,
        };
      },
    );

    return {
      _count: accounts.length,
      accounts: resultAccounts.filter(
        (account) => account.transaction_count > 0,
      ),
    };
  }
}
