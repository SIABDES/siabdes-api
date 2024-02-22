import { AddUnitIncomeHistoryDto, UpdateUnitIncomeHistoryDto } from '../dto';
import {
  AddUnitIncomeHistoryResponse,
  DeleteUnitIncomeHistoryResponse,
  GetUnitIncomeHistoriesResponse,
  UpdateUnitIncomeHistoryResponse,
} from '../types/responses';

export interface IUnitIncomesService {
  getIncomesHistory(unitId: string): Promise<GetUnitIncomeHistoriesResponse>;

  addIncomeHistory(
    unitId: string,
    dto: AddUnitIncomeHistoryDto,
  ): Promise<AddUnitIncomeHistoryResponse>;

  deleteIncomeHistory(
    unitId: string,
    incomeId: string,
  ): Promise<DeleteUnitIncomeHistoryResponse>;

  updateIncomeHistory(
    unitId: string,
    incomeId: string,
    dto: UpdateUnitIncomeHistoryDto,
  ): Promise<UpdateUnitIncomeHistoryResponse>;
}
