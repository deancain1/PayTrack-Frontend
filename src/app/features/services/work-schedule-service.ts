import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api-service';
import { CreateWorkScheduleModel } from '../models/workschedule/create-work-schedule';
import { WorkScheduleModel } from '../models/workschedule/work-schedule-model';
import { Observable } from 'rxjs';
import { PagedResult } from '../models/pagedresult/paged-result';
@Injectable({
  providedIn: 'root',
})
export class WorkScheduleService {
  
  constructor(private apiService: ApiService){}

    createWorkSchedule(schedule: CreateWorkScheduleModel): Observable<WorkScheduleModel> {
      return this.apiService.post<WorkScheduleModel>('api/WorkSchedule/work-schedule', schedule);
    }
    
    getSchedules(
      pageNumber: number,
      pageSize: number,
      search?: string
    ) {
      return this.apiService.get<PagedResult<WorkScheduleModel>>(
        `api/WorkSchedule?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search ?? ''}`
      );
    }
}
