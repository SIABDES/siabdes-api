import {
  AddBumdesIncomeHistoryDto,
  UpdateBumdesIncomeHistoryDto,
} from '../dto';
import {
  AddBumdesIncomeHistoryResponse,
  DeleteBumdesIncomeHistoryResponse,
  GetBumdesIncomeHistoriesResponse,
  UpdateBumdesIncomeHistoryResponse,
} from '../types/responses';

export interface IBumdesIncomesService {
  addHistory(
    bumdesId: string,
    dto: AddBumdesIncomeHistoryDto,
  ): Promise<AddBumdesIncomeHistoryResponse>;

  updateHistory(
    bumdesId: string,
    incomeId: string,
    dto: UpdateBumdesIncomeHistoryDto,
  ): Promise<UpdateBumdesIncomeHistoryResponse>;

  deleteHistory(
    bumdesId: string,
    incomeId: string,
  ): Promise<DeleteBumdesIncomeHistoryResponse>;

  getHistories(bumdesId: string): Promise<GetBumdesIncomeHistoriesResponse>;
}
