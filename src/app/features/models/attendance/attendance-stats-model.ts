export interface AttendanceStatsModel {
  presentToday: number;
  lateToday: number;
  absentToday: number;

  totalToday: number;

  presentPercentage: number;
  latePercentage: number;
  absentPercentage: number;
}