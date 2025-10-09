import { AuthService } from './../auth/services/auth.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

interface LoginResponse {
  token: string;
}
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  apiUrl: string = 'https://imav-motors-back.onrender.com/api'; //api poner la pai base
  tokenKey = 'authToken';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
  // Método para registrar un nuevo usuario

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`, {
      headers: this.getHeaders(),
    });
  }

  getUsuario(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuarios/${id}`, {
      headers: this.getHeaders(),
    });
  }

  createUsuario(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios`, data, {
      headers: this.getHeaders(),
    });
  }

  updateUsuario(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/usuarios/${id}`, data, {
      headers: this.getHeaders(),
    });
  }

  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuarios/${id}`, {
      headers: this.getHeaders(),
    });
  }

}
