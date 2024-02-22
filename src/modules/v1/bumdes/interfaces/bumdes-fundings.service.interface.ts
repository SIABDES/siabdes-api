import {
  AddBumdesFundingHistoryDto,
  UpdateBumdesFundingHistoryDto,
} from '../dto';
import {
  AddBumdesFundingHistoryResponse,
  DeleteBumdesFundingHistoryResponse,
  GetBumdesFundingHistoriesResponse,
  UpdateBumdesFundingHistoryResponse,
} from '../types';

export interface IBumdesFundingsService {
  addHistory(
    bumdesId: string,
    dto: AddBumdesFundingHistoryDto,
  ): Promise<AddBumdesFundingHistoryResponse>;

  deleteHistory(
    bumdesId: string,
    historyId: string,
  ): Promise<DeleteBumdesFundingHistoryResponse>;

  updateHistory(
    bumdesId: string,
    historyId: string,
    dto: UpdateBumdesFundingHistoryDto,
  ): Promise<UpdateBumdesFundingHistoryResponse>;

  getHistories(bumdesId: string): Promise<GetBumdesFundingHistoriesResponse>;
}
