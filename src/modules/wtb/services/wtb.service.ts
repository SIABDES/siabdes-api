import { Injectable, NotFoundException } from '@nestjs/common';
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
    const { end_occurred_at, start_occurred_at } = filter;

    const unit = await this.prisma.bumdesUnit.findUnique({
      where: { id: unitId },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found.');
    }

    const paginationQuery: Prisma.AccountFindManyArgs = {
      cursor: pagination?.cursor
        ? { id: Number(pagination.cursor) }
        : undefined,
      take: pagination?.limit ? Number(pagination.limit) : undefined,
    };

    const accounts = await this.prisma.account.findMany({
      ...paginationQuery,
      where: {
        businessTypes: { has: unit.businessType },
      },
    });

    const journals = await this.prisma.journal.findMany({
      where: {
        bumdesUnitId: unitId,
        deletedAt: null,
        occurredAt: {
          gte: start_occurred_at,
          lte: end_occurred_at,
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

      const account_ref = account.ref.split('-')[1];

      return {
        account: {
          id: account.id,
          name: account.name,
          is_credit: account.isCredit,
          ref: {
            group_ref: account.groupRef,
            account_ref,
            complete_ref: account.ref,
          },
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
    const summaryResult: GetWtbSummaryResponse = {
      sum: {
        laba_rugi: { credit: 0, debit: 0 },
        neraca_saldo: { credit: 0, debit: 0 },
        neraca_setelahnya: { credit: 0, debit: 0 },
        penyesuaian: { credit: 0, debit: 0 },
        posisi_keuangan: { credit: 0, debit: 0 },
      },
      laba_rugi_bersih: {
        laba_rugi: { credit: 0, debit: 0 },
        posisi_keuangan: { credit: 0, debit: 0 },
      },
      total: {
        laba_rugi: { credit: 0, debit: 0 },
        neraca_saldo: { credit: 0, debit: 0 },
        neraca_setelahnya: { credit: 0, debit: 0 },
        penyesuaian: { credit: 0, debit: 0 },
        posisi_keuangan: { credit: 0, debit: 0 },
      },
    };

    const wtbResult = await this.getWtbForUnit(unitId, filter);

    wtbResult.accounts.forEach((account) => {
      // Jumlah or Summary
      summaryResult.sum.neraca_saldo.credit +=
        account.result.neraca_saldo.credit;
      summaryResult.sum.neraca_saldo.debit += account.result.neraca_saldo.debit;

      summaryResult.sum.penyesuaian.credit += account.result.penyesuaian.credit;
      summaryResult.sum.penyesuaian.debit += account.result.penyesuaian.debit;

      summaryResult.sum.neraca_setelahnya.credit +=
        account.result.neraca_setelahnya.credit;
      summaryResult.sum.neraca_setelahnya.debit +=
        account.result.neraca_setelahnya.debit;

      summaryResult.sum.laba_rugi.credit += account.result.laba_rugi.credit;
      summaryResult.sum.laba_rugi.debit += account.result.laba_rugi.debit;

      summaryResult.sum.posisi_keuangan.credit +=
        account.result.posisi_keuangan.credit;
      summaryResult.sum.posisi_keuangan.debit +=
        account.result.posisi_keuangan.debit;
    });

    // Laba Rugi Bersih
    summaryResult.laba_rugi_bersih.laba_rugi.credit =
      summaryResult.sum.laba_rugi.credit - summaryResult.sum.laba_rugi.debit;
    switchSectionIfNegativeNumber(summaryResult.laba_rugi_bersih.laba_rugi);

    summaryResult.laba_rugi_bersih.posisi_keuangan.credit =
      summaryResult.sum.posisi_keuangan.credit -
      summaryResult.sum.posisi_keuangan.debit;
    switchSectionIfNegativeNumber(
      summaryResult.laba_rugi_bersih.posisi_keuangan,
    );

    // Total
    summaryResult.total.neraca_saldo.credit =
      summaryResult.sum.neraca_saldo.credit;
    summaryResult.total.neraca_saldo.debit =
      summaryResult.sum.neraca_saldo.debit;

    summaryResult.total.penyesuaian.credit =
      summaryResult.sum.penyesuaian.credit;
    summaryResult.total.penyesuaian.debit = summaryResult.sum.penyesuaian.debit;

    summaryResult.total.neraca_setelahnya.credit =
      summaryResult.sum.neraca_setelahnya.credit;
    summaryResult.total.neraca_setelahnya.debit =
      summaryResult.sum.neraca_setelahnya.debit;

    summaryResult.total.laba_rugi.credit =
      summaryResult.laba_rugi_bersih.laba_rugi.credit +
      summaryResult.sum.laba_rugi.credit;
    summaryResult.total.laba_rugi.debit =
      summaryResult.laba_rugi_bersih.laba_rugi.debit +
      summaryResult.sum.laba_rugi.debit;

    summaryResult.total.posisi_keuangan.credit =
      summaryResult.laba_rugi_bersih.posisi_keuangan.credit +
      summaryResult.sum.posisi_keuangan.credit;
    summaryResult.total.posisi_keuangan.debit =
      summaryResult.laba_rugi_bersih.posisi_keuangan.debit +
      summaryResult.sum.posisi_keuangan.debit;

    return summaryResult;
  }
}
