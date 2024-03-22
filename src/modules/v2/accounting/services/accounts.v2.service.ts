import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '~lib/prisma/prisma.service';
import { GetAccountsV2Dto, GetSubGroupAccountsV2Dto } from '../dto';
import { AccountType } from '@prisma/client';
import {
  GetAccountsV2Response,
  GetSubGroupAccountsV2Response,
} from '../responses';

@Injectable()
export class AccountsV2Service {
  constructor(private prisma: PrismaService) {}

  async getAccounts(dto: GetAccountsV2Dto): Promise<GetAccountsV2Response> {
    let unitId: string | undefined = undefined;

    if (dto.unit_id) {
      const unit = await this.prisma.bumdesUnit.findUnique({
        where: { id: dto.unit_id },
        select: { id: true },
      });

      if (!unit) throw new NotFoundException('Unit not found');

      unitId = unit.id;
    }

    const accounts = await this.prisma.account.findMany({
      orderBy: { ref: 'asc' },
      cursor: dto.cursor ? { id: dto.cursor as number } : undefined,
      take: dto.limit,
      skip: dto.cursor ? 1 : 0,
      where: {
        ref: dto.ref ? { contains: dto.ref, mode: 'insensitive' } : undefined,
        businessTypes: dto.business_type
          ? { has: dto.business_type }
          : undefined,
        OR: [
          {
            type: AccountType.GLOBAL,
          },
          unitId
            ? {
                unitOwnerId: { equals: unitId },
                type: { equals: AccountType.CUSTOM },
              }
            : undefined,
        ],
      },
      select: {
        id: true,
        name: true,
        isCredit: true,
        ref: true,
        groupRef: true,
        subgroupRef: true,
        businessTypes: true,
      },
    });

    return {
      _count: accounts.length,
      next_cursor: accounts[accounts.length - 1]?.id,
      accounts: accounts.map((account) => ({
        id: account.id,
        name: account.name,
        is_credit: account.isCredit,
        ref: account.ref,
        group_ref: account.groupRef,
        subgroup_ref: account.subgroupRef,
        business_type: account.businessTypes,
      })),
    };
  }

  async getSubGroupAccounts(
    dto?: GetSubGroupAccountsV2Dto,
  ): Promise<GetSubGroupAccountsV2Response> {
    const subgroups = await this.prisma.accountSubgroup.findMany({
      orderBy: { ref: 'asc' },
      cursor: dto.cursor ? { id: dto.cursor as number } : undefined,
      take: dto.limit,
      skip: dto.cursor ? 1 : 0,
      where: {
        accounts: dto.business_type
          ? {
              some: {
                businessTypes: { has: dto.business_type },
              },
            }
          : undefined,
      },
    });

    return {
      _count: subgroups.length,
      next_cursor: subgroups[subgroups.length - 1]?.id,
      subgroups: subgroups.map((subgroup) => ({
        id: subgroup.id,
        name: subgroup.name,
        group_ref: subgroup.groupRef,
        ref: subgroup.ref,
      })),
    };
  }
}
