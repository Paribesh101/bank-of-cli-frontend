import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../service/user';
import { FormsModule } from '@angular/forms';

/**
 * Handles user login functionality.
 * Binds input fields for username and password, and attempts authentication
 * using the User service. Navigates to the home page on success, or displays
 * an error message on failure.
 */
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  usernameInput = '';
  passwordInput = '';
  errorMessage = '';

  private router = inject(Router);
  private userService = inject(User);
  private mode = signal("register");

  

  /**
   * Attempts to log in using the provided credentials.
   * Navigates to the home page if successful, otherwise sets an error message.
   */
  async attemptLogin() {
    const loginSuccessful = this.userService.login(this.usernameInput, this.passwordInput);
    if (loginSuccessful) {
      await this.router.navigate(['dashboard']);
    } else {
      this.errorMessage = 'login failed, please try again';
    }
  }
}