import Decimal from 'decimal.js';
import {
  WtbCalculationsResultV2,
  WtbContentDecimalV2,
  WtbContentV2,
} from '../types';

export function prepareWtbCalculationResult(): WtbCalculationsResultV2 {
  return {
    neraca_saldo: { credit: 0, debit: 0 },
    penyesuaian: { credit: 0, debit: 0 },
    neraca_setelahnya: { credit: 0, debit: 0 },
    laba_rugi: { credit: 0, debit: 0 },
    posisi_keuangan: { credit: 0, debit: 0 },
  };
}

export function calculateJournalItemAmount(
  currentData: WtbContentDecimalV2,
  newData: { amount: Decimal; isCredit: boolean },
): WtbContentDecimalV2 {
  return {
    credit: currentData.credit.plus(newData.isCredit ? newData.amount : 0),
    debit: currentData.debit.plus(newData.isCredit ? 0 : newData.amount),
  };
}

function isDecimalContent(
  content: WtbContentDecimalV2 | WtbContentV2,
): content is WtbContentV2 {
  return (
    typeof content.credit === 'number' && typeof content.debit === 'number'
  );
}

export function subtractSection(
  section: WtbContentDecimalV2 | WtbContentV2,
): WtbContentDecimalV2 {
  let tempSection: WtbContentDecimalV2;

  if (isDecimalContent(section)) {
    tempSection = {
      credit: new Decimal(section.credit),
      debit: new Decimal(section.debit),
    };
  } else {
    tempSection = section;
  }

  return {
    credit: Decimal.max(0, tempSection.credit.sub(tempSection.debit)),
    debit: Decimal.max(0, tempSection.debit.sub(tempSection.credit)),
  };
}

export function mapContentDecimalToNumber(
  content: WtbContentDecimalV2,
): WtbContentV2 {
  return {
    credit: content.credit.toNumber(),
    debit: content.debit.toNumber(),
  };
}

export function calculateNeracaSetelahnya(
  neracaSaldo: WtbContentV2,
  penyesuaian: WtbContentV2,
): WtbContentV2 {
  return {
    credit: neracaSaldo.credit + penyesuaian.credit,
    debit: neracaSaldo.debit + penyesuaian.debit,
  };
}

export function assignAccountPosition({
  isFinancialState,
  result,
}: {
  result: WtbCalculationsResultV2;
  isFinancialState: boolean;
}): WtbCalculationsResultV2 {
  if (isFinancialState) {
    result.posisi_keuangan = result.neraca_setelahnya;
  } else {
    result.laba_rugi = result.neraca_setelahnya;
  }

  return result;
}
