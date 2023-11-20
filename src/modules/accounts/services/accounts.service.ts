import { Injectable } from '@nestjs/common';
import { IAccountsService } from '../interfaces';
import { $Enums, Account, Prisma } from '@prisma/client';
import { PaginationDto } from '~common/dto';
import { AccountsFiltersDto } from '../dto';
import { PrismaService } from '~lib/prisma/prisma.service';
import { AccountsFindAllResponse } from '../types/responses';

@Injectable()
export class AccountsService implements IAccountsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    filters: AccountsFiltersDto,
    pagination?: PaginationDto,
  ): Promise<AccountsFindAllResponse> {
    const { business_types, group_ref, name, ref } = filters;
    const { cursor, limit } = pagination;

    const paginationQuery: Prisma.AccountFindManyArgs = {
      cursor: cursor ? { id: String(cursor) } : undefined,
      take: limit ? limit : undefined,
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
