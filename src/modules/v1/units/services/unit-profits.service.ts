import { BadRequestException, Injectable } from '@nestjs/common';
import { IUnitProfitsService } from '../interfaces';
import { AddUnitProfitHistoryDto, UpdateUnitProfitHistoryDto } from '../dto';
import {
  AddUnitProfitHistoryResponse,
  GetUnitProfitHistoriesResponse,
  UpdaetUnitProfitHistoryResponse,
  DeleteUnitProfitHistoryResponse,
} from '../types/responses';
import { PrismaService } from '~lib/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UnitProfitsService implements IUnitProfitsService {
  constructor(private prisma: PrismaService) {}

  async addProfitHistory(
    unitId: string,
    dto: AddUnitProfitHistoryDto,
  ): Promise<AddUnitProfitHistoryResponse> {
    try {
      const history = await this.prisma.bumdesUnitNetProfitHistory.create({
        data: {
          year: dto.year,
          netProfit: dto.profit,
          dividend: dto.dividend,
          unit: { connect: { id: unitId } },
        },
      });

      return {
        id: history.id,
        createdAt: history.createdAt,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Duplicate entry');
        }
        if (error.code === 'P2025') {
          throw new BadRequestException('Invalid foreign key. Unit not found');
        }
      }
      throw error;
    }
  }

  async getProfitHistories(
    unitId: string,
  ): Promise<GetUnitProfitHistoriesResponse> {
    const histories = await this.prisma.bumdesUnitNetProfitHistory.findMany({
      where: { unitId },
      orderBy: { year: 'asc' },
    });

    return {
      _count: histories.length,
      histories: histories.map((history) => ({
        year: history.year,
        profit: history.netProfit.toNumber(),
        dividend: history.dividend.toNumber(),
      })),
    };
  }

  async updateProfitHistory(
    unitId: string,
    profitId: string,
    dto: UpdateUnitProfitHistoryDto,
  ): Promise<UpdaetUnitProfitHistoryResponse> {
    try {
      const history = await this.prisma.bumdesUnitNetProfitHistory.update({
        where: { id: profitId },
        data: {
          year: dto.year,
          netProfit: dto.profit,
          dividend: dto.dividend,
        },
      });

      return {
        id: history.id,
        updatedAt: history.updatedAt,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('Invalid foreign key. Unit not found');
        }
      }
      throw error;
    }
  }

  async deleteProfitHistory(
    unitId: string,
    profitId: string,
  ): Promise<DeleteUnitProfitHistoryResponse> {
    try {
      const history = await this.prisma.bumdesUnitNetProfitHistory.delete({
        where: { id: profitId, unitId },
      });

      return {
        id: history.id,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('Invalid foreign key. Unit not found');
        }
      }
      throw error;
    }
  }
}
