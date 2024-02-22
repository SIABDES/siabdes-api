import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationDto } from '~common/dto';
import { PrismaService } from '~lib/prisma/prisma.service';
import { AccountsService } from '~modules/v1/accounts/services';
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
    bumdesId: string,
    accountId: number,
    payload: GetLedgerPayloadDto,
    sort: GetLedgerSortDto,
    filters: GetLedgerFiltersDto,
    unitId?: string,
    pagination?: PaginationDto,
  ): Promise<GetLedgerResponse> {
    const hasNoUnitId = !filters.unit_id && !unitId;

    if (hasNoUnitId) throw new BadRequestException('Unit ID is required');

    const bumdes = await this.prisma.bumdesUnit.findUnique({
      where: {
        id: filters.unit_id ?? unitId,
        bumdesId: bumdesId,
      },
    });

    if (!bumdes) throw new NotFoundException('Unit not found');

    const account = await this.accountsService.findById(accountId);

    const journalItems = await this.prisma.journalItem.findMany({
      cursor: pagination?.cursor
        ? { id: String(pagination.cursor) }
        : undefined,
      take: pagination?.limit,
      skip: pagination?.cursor ? 1 : undefined,
      orderBy: {
        journal: {
          occurredAt:
            sort.sort_by === 'occurred_at' ? sort?.sort_direction : undefined,
          description:
            sort.sort_by === 'description' ? sort?.sort_direction : undefined,
        },
      },
      where: {
        accountId: accountId,
        deletedAt: null,
        amount: {
          gte: filters?.min_amount,
          lte: filters?.max_amount,
        },
        journal: {
          bumdesUnitId: filters.unit_id ?? unitId,
          deletedAt: null,
          occurredAt: {
            gte: filters?.start_occurred_at,
            lte: filters?.end_occurred_at,
          },
        },
      },
      include: {
        journal: {
          select: { occurredAt: true, description: true },
        },
      },
    });

    let balance = new Prisma.Decimal(payload.previous_balance ?? 0);

    const transactions: LedgerTransactionDetails[] = [];

    journalItems.forEach((item) => {
      balance = balance.add(
        account.isCredit === item.isCredit
          ? item.amount
          : item.amount.negated(),
      );

      transactions.push({
        id: item.id,
        amount: item.amount.toNumber(),
        is_credit: item.isCredit,
        occurred_at: item.journal.occurredAt,
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
