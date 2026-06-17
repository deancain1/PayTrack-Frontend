import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api-service';
import { Employee } from '../models/employees/employees-model';
import { PagedResult } from '../models/pagedresult/paged-result';
@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  
  constructor(private api: ApiService){}

getEmployees(
  pageNumber: number,
  pageSize: number,
  search?: string
) {
  return this.api.get<PagedResult<Employee>>(
    `api/Employees?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search ?? ''}`
  );
}

getEmployeesLookup() {
  return this.api.get<Employee[]>(
    'api/Employees/lookup'
  );
}
  generateQr(employeeId: string) {
  return this.api.post<any>(
    `api/Employees/${employeeId}/generate-qr`,
    {}
  );
}
}
