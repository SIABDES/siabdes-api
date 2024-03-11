import { Injectable, NotFoundException } from '@nestjs/common';
import { Account, Prisma } from '@prisma/client';
import { OptionalPaginationDto } from '~common/dto';
import { PrismaService } from '~lib/prisma/prisma.service';
import { AccountsFiltersDto } from '../dto';
import { IAccountsService } from '../interfaces';
import {
  AccountsFindAllResponse,
  AccountsFindAllSubgroupsResponse,
} from '../types/responses';

@Injectable()
export class AccountsService implements IAccountsService {
  constructor(private prisma: PrismaService) {}

  async findById(id: number): Promise<Account> {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });

    if (!account) throw new NotFoundException('Account not found');

    return account;
  }

  async findAllSubgroups(): Promise<AccountsFindAllSubgroupsResponse> {
    const subgroups = await this.prisma.accountSubgroup.findMany({
      include: {
        group: true,
      },
    });

    return {
      _count: subgroups.length,
      subgroups: subgroups.map((subgroup) => ({
        id: subgroup.id,
        name: subgroup.name,
        slug: subgroup.slug,
        group_ref: subgroup.groupRef,
        ref: subgroup.ref,
      })),
    };
  }

  async findAll(
    filters: AccountsFiltersDto,
    unitId?: string,
    pagination?: OptionalPaginationDto,
  ): Promise<AccountsFindAllResponse> {
    if (unitId) {
      const unit = await this.prisma.bumdesUnit.findUnique({
        where: { id: unitId },
      });

      if (!unit) throw new NotFoundException('Unit not found');

      filters.business_types = [unit.businessType];
    }

    const { business_types, group_ref, name, ref } = filters;

    const paginationQuery: Prisma.AccountFindManyArgs = {
      cursor: pagination?.cursor
        ? { id: Number(pagination?.cursor) }
        : undefined,
      take: pagination?.limit ? pagination?.limit : undefined,
    };

    const results = await this.prisma.account.findMany({
      ...paginationQuery,
      where: {
        name: name ? { contains: name } : undefined,
        ref: ref ? { contains: ref } : undefined,
        groupRef: group_ref ? { contains: group_ref } : undefined,
        businessTypes:
          business_types?.length > 0
            ? {
                hasSome: business_types,
              }
            : undefined,
      },
      select: {
        id: true,
        groupRef: true,
        subgroupRef: true,
        ref: true,
        businessTypes: true,
        isCredit: true,
        name: true,
        slug: true,
      },
    });

    return {
      _count: results.length,
      accounts: results.map((result) => ({
        id: result.id,
        group_ref: result.groupRef,
        subggroup_ref: result.subgroupRef,
        ref: result.ref,
        business_type: result.businessTypes,
        name: result.name,
        slug: result.slug,
        is_credit: result.isCredit,
      })),
    };
  }
}
