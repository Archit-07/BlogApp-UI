import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service'; // Import AuthService

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private authService: AuthService, private router: Router) {}

  // Check if the user is logged in by calling the authService
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn(); // Checks if the token exists
  }

  // Check if the current route is '/blogs'
  isBlogsPage(): boolean {
    return this.router.url === '/blogs'; // Only show buttons on /blogs page
  }

  // Log the user out
  onLogout(): void {
    this.authService.logout(); // Log out the user
    this.router.navigate(['/users/login']); // Redirect to login page
  }

  // Redirect to the login page
  onLogin(): void {
    this.router.navigate(['/users/login']); // Redirect to login page
  }
}
