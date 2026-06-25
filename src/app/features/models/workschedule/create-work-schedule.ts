export interface CreateWorkScheduleModel {
  scheduleName: string;
  scheduleType: number;
  startTime: string;
  endTime: string;
  requiredHours: number;
  gracePeriodMinutes: number;
}