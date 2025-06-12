import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { UserServiceService } from '../user-service.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { MatIcon } from '@angular/material/icon';
import { MatMenu } from '@angular/material/menu';
import { MatButton } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [MatToolbarModule, RouterOutlet, CommonModule, MatIcon, MatMenu, MatButton, MatMenuModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  username: string | null = null;

  constructor(private userService: UserServiceService, private authService: AuthService, private router: Router) {};
  

  setUsername(username: string | null) {
    this.username = username; // Bejelentkezett felhasználó neve
    console.log('setUsername meghívva, új érték:', this.username); // Debug üzenet
  }
  
  ngOnInit() {
    this.authService.getLoggedInUser().subscribe((user: any | null) => {
      
      if (user) {
        this.setUsername(user.username); // Beállítjuk a felhasználónevet
      } else {
        console.log('Nincs bejelentkezett felhasználó by init   '); // Debug üzenet
      }
    });
  }


  logout() {
    this.authService.logout().subscribe(() => { 
      this.setUsername(null); // Kijelentkezett felhasználó neve
      console.log('Logout successful'); // Kijelentkezés sikeres
      this.router.navigate(['/']); // Navigálás a bejelentkező oldalra
    });
  }
}
