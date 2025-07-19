// src/app/shared/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginDTO } from '../../Models/DTO/Login';
import { ApiResponse } from '../../Models/DTO/shared';
import { UserDto } from '../../Models/DTO/User';
import { ToastService } from './toast.service';
import { UserRole } from '../../Models/Enum/UserEnum';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users/auth`;

  constructor(private http: HttpClient, private toast : ToastService) {}

  login(payload: LoginDTO): Observable<ApiResponse<UserDto>> {
    return this.http.post<ApiResponse<UserDto>>(`${this.apiUrl}/login`, payload).pipe(
      tap(response => {
        if (response.success) {
          this.toast.success(`Welcome ${response.data.firstName} ${response.data.lastName}`);
        } else {
          this.toast.error(response.message || 'Login failed!');
        }
      }),
      catchError(error => {
        this.toast.error('Something went wrong. Please try again.');
        return throwError(() => error);
      })

    )
  }

  register(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  logout() {
    localStorage.clear();
  }

  getRole(): number | null {
    return Number(localStorage.getItem('role')) as UserRole;
    
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}
