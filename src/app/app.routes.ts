import { Routes } from '@angular/router';

import { Home } from './features/components/home/home';
import { Auth } from './features/components/auth/auth';

import { Dashboard } from './CompanyAdmin/dashboard/dashboard';

import { roleGuard } from './core/guards/role-guard';
import { authGuard } from './core/guards/auth-guard';
export const routes: Routes = [

  { path: '', component: Home },

  { path: 'auth', component: Auth },

  {
    path: 'company-admin-dashboard',
    component: Dashboard,
    canActivate: [authGuard ,roleGuard],
    data: { roles: ['CompanyAdmin'] }
  },

//   {
//     path: 'admin-dashboard',
//     component: AdminDashboard,
//     canActivate: [roleGuard],
//     data: { roles: ['Admin'] }
//   },

//   {
//     path: 'employee-dashboard',
//     component: EmployeeDashboard,
//     canActivate: [roleGuard],
//     data: { roles: ['Employee'] }
//   },

  { path: '**', redirectTo: '' }
];