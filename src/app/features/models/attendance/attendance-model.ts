export interface AttendanceModel {
  id: string;
  employeeNumber: string;
  photoBase64: string | null;
  fullName: string;
  timeIn: string;
  timeOut: string;
}