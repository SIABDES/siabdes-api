import { AddPpnObjectDto } from '../dto';
import { AddPpnTaxResponse, GetPpnTaxesResponse } from '../types/responses';

export interface IUnitPpnService {
  addPpnTax(
    unitId: string,
    evidence: Express.Multer.File,
    dto: AddPpnObjectDto,
  ): Promise<AddPpnTaxResponse>;

  getPpnTaxes(unitId: string): Promise<GetPpnTaxesResponse>;
}
