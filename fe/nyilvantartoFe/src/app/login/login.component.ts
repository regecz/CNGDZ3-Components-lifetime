import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserServiceService } from '../user-service.service';


@Component({
  selector: 'app-login',
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private authService: AuthService, private userService: UserServiceService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      this.authService.login(loginData).subscribe(
        (response) => {
          console.log('Login successful', response);
          this.router.navigate(['/components']); // Navigálás a főoldalra
        },
        (error) => {
          console.error('Login failed', error);
        }
      );
    }
  }

  onRegister() {
    if (this.loginForm.valid) {
      const registerData = this.loginForm.value;
      this.authService.register(registerData).subscribe(
        (response: any) => {
        console.log('Registration successful', response);
        
      },
      (error: any) => {
        console.error('Registration failed', error);
        let errorMsg = 'Sikertelen regisztráció';
        
        if (error.error && error.error.message) {
          errorMsg += ': ' + error.error.message;
        }
        
        alert(errorMsg);
      });
    }
  }
}