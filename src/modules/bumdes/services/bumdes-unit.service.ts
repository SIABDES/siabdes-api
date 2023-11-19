import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthUserRole, Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '~lib/prisma/prisma.service';
import { CreateBumdesUnitDto } from '../dto';
import { IBumdesUnitService } from '../interfaces';
import {
  BumdesCreateUnitResponse,
  BumdesDeleteUnitResponse,
  BumdesGetUnitResponse,
  BumdesGetUnitsResponse,
} from '../types';

@Injectable()
export class BumdesUnitService implements IBumdesUnitService {
  constructor(private prisma: PrismaService) {}

  async getBumdesUnits(bumdesId: string): Promise<BumdesGetUnitsResponse> {
    const units = await this.prisma.bumdesUnit.findMany({
      where: {
        bumdesId,
      },
      select: {
        _count: true,
        id: true,
        businessType: true,
        name: true,
      },
    });

    const result: BumdesGetUnitsResponse = {
      _count: units.length,
      units: units.map((unit) => ({
        id: unit.id,
        name: unit.name,
        business_type: unit.businessType,
      })),
    };

    return result;
  }

  async getBumdesUnitById(
    bumdesId: string,
    unitId: string,
  ): Promise<BumdesGetUnitResponse> {
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

  async deleteUnitById(
    bumdesId: string,
    unitId: string,
  ): Promise<BumdesDeleteUnitResponse> {
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

  async createUnit(
    data: CreateBumdesUnitDto,
    bumdesId: string,
  ): Promise<BumdesCreateUnitResponse> {
    const { name, business_type, credentials } = data;

    const hashedPassword = await argon2.hash(credentials.password);

    try {
      const unit = await this.prisma.bumdesUnit.create({
        data: {
          name,
          businessType: business_type,
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
}
