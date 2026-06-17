import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api-service';
import { CreateSalaryModel } from '../models/salary/create-salary-model';
import { SalaryModel } from '../models/salary/salary-model';
import { PagedResult } from '../models/pagedresult/paged-result';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SalaryService {
    constructor(
    private apiService: ApiService
  ) {}


  setupSalary(
    payload: CreateSalaryModel
  ): Observable<any> {

    return this.apiService.post<any>(
      `api/Salary/setup`,
      payload
    );
  }


  getSalaries(
    pageNumber: number = 1,
    pageSize: number = 7,
    search: string = ''
  ): Observable<PagedResult<SalaryModel>> {

    const endpoint =
      `api/Salary?pageNumber=${pageNumber}` +
      `&pageSize=${pageSize}` +
      `&search=${encodeURIComponent(search)}`;

    return this.apiService.get<PagedResult<SalaryModel>>(
      endpoint
    );
  }
}
