import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api-service';
import { AttendanceScanModel } from '../models/attendance/attendance-scan-model';
@Injectable({
  providedIn: 'root',
})
export class AttendanceService {

  constructor(private apiService: ApiService) {}

  recordAttendance(
    payload: AttendanceScanModel): Observable<any> {
    return this.apiService.post<any>(
      'api/Attendance/scan',
      payload
    );
  }
}
