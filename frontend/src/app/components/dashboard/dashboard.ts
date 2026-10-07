import { Component } from '@angular/core';
import { AccountOverview } from '../account-overview/account-overview';
import { History } from './history/history';

@Component({
  imports: [AccountOverview, History],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {}
