import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationDto } from '~common/dto';
import { PrismaService } from '~lib/prisma/prisma.service';
import { WtbFilterDto } from '../dto';
import {
  addAmountToSection,
  assignLaporanKeuangan,
  calculateNeracaSetelahnya,
  isPosisiKeuanganAccount,
  switchSectionIfNegativeNumber,
} from '../helpers';
import { IWtbService } from '../interfaces';
import { WtbAccountItem, WtbAccountResult, WtbJournalItem } from '../types';
import { GetWtbResponse, GetWtbSummaryResponse } from '../types/responses';

@Injectable()
export class WtbService implements IWtbService {
  constructor(private prisma: PrismaService) {}

  async getWtbForUnit(
    unitId: string,
    filter?: WtbFilterDto,
    pagination?: PaginationDto,
  ): Promise<GetWtbResponse> {
    const { end_occured_at, start_occured_at } = filter;

    const paginationQuery: Prisma.AccountFindManyArgs = {
      cursor: pagination?.cursor
        ? { id: Number(pagination.cursor) }
        : undefined,
      take: pagination?.limit ? Number(pagination.limit) : undefined,
    };

    const accounts = await this.prisma.account.findMany({
      ...paginationQuery,
    });

    const journals = await this.prisma.journal.findMany({
      where: {
        bumdesUnitId: unitId,
        occuredAt: {
          gte: start_occured_at,
          lte: end_occured_at,
        },
      },
      include: {
        items: true,
      },
    });

    // Loop through all accounts
    const accountDatas: WtbAccountItem[] = accounts.map((account) => {
      // Initialize result object
      const result: WtbAccountResult = {
        neraca_saldo: { credit: 0, debit: 0 },
        penyesuaian: { credit: 0, debit: 0 },
        neraca_setelahnya: { credit: 0, debit: 0 },
        laba_rugi: { credit: 0, debit: 0 },
        posisi_keuangan: { credit: 0, debit: 0 },
      };
      const {
        laba_rugi,
        neraca_saldo,
        neraca_setelahnya,
        penyesuaian,
        posisi_keuangan,
      } = result;

      // Loop through all journals and filter items that match the account
      const journalItems: WtbJournalItem[] = journals.flatMap((journal) => {
        const items = journal.items.filter(
          (item) => item.accountId === account.id,
        );

        return items.map((item) => ({
          id: item.id,
          amount: item.amount,
          isCredit: item.isCredit,
          accountId: item.accountId,
          isAdjustment: journal.category === 'ADJUSTMENT',
        }));
      });

      // Loop through all journal items and calculate the total amount
      journalItems.forEach((item) => {
        const { amount, isCredit: isItemCredit, isAdjustment } = item;

        // If the item is an adjustment, add the amount to the penyesuaian result
        if (isAdjustment) {
          addAmountToSection(
            penyesuaian,
            amount.toNumber(),
            account.isCredit,
            isItemCredit,
          );
        } else {
          addAmountToSection(
            neraca_saldo,
            amount.toNumber(),
            account.isCredit,
            isItemCredit,
          );
        }
      });

      switchSectionIfNegativeNumber(neraca_saldo);
      switchSectionIfNegativeNumber(penyesuaian);

      calculateNeracaSetelahnya({
        neraca_saldo,
        penyesuaian,
        neraca_setelahnya,
        isAccountCredit: account.isCredit,
      });

      switchSectionIfNegativeNumber(neraca_setelahnya);

      assignLaporanKeuangan({
        groupRef: account.groupRef,
        neraca_setelahnya,
        laba_rugi,
        posisi_keuangan,
      });

      return {
        account: {
          id: account.id,
          name: account.name,
          is_credit: account.isCredit,
          ref: account.ref,
          is_posisi_keuangan: isPosisiKeuanganAccount(account.groupRef),
        },
        result,
      };
    });

    return {
      accounts: accountDatas,
    };
  }

  async getWtbSummary(
    unitId: string,
    filter?: WtbFilterDto,
  ): Promise<GetWtbSummaryResponse> {
    const result = await this.getWtbForUnit(unitId, filter);

    result.accounts.forEach((account) => {});

    throw new Error('Method not implemented.');
  }
}
