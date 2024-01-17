import {
  AddUnitEmployeePph21Dto,
  UpdateUnitEmployeePph21Dto,
} from '../dto/pph21';

import {
  AddUnitEmployeePph21Response,
  DeleteUnitEmployeePph21Response,
  GetUnitEmployeeTaxResponse,
  GetUnitEmployeeTaxesResponse,
  UpdateUnitEmployeePph21Response,
} from '../types/responses';

export interface IUnitPph21Service {
  addTax(
    unitId: string,
    employeeId: string,
    dto: AddUnitEmployeePph21Dto,
  ): Promise<AddUnitEmployeePph21Response>;

  getTaxDetailsById(
    unitId: string,
    taxId: string,
  ): Promise<GetUnitEmployeeTaxResponse>;

  getTaxes(unitId: string): Promise<GetUnitEmployeeTaxesResponse>;

  updateTax(
    taxId: string,
    dto: UpdateUnitEmployeePph21Dto,
  ): Promise<UpdateUnitEmployeePph21Response>;

  deleteTax(taxId: string): Promise<DeleteUnitEmployeePph21Response>;
}
