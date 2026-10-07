import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../contracts/transaction';
import { getTransactionsByAccountId } from '../../mock/api';

@Component({
  imports: [CommonModule],
  selector: 'app-analytics',
  styleUrl: './analytics.css',
  templateUrl: './analytics.html',
})
export class Analytics {

  transactions: Transaction[] = [];
  moneyIn = 0;
  moneyOut = 0;

  constructor() {
    this.transactions = getTransactionsByAccountId(3);

      for (const transaction of this.transactions) {
    if(transaction.type == 'deposit') {
      this.moneyIn += transaction.amount;
    }

    if(transaction.type == 'withdrawal') {
      this.moneyOut += transaction.amount;
    }

  }
  }


}
