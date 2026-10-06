import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  balance: string = "24,310.47";
  lastUpdated: string = 'Sep 29, 2026 - 14:32 PST';
}
