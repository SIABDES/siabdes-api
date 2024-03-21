import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '~lib/prisma/prisma.service';
import { AddUnitV2Dto, GetManyUnitsV2Dto } from '../dto';
import {
  AddUnitV2Response,
  DeleteUnitV2Response,
  GetManyUnitsV2Response,
  GetUnitDetailsV2Response,
} from '../responses';
import * as argon2 from 'argon2';
import { AuthUserRole, Prisma } from '@prisma/client';
import { PrismaClientExceptionCode } from '~common/exceptions';
import { CommonDeleteDto } from '~common/dto';

@Injectable()
export class UnitV2Service {
  constructor(private prisma: PrismaService) {}

  async create(dto: AddUnitV2Dto): Promise<AddUnitV2Response> {
    if (!dto.bumdes_id) throw new BadRequestException('Bumdes ID is required');

    const hashedPassword = await argon2.hash(dto.credentials.password);

    try {
      const unit = await this.prisma.bumdesUnit.create({
        data: {
          name: dto.name,
          description: dto.description,
          businessType: dto.business_type,
          address: dto.address,
          leader: dto.leader,
          phoneNumber: dto.phone_number,
          bumdes: { connect: { id: dto.bumdes_id } },
          user: {
            create: {
              identifier: dto.credentials.identifier,
              password: hashedPassword,
              role: AuthUserRole.UNIT,
              bumdes: { connect: { id: dto.bumdes_id } },
            },
          },
        },
        select: { id: true, createdAt: true },
      });

      return {
        id: unit.id,
        created_at: unit.createdAt,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaClientExceptionCode.UNIQUE_CONSTRAINT_FAILED) {
          throw new BadRequestException('Username already taken');
        }
      }
      throw error;
    }
  }

  async findMany(dto: GetManyUnitsV2Dto): Promise<GetManyUnitsV2Response> {
    const units = await this.prisma.bumdesUnit.findMany({
      where: {
        bumdesId: dto.bumdes_id ? dto.bumdes_id : undefined,
        deletedAt: { equals: null },
      },
      select: { id: true, name: true, businessType: true, createdAt: true },
    });

    return {
      _count: units.length,
      units: units.map((unit) => ({
        id: unit.id,
        name: unit.name,
        business_type: unit.businessType,
        created_at: unit.createdAt,
      })),
    };
  }

  async findById(id: string): Promise<GetUnitDetailsV2Response> {
    const unit = await this.prisma.bumdesUnit.findUnique({
      where: { id, deletedAt: { equals: null } },
    });

    if (!unit) throw new NotFoundException('Unit not found');

    return {
      id: unit.id,
      name: unit.name,
      description: unit.description,
      business_type: unit.businessType,
      leader: unit.leader,
      phone_number: unit.phoneNumber,
      address: unit.address,
      created_at: unit.createdAt,
    };
  }

  async softDeleteById(id: string): Promise<DeleteUnitV2Response> {
    try {
      const unit = await this.prisma.bumdesUnit.update({
        where: { id, deletedAt: { equals: null } },
        data: { deletedAt: new Date() },
        select: { id: true, deletedAt: true },
      });

      return {
        id: unit.id,
        deleted_at: unit.deletedAt,
        hard_delete: false,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaClientExceptionCode.RECORD_NOT_FOUND) {
          throw new NotFoundException('Unit not found');
        }
      }
      throw error;
    }
  }

  async hardDeleteById(
    id: string,
    dto: CommonDeleteDto,
  ): Promise<DeleteUnitV2Response> {
    try {
      const unit = await this.prisma.bumdesUnit.delete({
        where: { id, deletedAt: dto.force ? undefined : { not: null } },
        select: { id: true, deletedAt: true },
      });

      return {
        id: unit.id,
        deleted_at: unit.deletedAt || new Date(),
        hard_delete: true,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaClientExceptionCode.RECORD_NOT_FOUND) {
          throw new NotFoundException('Unit not found');
        }
        if (
          error.code ===
          PrismaClientExceptionCode.OPERATION_FAILED_RECORD_NOT_FOUND
        ) {
          throw new NotFoundException('Unit not found');
        }
      }
      throw error;
    }
  }
}
