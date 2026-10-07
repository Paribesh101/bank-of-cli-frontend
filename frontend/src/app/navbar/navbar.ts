import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {

  protected readonly isAuthenticated = signal(false);

  protected toggleLogin(): void {
    this.isAuthenticated.update((isAuthenticated) => !isAuthenticated);
  }
}
