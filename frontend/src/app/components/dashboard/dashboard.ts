import { Component } from '@angular/core';
import { AccountOverview } from '../account-overview/account-overview';
import { Transaction } from '../transaction/transaction';

@Component({
  imports: [AccountOverview, Transaction],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {}
