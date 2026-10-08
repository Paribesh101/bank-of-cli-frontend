import { Component, inject } from '@angular/core';
import { BankService } from '../../service/bank.service';
import { CommonModule } from '@angular/common';
import { Spinner } from '../spinner/spinner';



@Component({
  imports: [CommonModule, Spinner],
  selector: 'app-account-overview',
  styleUrl: './account-overview.css',
  templateUrl: './account-overview.html',
})
export class AccountOverview {

  private readonly bankService = inject(BankService)
  readonly balance = this.bankService.balance;
  readonly lastUpdated = this.bankService.lastUpdated;
  readonly isLoading = this.bankService.isLoading;

  constructor() {
    this.bankService.loadAccount(4).subscribe();
  }

  // balance: number = 20.00;
  //lastUpdated: string = 'Sep 29, 2026 - 14:32 PST';
}