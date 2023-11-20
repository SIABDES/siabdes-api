import { PrismaService } from '~lib/prisma/prisma.service';
import {
  AdjustmentJournalCreateTransactionDto,
  AdjustmentJournalUpdateTransactionDto,
} from '../dto';
import { IAdjustmentJournalsService } from '../interfaces';
import {
  CreateAdjustmentTransactionResponse,
  DeleteAdjustmentTransactionResponse,
  GetAdjustmentTransactionDetailsResponse,
  GetUnitAdjustmentTransactionsResponse,
  UpdateAdjustmentTransactionResponse,
} from '../types/responses';
import { PaginationDto } from '~common/dto';
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdjustmentJournalsService implements IAdjustmentJournalsService {
  constructor(private prisma: PrismaService) {}

  async createTransaction(
    unitId: string,
    data: AdjustmentJournalCreateTransactionDto,
  ): Promise<CreateAdjustmentTransactionResponse> {
    const unit = await this.prisma.bumdesUnit.findUnique({
      where: {
        id: unitId,
      },
    });

    if (!unit) throw new NotFoundException('Unit tidak ditemukan');

    const { data_transactions, description, occured_at } = data;

    const journal = await this.prisma.adjustmentJournal.create({
      data: {
        description,
        occuredAt: occured_at,
        bumdesUnit: {
          connect: {
            id: unitId,
          },
        },
        journalItems: {
          createMany: {
            data: data_transactions.map((transaction) => ({
              accountRef: transaction.account_ref,
              amount: transaction.amount,
              isCredit: transaction.is_credit,
            })),
          },
        },
      },
    });

    return {
      id: journal.id,
    };
  }

  async getTransactionDetails(
    journalId: string,
  ): Promise<GetAdjustmentTransactionDetailsResponse> {
    const journal = await this.prisma.adjustmentJournal.findUnique({
      where: {
        id: journalId,
      },
      include: {
        journalItems: true,
      },
    });

    if (!journal) throw new NotFoundException('Jurnal tidak ditemukan');

    return {
      id: journal.id,
      description: journal.description,
      occured_at: journal.occuredAt,
      data_transactions: journal.journalItems.map((item) => ({
        id: item.id,
        account_ref: item.accountRef,
        amount: item.amount.toNumber(),
        is_credit: item.isCredit,
      })),
    };
  }

  async getUnitTransactions(
    unitId: string,
    pagination?: PaginationDto,
  ): Promise<GetUnitAdjustmentTransactionsResponse> {
    const unit = await this.prisma.bumdesUnit.findUnique({
      where: {
        id: unitId,
      },
    });

    if (!unit) throw new NotFoundException('Unit tidak ditemukan');

    const { cursor, limit } = pagination;

    const paginationQuery: Prisma.AdjustmentJournalFindManyArgs = {
      cursor: cursor ? { id: String(cursor) } : undefined,
      take: limit ? limit : undefined,
    };

    const journals = await this.prisma.adjustmentJournal.findMany({
      where: {
        bumdesUnitId: unitId,
        deletedAt: null,
      },
      include: {
        journalItems: true,
      },
      orderBy: {
        occuredAt: 'desc',
      },
      ...paginationQuery,
    });

    return {
      _count: journals.length,
      journals: journals.map((journal) => ({
        id: journal.id,
        description: journal.description,
        occured_at: journal.occuredAt,
        data_transactions: journal.journalItems.map((item) => ({
          id: item.id,
          account_ref: item.accountRef,
          amount: item.amount.toNumber(),
          is_credit: item.isCredit,
        })),
      })),
    };
  }

  async updateTransaction(
    journalId: string,
    data: AdjustmentJournalUpdateTransactionDto,
  ): Promise<UpdateAdjustmentTransactionResponse> {
    const { data_transactions, description, occured_at } = data;

    const journal = await this.prisma.adjustmentJournal.findUnique({
      where: {
        id: journalId,
      },
    });

    if (!journal) throw new NotFoundException('Jurnal tidak ditemukan');

    await this.prisma.adjustmentJournal.update({
      where: {
        id: journalId,
      },
      data: {
        description,
        occuredAt: occured_at,
        journalItems: {
          deleteMany: {
            adjustmentJournalId: journalId,
          },
          createMany: {
            data: data_transactions.map((transaction) => ({
              accountRef: transaction.account_ref,
              amount: transaction.amount,
              isCredit: transaction.is_credit,
            })),
          },
        },
      },
    });

    return {
      id: journal.id,
    };
  }

  async deleteTransaction(
    journalId: string,
  ): Promise<DeleteAdjustmentTransactionResponse> {
    const journal = await this.prisma.adjustmentJournal.findUnique({
      where: {
        id: journalId,
      },
    });

    if (!journal) throw new NotFoundException('Jurnal tidak ditemukan');

    await this.prisma.adjustmentJournal.update({
      where: {
        id: journalId,
      },
      data: {
        deletedAt: new Date().toISOString(),
      },
    });

    return {
      id: journal.id,
    };
  }
}
