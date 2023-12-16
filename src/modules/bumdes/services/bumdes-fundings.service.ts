import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '~lib/prisma/prisma.service';
import { IBumdesFundingsService } from '../interfaces';
import {
  AddBumdesFundingHistoryDto,
  UpdateBumdesFundingHistoryDto,
} from '../dto';
import {
  AddBumdesFundingHistoryResponse,
  DeleteBumdesFundingHistoryResponse,
  UpdateBumdesFundingHistoryResponse,
  GetBumdesFundingHistoriesResponse,
} from '../types';
import { Prisma } from '@prisma/client';

@Injectable()
export class BumdesFundingsService implements IBumdesFundingsService {
  constructor(private prisma: PrismaService) {}

  async addHistory(
    bumdesId: string,
    dto: AddBumdesFundingHistoryDto,
  ): Promise<AddBumdesFundingHistoryResponse> {
    try {
      const history = await this.prisma.bumdesFundingHistoryItem.create({
        data: {
          bumdes: { connect: { id: bumdesId } },
          year: dto.year,
          otherPartiesAmount: dto.other_parties_funding.amount,
          otherPartiesPercentage: dto.other_parties_funding.percentage,
          rulesNumber: dto.rules_number,
          villageAmount: dto.village_government_funding.amount,
          villagePercentage: dto.village_government_funding.percentage,
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
          throw new BadRequestException('Invalid foreign key');
        }
      }
      throw error;
    }
  }

  async deleteHistory(
    bumdesId: string,
    historyId: string,
  ): Promise<DeleteBumdesFundingHistoryResponse> {
    try {
      const history = await this.prisma.bumdesFundingHistoryItem.delete({
        where: { id: historyId, bumdesId },
      });

      return {
        id: history.id,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('Invalid foreign key');
        }
      }
      throw error;
    }
  }

  async updateHistory(
    bumdesId: string,
    historyId: string,
    dto: UpdateBumdesFundingHistoryDto,
  ): Promise<UpdateBumdesFundingHistoryResponse> {
    try {
      const history = await this.prisma.bumdesFundingHistoryItem.update({
        where: { id: historyId, bumdesId },
        data: {
          year: dto.year,
          otherPartiesAmount: dto.other_parties_funding.amount,
          otherPartiesPercentage: dto.other_parties_funding.percentage,
          rulesNumber: dto.rules_number,
          villageAmount: dto.village_government_funding.amount,
          villagePercentage: dto.village_government_funding.percentage,
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
          throw new BadRequestException('Invalid foreign key');
        }
      }
      throw error;
    }
  }

  async getHistories(
    bumdesId: string,
  ): Promise<GetBumdesFundingHistoriesResponse> {
    try {
      const histories = await this.prisma.bumdesFundingHistoryItem.findMany({
        where: { bumdesId },
      });

      return {
        _count: histories.length,
        histories: histories.map((history) => ({
          id: history.id,
          year: history.year,
          rules_number: history.rulesNumber,
          other_parties_funding: {
            amount: history.otherPartiesAmount.toNumber(),
            percentage: history.otherPartiesPercentage.toNumber(),
          },
          village_government_funding: {
            amount: history.villageAmount.toNumber(),
            percentage: history.villagePercentage.toNumber(),
          },
        })),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('Invalid foreign key');
        }
      }
      throw error;
    }
  }
}
