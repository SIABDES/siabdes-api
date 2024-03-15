import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AccountType } from '@prisma/client';
import Decimal from 'decimal.js';
import { PrismaService } from '~lib/prisma/prisma.service';
import { GetLedgersV2Dto } from '../dto';
import {
  GetLedgersFinalBalanceV2Response,
  GetLedgersV2Response,
} from '../responses';

@Injectable()
export class LedgersV2Service {
  constructor(private prisma: PrismaService) {}

  // TODO: Implement for custom account
  async getLedgers(dto: GetLedgersV2Dto): Promise<GetLedgersV2Response> {
    const { account_id, unit_id } = dto;

    if (!unit_id) throw new BadRequestException('Unit ID is required');
    if (!account_id)
      throw new BadRequestException('Account ID or Ref is required');

    const account = await this.prisma.account.findFirst({
      orderBy: { ref: 'asc' },
      where: {
        id: account_id,
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
        isCredit: true,
      },
    });

    if (!account) throw new NotFoundException('Account not found');

    const journalItems = await this.prisma.journalItem.findMany({
      orderBy: { journal: { occurredAt: 'desc' } },
      where: {
        journal: { bumdesUnitId: unit_id },
        accountId: account_id,
      },
      cursor: dto.cursor ? { id: dto.cursor as string } : undefined,
      take: dto.limit || 50,
      skip: dto.cursor ? 1 : 0,
      select: {
        id: true,
        amount: true,
        isCredit: true,
        journal: { select: { description: true, occurredAt: true } },
      },
    });

    let resultBalance = new Decimal(dto.last_balance || 0);

    const transactions = journalItems.map((item) => {
      const previousBalance = resultBalance.toNumber();

      const transactionAmount =
        account.isCredit === item.isCredit
          ? item.amount
          : item.amount.negated();

      resultBalance = resultBalance.plus(transactionAmount);

      return {
        id: item.id,
        occurred_at: item.journal.occurredAt,
        description: item.journal.description,
        is_credit: item.isCredit,
        amount: item.amount.toNumber(),
        previous_balance: previousBalance,
        result_balance: resultBalance.toNumber(),
      };
    });

    return {
      last_balance: dto.last_balance || 0,
      result_balance: resultBalance.toNumber(),
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

    const account = await this.prisma.account.findFirst({
      orderBy: { ref: 'asc' },
      where: {
        id: account_id,
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
      },
    });

    if (!account) throw new NotFoundException('Account not found');

    const journals = await this.prisma.journal.findMany({
      orderBy: { occurredAt: 'desc' },
      where: {
        bumdesUnitId: unit_id,
        occurredAt: {
          gte: start_occurred_at,
          lte: end_occurred_at,
        },
        items: {
          some: { accountId: account_id },
        },
      },
      select: {
        items: {
          where: { accountId: account_id },
          select: {
            amount: true,
            isCredit: true,
          },
        },
      },
    });

    const items = journals.flatMap((journal) => journal.items);

    let finalBalance = new Decimal(0);

    items.forEach((item) => {
      const actualAmount =
        item.isCredit === account.isCredit
          ? item.amount
          : item.amount.negated();
      finalBalance = finalBalance.plus(actualAmount);
    });

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
      items_count: items.length,
      final_balance: finalBalance.toNumber(),
    };
  }
}
