import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '~lib/prisma/prisma.service';
import { AddUnitCapitalHistoryDto, UpdateUnitCapitalHistoryDto } from '../dto';
import { IUnitCapitalsService } from '../interfaces';
import {
  AddUnitCapitalHistoryResponse,
  DeleteUnitCapitalHistoryResponse,
  GetUnitCapitalHistoriesResponse,
  UpdateUnitCapitalHistoryResponse,
} from '../types/responses';

@Injectable()
export class UnitCapitalsService implements IUnitCapitalsService {
  constructor(private prisma: PrismaService) {}

  async deleteCapitalHistory(
    unitId: string,
    capitalId: string,
  ): Promise<DeleteUnitCapitalHistoryResponse> {
    try {
      const capital = await this.prisma.bumdesUnitCapitalHistory.delete({
        where: { id: capitalId, unitId: unitId },
      });

      return {
        id: capital.id,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Capital not found`);
        }
      }
      throw error;
    }
  }

  async updateCapitalHistory(
    unitId: string,
    capitalId: string,
    dto: UpdateUnitCapitalHistoryDto,
  ): Promise<UpdateUnitCapitalHistoryResponse> {
    try {
      const capital = await this.prisma.bumdesUnitCapitalHistory.update({
        where: { id: capitalId, unitId: unitId },
        data: {
          amount: dto.amount,
          percentage: dto.percentage,
          source: dto.source,
        },
      });

      return {
        id: capital.id,
        updatedAt: capital.updatedAt,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Capital not found`);
        }
      }
      throw error;
    }
  }

  async addCapitalHistory(
    unitId: string,
    dto: AddUnitCapitalHistoryDto,
  ): Promise<AddUnitCapitalHistoryResponse> {
    try {
      const unit = await this.prisma.bumdesUnit.findUnique({
        where: {
          id: unitId,
        },
      });

      if (!unit) {
        throw new NotFoundException('Unit not found');
      }

      const capital = await this.prisma.bumdesUnitCapitalHistory.create({
        data: {
          amount: dto.amount,
          percentage: dto.percentage,
          source: dto.source,
          unit: {
            connect: {
              id: unit.id,
            },
          },
        },
      });

      return {
        id: capital.id,
        createdAt: capital.createdAt,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Unit not found');
        }
      }
      throw error;
    }
  }

  async getCapitalHistories(
    unitId: string,
  ): Promise<GetUnitCapitalHistoriesResponse> {
    try {
      const unit = await this.prisma.bumdesUnit.findUnique({
        where: {
          id: unitId,
        },
      });

      if (!unit) {
        throw new NotFoundException('Unit not found');
      }

      const capitals = await this.prisma.bumdesUnitCapitalHistory.findMany({
        where: {
          unitId: unit.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        _count: capitals.length,
        histories: capitals.map((capital) => ({
          id: capital.id,
          amount: capital.amount.toNumber(),
          percentage: capital.percentage.toNumber(),
          source: capital.source,
        })),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Unit not found');
        }
      }
      throw error;
    }
  }
}
