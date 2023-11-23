import { Injectable } from '@nestjs/common';
import { IWtbService } from '../interfaces';
import { GetWtbResponse, GetWtbSummaryResponse } from '../types/responses';
import { PrismaService } from '~lib/prisma/prisma.service';
import { WtbFilterDto } from '../dto';
import { PaginationDto } from '~common/dto';
import { Journal, JournalItem, Prisma } from '@prisma/client';
import {
  WtbAccountItem,
  WtbAccountItemDetails,
  WtbAccountResult,
  WtbJournalItem,
} from '../types';
import { WTB_POSISI_KEUANGAN_ACCOUNT_REFS } from '../constants';

@Injectable()
export class WtbService implements IWtbService {
  constructor(private prisma: PrismaService) {}

  async getWtbSummary(
    unitId: string,
    filter?: WtbFilterDto,
  ): Promise<GetWtbSummaryResponse> {
    throw new Error('Method not implemented.');
  }

  async getWtbForUnit(
    unitId: string,
    filter?: WtbFilterDto,
    pagination?: PaginationDto,
  ): Promise<GetWtbResponse> {
    const paginationQuery: Prisma.AccountFindManyArgs = {
      cursor: pagination?.cursor
        ? { id: parseInt(pagination.cursor.toString()) }
        : undefined,
      skip: pagination?.cursor ? 1 : undefined,
      take: pagination?.limit,
    };

    const accounts = await this.prisma.account.findMany({
      ...paginationQuery,
      include: {
        journalItems: {
          where: {
            journal: {
              bumdesUnitId: unitId,
              occuredAt: {
                gte: filter?.start_occured_at,
                lte: filter?.end_occured_at,
              },
            },
          },
        },
      },
    });

    const journalIds: string[] = accounts.reduce((acc, account) => {
      return [...acc, ...account.journalItems.map((item) => item.journalId)];
    }, []);

    const journals = await this.prisma.journal.findMany({
      where: {
        bumdesUnitId: unitId,
        occuredAt: {
          gte: filter?.start_occured_at,
          lte: filter?.end_occured_at,
        },
        id: { in: journalIds },
      },
      select: { id: true, category: true },
    });

    const items: WtbAccountItem[] = accounts.map((account) => {
      const isPosisiKeuangan = this.checkIsPosisiKeuangan(account.groupRef);

      const result: WtbAccountResult = {
        neraca_saldo: {
          credit: 0,
          debit: 0,
        },
        penyesuaian: {
          credit: 0,
          debit: 0,
        },
        neraca_setelahnya: {
          credit: 0,
          debit: 0,
        },
        laba_rugi: {
          credit: 0,
          debit: 0,
        },
        posisi_keuangan: {
          credit: 0,
          debit: 0,
        },
      };

      const journalItems: WtbJournalItem[] = account.journalItems.map(
        (item) => {
          const journal = journals.find(
            (journal) => journal.id === item.journalId,
          );

          if (!journal) {
            return;
          }

          return {
            id: item.id,
            accountId: item.accountId,
            isCredit: item.isCredit,
            amount: item.amount,
            isAdjustment: journal.category === 'ADJUSTMENT',
          };
        },
      );

      journalItems.forEach((item) => {
        this.assignNeracaForJurnalItem(result, item);

        console.log({ result, item });
      });

      this.updateNeracaSaldoAndPenyesuaian(result, account.isCredit);

      this.updateNeracaSetelahnya(result, account.isCredit);

      this.switchNegativeNumber(result);

      this.assignLaporanKeuangan(result, isPosisiKeuangan);

      console.log({ result });

      return {
        account: {
          id: account.id,
          name: account.name,
          ref: account.ref,
          is_credit: account.isCredit,
        },
        result,
      };
    });

    return {
      accounts: items,
    };
  }

  private checkIsPosisiKeuangan(groupRef: string): boolean {
    return WTB_POSISI_KEUANGAN_ACCOUNT_REFS.includes(groupRef);
  }

