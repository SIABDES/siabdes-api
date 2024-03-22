import Decimal from 'decimal.js';
import {
  LedgersFindAccountResult,
  LedgersFindJournalItemsResult,
  LedgersFindJournalsRowItem,
} from '../types';

export function calculateLedgerJournalItems(
  resultBalance: Decimal,
  account: LedgersFindAccountResult,
  journalItems: LedgersFindJournalItemsResult,
) {
  const transactions = journalItems.map((item) => {
    const previousBalance = resultBalance.toNumber();

    const transactionAmount =
      account.isCredit === item.isCredit ? item.amount : item.amount.negated();

    resultBalance = resultBalance.plus(transactionAmount);

    return {
      id: item.id,
      occurred_at: item.journal.occurredAt,
      description: item.journal.description,
      is_credit: item.isCredit,
      amount: item.amount.toNumber(),
      previous_balance: previousBalance,
      result_balance: resultBalance.toNumber(),
    };
  });

  return { transactions, resultBalance };
}

export function calculateLedgerFinalBalance(
  account: LedgersFindAccountResult,
  items: LedgersFindJournalsRowItem[],
) {
  let finalBalance = new Decimal(0);

  items.forEach((item) => {
    const actualAmount =
      item.isCredit === account.isCredit ? item.amount : item.amount.negated();
    finalBalance = finalBalance.plus(actualAmount);
  });

  return finalBalance;
}
