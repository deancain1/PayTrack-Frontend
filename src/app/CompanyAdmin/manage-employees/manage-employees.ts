import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Users } from '../../features/models/users/users';
import { UsersService } from '../../features/services/users-service';
import { SharedModule } from '../../../shared.module';
import { AddEmployeeDialog } from '../dialogs/add-employee-dialog/add-employee-dialog';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../features/services/auth-service';
import { DepartmentModel } from '../../features/models/departments/department-model';
import { DepartmentsService } from '../../features/services/departments-service';
import { EmployeesService } from '../../features/services/employees-service';
@Component({
  selector: 'app-manage-employees',
  imports: [SharedModule, AddEmployeeDialog],
  templateUrl: './manage-employees.html',
  styleUrl: './manage-employees.scss',
})
export class ManageEmployees implements OnInit{

  employees$ = new BehaviorSubject<Users[]>([]);
  selectedUsers: Users[] = [];


  pageNumber = 1;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  searchTerm = '';

  addEmployeeDialogVisible = false;
  creating = false;

  constructor (private usersService: UsersService, private authService: AuthService, private employeesService: EmployeesService, private messageService: MessageService){}

  ngOnInit(): void {
      this.loadPage({ first: 0, rows: this.pageSize });
     
  }


  loadPage(event: any): void {
    this.pageNumber = (event.first / event.rows) +1;
    this.pageSize = event.rows;

    this.usersService.getUsersByRole('Employee', this.pageNumber, this.pageSize, this.searchTerm)
    .subscribe(result => { 
      this.employees$.next(result.items);
     this.pageSize = result.pageSize;
     this.pageNumber = result.pageNumber;
      
    });
  }
    openAddEmployeeDialog(): void {
    this.addEmployeeDialogVisible = true;
  }

  onEmployeeCreated(payload: any) {

    if (this.creating) return;
    this.creating = true;

    this.authService.registerEmployee(payload).subscribe({
      next: (res) => {

        const newEmployee: Users = {
          ...res,
          role: res.role ?? payload.role,
        };

        this.employees$.next([
          ...this.employees$.value,
          newEmployee
        ]);

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Admin created'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Creation failed'
        });
      },
      complete: () => {
        this.creating = false;
      }
    });
  }

  getInitials(fullName: string): string {
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

  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.pageNumber = 1;

    this.loadPage({ first: 0, rows: this.pageSize });
  }
   onPageSizeChange(event: any): void {
    this.pageNumber = 1;
    this.loadPage({ first: 0, rows: this.pageSize });
  }

  generateQr(user: Users): void {
  if (!user.employeeId) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Employee ID not found'
    });
    return;
  }

  this.employeesService.generateQr(user.employeeId)
    .subscribe({
      next: (updatedEmployee) => {
        const updated = this.employees$.value.map(emp =>
          emp.employeeId === updatedEmployee.id
            ? { ...emp, qrCodeBase64: updatedEmployee.qrCodeBase64 }
            : emp
        );

        this.employees$.next(updated);
      }
    });
}
  

}
