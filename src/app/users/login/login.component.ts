import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Import AuthService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup; // Form group for login form
  loginError: string | null = null; // Holds any login error messages

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) {
    this.initializeForm();
  }

  // Initializes the login form with validators
  private initializeForm(): void {
    this.loginForm = this.fb.group({
      loginId: ['', Validators.required], // Login ID field with required validator
      password: ['', Validators.required], // Password field with required validator
    });
  }

  // Handles form submission
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authenticateUser();
    } else {
      this.markFormAsTouched();
    }
  }

  // Authenticates the user by calling AuthService
  private authenticateUser(): void {
    const loginData = this.loginForm.value;

    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.handleSuccess(response.token);
      },
      error: (error) => {
        this.handleError(error);
      },
    });
  }

  // Handles successful login
  private handleSuccess(token: string): void {
    this.loginError = null; // Clear any previous errors
    this.router.navigate(['/blogs']); // Navigate to the blogs page
  }

  // Handles login errors
  private handleError(error: any): void {
    console.error('Error during login:', error);
    this.loginError = 'An error occurred during login. Please try again later.'; // Update error message
  }

  // Marks all form controls as touched to show validation errors
  private markFormAsTouched(): void {
    this.loginForm.markAllAsTouched();
    console.log('Login Form is invalid');
  }

  // Navigates to the registration page
  onRegister(): void {
    this.router.navigate(['/users/register']);
  }

  // Navigates to the forgot password page
  onForgotPassword(event: Event): void {
    event.preventDefault(); // Prevent default link behavior
    this.router.navigate(['/users/forgot-password']);
  }
}
