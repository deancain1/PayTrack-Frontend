import { Component } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FormsModule, NgForm } from '@angular/forms';

import { AuthService } from '../../services/auth-service';
import { MessageService } from 'primeng/api';
import { AuthResponse } from '../../models/auth-response';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    ToolbarModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FormsModule
  ],
  templateUrl: './auth.html',
  styleUrls: ['./auth.scss'],
})


export class Auth {

 

  model = {
    fullName: '',
    companyName: '',
    role: 'User',
    email: '',
    password: '',
    profilePicture: ''
  };

  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) {}



  // ---------------- REGISTER ----------------
onRegister(registerForm: NgForm) {
  if (registerForm.invalid) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Validation',
      detail: 'All fields are required'
    });
    return;
  }

  this.authService.register(this.model).subscribe({
    next: (res: AuthResponse) => {
      console.log("SUCCESS:", res);

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Registered successfully'
      });

      // reset form model
      this.model = {
        fullName: '',
        companyName: '',
        role: 'User',
        email: '',
        password: '',
        profilePicture: ''
      };

      registerForm.resetForm(this.model);
    },

    error: (err) => {
      console.log("FULL ERROR:", err);
      console.log("STATUS:", err.status);
      console.log("ERROR BODY:", err.error);

      // try to extract backend validation message
      const backendMessage =
        err?.error?.message ||
        err?.error?.title ||
        (err?.error?.errors
          ? Object.values(err.error.errors).flat().join(', ')
          : null);

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: backendMessage || 'Registration failed'
      });
    }
  });
}
}