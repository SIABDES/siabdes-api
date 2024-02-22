import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationDto } from '~common/dto';
import { PrismaService } from '~lib/prisma/prisma.service';
import { JournalFilesService } from '~modules/files_manager/services';
import {
  CreateJournalDto,
  GetJournalsFilterDto,
  GetJournalsSortDto,
  UpdateJournalDto,
} from '../dto';
import { IJournalsService } from '../interfaces';
import { JournalDetailsType } from '../types';
import {
  CreateJournalResponse,
  DeleteJournalResponse,
  GetJournalsResponse,
  UpdateJournalReponse,
} from '../types/responses';

@Injectable()
export class JournalsService implements IJournalsService {
  constructor(
    private prisma: PrismaService,
    private files: JournalFilesService,
  ) {}

  async createJournal(
    unitId: string,
    data: CreateJournalDto,
    evidenceFile?: Express.Multer.File,
  ): Promise<CreateJournalResponse> {
    const { category, data_transactions, description, occurred_at } = data;

    const unit = await this.prisma.bumdesUnit.findUnique({
      where: { id: unitId },
      select: { id: true, bumdesId: true },
    });

    if (!unit) throw new ForbiddenException('Unit not found');

    if (category === 'GENERAL' && !evidenceFile)
      throw new BadRequestException('Evidence file is required');

    const evidenceKey = await this.files.upload({
      category: category,
      file: evidenceFile,
      unitId: unit.id,
      bumdesId: unit.bumdesId,
    });

    try {
      const journal = await this.prisma.journal.create({
        data: {
          category,
          description,
          occurredAt: occurred_at,
          evidence: evidenceKey,
          bumdesUnit: {
            connect: { id: unitId },
          },
          items: {
            createMany: {
              data: data_transactions.map((item) => ({
                accountId: item.account_id,
                amount: item.amount,
                isCredit: item.is_credit,
              })),
            },
          },
        },
        select: {
          id: true,
          category: true,
        },
      });

      return {
        id: journal.id,
        category: journal.category,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Account not found');
        }
      }
      throw error;
    }
  }

  async updateJournal(
    unitId: string,
    journalId: string,
    data: UpdateJournalDto,
    evidenceFile?: Express.Multer.File,
  ): Promise<UpdateJournalReponse> {
    try {
      const journal = await this.prisma.journal.findUnique({
        where: { id: journalId, bumdesUnitId: unitId },
        select: { id: true, deletedAt: true, category: true },
      });

      if (!journal) throw new NotFoundException('Journal not found');

      if (journal.deletedAt) {
        return {
          id: journal.id,
          category: journal.category,
          deletedAt: journal.deletedAt,
        };
      }

      let evidenceKey: string | null = null;

      if (evidenceFile) {
        evidenceKey = await this.files.upload({
          category: journal.category,
          file: evidenceFile,
          unitId: unitId,
        });
      }

      const updatedJournal = await this.prisma.journal.update({
        where: { id: journal.id },
        data: {
          description: data.description,
          occurredAt: data.occurred_at,
          evidence: evidenceKey,
          items: {
            deleteMany: {},
            createMany: {
              data: data.data_transactions.map((item) => ({
                accountId: item.account_id,
                amount: item.amount,
                isCredit: item.is_credit,
              })),
            },
          },
        },
        select: {
          id: true,
          category: true,
        },
      });

      return {
        id: updatedJournal.id,
        category: updatedJournal.category,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Journal not found');
        }
        if (error.code === 'P2002') {
          throw new BadRequestException('Account not found');
        }
      }
      throw error;
    }
  }

  async getJournals(
    unitId: string,
    sort?: GetJournalsSortDto,
    filter?: GetJournalsFilterDto,
    pagination?: PaginationDto,
  ): Promise<GetJournalsResponse> {
    const paginationQuery: Prisma.JournalFindManyArgs = {
      cursor: pagination?.cursor
        ? { id: String(pagination.cursor) }
        : undefined,
      take: pagination?.limit,
    };

    const sortQuery: Prisma.JournalFindManyArgs = {
      orderBy: {
        occurredAt:
          sort?.sort_by === 'occurred_at' ? sort.sort_direction : undefined,
        description:
          sort?.sort_by === 'description' ? sort.sort_direction : undefined,
      },
    };

    const journals = await this.prisma.journal.findMany({
      ...paginationQuery,
      ...sortQuery,
      where: {
        bumdesUnitId: unitId,
        deletedAt: filter?.get_deleted ? undefined : null,
        occurredAt: {
          gte: filter?.start_occurred_at,
          lte: filter?.end_occurred_at,
        },
        category: filter?.category,
        description: filter.description
          ? { contains: filter?.description, mode: 'insensitive' }
          : undefined,
      },
      include: {
        items: filter.is_detailed
          ? {
              where: {
                deletedAt: filter?.get_deleted ? undefined : null,
                accountId: filter?.account_id ? filter?.account_id : undefined,
                amount: {
                  gte: filter?.min_amount,
                  lte: filter?.max_amount,
                },
              },
            }
          : false,
      },
    });

    return {
      _count: journals.length,
      journals: journals.map((journal) => ({
        id: journal.id,
        category: journal.category,
        description: journal.description,
        occured_at: journal.occurredAt,
        created_at: journal.createdAt,
        updated_at: journal.updatedAt,
        evidence: filter.is_detailed ? journal.evidence : undefined,
        data_transactions: filter.is_detailed
          ? journal.items.map((item) => ({
              account_id: item.accountId,
              amount: item.amount.toNumber(),
              is_credit: item.isCredit,
            }))
          : undefined,
      })),
    };
  }

  async getJournalDetails(
    unitId: string,
    journalId: string,
  ): Promise<JournalDetailsType> {
    const journal = await this.prisma.journal.findUnique({
      where: { id: journalId, bumdesUnitId: unitId },
      include: {
        items: {
          select: {
            id: true,
            accountId: true,
            amount: true,
            isCredit: true,
          },
        },
      },
    });

    if (!journal) throw new NotFoundException('Journal not found');

    const accountIds = journal.items.map((item) => item.accountId);

    const accounts = await this.prisma.account.findMany({
      where: {
        id: { in: accountIds },
      },
    });

    return {
      id: journal.id,
      category: journal.category,
      description: journal.description,
      evidence: journal.evidence,
      occured_at: journal.occurredAt,
      created_at: journal.createdAt,
      updated_at: journal.updatedAt,
      data_transactions: journal.items.map((item) => ({
        account_id: item.accountId,
        account_name: accounts.find((acc) => acc.id === item.accountId).name,
        account_ref: accounts.find((acc) => acc.id === item.accountId).ref,
        amount: item.amount.toNumber(),
        is_credit: item.isCredit,
      })),
    };
  }

  async deleteJournal(
    unitId: string,
    journalId: string,
  ): Promise<DeleteJournalResponse> {
    const journal = await this.prisma.journal.findUnique({
      where: { id: journalId, bumdesUnitId: unitId },
      select: { id: true, deletedAt: true },
    });

    if (!journal) throw new NotFoundException('Journal not found');

    if (journal.deletedAt) {
      return {
        id: journal.id,
        deletedAt: journal.deletedAt,
      };
    }

    const deletedJournal = await this.prisma.journal.update({
      where: { id: journal.id },
      data: { deletedAt: new Date().toISOString() },
      select: { id: true, deletedAt: true },
    });

    return {
      id: deletedJournal.id,
      deletedAt: deletedJournal.deletedAt,
    };
  }
}
