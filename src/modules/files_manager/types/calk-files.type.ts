import { FinancialStatementType } from './financial-statement.type';

export type CalkFileInputType = {
  file: Express.Multer.File;
  unitId: string;
  bumdesId?: string;
  type: FinancialStatementType;
};
