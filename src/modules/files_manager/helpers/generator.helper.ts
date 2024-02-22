import { FinancialStatementType } from '../types';
import {
  generateBaseLocationForFinancialStatement,
  generateBaseLocationForJournal,
  generateBaseLocationForPpn,
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

export function generatePpnKeyPath(
  name: string,
  bumdesId: string,
  unitId: string,
) {
  const basePath = generateBaseLocationForPpn(unitId, bumdesId);

  return `${basePath}/${name}`;
}
