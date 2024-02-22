import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '~lib/prisma/prisma.service';
import { UpdateBumdesOrganizationDto } from '../dto';
import { IBumdesOrganizationService } from '../interfaces';
import {
  GetBumdesOrganizationResponse,
  UpdateBumdesOrganizationResponse,
} from '../types';

@Injectable()
export class BumdesOrganizationService implements IBumdesOrganizationService {
  constructor(private prisma: PrismaService) {}

  async updateOrganization(
    bumdesId: string,
    dto: UpdateBumdesOrganizationDto,
  ): Promise<UpdateBumdesOrganizationResponse> {
    try {
      const bumdes = await this.prisma.bumdes.update({
        where: { id: bumdesId },
        data: {
          consultant: dto.consultant,
          leader: dto.core.leader,
          secretary: dto.core.secretary,
          treasurer: dto.core.treasurer,
          supervisor_leader: dto.supervisor?.leader,
          supervisor_secretary: dto.supervisor?.secretary,
          supervisor_treasurer: dto.supervisor?.treasurer,
        },
      });

      return {
        id: bumdes.id,
        updated_at: bumdes.updatedAt,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Bumdes not found');
        }
      }
      throw error;
    }
  }

  async getOrganization(
    bumdesId: string,
  ): Promise<GetBumdesOrganizationResponse> {
    const bumdes = await this.prisma.bumdes.findUnique({
      where: { id: bumdesId },
      select: {
        leader: true,
        secretary: true,
        treasurer: true,
        consultant: true,
        supervisor_leader: true,
        supervisor_secretary: true,
        supervisor_treasurer: true,
        units: {
          select: {
            name: true,
            leader: true,
            members: true,
          },
        },
      },
    });

    if (!bumdes) throw new NotFoundException('Bumdes not found');

    return {
      consultant: bumdes.consultant,
      core: {
        leader: bumdes.leader,
        secretary: bumdes.secretary,
        treasurer: bumdes.treasurer,
        units: bumdes.units.map((unit) => {
          return {
            name: unit.name,
            leader: unit.leader,
            members: unit.members,
          };
        }),
      },
      supervisor: {
        leader: bumdes.supervisor_leader,
        secretary: bumdes.supervisor_secretary,
        treasurer: bumdes.supervisor_treasurer,
      },
    };
  }
}
