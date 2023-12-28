import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '~lib/prisma/prisma.service';
import { UpdateBumdesProfileDto } from '../dto';
import { IBumdesProfileService } from '../interfaces';
import {
  GetBumdesProfileResponse,
  UpdateBumdesProfileResponse,
} from '../types';

@Injectable()
export class BumdesProfileService implements IBumdesProfileService {
  constructor(private prisma: PrismaService) {}

  async updateProfile(
    bumdesId: string,
    dto: UpdateBumdesProfileDto,
  ): Promise<UpdateBumdesProfileResponse> {
    try {
      const bumdes = await this.prisma.bumdes.update({
        where: { id: bumdesId },
        data: {
          name: dto.name,
          completeAddress: dto.complete_address,
          phone: dto.phone,
          foundedAt: dto.founded_at,

          bankName: dto.bank?.name,
          bankAccount: dto.bank?.account_number,

          facebook: dto.socials?.facebook,
          twitter: dto.socials?.twitter,
          instagram: dto.socials?.instagram,
          website: dto.socials?.website,
          otherSocials: dto.socials?.other_socials,

          initialCapitalParticipation: dto.capital_participation?.initial,
          additionalCapitalParticipation: dto.capital_participation?.additional,

          npwpNumber: dto.npwp_number,

          villageRuleNumber: dto.village_rule_number,
          skAdministratorNumber: dto.sk_administrator_number,
          skAdministratorDate: dto.sk_administrator_date,
          skAssistantNumber: dto.sk_assistant_number,
          skAssistantDate: dto.sk_assistant_date,
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

  async getProfile(bumdesId: string): Promise<GetBumdesProfileResponse> {
    const bumdes = await this.prisma.bumdes.findUnique({
      where: { id: bumdesId },
      include: {
        users: {
          where: { role: 'BUMDES' },
        },
      },
    });

    if (!bumdes) throw new NotFoundException('Bumdes not found');

    if (bumdes.users.length <= 0)
      throw new BadRequestException(
        'Orphan Bumdes. Bumdes without user that has role BUMDes. Please contact administrator',
      );

    return {
      name: bumdes.name,
      email: bumdes.users[0].identifier,
      founded_at: bumdes.foundedAt,
      phone: bumdes.phone,
      complete_address: bumdes.completeAddress,
      bank: {
        name: bumdes.bankName,
        account_number: bumdes.bankAccount,
      },
      capital_participation: {
        initial: bumdes.initialCapitalParticipation?.toNumber() ?? null,
        additional: bumdes.additionalCapitalParticipation?.toNumber() ?? null,
      },
      socials: {
        facebook: bumdes.facebook,
        twitter: bumdes.twitter,
        instagram: bumdes.instagram,
        website: bumdes.website,
        other_socials: bumdes.otherSocials,
      },
      npwp_number: bumdes.npwpNumber,
      village_rule_number: bumdes.villageRuleNumber,
      sk_administrator_number: bumdes.skAdministratorNumber,
      sk_administrator_date: bumdes.skAdministratorDate,
      sk_assistant_number: bumdes.skAssistantNumber,
      sk_assistant_date: bumdes.skAssistantDate,
    };
  }
}
