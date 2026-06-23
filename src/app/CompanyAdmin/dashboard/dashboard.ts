import { Component } from '@angular/core';
import { PayrollService } from '../../features/services/payroll-service';
import { EmployeesService } from '../../features/services/employees-service';
import { SharedModule } from '../../../shared.module';
import { AttendanceService } from '../../features/services/attendance-service';
import { AttendanceModel } from '../../features/models/attendance/attendance-model';
import { EmployeeStatsModel } from '../../features/models/employees/employee-stats-model';
import { ChangeDetectorRef } from '@angular/core';
import { AttendanceStatsModel } from '../../features/models/attendance/attendance-stats-model';

@Component({
  selector: 'app-dashboard',
  imports: [SharedModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

 
  showPayrollDialog: boolean = false;

  //DATE RANGE 
  startDate!: Date;
  endDate!: Date;

  // EMPLOYEE SELECTION 
  selectedEmployees: string[] = [];
  selectAllEmployees: boolean = false;

  employeeOptions: any[] = [];

  estimatedTotal: number = 0;
  employeeStats: EmployeeStatsModel = {
  totalEmployees: 0};

  attendanceStats: AttendanceStatsModel = {
  presentToday: 0,
  absentToday: 0
};

  attendanceList: AttendanceModel[] = [];
   
  constructor(
    private payrollService: PayrollService,
    private employeesService: EmployeesService,
    private attendanceService: AttendanceService,
     private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadAttendance();
    this.loadEmployeeStats();
    this.loadAttendanceStats();
  }

 
  openPayrollDialog() {
    this.showPayrollDialog = true;
  }

  closeDialog() {
    this.showPayrollDialog = false;
  }

  loadEmployeeStats(): void {
  this.employeesService
    .getEmployeeSummary()
    .subscribe({
      next: (res) => {
        this.employeeStats = res;
         this.cdr.detectChanges();
      }
    });
}


loadAttendanceStats(): void {
  this.attendanceService
    .getAttendanceStats()
    .subscribe({
      next: (response) => {
        this.attendanceStats = response;
         this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
}
  // LOAD EMPLOYEES 
  loadEmployees() {
    this.employeesService.getEmployeesLookup().subscribe({
      next: (res: any[]) => {
        this.employeeOptions = res.map(e => ({
          label: e.fullName,
          value: e.id
        }));
         this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  
  isSelected(employeeId: string): boolean {
    return this.selectedEmployees.includes(employeeId);
  }

  toggleEmployee(employeeId: string, event: any) {

    if (event.target.checked) {
      if (!this.selectedEmployees.includes(employeeId)) {
        this.selectedEmployees.push(employeeId);
      }
    } else {
      this.selectedEmployees = this.selectedEmployees
        .filter(id => id !== employeeId);
    }

    this.updateSelectAllState();
    
    
  }


  toggleAllEmployees() {

    if (this.selectAllEmployees) {
      this.selectedEmployees = this.employeeOptions.map(e => e.value);
    } else {
      this.selectedEmployees = [];
    }
    
  }

//   updateEstimatedTotal() {
//   const selected =
//     this.selectAllEmployees
//       ? this.employeeOptions.map(e => e.value)
//       : this.selectedEmployees;

//   // dummy calculation (replace later with backend preview)
//   this.estimatedTotal = selected.length * 1000; // temporary
// }
  
  updateSelectAllState() {
    this.selectAllEmployees =
      this.selectedEmployees.length === this.employeeOptions.length;
  }

 
  generatePayroll() {

    if (!this.startDate || !this.endDate) {
      alert('Please select start and end date');
      return;
    }

    // decide: all or selected
    const request = {
      employeeIds: this.selectAllEmployees
        ? null
        : this.selectedEmployees,

      periodStart: this.startDate,
      periodEnd: this.endDate
    };

    this.payrollService.generatePayroll(request)
      .subscribe({
        next: (res: any) => {
          console.log('Payroll Result:', res);

          this.generatePdf(res);

          this.showPayrollDialog = false;
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  
  
  generatePdf(data: any) {

    import('jspdf').then(jsPDF => {

      const doc = new jsPDF.default();

      doc.text('PAYROLL REPORT', 10, 10);

      let y = 20;

      data.employees.forEach((e: any) => {
        doc.text(
          `${e.employeeName} - ₱${e.totalAmount}`,
          10,
          y
        );
        y += 10;
      });

      doc.text(`TOTAL: ₱${data.grandTotal}`, 10, y + 10);

      doc.save('payroll.pdf');
    });
  }

  getInitials(fullName?: string): string {

    if (!fullName) return '';

    const names = fullName.trim().split(' ');

    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }

    return (
      names[0].charAt(0) +
      names[1].charAt(0)
    ).toUpperCase();
  }

   loadAttendance(): void {
    this.attendanceService.getTodayAttendance().subscribe({
      next: (response) => {
        this.attendanceList = response;
          this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load attendance', error);
      }
    });
  }
}