import { Injectable, NotFoundException } from '@nestjs/common';
import { Account, Prisma } from '@prisma/client';
import { PaginationDto } from '~common/dto';
import { PrismaService } from '~lib/prisma/prisma.service';
import { AccountsFiltersDto } from '../dto';
import { IAccountsService } from '../interfaces';
import { AccountsFindAllResponse } from '../types/responses';

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

  async findAll(
    filters: AccountsFiltersDto,
    pagination?: PaginationDto,
  ): Promise<AccountsFindAllResponse> {
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
        ref: result.ref,
        business_type: result.businessTypes,
        name: result.name,
        slug: result.slug,
        is_credit: result.isCredit,
      })),
    };
  }
}
