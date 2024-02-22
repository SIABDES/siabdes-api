import { PaginationDto } from '~common/dto';
import {
  AddPpnObjectDto,
  GetPpnTaxesFilterDto,
  UpdatePpnObjectDto,
} from '../dto';
import {
  AddPpnTaxResponse,
  DeletePpnTaxResponse,
  GetPpnTaxDetailsResponse,
  GetPpnTaxesResponse,
  UpdatePpnTaxResponse,
} from '../types/responses';

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

  getPpnTaxById(
    unitId: string,
    ppnId: string,
  ): Promise<GetPpnTaxDetailsResponse>;

  updatePpnTaxById(
    unitId: string,
    ppnId: string,
    dto: UpdatePpnObjectDto,
    evidence?: Express.Multer.File,
  ): Promise<UpdatePpnTaxResponse>;

  deletePpnTaxById(
    unitId: string,
    ppnId: string,
  ): Promise<DeletePpnTaxResponse>;
}
