import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { SharedModule } from '../../../../shared.module';
import { DepartmentsService } from '../../../features/services/departments-service';
import { DepartmentModel } from '../../../features/models/departments/department-model';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-add-employee-dialog',
  imports: [SharedModule],
  templateUrl: './add-employee-dialog.html',
  styleUrl: './add-employee-dialog.scss',
})
export class AddEmployeeDialog implements OnInit{

  departments: DepartmentModel[] = [];

selectedDepartmentId: string = '';

  @Input() displayAddEmployeeVisible = false;
  @Output() displayAddEmployeeVisibleChange = new EventEmitter<boolean>();

  @Output() created = new EventEmitter<any>();

   profilePreview: string | null = null;
   profileFile: File | null = null;

   isSubmitting = false;

   constructor(private messageService: MessageService, private departmentsService: DepartmentsService,  private cdr: ChangeDetectorRef){}

     ngOnInit(): void {
      this.loadDepartments();
  }

     onProfileImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;

    this.profileFile = input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.profilePreview = reader.result as string;
    };
    reader.readAsDataURL(this.profileFile);
  }

 loadDepartments(): void {
  this.departmentsService.getMyDepartments().subscribe({
    next: (res) => {
      this.departments = res;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error(err);
    }
  });
}

   createEmployee(employeeForm: NgForm) {
    if (employeeForm.invalid || this.isSubmitting) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'All fields required'
      });
      return;
    }

    this.isSubmitting = true;

    const payload = {
      fullName: employeeForm.value.fullName,
      email: employeeForm.value.email,
      phoneNumber: employeeForm.value.phoneNumber,
      department: employeeForm.value.department,
      password: employeeForm.value.password,
      role: 'Employee',
      profilePicture: this.profilePreview ?? undefined
    };

    this.created.emit(payload);

    employeeForm.resetForm();
    this.resetFormState();
    this.close();

    this.isSubmitting = false;
  }

   close() {
    this.displayAddEmployeeVisible = false;
    this.displayAddEmployeeVisibleChange.emit(false);
    this.resetFormState();
  }

  private resetFormState() {
    this.profilePreview = null;
    this.profileFile = null;
  }

}
