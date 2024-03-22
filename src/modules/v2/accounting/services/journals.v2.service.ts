import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JournalCategory, Prisma } from '@prisma/client';
import { CommonDeleteDto, IdsDto } from '~common/dto';
import { PrismaClientExceptionCode } from '~common/exceptions';
import { FilesService } from '~common/services';
import { FileResourceLocation } from '~common/types';
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
  constructor(
    private prisma: PrismaService,
    private readonly filesService: FilesService,
  ) {}

  async addJournal(
    dto: AddJournalV2Dto,
    ids: IdsDto,
    evidence?: Express.Multer.File,
  ): Promise<AddJournalV2Response> {
    if (!ids.unit_id) throw new BadRequestException('unit_id is required');

    if (dto.category === JournalCategory.GENERAL && !evidence)
      throw new BadRequestException(
        'Jurnal umum harus memiliki bukti transaksi',
      );

    let evidenceKey: string;

    if (evidence) {
      const { key } = await this.filesService.upload(evidence, {
        ...ids,
        resource: FileResourceLocation.JOURNALS,
      });
      evidenceKey = key;
    }

    const journal = await this.prisma.journal.create({
      data: {
        bumdesUnit: { connect: { id: ids.unit_id } },
        category: dto.category,
        description: dto.description,
        occurredAt: dto.occurred_at,
        evidence: evidenceKey,
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
        items: {
          select: {
            amount: true,
            isCredit: true,
            accountId: true,
            account: {
              select: {
                name: true,
                ref: true,
              },
            },
          },
        },
      },
    });

    if (!journal) throw new NotFoundException('Jurnal tidak ditemukan');

    let evidenceUrl: string;

    if (journal.evidence) {
      evidenceUrl = await this.filesService.getUrl(journal.evidence);
    }

    return {
      id: journal.id,
      unit_id: journal.bumdesUnitId,
      category: journal.category,
      description: journal.description,
      occurred_at: journal.occurredAt,
      evidence: evidenceUrl,
      created_at: journal.createdAt,
      data_transactions: journal.items.map((item) => ({
        account_id: item.accountId,
        account_name: item.account.name,
        account_ref: item.account.ref,
        amount: item.amount.toNumber(),
        is_credit: item.isCredit,
      })),
    };
  }

  async getJournalEvidenceById(id): Promise<string> {
    const journal = await this.prisma.journal.findUnique({
      where: { id },
      select: { evidence: true },
    });

    if (!journal) throw new NotFoundException('Jurnal tidak ditemukan');
    if (!journal.evidence)
      throw new NotFoundException('Bukti transaksi tidak ada');

    return await this.filesService.getUrl(journal.evidence);
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
    ids: IdsDto,
    evidence?: Express.Multer.File,
  ): Promise<UpdateJournalV2Response> {
    const journal = await this.prisma.journal.findUnique({
      where: { id, bumdesUnitId: ids.unit_id },
      select: {
        id: true,
        bumdesUnitId: true,
      },
    });

    if (!journal) throw new NotFoundException('Jurnal tidak ditemukan');

    let evidenceKey: string;

    if (evidence) {
      if (!ids.bumdes_id || !ids.unit_id)
        throw new BadRequestException('bumdesId and unitId are required');

      const { key } = await this.filesService.upload(evidence, {
        unit_id: ids.unit_id,
        bumdes_id: ids.bumdes_id,
      });
      evidenceKey = key;
    }

    const journalUpdated = await this.prisma.journal.update({
      where: { id, deletedAt: { equals: null } },
      data: {
        category: dto.category,
        description: dto.description,
        occurredAt: dto.occurred_at,
        evidence: evidenceKey,
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
      select: { id: true, updatedAt: true },
    });

    return {
      id: journalUpdated.id,
      updated_at: journalUpdated.updatedAt,
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
