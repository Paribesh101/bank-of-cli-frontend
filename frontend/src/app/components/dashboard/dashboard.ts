import { Component, inject } from '@angular/core';
import { AccountOverview } from '../account-overview/account-overview';
import { Analytics } from '../analytics/analytics';
import { Transaction } from '../transaction/transaction';
import { BankService } from '../../service/bank.service';

@Component({
  imports: [AccountOverview, Analytics, Transaction],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {

    private readonly bankService = inject(BankService);
    accountId = sessionStorage.getItem("accountId");

    ngOnInit() {
      this.bankService.loadAccount(Number(this.accountId || 0)).subscribe();
    }
}
