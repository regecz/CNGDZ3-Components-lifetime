import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private apiUrl = 'http://localhost:3000/auth/profile';
  private userCache: any = null;

  constructor(private http: HttpClient) {}

  getUser(): Observable<any> {
    
    if (this.userCache) {
      return of(this.userCache); // Ha van cache, azt adjuk vissza
    }

    // Lekérés a backendről
    return this.http.get<any>(this.apiUrl, { withCredentials: true }).pipe(
      tap(user => {
        this.userCache = user; // Cache-elés
        console.log('Fetched user:', user); // Debug üzenet
      })
    );
  }

  clearCache(): void {
    this.userCache = null; // Cache törlése
  }
  
}