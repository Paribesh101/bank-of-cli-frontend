import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as api from './mock/api'
import { Dashboard } from './components/dashboard/dashboard';

@Component({
  imports: [RouterOutlet, Dashboard],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('frontend');
}

console.log(api.getTransactions());