import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NgForm } from '@angular/forms';

import { SharedModule } from '../../../shared.module';

import { SalaryService } from '../../features/services/salary-service';
import { SalaryModel } from '../../features/models/salary/salary-model';

import { EmployeesService } from '../../features/services/employees-service';
import { Employee } from '../../features/models/employees/employees-model';

import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-manage-salary',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './manage-salary.html',
  styleUrl: './manage-salary.scss',
})
export class ManageSalary implements OnInit {

  employees$!: Observable<Employee[]>;
  salaries$ = new BehaviorSubject<SalaryModel[]>([]);

  pageNumber = 1;
  pageSize = 7;
  searchTerm = '';

  isSubmitting = false;

  // optional (keep only if parent listens)
  @Output() saved = new EventEmitter<any>();

  policies = [
    { label: 'FullDay', value: 0 },
    { label: 'ProRated', value: 1 },
    { label: 'HalfDay', value: 2 },
    { label: 'Hourly', value: 3 },
    { label: 'Monthly', value: 4 }
  ];

  constructor(
    private salaryService: SalaryService,
    private employeeService: EmployeesService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadPage({
      first: 0,
      rows: this.pageSize
    });

    this.employees$ = this.employeeService.getEmployeesLookup();
  }

  loadPage(event: any): void {

    this.pageNumber = event.first / event.rows + 1;
    this.pageSize = event.rows;

    this.salaryService
      .getSalaries(this.pageNumber, this.pageSize, this.searchTerm)
      .subscribe({
        next: (result) => {
          this.salaries$.next(result.items);

          this.pageNumber = result.pageNumber;
          this.pageSize = result.pageSize;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load salaries'
          });
        }
      });
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.pageNumber = 1;

    this.loadPage({
      first: 0,
      rows: this.pageSize
    });
  }

  onSalarySaved(): void {
    this.loadPage({
      first: 0,
      rows: this.pageSize
    });
  }

  getInitials(name: string): string {
    if (!name) return '';

    return name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase();
  }

  createSalary(form: NgForm): void {

    if (form.invalid || this.isSubmitting) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'All fields are required'
      });
      return;
    }

    this.isSubmitting = true;

    const payload = {
      employeeId: form.value.employeeId,
      rate: Number(form.value.rate),
      requiredHours: Number(form.value.requiredHours),
      policy: Number(form.value.policy)
    };

    this.salaryService.setupSalary(payload).subscribe({
      next: (res) => {

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Salary saved successfully'
        });

        // refresh table
        this.onSalarySaved();

        // notify parent if needed
        this.saved.emit(res);

        form.resetForm({
          employeeId: '',
          rate: 0,
          requiredHours: 8,
          policy: 0
        });

        this.isSubmitting = false;
      },

      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save salary'
        });

        this.isSubmitting = false;
      }
    });
  }
}