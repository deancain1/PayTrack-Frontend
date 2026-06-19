import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api-service';
import { AttendanceScanModel } from '../models/attendance/attendance-scan-model';
import { AttendanceModel } from '../models/attendance/attendance-model';
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
   getTodayAttendance(): Observable<AttendanceModel[]> {
    return this.apiService.get<AttendanceModel[]>(`api/Attendance/today`);
  }
}
