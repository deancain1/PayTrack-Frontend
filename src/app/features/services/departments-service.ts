import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api-service';
import { CreateDepartmentModel } from '../models/departments/create-department-model';
import { DepartmentModel } from '../models/departments/department-model';
import { Observable } from 'rxjs';
import { PagedResult } from '../models/pagedresult/paged-result';
@Injectable({
  providedIn: 'root',
})
export class DepartmentsService {
  
  constructor(private api: ApiService){}
  
   createDepartment(department: CreateDepartmentModel): Observable<DepartmentModel> {
    return this.api.post<DepartmentModel>('api/Departments/department', department);
  }
    
    getDepartmentsPaged(pageNumber: number, pageSize?: number, search?: string) {
    let query = `api/Departments/departments?pageNumber=${pageNumber}`;
    if (pageSize) query += `&pageSize=${pageSize}`;
    if (search) query += `&search=${search}`;
    return this.api.get<PagedResult<DepartmentModel>>(query);
  }
}
