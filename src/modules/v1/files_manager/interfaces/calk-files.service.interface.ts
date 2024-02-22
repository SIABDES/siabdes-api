import {
  CalkFileInputType,
  FinancialStatementFileList,
  FinancialStatementType,
} from '../types';

export interface ICalkFilesService {
  upload(args: CalkFileInputType): Promise<string>;

  getListFilesKeys(
    unitId: string,
    type: FinancialStatementType,
  ): Promise<FinancialStatementFileList>;

  deleteFile(key: string): Promise<void>;
}
