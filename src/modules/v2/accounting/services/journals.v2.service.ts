import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JournalCategory, Prisma } from '@prisma/client';
import { CommonDeleteDto } from '~common/dto';
import { PrismaClientExceptionCode } from '~common/exceptions';
import { PrismaService } from '~lib/prisma/prisma.service';
import {
  AddJournalV2Dto,
  GetManyJournalsV2Dto,
  UpdateJournalV2Dto,
} from '../dto';
import {
  AddJournalV2Response,
  DeleteJournalV2Response,
  GetJournalByIdV2Response,
  GetManyJournalsV2Response,
  UpdateJournalV2Response,
} from '../responses';

@Injectable()
export class JournalsV2Service {
  constructor(private prisma: PrismaService) {}

  async addJournal(
    dto: AddJournalV2Dto,
    evidence?: Express.Multer.File,
  ): Promise<AddJournalV2Response> {
    if (dto.category === JournalCategory.GENERAL && !evidence)
      throw new BadRequestException(
        'Jurnal umum harus memiliki bukti transaksi',
      );

    const evidenceUrl = '';

    const journal = await this.prisma.journal.create({
      data: {
        bumdesUnit: { connect: { id: dto.unit_id } },
        category: dto.category,
        description: dto.description,
        occurredAt: dto.occurred_at,
        evidence: evidenceUrl,
        items: {
          createMany: {
            data: dto.data_transactions.map((transaction) => ({
              accountId: transaction.account_id,
              amount: transaction.amount,
              isCredit: transaction.is_credit,
            })),
          },
        },
      },
    });

    return {
      id: journal.id,
      created_at: journal.createdAt,
    };
  }

  async getJournalById(id: string): Promise<GetJournalByIdV2Response> {
    const journal = await this.prisma.journal.findUnique({
      where: { id, deletedAt: { equals: null } },
      include: {
        items: true,
      },
    });

    if (!journal) throw new NotFoundException('Jurnal tidak ditemukan');

    return {
      id: journal.id,
      unit_id: journal.bumdesUnitId,
      category: journal.category,
      description: journal.description,
      occurred_at: journal.occurredAt,
      evidence: journal.evidence,
      created_at: journal.createdAt,
      data_transactions: journal.items.map((item) => ({
        account_id: item.accountId,
        amount: item.amount.toNumber(),
        is_credit: item.isCredit,
      })),
    };
  }

  async getJournals(
    dto?: GetManyJournalsV2Dto,
  ): Promise<GetManyJournalsV2Response> {
    const whereQuery: Prisma.JournalWhereInput = {
      category: dto.category,
      deletedAt: { equals: null },
    };

    if (dto.unit_id || dto.bumdes_id) {
      whereQuery.bumdesUnit = {
        id: dto.unit_id,
        bumdesId: dto.bumdes_id,
      };
    }

    if (dto.start_occurred_at || dto.end_occurred_at) {
      whereQuery.occurredAt = {
        gte: dto.start_occurred_at,
        lte: dto.end_occurred_at,
      };
    }

    const journals = await this.prisma.journal.findMany({
      where: whereQuery,
      include: { items: true },
      orderBy: { occurredAt: 'desc' },
      cursor: dto.cursor ? { id: dto.cursor as string } : undefined,
      skip: dto.cursor ? 1 : 0,
      take: dto.limit,
    });

    return {
      _count: journals.length,
      journals: journals.map((journal) => ({
        id: journal.id,
        unit_id: journal.bumdesUnitId,
        category: journal.category,
        description: journal.description,
        occurred_at: journal.occurredAt,
        evidence: journal.evidence,
        created_at: journal.createdAt,
        data_transactions: journal.items.map((item) => ({
          account_id: item.accountId,
          amount: item.amount.toNumber(),
          is_credit: item.isCredit,
        })),
      })),
    };
  }

  async updateJournal(
    id: string,
    dto: UpdateJournalV2Dto,
    evidence?: Express.Multer.File,
  ): Promise<UpdateJournalV2Response> {
    const journal = await this.prisma.journal.findUnique({
      where: { id },
    });

    if (!journal) throw new NotFoundException('Jurnal tidak ditemukan');

    const evidenceUrl = '';

    await this.prisma.journal.update({
      where: { id, deletedAt: { equals: null } },
      data: {
        category: dto.category,
        description: dto.description,
        occurredAt: dto.occurred_at,
        evidence: evidenceUrl,
        items: {
          deleteMany: {},
          createMany: {
            data: dto.data_transactions.map((transaction) => ({
              accountId: transaction.account_id,
              amount: transaction.amount,
              isCredit: transaction.is_credit,
            })),
          },
        },
      },
    });

    return {
      id: journal.id,
      updated_at: journal.updatedAt,
    };
  }

  async softDeleteJournal(id: string): Promise<DeleteJournalV2Response> {
    try {
      const journal = await this.prisma.journal.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
        select: { id: true, deletedAt: true },
      });

      return {
        id: journal.id,
        hard_delete: false,
        deleted_at: journal.deletedAt || new Date(),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaClientExceptionCode.RECORD_NOT_FOUND) {
          throw new NotFoundException('Jurnal tidak ditemukan');
        }
      }

      throw error;
    }
  }

  async hardDeleteJournal(
    id: string,
    dto: CommonDeleteDto,
  ): Promise<DeleteJournalV2Response> {
    try {
      const journal = await this.prisma.journal.delete({
        where: { id, deletedAt: dto.force ? undefined : { not: null } },
        select: { id: true, deletedAt: true },
      });

      return {
        id: journal.id,
        hard_delete: true,
        deleted_at: journal.deletedAt || new Date(),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaClientExceptionCode.RECORD_NOT_FOUND) {
          throw new NotFoundException('Jurnal tidak ditemukan');
        }
        if (
          error.code ===
          PrismaClientExceptionCode.OPERATION_FAILED_RECORD_NOT_FOUND
        ) {
          throw new NotFoundException('Jurnal tidak dapat dihapus');
        }
      }
      throw error;
    }
  }
}
