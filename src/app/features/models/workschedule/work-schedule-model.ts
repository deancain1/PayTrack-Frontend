export interface WorkScheduleModel {
  id: string;
  scheduleName: string;
  scheduleType: number;
  startTime: string;
  endTime: string;
  requiredHours: number;
  gracePeriodMinutes: number;
}