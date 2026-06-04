import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api-service';
import { Employee } from '../models/employees/employees-model';
import { PagedResult } from '../models/pagedresult/paged-result';
@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  
  constructor(private api: ApiService){}

//  getEmployees(pageNumber: number, pageSize: number, search: string = '') {
//     const endpoint =
//       `api/Employees/employees?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}`;

//     return this.api.get<PagedResult<Employee>>(endpoint);
//   }

  generateQr(employeeId: string) {
  return this.api.post<any>(
    `api/Employees/${employeeId}/generate-qr`,
    {}
  );
}
}
