import { AddUnitProfitHistoryDto, UpdateUnitProfitHistoryDto } from '../dto';
import {
  AddUnitProfitHistoryResponse,
  DeleteUnitProfitHistoryResponse,
  GetUnitProfitHistoriesResponse,
  UpdaetUnitProfitHistoryResponse,
} from '../types/responses';

export interface IUnitProfitsService {
  addProfitHistory(
    unitId: string,
    dto: AddUnitProfitHistoryDto,
  ): Promise<AddUnitProfitHistoryResponse>;

  getProfitHistories(unitId: string): Promise<GetUnitProfitHistoriesResponse>;

  updateProfitHistory(
    unitId: string,
    profitId: string,
    dto: UpdateUnitProfitHistoryDto,
  ): Promise<UpdaetUnitProfitHistoryResponse>;

  deleteProfitHistory(
    unitId: string,
    profitId: string,
  ): Promise<DeleteUnitProfitHistoryResponse>;
}
