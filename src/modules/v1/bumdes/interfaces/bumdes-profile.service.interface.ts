import { UpdateBumdesProfileDto } from '../dto';
import {
  GetBumdesProfileResponse,
  UpdateBumdesProfileResponse,
} from '../types';

export interface IBumdesProfileService {
  updateProfile(
    bumdesId: string,
    dto: UpdateBumdesProfileDto,
  ): Promise<UpdateBumdesProfileResponse>;

  getProfile(bumdesId: string): Promise<GetBumdesProfileResponse>;
}
