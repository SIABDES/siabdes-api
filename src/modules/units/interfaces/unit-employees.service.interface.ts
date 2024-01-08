import { AddUnitEmployeeDto, UpdateUnitEmployeeDto } from '../dto';
import {
  AddUnitEmployeeResponse,
  DeleteUnitEmployeeResponse,
  GetUnitEmployeeResponse,
  GetUnitEmployeesResponse,
  UpdateUnitEmployeeResponse,
} from '../types/responses';

export interface IUnitEmployeesService {
  addEmployee(
    unitId: string,
    dto: AddUnitEmployeeDto,
  ): Promise<AddUnitEmployeeResponse>;

  getEmployees(unitId: string): Promise<GetUnitEmployeesResponse>;

  getEmployeeById(
    unitId: string,
    employeeId: string,
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
}
