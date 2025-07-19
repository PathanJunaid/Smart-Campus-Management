// src/app/shared/guards/role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.services';
AuthService

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];
    const currentRole = this.auth.getRole();
    if (expectedRole !== currentRole) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
