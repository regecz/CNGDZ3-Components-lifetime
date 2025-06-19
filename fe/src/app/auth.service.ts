import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { UserServiceService } from './user-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private loggedInUser = new BehaviorSubject<any | null>(null);

  constructor(private http: HttpClient, private userService: UserServiceService) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<{ username: string }>(`${this.apiUrl}/login`, credentials, { withCredentials: true }).pipe(
      tap((response) => {
        if (response) {
          this.userService.getUser().subscribe((user) => {
            this.setLoggedInUser(user); // Beállítjuk a bejelentkezett felhasználót
          })
        } else {
          console.error('Login failed: Invalid response from server'); // Hibaüzenet ha a válasz nem érvényes
        }
      })
    );
  }

  register(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, credentials, { withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.setLoggedInUser(null); // Felhasználó kijelentkezése
        this.userService.clearCache(); // Cache törlése
      })
    );
  }

  setLoggedInUser(user: any | null): void {
    this.loggedInUser.next(user); // Frissítjük a BehaviorSubject értékét
  }

  getLoggedInUser(): Observable<any | null> {
    if (!this.loggedInUser.getValue()) {
      // Ha a BehaviorSubject értéke null, kérdezzük le a backend-ről
      this.http.get<{ username: string }>(`${this.apiUrl}/profile`, { withCredentials: true }).subscribe(
        (response) => {
          if (response && response.username) {
            this.setLoggedInUser(response); // Frissítjük a BehaviorSubject-et
          } else {
            this.setLoggedInUser(null); // Nincs bejelentkezett felhasználó
          }
        },
        (error) => {
          console.error('Hiba a felhasználó lekérdezésekor:', error);
          this.setLoggedInUser(null); // Hiba esetén is töröljük az állapotot
        }
      );
    }
    return this.loggedInUser.asObservable(); // Visszaadjuk az Observable-t
  }
}