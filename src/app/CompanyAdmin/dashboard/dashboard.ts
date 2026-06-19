import { Component } from '@angular/core';
import { PayrollService } from '../../features/services/payroll-service';
import { EmployeesService } from '../../features/services/employees-service';
import { SharedModule } from '../../../shared.module';
import { AttendanceService } from '../../features/services/attendance-service';
import { AttendanceModel } from '../../features/models/attendance/attendance-model';

@Component({
  selector: 'app-dashboard',
  imports: [SharedModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  // ================= DIALOG STATE =================
  showPayrollDialog: boolean = false;

  // ================= DATE RANGE =================
  startDate!: Date;
  endDate!: Date;

  // ================= EMPLOYEE SELECTION =================
  selectedEmployees: string[] = [];
  selectAllEmployees: boolean = false;

  employeeOptions: any[] = [];

  estimatedTotal: number = 0;
  attendanceList: AttendanceModel[] = [];

  constructor(
    private payrollService: PayrollService,
    private employeesService: EmployeesService,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
     this.loadAttendance();
  }

  // ================= OPEN / CLOSE DIALOG =================
  openPayrollDialog() {
    this.showPayrollDialog = true;
  }

  closeDialog() {
    this.showPayrollDialog = false;
  }

  // ================= LOAD EMPLOYEES =================
  loadEmployees() {
    this.employeesService.getEmployeesLookup().subscribe({
      next: (res: any[]) => {
        this.employeeOptions = res.map(e => ({
          label: e.fullName,
          value: e.id
        }));
      },
      error: (err) => console.error(err)
    });
  }

  // ================= CHECK IF SELECTED =================
  isSelected(employeeId: string): boolean {
    return this.selectedEmployees.includes(employeeId);
  }

  // ================= TOGGLE SINGLE EMPLOYEE =================
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

  // ================= TOGGLE ALL EMPLOYEES =================
  toggleAllEmployees() {

    if (this.selectAllEmployees) {
      this.selectedEmployees = this.employeeOptions.map(e => e.value);
    } else {
      this.selectedEmployees = [];
    }
    
  }

  updateEstimatedTotal() {
  const selected =
    this.selectAllEmployees
      ? this.employeeOptions.map(e => e.value)
      : this.selectedEmployees;

  // dummy calculation (replace later with backend preview)
  this.estimatedTotal = selected.length * 1000; // temporary
}
  // ================= SYNC "ALL" STATE =================
  updateSelectAllState() {
    this.selectAllEmployees =
      this.selectedEmployees.length === this.employeeOptions.length;
  }

  // ================= GENERATE PAYROLL =================
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

  // ================= PDF GENERATOR =================
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

  getInitials(name: string): string {
  if (!name) return '';

  return name
    .split(' ')
    .map(x => x[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

   loadAttendance(): void {
    this.attendanceService.getTodayAttendance().subscribe({
      next: (response) => {
        this.attendanceList = response;
      },
      error: (error) => {
        console.error('Failed to load attendance', error);
      }
    });
  }
}