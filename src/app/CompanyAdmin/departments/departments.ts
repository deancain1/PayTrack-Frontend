import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { DepartmentModel } from '../../features/models/departments/department-model';
import { DepartmentsService } from '../../features/services/departments-service';
import { SharedModule } from '../../../shared.module';
@Component({
  selector: 'app-manage-departments',
  imports: [FormsModule, SharedModule],
  templateUrl: './departments.html',
  styleUrl: './departments.scss',
})
export class Departments implements OnInit {

  departments$ = new BehaviorSubject<DepartmentModel[]>([]);

  pageNumber = 1;
  pageSize = 5;
  pageSizeOptions = [5, 7, 10, 20]; 
  searchTerm = '';

  departmentName = '';
  departmentDescription = '';

  constructor(
    private departmentService: DepartmentsService,
    private cdr: ChangeDetectorRef   
  ) {}

    ngOnInit(): void {
    this.loadPage({ first: 0, rows: this.pageSize });
  }


  // ADD DEPARTMENT
 addDepartment(): void {

  if (!this.departmentName.trim()) {
    alert('Department name is required.');
    return;
  }

  const payload = {
    departmentName: this.departmentName,
    description: this.departmentDescription
  };

  this.departmentService.createDepartment(payload).subscribe({
    next: () => {

      // // reload departments
      // this.getDepartments();

      // clear fields safely
      setTimeout(() => {
        this.departmentName = '';
        this.departmentDescription = '';

        this.cdr.markForCheck();
      });

    },
    error: (err) => {
      console.error(err);
    }
  });
}

  // PAGINATION
loadPage(event: any): void {
    this.pageNumber = (event.first / event.rows) + 1;
    this.pageSize = event.rows;

    this.departmentService.getDepartmentsPaged(this.pageNumber, this.pageSize, this.searchTerm)
      .subscribe(result => {
        this.departments$.next(result.items);
       

        // Sync frontend with backend
        this.pageSize = result.pageSize;
        this.pageNumber = result.pageNumber;
      });
  }
}