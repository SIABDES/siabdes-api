import { FinancialStatementType } from '../types';
import {
  generateBaseLocationForFinancialStatement,
  generateBaseLocationForJournal,
} from './base-location.helper';

export function generateJournalsKeyPath(
  name: string,
  bumdesId: string,
  unitId: string,
  isAdjustment: boolean,
) {
  const basePath = generateBaseLocationForJournal(
    unitId,
    bumdesId,
    isAdjustment,
  );
  return `${basePath}/${name}`;
}

export function generateFinancialStatementKeyPath(
  name: string,
  bumdesId: string,
  unitId: string,
  type: FinancialStatementType,
) {
  const basePath = generateBaseLocationForFinancialStatement(
    unitId,
    bumdesId,
    type,
  );

  return `${basePath}/${name}`;
}
