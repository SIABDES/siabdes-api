import { JournalItemType } from '~modules/journals/types';

export function isCreditAndDebitBalance(data_transactions: JournalItemType[]) {
  const totalCredit = data_transactions.reduce((acc, curr) => {
    if (curr.is_credit) {
      return acc + curr.amount;
    }
    return acc;
  }, 0);

  const totalDebit = data_transactions.reduce((acc, curr) => {
    if (!curr.is_credit) {
      return acc + curr.amount;
    }
    return acc;
  }, 0);

  return totalCredit === totalDebit;
}

export function isAccountIdsUnique(data_transactions: JournalItemType[]) {
  const accountIds = data_transactions.map((item) => item.account_id);

  return new Set(accountIds).size === accountIds.length;
}
