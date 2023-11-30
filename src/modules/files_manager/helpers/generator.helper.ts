import {
  generateBaseLocationForFinancialStatement,
  generateBaseLocationForJournal,
} from './base-location.helper';

export function generateJournalsKeyPath(
  file: Express.Multer.File,
  bumdesId: string,
  unitId: string,
  isAdjustment: boolean,
) {
  const basePath = generateBaseLocationForJournal(
    unitId,
    bumdesId,
    isAdjustment,
  );
  return `${basePath}/${file.originalname}`;
}

export function generateFinancialStatementKeyPath(
  file: Express.Multer.File,
  bumdesId: string,
  unitId: string,
  type: 'calk' | 'laba_rugi' | 'posisi_keuangan',
) {
  const basePath = generateBaseLocationForFinancialStatement(
    unitId,
    bumdesId,
    type,
  );

  return `${basePath}/${file.originalname}`;
}
