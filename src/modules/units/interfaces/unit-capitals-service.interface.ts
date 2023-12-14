import { AddUnitCapitalHistoryDto, UpdateUnitCapitalHistoryDto } from '../dto';
import {
  AddUnitCapitalHistoryResponse,
  DeleteUnitCapitalHistoryResponse,
  GetUnitCapitalHistoriesResponse,
  UpdateUnitCapitalHistoryResponse,
} from '../types/responses';

export interface IUnitCapitalsService {
  addCapitalHistory(
    unitId: string,
    dto: AddUnitCapitalHistoryDto,
  ): Promise<AddUnitCapitalHistoryResponse>;

  getCapitalHistories(unitId: string): Promise<GetUnitCapitalHistoriesResponse>;

  deleteCapitalHistory(
    unitId: string,
    capitalId: string,
  ): Promise<DeleteUnitCapitalHistoryResponse>;

  updateCapitalHistory(
    unitId: string,
    capitalId: string,
    dto: UpdateUnitCapitalHistoryDto,
  ): Promise<UpdateUnitCapitalHistoryResponse>;
}
