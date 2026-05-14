import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api-service';
import { AuthResponse } from '../models/auth-response';
import { RegisterModel } from '../models/users/user-register-model';
// import { SessionUser } from '../models/session/session-user';
// import jwt_decode from 'jwt-decode';




@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private api: ApiService) {}

register(user: RegisterModel): Observable<AuthResponse> {
  return this.api.post<AuthResponse>('api/Auth/register', user);
}

login(credentials: { email: string; password: string }): Observable<AuthResponse> {
  return this.api.post<AuthResponse>('api/Auth/login', credentials);
}

//  getCurrentUser(): SessionUser | null {
//     const token = this.getToken();
//     if (!token) return null;

//     try {
//     const payload: any = jwt_decode(token); 
//       return {
//         id: payload.sub,
//         email: payload.email,
//         role: payload.role,
//       };
//     } catch (error) {
//       console.error('Invalid token', error);
//       return null;
//     }
//   }

  // isAdmin(): boolean {
  //   const user = this.getCurrentUser();
  //   return user?.role === 'Admin';
  // }
  saveToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

 
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

 
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  
  logout() {
    localStorage.removeItem('accessToken');
  }
  
//  forgotPassword(email: string) {
//   return this.api.post('api/Auth/forgot-password', { email });
// }

// verifyOtp(email: string, otp: string) {
//   return this.api.post('api/Auth/verify-otp', { email, otp });
// }

// resetPassword(email: string, otp: string, newPassword: string) {
//   return this.api.post('api/Auth/reset-password', { email, otp, newPassword });
// }

}
