import { PaginationDto } from '~common/dto';
import {
  AddUnitEmployeeDto,
  GetEmployeesFilterDto,
  TaxesPeriodDto,
  UpdateUnitEmployeeDto,
} from '../dto';
import {
  AddUnitEmployeeResponse,
  DeleteUnitEmployeeResponse,
  GetUnitEmployeePtkpResponse,
  GetUnitEmployeeResponse,
  GetUnitEmployeesResponse,
  UpdateUnitEmployeeResponse,
} from '../types/responses';

export interface IUnitEmployeesService {
  addEmployee(
    unitId: string,
    dto: AddUnitEmployeeDto,
  ): Promise<AddUnitEmployeeResponse>;

  getEmployees(
    unitId: string,
    filter?: GetEmployeesFilterDto,
    pagination?: PaginationDto,
  ): Promise<GetUnitEmployeesResponse>;

  getEmployeeById(
    unitId: string,
    employeeId: string,
    taxPeriod: TaxesPeriodDto,
  ): Promise<GetUnitEmployeeResponse>;

  updateEmployee(
    unitId: string,
    employeeId: string,
    dto: UpdateUnitEmployeeDto,
  ): Promise<UpdateUnitEmployeeResponse>;

  deleteEmployeeById(
    unitId: string,
    employeeId: string,
  ): Promise<DeleteUnitEmployeeResponse>;

  getEmployeeTaxInfo(
    unitId: string,
    employeeId: string,
    taxPeriod: TaxesPeriodDto,
  ): Promise<GetUnitEmployeePtkpResponse>;
}
