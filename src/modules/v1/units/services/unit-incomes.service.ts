import { Injectable, NotFoundException } from '@nestjs/common';
import { IUnitIncomesService } from '../interfaces';
import { AddUnitIncomeHistoryDto, UpdateUnitIncomeHistoryDto } from '../dto';
import {
  GetUnitIncomeHistoriesResponse,
  AddUnitIncomeHistoryResponse,
  DeleteUnitIncomeHistoryResponse,
  UpdateUnitIncomeHistoryResponse,
} from '../types/responses';
import { PrismaService } from '~lib/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UnitIncomesService implements IUnitIncomesService {
  constructor(private prisma: PrismaService) {}

  async getIncomesHistory(
    unitId: string,
  ): Promise<GetUnitIncomeHistoriesResponse> {
    const histories = await this.prisma.bumdesUnitIncomeHistory.findMany({
      where: { unitId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      _count: histories.length,
      histories: histories.map((history) => ({
        id: history.id,
        asset: history.asset.toNumber(),
        revenue: history.revenue.toNumber(),
        year: history.year,
      })),
    };
  }

  async addIncomeHistory(
    unitId: string,
    dto: AddUnitIncomeHistoryDto,
  ): Promise<AddUnitIncomeHistoryResponse> {
    const { asset, revenue, year } = dto;

    const history = await this.prisma.bumdesUnitIncomeHistory.create({
      data: {
        asset,
        revenue,
        year,
        unitId,
      },
    });

    return {
      id: history.id,
      bumdesId: history.unitId,
      unitId: history.unitId,
      createdAt: history.createdAt,
    };
  }

  async deleteIncomeHistory(
    unitId: string,
    incomeId: string,
  ): Promise<DeleteUnitIncomeHistoryResponse> {
    try {
      const history = await this.prisma.bumdesUnitIncomeHistory.delete({
        where: { id: incomeId, unitId },
      });

      return {
        id: history.id,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Data tidak ditemukan');
        }
      }
      throw error;
    }
  }

  async updateIncomeHistory(
    unitId: string,
    incomeId: string,
    dto: UpdateUnitIncomeHistoryDto,
  ): Promise<UpdateUnitIncomeHistoryResponse> {
    try {
      const history = await this.prisma.bumdesUnitIncomeHistory.update({
        where: { id: incomeId, unitId },
        data: dto,
      });

      return {
        id: history.id,
        updatedAt: history.updatedAt,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Data tidak ditemukan');
        }
      }
      throw error;
    }
  }
}
