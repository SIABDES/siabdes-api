export function generateBaseLocationForFinancialStatement(
  unitId: string,
  bumdesId: string,
  type: 'calk' | 'laba_rugi' | 'posisi_keuangan',
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
