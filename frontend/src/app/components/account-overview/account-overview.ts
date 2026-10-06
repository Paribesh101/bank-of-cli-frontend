import { Component } from '@angular/core';


@Component({
  imports: [],
  selector: 'app-account-overview',
  styleUrl: './account-overview.css',
  templateUrl: './account-overview.html',
})
export class AccountOverview {
  balance: number = 20.00;
  lastUpdated: string = 'Sep 29, 2026 - 14:32 PST';
}