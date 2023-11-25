import { boolean, number } from 'zod';
import { WTB_POSISI_KEUANGAN_GROUP_REFS } from '../constants';
import { WtbAccountItemDetails } from '../types';

export function isPosisiKeuanganAccount(groupRef: string) {
  return WTB_POSISI_KEUANGAN_GROUP_REFS.includes(groupRef);
}

export function assignLaporanKeuangan(payload: {
  groupRef: string;
  neraca_setelahnya: WtbAccountItemDetails;
  laba_rugi: WtbAccountItemDetails;
  posisi_keuangan: WtbAccountItemDetails;
}) {
  const { groupRef, neraca_setelahnya, laba_rugi, posisi_keuangan } = payload;

  if (isPosisiKeuanganAccount(groupRef)) {
    posisi_keuangan.credit = neraca_setelahnya.credit;
    posisi_keuangan.debit = neraca_setelahnya.debit;
  } else {
    laba_rugi.credit = neraca_setelahnya.credit;
    laba_rugi.debit = neraca_setelahnya.debit;
  }
}

export function calculateNeracaSetelahnya(payload: {
  neraca_saldo: WtbAccountItemDetails;
  penyesuaian: WtbAccountItemDetails;
  neraca_setelahnya: WtbAccountItemDetails;
  isAccountCredit: boolean;
}) {
  const { neraca_saldo, penyesuaian, neraca_setelahnya, isAccountCredit } =
    payload;

  const credit = neraca_saldo.credit + penyesuaian.credit;
  const debit = neraca_saldo.debit + penyesuaian.debit;

  if (isAccountCredit) {
    neraca_setelahnya.credit = credit - debit;
  } else {
    neraca_setelahnya.debit = debit - credit;
  }
}

export function addAmountToSection(
  section: WtbAccountItemDetails,
  amount: number,
  isAccountCredit: boolean,
  isItemCredit: boolean,
) {
  if (isAccountCredit) {
    if (isItemCredit) {
      section.credit += amount;
    } else {
      section.credit -= amount;
    }
  } else {
    if (isItemCredit) {
      section.debit -= amount;
    } else {
      section.debit += amount;
    }
  }
}

export function switchSectionIfNegativeNumber(section: WtbAccountItemDetails) {
  if (section.debit < 0) {
    section.credit = Math.abs(section.debit);
    section.debit = 0;
  }
  if (section.credit < 0) {
    section.debit = Math.abs(section.credit);
    section.credit = 0;
  }
}
