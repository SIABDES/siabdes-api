import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { PrismaService } from '~lib/prisma/prisma.service';
import {
  LedgersFindAccountArgs,
  LedgersFindAccountResult,
  LedgersFindJournalItemsArgs,
  LedgersFindJournalItemsResult,
  LedgersFindJournalsArgs,
  LedgersFindJournalsResult,
} from '../types';

@Injectable()
export class LedgersV2Repository {
  constructor(private prisma: PrismaService) {}

  async findAccount({
    account_id,
    unit_id,
    dto,
  }: LedgersFindAccountArgs): Promise<LedgersFindAccountResult> {
    const account = await this.prisma.account.findFirst({
      orderBy: { ref: 'asc' },
      where: {
        id: account_id,
        businessTypes: { has: dto.business_type },
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

    return account;
  }

  async findJournalItems({
    account_id,
    unit_id,
    dto,
  }: LedgersFindJournalItemsArgs): Promise<LedgersFindJournalItemsResult> {
    const journalItems = await this.prisma.journalItem.findMany({
      orderBy: { journal: { occurredAt: 'asc' } },
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

    return journalItems;
  }

  async findJournals({
    account_id,
    unit_id,
    dto,
  }: LedgersFindJournalsArgs): Promise<LedgersFindJournalsResult> {
    const journals = await this.prisma.journal.findMany({
      orderBy: { occurredAt: 'desc' },
      where: {
        bumdesUnitId: unit_id,
        occurredAt: {
          gte: dto.start_occurred_at,
          lte: dto.end_occurred_at,
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

    return journals;
  }
}
