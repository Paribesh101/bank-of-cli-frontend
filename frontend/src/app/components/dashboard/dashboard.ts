import { Component } from '@angular/core';
import { AccountOverview } from '../account-overview/account-overview';
import { Analytics } from '../analytics/analytics';
import { Transaction } from '../transaction/transaction';

@Component({
  imports: [AccountOverview, Analytics, Transaction],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {}
