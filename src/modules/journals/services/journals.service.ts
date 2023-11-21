import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IJournalsService } from '../interfaces';
import { PrismaService } from '~lib/prisma/prisma.service';
import {
  CreateJournalDto,
  GetJournalsFilterDto,
  GetJournalsSortDto,
  UpdateJournalDto,
} from '../dto';
import { JournalDetailsType } from '../types';
import {
  CreateJournalResponse,
  UpdateJournalReponse,
  GetJournalsResponse,
  DeleteJournalResponse,
} from '../types/responses';
import { GeneralJournalsFilesService } from '~modules/files_manager/services';
import { PaginationDto } from '~common/dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class JournalsService implements IJournalsService {
  constructor(
    private prisma: PrismaService,
    private generalJournalFiles: GeneralJournalsFilesService,
  ) {}

  async createJournal(
    unitId: string,
    evidenceFile: Express.Multer.File,
    data: CreateJournalDto,
  ): Promise<CreateJournalResponse> {
    const { category, data_transactions, description, occured_at } = data;

    const unit = await this.prisma.bumdesUnit.findUnique({
      where: { id: unitId },
      select: { id: true, bumdesId: true },
    });

    if (!unit) throw new ForbiddenException('Unit not found');

    try {
      let evidenceKey =
        category === 'GENERAL'
          ? await this.generalJournalFiles.uploadEvidence(
              evidenceFile,
              unit.bumdesId,
              unitId,
            )
          : null;

      const journal = await this.prisma.journal.create({
        data: {
          category,
          description,
          occuredAt: occured_at,
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
      throw error;
    }
  }

  async updateJournal(
    unitId: string,
    journalId: string,
    data: UpdateJournalDto,
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

      const updatedJournal = await this.prisma.journal.update({
        where: { id: journal.id },
        data: {
          description: data.description,
          occuredAt: data.occured_at,
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
        occuredAt:
          sort?.sort_by === 'occured_at' ? sort.sort_direction : undefined,
        description:
          sort?.sort_by === 'description' ? sort.sort_direction : undefined,
      },
    };

    const journals = await this.prisma.journal.findMany({
      ...paginationQuery,
      ...sortQuery,
      where: {
        bumdesUnitId: unitId,
        occuredAt: {
          gte: filter?.start_occured_at,
          lte: filter?.end_occured_at,
        },
        category: filter?.category,
        description: filter.description
          ? { contains: filter?.description, mode: 'insensitive' }
          : undefined,
      },
    });

    return {
      _count: journals.length,
      journals: journals.map((journal) => ({
        id: journal.id,
        category: journal.category,
        description: journal.description,
        occured_at: journal.occuredAt,
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

    return {
      id: journal.id,
      category: journal.category,
      description: journal.description,
      evidence: journal.evidence,
      occured_at: journal.occuredAt,
      data_transactions: journal.items.map((item) => ({
        account_id: item.accountId,
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
