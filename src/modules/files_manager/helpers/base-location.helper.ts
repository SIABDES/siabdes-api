import { FinancialStatementType } from '../types';

export function generateBaseLocationForFinancialStatement(
  unitId: string,
  bumdesId: string,
  type: FinancialStatementType,
): string {
  return `${bumdesId}/${unitId}/financial-statement/${type}`;
}

export function generateBaseLocationForJournal(
  unitId: string,
  bumdesId: string,
  isAdjustment: boolean,
): string {
  const journalFolder = isAdjustment
    ? 'adjustment_journals'
    : 'general_journals';

  return `${bumdesId}/${unitId}/${journalFolder}`;
}

export function generateBaseLocationForPpn(
  unitId: string,
  bumdesId: string,
): string {
  return `${bumdesId}/${unitId}/ppn`;
}