  private assignNeracaForJurnalItem(
    currentResult: WtbAccountResult,
    item: WtbJournalItem,
  ) {
    if (item.isAdjustment) {
      currentResult.penyesuaian.credit = item.isCredit
        ? item.amount.add(currentResult.penyesuaian.credit).toNumber()
        : currentResult.penyesuaian.credit;

      currentResult.penyesuaian.debit = item.isCredit
        ? currentResult.penyesuaian.debit
        : item.amount.add(currentResult.penyesuaian.debit).toNumber();
    } else {
      currentResult.neraca_saldo.credit = item.isCredit
        ? item.amount.add(currentResult.neraca_saldo.credit).toNumber()
        : currentResult.neraca_saldo.credit;

      currentResult.neraca_saldo.debit = item.isCredit
        ? currentResult.neraca_saldo.debit
        : item.amount.add(currentResult.neraca_saldo.debit).toNumber();
    }
  }

  private updateNeracaSaldoAndPenyesuaian(
    currentResult: WtbAccountResult,
    isAccountCredit: boolean,
  ) {
    const { neraca_saldo, penyesuaian } = currentResult;

    if (isAccountCredit) {
      neraca_saldo.credit = neraca_saldo.credit - neraca_saldo.debit;
      neraca_saldo.debit = 0;

      penyesuaian.credit = penyesuaian.credit - penyesuaian.debit;
      penyesuaian.debit = 0;
    } else {
      neraca_saldo.debit = neraca_saldo.debit - neraca_saldo.credit;
      neraca_saldo.credit = 0;

      penyesuaian.debit = penyesuaian.debit - penyesuaian.credit;
      penyesuaian.credit = 0;
    }
  }

  private updateNeracaSetelahnya(
    currentResult: WtbAccountResult,
    isAccountCredit: boolean,
  ) {
    const { neraca_saldo, penyesuaian, neraca_setelahnya } = currentResult;

    neraca_setelahnya.credit = neraca_saldo.credit + penyesuaian.credit;
    neraca_setelahnya.debit = neraca_saldo.debit + penyesuaian.debit;

    if (isAccountCredit) {
      neraca_setelahnya.credit =
        neraca_setelahnya.credit - neraca_setelahnya.debit;
      neraca_setelahnya.debit = 0;
    } else {
      neraca_setelahnya.debit =
        neraca_setelahnya.debit - neraca_setelahnya.credit;
      neraca_setelahnya.credit = 0;
    }
  }

  // Menukarkan nilai negatif menjadi positif pada bagian neraca saldo, penyesuaian, dan neraca setelahnya
  private switchNegativeNumber(currentResult: WtbAccountResult) {
    const { neraca_saldo, penyesuaian, neraca_setelahnya } = currentResult;

    neraca_saldo.credit = Math.max(neraca_saldo.credit - neraca_saldo.debit, 0);
    neraca_saldo.debit = Math.max(neraca_saldo.debit - neraca_saldo.credit, 0);

    penyesuaian.credit = Math.max(penyesuaian.credit - penyesuaian.debit, 0);
    penyesuaian.debit = Math.max(penyesuaian.debit - penyesuaian.credit, 0);

    neraca_setelahnya.credit = Math.max(
      neraca_setelahnya.credit - neraca_setelahnya.debit,
      0,
    );
    neraca_setelahnya.debit = Math.max(
      neraca_setelahnya.debit - neraca_setelahnya.credit,
      0,
    );
  }

  /* Memindahkan nilai neraca setelahnya ke posisi keuangan atau laba rugi
   * jika akun tersebut merupakan akun posisi keuangan (kategori akun Aset, Liabilitas dan Ekuitas),
   * jika bukan, maka akun tersebut merupakan akun laba rugi (kategori akun Pendapatan dan Beban)
   */
  private assignLaporanKeuangan(
    currentResult: WtbAccountResult,
    isPosisiKeuangan: boolean,
  ) {
    if (isPosisiKeuangan) {
      currentResult.posisi_keuangan.credit =
        currentResult.neraca_setelahnya.credit;
      currentResult.posisi_keuangan.debit =
        currentResult.neraca_setelahnya.debit;
    } else {
      currentResult.laba_rugi.credit = currentResult.neraca_setelahnya.credit;
      currentResult.laba_rugi.debit = currentResult.neraca_setelahnya.debit;
    }
  }
}
