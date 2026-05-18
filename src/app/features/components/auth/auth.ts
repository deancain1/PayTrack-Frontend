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
import { LoginModel } from '../../models/users/user-login-model';
import { Router } from '@angular/router';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login';

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

  isFlipped: boolean = false;

  model = {
    fullName: '',
    companyName: '',
    role: 'CompanyAdmin',
    email: '',
    password: '',
    profilePicture: ''
  };

  loginModel = {
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private socialAuthService: SocialAuthService
  ) {}

 toggleForm(event:Event){
  event.preventDefault();
  this.isFlipped = !this.isFlipped;
 }

  //REGISTER
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

// Login
 onLogin(loginForm: NgForm) {

    if (loginForm.invalid) {

      this.messageService.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Please enter your credentials.'
      });

      return;
    }

    this.authService.login(this.loginModel).subscribe({

      next: (response) => {

        this.authService.saveToken(response.token);

        this.messageService.add({
          severity: 'success',
          summary: 'Login Successful',
          detail: 'Welcome back!'
        });

        loginForm.resetForm();

        switch (response.role) {

          case 'CompanyAdmin':
            this.router.navigate(['/company-admin-dashboard']);
            break;

          case 'Admin':
            this.router.navigate(['/admin-dashboard']);
            break;

          case 'Employee':
            this.router.navigate(['/employee-dashboard']);
            break;

          default:
            this.router.navigate(['/']);
            break;
        }
      },

      error: (error) => {

        console.error(error);

        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: error?.error?.message || 'Invalid email or password.'
        });
      }
    });
  }
  signInWithGoogle(): void {

  this.socialAuthService
    .signIn(GoogleLoginProvider.PROVIDER_ID)
    .then((user: SocialUser) => {

      console.log(user);

      // Send token to backend
      // user.idToken

    })
    .catch(err => {
      console.error(err);
    });
}
}