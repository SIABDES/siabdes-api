import { Injectable, NotFoundException } from '@nestjs/common';
import { IUnitProfileService } from '../interfaces';
import { PrismaService } from '~lib/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  GetUnitProfileResponse,
  UpdateUnitProfileResponse,
} from '../types/responses';
import { UpdateUnitProfileDto } from '../dto';

@Injectable()
export class UnitProfileService implements IUnitProfileService {
  constructor(private prisma: PrismaService) {}

  async updateUnitProfile(
    unitId: string,
    dto: UpdateUnitProfileDto,
  ): Promise<UpdateUnitProfileResponse> {
    try {
      const unit = await this.prisma.bumdesUnit.update({
        where: { id: unitId },
        data: {
          address: dto.address,
          leader: dto.organization.leader,
          members: dto.organization.members,
          description: dto.description,
          name: dto.name,
          phoneNumber: dto.phone,
          thirdPartyPartners: dto.third_party_partners,
          foundedAt: dto.founded_at,
        },
      });

      return {
        id: unit.id,
        updatedAt: unit.updatedAt,
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

  async getUnitProfile(unitId: string): Promise<GetUnitProfileResponse> {
    try {
      const unit = await this.prisma.bumdesUnit.findUnique({
        where: { id: unitId },
      });

      if (!unit) {
        throw new NotFoundException('Unit not found');
      }

      return {
        address: unit.address,
        business_type: unit.businessType,
        description: unit.description,
        founded_at: unit.foundedAt,
        name: unit.name,
        phone: unit.phoneNumber,
        third_party_partners: unit.thirdPartyPartners,
        organization: {
          leader: unit.leader,
          members: unit.members,
        },
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
