import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) { }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, data).pipe(
      tap((res: any) => {
        if (res?.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role || 'client');
          localStorage.setItem('userName', res.name || '');
          localStorage.setItem('userEmail', data.email);
        }
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, data);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getRole(): string {
    return localStorage.getItem('role') || 'client';
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  getUserName(): string {
    return localStorage.getItem('userName') || 'Utilizador';
  }

  getEmail(): string {
    return localStorage.getItem('userEmail') || '';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}