import { PaginationDto } from '~common/dto';
import { CreateUnitDto } from '../dto';
import {
  CreateUnitResponse,
  DeleteUnitResponse,
  GetUnitMetadataResponse,
  GetUnitResponse,
  GetUnitsResponse,
} from '../types/responses';

export interface IUnitsService {
  createUnit(
    data: CreateUnitDto,
    bumdesId: string,
  ): Promise<CreateUnitResponse>;

  deleteUnitById(bumdesId: string, unitId: string): Promise<DeleteUnitResponse>;

  getUnits(
    bumdesId: string,
    pagination?: PaginationDto,
  ): Promise<GetUnitsResponse>;

  getUnitById(bumdesId: string, unitId: string): Promise<GetUnitResponse>;

  getUnitMetadata(unitId: string): Promise<GetUnitMetadataResponse>;
}
