export type FinancialStatementType = 'calk' | 'laba_rugi' | 'posisi_keuangan';

export type FinancialStatementRecord = { key: string; url: string };

export type FinancialStatementFileList = Record<
  string,
  FinancialStatementRecord
>;
