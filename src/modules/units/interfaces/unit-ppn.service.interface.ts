import { PaginationDto } from '~common/dto';
import { AddPpnObjectDto, GetPpnTaxesFilterDto } from '../dto';
import { AddPpnTaxResponse, GetPpnTaxesResponse } from '../types/responses';

export interface IUnitPpnService {
  addPpnTax(
    unitId: string,
    evidence: Express.Multer.File,
    dto: AddPpnObjectDto,
  ): Promise<AddPpnTaxResponse>;

  getPpnTaxes(
    unitId: string,
    pagination?: PaginationDto,
    filter?: GetPpnTaxesFilterDto,
  ): Promise<GetPpnTaxesResponse>;
}
