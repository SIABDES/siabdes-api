import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountType, JournalCategory } from '@prisma/client';
import Decimal from 'decimal.js';
import { PrismaService } from '~lib/prisma/prisma.service';
import { WTB_CATEGORY_GROUP_REFS } from '../constants';
import { GetWtbV2Dto } from '../dto';
import {
  addMultipleSection,
  assignAccountPosition,
  calculateJournalItemAmount,
  calculateNeracaSetelahnya,
  mapContentDecimalToNumber,
  prepareWtbCalculationResult,
  subtractSection,
} from '../helpers';
import { GetWtbSummaryV2Response, GetWtbV2Response } from '../responses';
import { WtbCategoryV2, WtbContentDecimalV2 } from '../types';

@Injectable()
export class WtbV2Service {
  constructor(private prisma: PrismaService) {}

  async getUnitWtb(dto: GetWtbV2Dto): Promise<GetWtbV2Response> {
    if (!dto.unit_id) throw new BadRequestException('unit_id harus diisi');

    const refs =
      dto.group_refs ?? WTB_CATEGORY_GROUP_REFS[dto.retrieval_category];

    // Posisi keuangan group refs
    const financialStateGroupRefs =
      WTB_CATEGORY_GROUP_REFS[WtbCategoryV2.FINANCIAL_STATE];

    const accounts = await this.prisma.account.findMany({
      orderBy: {
        groupRef: 'asc',
      },
      cursor: dto.cursor ? { id: dto.cursor as number } : undefined,
      skip: dto.cursor ? 1 : undefined,
      take: dto.limit ?? undefined,
      where: {
        groupRef: { in: refs },
        OR: [
          { type: AccountType.GLOBAL },
          {
            type: AccountType.CUSTOM,
            unitOwnerId: dto.unit_id,
          },
        ],
      },
      select: {
        id: true,
        ref: true,
        groupRef: true,
        name: true,
        isCredit: true,
        journalItems: {
          where: {
            journal: {
              bumdesUnitId: dto.unit_id,
              occurredAt:
                dto.start_occurred_at || dto.end_occurred_at
                  ? {
                      gte: dto.start_occurred_at
                        ? dto.start_occurred_at
                        : undefined,
                      lte: dto.end_occurred_at
                        ? dto.end_occurred_at
                        : undefined,
                    }
                  : undefined,
            },
          },
          select: {
            amount: true,
            isCredit: true,
            journal: {
              select: {
                category: true,
              },
            },
          },
        },
      },
    });

    return {
      next_cursor: accounts[accounts.length - 1]?.id,
      start_occurred_at: dto.start_occurred_at,
      end_occurred_at: dto.end_occurred_at,
      group_refs: refs,
      category: dto.retrieval_category,
      accounts: accounts.map((account) => {
        // Prepare the result temp variable for each account
        let generalAmount: WtbContentDecimalV2 = {
          credit: new Decimal(0),
          debit: new Decimal(0),
        };
        let adjustmentAmount: WtbContentDecimalV2 = {
          credit: new Decimal(0),
          debit: new Decimal(0),
        };

        // Posisi Keuangan
        const isFinancialState = financialStateGroupRefs.includes(
          account.groupRef,
        );

        // Prepare result
        const result = prepareWtbCalculationResult();

        // Calculate the result
        account.journalItems.forEach((item) => {
          if (item.journal.category === JournalCategory.GENERAL) {
            generalAmount = calculateJournalItemAmount(generalAmount, {
              amount: item.amount,
              isCredit: item.isCredit,
            });
          } else {
            adjustmentAmount = calculateJournalItemAmount(adjustmentAmount, {
              amount: item.amount,
              isCredit: item.isCredit,
            });
          }
        });

        generalAmount = subtractSection(generalAmount);
        adjustmentAmount = subtractSection(adjustmentAmount);

        result.neraca_saldo = mapContentDecimalToNumber(generalAmount);

        result.penyesuaian = mapContentDecimalToNumber(adjustmentAmount);

        result.neraca_setelahnya = calculateNeracaSetelahnya(
          result.neraca_saldo,
          result.penyesuaian,
        );

        result.neraca_setelahnya = mapContentDecimalToNumber(
          subtractSection(result.neraca_setelahnya),
        );

        assignAccountPosition({ result, isFinancialState });

        return {
          account: {
            id: account.id,
            name: account.name,
            is_credit: account.isCredit,
            is_posisi_keuangan: isFinancialState,
            ref: {
              group_ref: account.groupRef,
              complete_ref: account.ref,
            },
          },
          result,
        };
      }),
    };
  }

  async getUnitWtbSummary(dto: GetWtbV2Dto): Promise<GetWtbSummaryV2Response> {
    const summary: GetWtbSummaryV2Response = {
      sum: prepareWtbCalculationResult(),
      laba_rugi_bersih: {
        laba_rugi: { credit: 0, debit: 0 },
        posisi_keuangan: { credit: 0, debit: 0 },
      },
      total: prepareWtbCalculationResult(),
    };

    const wtbResult = await this.getUnitWtb(dto);

    wtbResult.accounts.forEach((account) => {
      // Summary
      summary.sum.neraca_saldo.credit += account.result.neraca_saldo.credit;
      summary.sum.neraca_saldo.debit += account.result.neraca_saldo.debit;

      summary.sum.penyesuaian.credit += account.result.penyesuaian.credit;
      summary.sum.penyesuaian.debit += account.result.penyesuaian.debit;

      summary.sum.neraca_setelahnya.credit +=
        account.result.neraca_setelahnya.credit;
      summary.sum.neraca_setelahnya.debit +=
        account.result.neraca_setelahnya.debit;

      summary.sum.laba_rugi.credit += account.result.laba_rugi.credit;
      summary.sum.laba_rugi.debit += account.result.laba_rugi.debit;

      summary.sum.posisi_keuangan.credit +=
        account.result.posisi_keuangan.credit;
      summary.sum.posisi_keuangan.debit += account.result.posisi_keuangan.debit;
    });

    // Laba rugi bersih
    summary.laba_rugi_bersih.laba_rugi = mapContentDecimalToNumber(
      subtractSection(summary.sum.laba_rugi),
    );
    summary.laba_rugi_bersih.posisi_keuangan = mapContentDecimalToNumber(
      subtractSection(summary.sum.posisi_keuangan),
    );

    // Total
    summary.total.neraca_saldo = summary.sum.neraca_saldo;
    summary.total.penyesuaian = summary.sum.penyesuaian;
    summary.total.neraca_setelahnya = summary.sum.neraca_setelahnya;

    summary.total.laba_rugi = addMultipleSection(
      summary.sum.laba_rugi,
      summary.laba_rugi_bersih.laba_rugi,
    );
    summary.total.posisi_keuangan = addMultipleSection(
      summary.sum.posisi_keuangan,
      summary.laba_rugi_bersih.posisi_keuangan,
    );

    return summary;
  }
}
