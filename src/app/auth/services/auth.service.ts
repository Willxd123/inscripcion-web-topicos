import { environment } from './../../environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

interface LoginResponse {
  token: string;
  registro: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  tokenKey = 'authToken';
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private router: Router) {}

  login(registro: string, codigo: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/usuarios/auth/login`, { registro, codigo })
      .pipe(
        tap((response) => {
          if (response.token) {
            console.log('✅ Token recibido:', response.token);
            this.setToken(response.token);
          }
        }),
        catchError((err) => {
          console.error('❌ Error en el login:', err);
          throw err;
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  getUsuarioId(): number | null {
    const token = this.getToken();
    if (!token) return null;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.id || null;
    } catch {
      return null;
    }
  }
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() < payload.exp * 1000;
  }

  logout(): void {
    console.log('🔓 Logout ejecutado');
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/']);
  }
}
