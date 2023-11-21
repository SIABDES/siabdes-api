import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '~lib/prisma/prisma.service';
import {
  GeneralJournalCreateTransactionDto,
  GetTransactionsFiltersDto,
} from '../dto';
import { GeneralJournalUpdateTransactionDto } from '../dto/update-transaction.dto';
import { IGeneralJournalsService } from '../interfaces';
import {
  CreateTransactionResponse,
  GetJournalDetailsResponse,
  GetUnitJournalsResponse,
  UpdateTransactionResponse,
} from '../types/responses';
import { PaginationDto } from '~common/dto';
import { GeneralJournalsFilesService } from '~modules/files_manager/services';

@Injectable()
export class GeneralJournalsService implements IGeneralJournalsService {
  constructor(
    private prisma: PrismaService,
    private filesService: GeneralJournalsFilesService,
  ) {}

  async getUnitTransactions(
    unitId: string,
    filters?: GetTransactionsFiltersDto,
    pagination?: PaginationDto,
  ): Promise<GetUnitJournalsResponse> {
    const { cursor, limit } = pagination;
    const { get_deleted } = filters;

    const paginationQuery: Prisma.GeneralJournalFindManyArgs = {
      cursor: cursor ? { id: String(cursor) } : undefined,
      take: limit ? limit : undefined,
    };

    const journals = await this.prisma.generalJournal.findMany({
      ...paginationQuery,
      orderBy: {
        occuredAt: 'desc',
      },
      where: {
        bumdesUnitId: unitId,
        deletedAt: get_deleted ? undefined : null,
      },
    });

    return {
      _count: journals.length,
      journals: journals.map((journal) => ({
        id: journal.id,
        description: journal.description,
        occuredAt: journal.occuredAt,
        evidence: journal.evidence,
      })),
    };
  }

  async deleteTransaction(unitId: string, journalId: string): Promise<void> {
    try {
      const deletedAt = new Date().toISOString();

      await this.prisma.generalJournal.update({
        where: {
          bumdesUnitId: unitId,
          id: journalId,
        },
        data: {
          deletedAt: deletedAt,
          journalItems: {
            updateMany: {
              where: {
                generalJournalId: journalId,
              },
              data: {
                deletedAt: deletedAt,
              },
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Jurnal tidak ditemukan');
        }
      }
      throw error;
    }
  }

  async updateTransaction(
    unitId: string,
    journalId: string,
    data: GeneralJournalUpdateTransactionDto,
  ): Promise<UpdateTransactionResponse> {
    try {
      const journal = await this.prisma.generalJournal.findUnique({
        where: {
          id: journalId,
          bumdesUnitId: unitId,
        },
      });

      if (!journal) throw new NotFoundException('Jurnal tidak ditemukan');

      const result = await this.prisma.$transaction(async (tx) => {
        await tx.generalJournalItem.deleteMany({
          where: {
            generalJournalId: journal.id,
          },
        });

        const updateResult = await tx.generalJournal.update({
          where: {
            id: journalId,
            bumdesUnitId: unitId,
          },
          data: {
            description: data.description,
            occuredAt: data.occured_at,
            journalItems: {
              createMany: {
                data: data.data_transactions.map((transaction) => ({
                  amount: transaction.amount,
                  isCredit: transaction.is_credit,
                  accountId: transaction.account_id,
                })),
              },
            },
          },
        });

        return updateResult;
      });

      return {
        id: journal.id,
        updatedAt: result.updatedAt,
      };
    } catch (error) {
      throw error;
    }
  }

  async getTransactionDetails(
    unitId: string,
    journalId: string,
  ): Promise<GetJournalDetailsResponse> {
    try {
      const journal = await this.prisma.generalJournal.findUnique({
        where: {
          id: journalId,
          bumdesUnitId: unitId,
        },
        include: {
          _count: {
            select: {
              journalItems: {
                where: {
                  deletedAt: null,
                },
              },
            },
          },
          journalItems: {
            include: {
              account: true,
            },
          },
        },
      });

      if (!journal) throw new NotFoundException('Jurnal tidak ditemukan');

      return {
        _count: journal._count.journalItems,
        details: {
          id: journal.id,
          description: journal.description,
          occuredAt: journal.occuredAt,
          evidence: journal.evidence,
          data_transactions: journal.journalItems.map((item) => ({
            id: item.id,
            account_ref: item.account.ref,
            account_id: item.accountId,
            amount: item.amount.toNumber(),
            is_credit: item.isCredit,
          })),
        },
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Jurnal tidak ditemukan');
        }
      }
      throw error;
    }
  }

  async createTransaction(
    evidence: Express.Multer.File,
    data: GeneralJournalCreateTransactionDto,
    bumdesId: string,
    bumdesUnitId: string,
  ): Promise<CreateTransactionResponse> {
    const { data_transactions, description, occured_at } = data;

    const evidenceKey = await this.filesService.uploadEvidence(
      evidence,
      bumdesId,
      bumdesUnitId,
    );

    try {
      const journal = await this.prisma.generalJournal.create({
        data: {
          description,
          occuredAt: occured_at,
          evidence: evidenceKey,
          bumdesUnit: {
            connect: {
              id: bumdesUnitId,
            },
          },
          journalItems: {
            createMany: {
              data: data_transactions.map((transaction) => ({
                amount: transaction.amount,
                isCredit: transaction.is_credit,
                accountId: transaction.account_id,
              })),
            },
          },
        },
      });

      return {
        id: journal.id,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new NotFoundException('Unit tidak ditemukan');
        }
      }
      throw error;
    }
  }
}
