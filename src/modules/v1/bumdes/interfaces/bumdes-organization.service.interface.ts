import { UpdateBumdesOrganizationDto } from '../dto';
import {
  UpdateBumdesOrganizationResponse,
  GetBumdesOrganizationResponse,
} from '../types';

export interface IBumdesOrganizationService {
  updateOrganization(
    bumdesId: string,
    dto: UpdateBumdesOrganizationDto,
  ): Promise<UpdateBumdesOrganizationResponse>;

  getOrganization(bumdesId: string): Promise<GetBumdesOrganizationResponse>;
}
