import { UpdateUnitProfileDto } from '../dto';
import {
  GetUnitProfileResponse,
  UpdateUnitProfileResponse,
} from '../types/responses';

export interface IUnitProfileService {
  updateUnitProfile(
    unitId: string,
    dto: UpdateUnitProfileDto,
  ): Promise<UpdateUnitProfileResponse>;

  getUnitProfile(unitId: string): Promise<GetUnitProfileResponse>;
}
