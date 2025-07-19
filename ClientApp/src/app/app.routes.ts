import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { RoleGuard } from './shared/guards/role.guard';
import { NoAuthGuard } from './shared/guards/no-auth.guard';
import { UserRole } from './Models/Enum/UserEnum';

export const routes: Routes = [
    { path: 'login',
      component: LoginComponent,
      canActivate : [NoAuthGuard]
     },
    { path: 'register',
      component: RegisterComponent,
      canActivate : [NoAuthGuard]
    },
    
  // {
  //   path: 'dashboard',
  //   component: AdminDashboardComponent,
  //   canActivate: [RoleGuard],
  //   data: { expectedRole: UserRole.Admin },
  // },
//   {
//     path: 'dashboard',
//     component: FacultyDashboardComponent,
//     canActivate: [RoleGuard],
//     data: { expectedRole: 'Faculty' },
//   },
//   {
//     path: 'dashboard',
//     component: StudentDashboardComponent,
//     canActivate: [RoleGuard],
//     data: { expectedRole: 'Student' },
//   },
];
