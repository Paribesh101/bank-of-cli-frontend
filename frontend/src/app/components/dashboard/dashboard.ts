import { Component } from '@angular/core';
import { AccountOverview } from '../account-overview/account-overview';
import { Analytics } from '../analytics/analytics';

@Component({
  imports: [AccountOverview, Analytics],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {}
