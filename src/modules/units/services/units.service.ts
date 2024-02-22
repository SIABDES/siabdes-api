import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthUserRole, Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '~lib/prisma/prisma.service';
import { CreateUnitDto } from '../dto';
import { IUnitsService } from '../interfaces';
import { GetUnit } from '../types';
import {
  CreateUnitResponse,
  DeleteUnitResponse,
  GetUnitMetadataResponse,
  GetUnitsResponse,
} from '../types/responses';
import { PaginationDto } from '~common/dto';

@Injectable()
export class UnitsService implements IUnitsService {
  constructor(private prisma: PrismaService) {}

  async getUnitMetadata(unitId: string): Promise<GetUnitMetadataResponse> {
    const unit = await this.prisma.bumdesUnit.findUnique({
      where: { id: unitId },
      select: {
        createdAt: true,
      },
    });

    if (!unit) {
      throw new NotFoundException('Unit tidak ditemukan');
    }

    const firstJournal = await this.prisma.journal.findFirst({
      where: {
        bumdesUnitId: unitId,
      },
      orderBy: { occurredAt: 'asc' },
      select: {
        id: true,
        category: true,
        occurredAt: true,
        description: true,
      },
    });

    return {
      created_at: unit.createdAt,
      journals: {
        first_journal: firstJournal && {
          id: firstJournal.id,
          description: firstJournal.description,
          category: firstJournal.category,
          occurred_at: firstJournal.occurredAt,
        },
      },
    };
  }

  async createUnit(
    data: CreateUnitDto,
    bumdesId: string,
  ): Promise<CreateUnitResponse> {
    const { name, business_type, credentials, address, phone_number, leader } =
      data;

    const hashedPassword = await argon2.hash(credentials.password);

    try {
      const unit = await this.prisma.bumdesUnit.create({
        data: {
          name,
          businessType: business_type,
          address,
          phoneNumber: phone_number,
          leader,
          bumdes: {
            connect: {
              id: bumdesId,
            },
          },
          user: {
            create: {
              identifier: credentials.identifier,
              password: hashedPassword,
              role: AuthUserRole.UNIT,
              bumdes: {
                connect: {
                  id: bumdesId,
                },
              },
            },
          },
        },
      });

      return {
        unitId: unit.id,
        bumdesId: unit.bumdesId,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Identifier sudah digunakan');
        }
      }
      throw error;
    }
  }

  async deleteUnitById(
    bumdesId: string,
    unitId: string,
  ): Promise<DeleteUnitResponse> {
    try {
      const result = await this.prisma.bumdesUnit.delete({
        where: {
          id: unitId,
          bumdesId,
        },
      });

      return {
        unitId: result.id,
        bumdesId: result.bumdesId,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Unit tidak ditemukan');
        }
      }
    }
  }

  async getUnits(
    bumdesId: string,
    pagination?: PaginationDto,
  ): Promise<GetUnitsResponse> {
    const paginationQuery: Prisma.BumdesUnitFindManyArgs = {
      cursor: pagination.cursor ? { id: String(pagination.cursor) } : undefined,
      take: pagination?.limit,
      skip: pagination?.cursor ? 1 : undefined,
    };

    const units = await this.prisma.bumdesUnit.findMany({
      ...paginationQuery,
      where: {
        bumdesId,
      },
      select: {
        _count: true,
        id: true,
        businessType: true,
        name: true,
        createdAt: true,
      },
    });

    return {
      _count: units.length,
      next_cursor: units.length > 1 ? units[units.length - 1].id : undefined,
      units: units.map((unit) => ({
        id: unit.id,
        name: unit.name,
        business_type: unit.businessType,
        created_at: unit.createdAt.toISOString(),
      })),
    };
  }

  async getUnitById(bumdesId: string, unitId: string): Promise<GetUnit> {
    try {
      const unit = await this.prisma.bumdesUnit.findUnique({
        where: {
          id: unitId,
          bumdesId,
        },
      });

      return {
        id: unit.id,
        name: unit.name,
        business_type: unit.businessType,
        created_at: unit.createdAt.toISOString(),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Unit tidak ditemukan');
        }
      }

      throw error;
    }
  }
}
