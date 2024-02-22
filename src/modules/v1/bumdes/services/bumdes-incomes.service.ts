import { BadRequestException, Injectable } from '@nestjs/common';
import { IBumdesIncomesService } from '../interfaces';
import {
  AddBumdesIncomeHistoryDto,
  UpdateBumdesIncomeHistoryDto,
} from '../dto';
import {
  AddBumdesIncomeHistoryResponse,
  UpdateBumdesIncomeHistoryResponse,
  DeleteBumdesIncomeHistoryResponse,
  GetBumdesIncomeHistoriesResponse,
} from '../types';
import { PrismaService } from '~lib/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BumdesIncomesService implements IBumdesIncomesService {
  constructor(private prisma: PrismaService) {}

  async addHistory(
    bumdesId: string,
    dto: AddBumdesIncomeHistoryDto,
  ): Promise<AddBumdesIncomeHistoryResponse> {
    try {
      const history = await this.prisma.bumdesIncomeHistoryItem.create({
        data: {
          bumdes: { connect: { id: bumdesId } },
          year: dto.year,
          omzet: dto.omzet,
          profit: dto.profit,
          dividend: dto.dividend,
        },
      });

      return {
        id: history.id,
        created_at: history.createdAt,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Duplicate entry');
        }
        if (error.code === 'P2025') {
          throw new BadRequestException(
            'Invalid foreign key. Bumdes not found',
          );
        }
      }
      throw error;
    }
  }

  async updateHistory(
    bumdesId: string,
    incomeId: string,
    dto: UpdateBumdesIncomeHistoryDto,
  ): Promise<UpdateBumdesIncomeHistoryResponse> {
    try {
      const history = await this.prisma.bumdesIncomeHistoryItem.update({
        where: { id: incomeId, bumdesId: bumdesId },
        data: {
          year: dto.year,
          omzet: dto.omzet,
          profit: dto.profit,
          dividend: dto.dividend,
        },
      });

      return {
        id: history.id,
        updated_at: history.updatedAt,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Duplicate entry');
        }
        if (error.code === 'P2025') {
          throw new BadRequestException(
            'Invalid foreign key. Bumdes not found',
          );
        }
      }
      throw error;
    }
  }

  async deleteHistory(
    bumdesId: string,
    incomeId: string,
  ): Promise<DeleteBumdesIncomeHistoryResponse> {
    try {
      const history = await this.prisma.bumdesIncomeHistoryItem.delete({
        where: { id: incomeId, bumdesId },
      });

      return {
        id: history.id,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException(
            'Invalid foreign key. Bumdes not found',
          );
        }
      }
      throw error;
    }
  }

  async getHistories(
    bumdesId: string,
  ): Promise<GetBumdesIncomeHistoriesResponse> {
    const histories = await this.prisma.bumdesIncomeHistoryItem.findMany({
      where: { bumdesId },
    });

    return {
      _count: histories.length,
      histories: histories.map((history) => ({
        id: history.id,
        year: history.year,
        omzet: history.omzet.toNumber(),
        profit: history.profit.toNumber(),
        dividend: history.dividend.toNumber(),
      })),
    };
  }
}
