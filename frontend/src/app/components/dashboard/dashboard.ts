import { Component } from '@angular/core';
import { AccountOverview } from '../account-overview/account-overview';

@Component({
  imports: [AccountOverview],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {}
