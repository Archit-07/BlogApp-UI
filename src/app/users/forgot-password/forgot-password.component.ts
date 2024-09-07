import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  password: string | null = null; // To store the generated password
  showPassword: boolean = false; // To toggle password visibility
  copySuccess: boolean = false; // To indicate successful copy

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.forgotPasswordForm = this.fb.group({
      loginId: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', Validators.required]  // Added newPassword field
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const { loginId, email, newPassword } = this.forgotPasswordForm.value;
  
      this.authService.patchPassword(loginId, email, newPassword).subscribe({
        next: (response) => {
          console.log('Password updated successfully', response);
          this.navigateTo('/users/login');
        },
        error: (err) => {
          console.error('Error updating password:', err);
        }
      });
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
