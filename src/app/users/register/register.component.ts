import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Import the AuthService

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm!: FormGroup;
  submissionError: string | null = null;
  showPassword: boolean = false; // Property to toggle password visibility

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService // Inject the AuthService
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      loginId: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      contact: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.registerUser();
    } else {
      console.log('Form is invalid');
      this.registerForm.markAllAsTouched();
    }
  }

  private registerUser(): void {
    const registerData = this.registerForm.value;

    this.authService.register(registerData).subscribe({
      next: () => {
        console.log('Registration successful');
        this.router.navigate(['/users/login']);
      },
      error: (error) => {
        console.error('Registration failed', error);
        this.submissionError = 'Registration failed. Please try again.';
      },
    });
  }
}
