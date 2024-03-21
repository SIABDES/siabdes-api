import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '~lib/prisma/prisma.service';
import { AddBumdesV2Dto, GetManyBumdesV2Dto } from '../dto';
import {
  AddBumdesV2Response,
  DeleteBumdesV2Response,
  GetBumdesDetailsV2Response,
  GetManyBumdesV2Response,
} from '../responses';
import * as argon2 from 'argon2';
import { AuthUserRole, Prisma } from '@prisma/client';
import { PrismaClientExceptionCode } from '~common/exceptions';
import { CommonDeleteDto } from '~common/dto';

@Injectable()
export class BumdesV2Service {
  constructor(private prisma: PrismaService) {}

  async create(dto: AddBumdesV2Dto): Promise<AddBumdesV2Response> {
    try {
      const hashedPassword = await argon2.hash(dto.password);

      const bumdes = await this.prisma.bumdes.create({
        data: {
          name: dto.bumdes.name,
          phone: dto.bumdes.phone,
          leader: dto.organization.leader,
          secretary: dto.organization.secretary,
          treasurer: dto.organization.treasurer,
          province: dto.bumdes.address.province,
          regency: dto.bumdes.address.regency,
          district: dto.bumdes.address.district,
          village: dto.bumdes.address.village,
          postalCode: dto.bumdes.address.postal_code,
          completeAddress: dto.bumdes.address.complete_address,
          users: {
            create: {
              identifier: dto.identifier,
              password: hashedPassword,
              role: AuthUserRole.BUMDES,
            },
          },
        },
        select: { id: true, createdAt: true },
      });

      return {
        id: bumdes.id,
        created_at: bumdes.createdAt,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaClientExceptionCode.UNIQUE_CONSTRAINT_FAILED) {
          throw new BadRequestException('Email sudah terdaftar');
        }
      }
      throw error;
    }
  }

  async findMany(dto: GetManyBumdesV2Dto): Promise<GetManyBumdesV2Response> {
    const bumdes = await this.prisma.bumdes.findMany({
      orderBy: { name: 'asc' },
      skip: dto.cursor ? 1 : 0,
      take: dto.limit ?? undefined,
      cursor: dto.cursor ? { id: dto.cursor as string } : undefined,
      where: {
        deletedAt: { equals: null },
        name: dto.name
          ? { contains: dto.name, mode: 'insensitive' }
          : undefined,
        phone: dto.phone ? { contains: dto.phone } : undefined,

        province: dto.address_province
          ? { contains: dto.address_province, mode: 'insensitive' }
          : undefined,
        regency: dto.address_regency
          ? { contains: dto.address_regency, mode: 'insensitive' }
          : undefined,
        district: dto.address_district
          ? { contains: dto.address_district, mode: 'insensitive' }
          : undefined,
        village: dto.address_village
          ? { contains: dto.address_village, mode: 'insensitive' }
          : undefined,
        postalCode: dto.address_postal_code
          ? { contains: dto.address_postal_code }
          : undefined,

        leader: dto.organization_leader
          ? { contains: dto.organization_leader, mode: 'insensitive' }
          : undefined,
        secretary: dto.organization_secretary
          ? { contains: dto.organization_secretary, mode: 'insensitive' }
          : undefined,
        treasurer: dto.organization_treasurer
          ? { contains: dto.organization_treasurer, mode: 'insensitive' }
          : undefined,
      },
    });

    return {
      _count: bumdes.length,
      bumdes: bumdes.map((bumdes) => ({
        id: bumdes.id,
        name: bumdes.name,
        phone: bumdes.phone,
        created_at: bumdes.createdAt,
        address: {
          province: bumdes.province,
          regency: bumdes.regency,
          district: bumdes.district,
          village: bumdes.village,
          postal_code: bumdes.postalCode,
          complete_address: bumdes.completeAddress,
        },
      })),
    };
  }

  async findById(id: string): Promise<GetBumdesDetailsV2Response> {
    const bumdes = await this.prisma.bumdes.findUnique({
      where: { id, deletedAt: { equals: null } },
    });

    if (!bumdes) throw new NotFoundException('Bumdes tidak ditemukan');

    return {
      id: bumdes.id,
      name: bumdes.name,
      phone: bumdes.phone,
      created_at: bumdes.createdAt,
      address: {
        province: bumdes.province,
        regency: bumdes.regency,
        district: bumdes.district,
        village: bumdes.village,
        postal_code: bumdes.postalCode,
        complete_address: bumdes.completeAddress,
      },
      organization: {
        leader: bumdes.leader,
        secretary: bumdes.secretary,
        treasurer: bumdes.treasurer,
      },
    };
  }

  async softDeleteById(id: string): Promise<DeleteBumdesV2Response> {
    try {
      const bumdes = await this.prisma.bumdes.update({
        where: { id, deletedAt: null },
        data: { deletedAt: new Date() },
        select: { id: true, deletedAt: true },
      });

      return {
        id: bumdes.id,
        deleted_at: bumdes.deletedAt,
        hard_delete: false,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (
          error.code ===
          PrismaClientExceptionCode.OPERATION_FAILED_RECORD_NOT_FOUND
        ) {
          throw new NotFoundException('Bumdes tidak ditemukan');
        }
      }
      throw error;
    }
  }

  async hardDeleteById(
    id: string,
    dto: CommonDeleteDto,
  ): Promise<DeleteBumdesV2Response> {
    try {
      const bumdes = await this.prisma.bumdes.delete({
        where: { id, deletedAt: dto.hard_delete ? { not: null } : undefined },
        select: { id: true, deletedAt: true },
      });

      return {
        id: bumdes.id,
        deleted_at: bumdes.deletedAt,
        hard_delete: true,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (
          error.code ===
          PrismaClientExceptionCode.OPERATION_FAILED_RECORD_NOT_FOUND
        ) {
          throw new NotFoundException('Bumdes tidak ditemukan');
        }
      }
      throw error;
    }
  }
}
