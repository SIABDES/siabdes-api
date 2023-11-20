import { GeneralJournalCreateTransactionDto } from '../dto';
import { GeneralJournalUpdateTransactionDto } from '../dto/update-transaction.dto';
import {
  CreateTransactionResponse,
  GetJournalDetailsResponse,
  UpdateTransactionResponse,
} from '../types/responses';

export interface IGeneralJournalsService {
  createTransaction(
    data: GeneralJournalCreateTransactionDto,
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
