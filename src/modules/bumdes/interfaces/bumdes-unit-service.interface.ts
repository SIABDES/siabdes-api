import { BumdesUnit } from '@prisma/client';
import { CreateBumdesUnitDto } from '../dto';
import {
  BumdesCreateUnitResponse,
  BumdesDeleteUnitResponse,
  BumdesGetUnitResponse,
  BumdesGetUnitsResponse,
} from '../types';

export interface IBumdesUnitService {
  createUnit(
    data: CreateBumdesUnitDto,
    bumdesId: string,
  ): Promise<BumdesCreateUnitResponse>;

  deleteUnitById(
    bumdesId: string,
    unitId: string,
  ): Promise<BumdesDeleteUnitResponse>;

  getBumdesUnits(bumdesId: string): Promise<BumdesGetUnitsResponse>;

  getBumdesUnitById(
    bumdesId: string,
    unitId: string,
  ): Promise<BumdesGetUnitResponse>;
}
