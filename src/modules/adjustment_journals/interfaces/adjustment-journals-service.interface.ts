import { PaginationDto } from '~common/dto';
import {
  AdjustmentJournalCreateTransactionDto,
  AdjustmentJournalUpdateTransactionDto,
} from '../dto';
import {
  CreateAdjustmentTransactionResponse,
  DeleteAdjustmentTransactionResponse,
  GetAdjustmentTransactionDetailsResponse,
  GetUnitAdjustmentTransactionsResponse,
  UpdateAdjustmentTransactionResponse,
} from '../types/responses';

export interface IAdjustmentJournalsService {
  createTransaction(
    unitId: string,
    data: AdjustmentJournalCreateTransactionDto,
  ): Promise<CreateAdjustmentTransactionResponse>;

  getTransactionDetails(
    journalId: string,
  ): Promise<GetAdjustmentTransactionDetailsResponse>;

  getUnitTransactions(
    unitId: string,
    pagination?: PaginationDto,
  ): Promise<GetUnitAdjustmentTransactionsResponse>;

  updateTransaction(
    journalId: string,
    data: AdjustmentJournalUpdateTransactionDto,
  ): Promise<UpdateAdjustmentTransactionResponse>;

  deleteTransaction(
    journalId: string,
  ): Promise<DeleteAdjustmentTransactionResponse>;
}
