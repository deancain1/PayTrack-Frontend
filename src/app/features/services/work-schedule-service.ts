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
    
    getSchedulesLookup() {
      return this.apiService.get<WorkScheduleModel[]>(
        'api/WorkSchedule/lookup'
      );
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

     assignSchedule(employeeId: string, workScheduleId: string, scheduleEffectiveDate: Date): Observable<void> {
    return this.apiService.update<void>(
      'api/WorkSchedule/assign-schedule',
      {
        employeeId,
        workScheduleId, 
        scheduleEffectiveDate
      }
    );
  }
}
