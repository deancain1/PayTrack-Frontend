import { Routes } from '@angular/router';
import { Home } from './features/components/home/home';
import { Auth } from './features/components/auth/auth';
export const routes: Routes = [
     { path: '', component: Home },
     { path: 'auth', component: Auth },
];
