import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '~lib/prisma/prisma.service';
import { GeneralJournalCreateTransactionDto } from '../dto';
import { GeneralJournalUpdateTransactionDto } from '../dto/update-transaction.dto';
import { IGeneralJournalsService } from '../interfaces';
import {
  CreateTransactionResponse,
  GetJournalDetailsResponse,
  UpdateTransactionResponse,
} from '../types/responses';
import { Prisma } from '@prisma/client';

@Injectable()
export class GeneralJournalsService implements IGeneralJournalsService {
  constructor(private prisma: PrismaService) {}

  async deleteTransaction(unitId: string, journalId: string): Promise<void> {
    try {
      const deletedAt = new Date().toUTCString();

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
                  accountRef: transaction.account_ref,
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
          journalItems: true,
        },
      });

      if (!journal) throw new NotFoundException('Jurnal tidak ditemukan');

      return {
        _count: journal._count.journalItems,
        details: {
          description: journal.description,
          occuredAt: journal.occuredAt,
          data_transactions: journal.journalItems.map((item) => ({
            id: item.id,
            account_ref: item.accountRef,
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
    data: GeneralJournalCreateTransactionDto,
    bumdesUnitId: string,
  ): Promise<CreateTransactionResponse> {
    const { data_transactions, description, occured_at } = data;

    const journal = await this.prisma.generalJournal.create({
      data: {
        description,
        occuredAt: occured_at,
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
              accountRef: transaction.account_ref,
            })),
          },
        },
      },
    });

    return {
      id: journal.id,
    };
  }
}
