import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) { }

  login(credintials: {username: string, password: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credintials, { withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true });
  }

  checkSession(): Observable<any> {
    return this.http.get(`${this.apiUrl}/session`, { withCredentials: true });
  }

}
