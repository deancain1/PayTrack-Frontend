import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { SharedModule } from '../../../shared.module';
import { AddEmployeeDialog } from '../dialogs/add-employee-dialog/add-employee-dialog';

import { MessageService } from 'primeng/api';

import { AuthService } from '../../features/services/auth-service';
import { EmployeesService } from '../../features/services/employees-service';

import { Employee } from '../../features/models/employees/employees-model';

@Component({
  selector: 'app-manage-employees',
  imports: [SharedModule, AddEmployeeDialog],
  templateUrl: './manage-employees.html',
  styleUrl: './manage-employees.scss',
})
export class ManageEmployees implements OnInit {

  employees$ = new BehaviorSubject<Employee[]>([]);
  selectedUsers: Employee[] = [];

  pageNumber = 1;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  searchTerm = '';

  addEmployeeDialogVisible = false;
  creating = false;

  constructor(
    private authService: AuthService,
    private employeesService: EmployeesService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadPage({
      first: 0,
      rows: this.pageSize
    });
  }

  loadPage(event: any): void {

    this.pageNumber = event.first / event.rows + 1;
    this.pageSize = event.rows;

    this.employeesService
      .getEmployees(
        this.pageNumber,
        this.pageSize,
        this.searchTerm
      )
      .subscribe({
        next: (result) => {

          this.employees$.next(result.items);

          this.pageNumber = result.pageNumber;
          this.pageSize = result.pageSize;
        }
      });
  }

  openAddEmployeeDialog(): void {
    this.addEmployeeDialogVisible = true;
  }

  onEmployeeCreated(payload: any): void {

    if (this.creating) return;

    this.creating = true;

    this.authService.registerEmployee(payload).subscribe({
      next: () => {

        this.loadPage({
          first: 0,
          rows: this.pageSize
        });

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Employee created'
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

  onSearch(event: any): void {

    this.searchTerm = event.target.value;

    this.pageNumber = 1;

    this.loadPage({
      first: 0,
      rows: this.pageSize
    });
  }

  onPageSizeChange(event: any): void {

    this.pageSize = Number(event.target.value);

    this.pageNumber = 1;

    this.loadPage({
      first: 0,
      rows: this.pageSize
    });
  }

  generateQr(employee: Employee): void {

    if (!employee.id) {

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Employee ID not found'
      });

      return;
    }

    this.employeesService
      .generateQr(employee.id)
      .subscribe({
        next: (updatedEmployee) => {

          const updated = this.employees$.value.map(emp =>
            emp.id === updatedEmployee.id
              ? {
                  ...emp,
                  qrCodeBase64: updatedEmployee.qrCodeBase64
                }
              : emp
          );

          this.employees$.next(updated);

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'QR Code generated'
          });
        },

        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to generate QR code'
          });
        }
      });
  }
}