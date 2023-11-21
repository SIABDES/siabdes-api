import { PaginationDto } from '~common/dto';
import {
  GeneralJournalCreateTransactionDto,
  GeneralJournalUpdateTransactionDto,
  GetTransactionsFiltersDto,
} from '../dto';
import {
  CreateTransactionResponse,
  GetJournalDetailsResponse,
  GetUnitJournalsResponse,
  UpdateTransactionResponse,
} from '../types/responses';

export interface IGeneralJournalsService {
  getUnitTransactions(
    unitId: string,
    filters?: GetTransactionsFiltersDto,
    pagination?: PaginationDto,
  ): Promise<GetUnitJournalsResponse>;

  createTransaction(
    evidence: Express.Multer.File,
    data: GeneralJournalCreateTransactionDto,
    bumdesId: string,
    bumdesUnitId: string,
  ): Promise<CreateTransactionResponse>;

  getTransactionDetails(
    unitId: string,
    journalId: string,
  ): Promise<GetJournalDetailsResponse>;

  deleteTransaction(unitId: string, journalId: string): Promise<void>;

  updateTransaction(
    unitId: string,
    journalId: string,
    data: GeneralJournalUpdateTransactionDto,
  ): Promise<UpdateTransactionResponse>;
}
