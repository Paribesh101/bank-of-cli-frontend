import { AfterViewInit, Component, effect, inject, ViewChild } from '@angular/core';

import { CurrencyPipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Transaction } from '../../../contracts/transaction';
import { BankService } from '../../../service/bank.service';

@Component({
  selector: 'app-history',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    CurrencyPipe,
  ],
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class History implements AfterViewInit {
  private readonly bankService = inject(BankService);

  /*
   * Get the ID of the account that is currently logged in.
   *
   * sessionStorage gives us a string, so Number() changes it
   * into a number that we can compare with accountId.
   */
  accountId = Number(sessionStorage.getItem('accountId') || 0);

  displayedColumns: string[] = ['timestamp', 'type', 'amount'];

  dataSource = new MatTableDataSource<Transaction>([]);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor() {
    /*
     * Whenever BankService's transaction list changes,
     * update the table automatically.
     */
    effect(() => {
      this.dataSource.data = this.bankService.transactions();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /*
   * Filters the table when the user types
   * something into the search box.
   */
  applyFilter(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.dataSource.filter = input.value.trim().toLowerCase();

    /*
     * Go back to page 1 after filtering.
     */
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /*
   * Changes a timestamp like:
   *
   * 2020-07-08 14:40:06-07
   *
   * into:
   *
   * Jul 08, 2020
   */
  formatDate(timestamp: string): string {
    // Get only "2020-07-08"
    const date = timestamp.substring(0, 10);

    // Split it into year, month, and day.
    const [year, month, day] = date.split('-');

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    // JSON months start at 01, but arrays start at 0.
    const monthName = months[Number(month) - 1];

    return `${monthName} ${day}, ${year}`;
  }

  /*
   * Decide what color a transfer amount should be.
   *
   * Example:
   *
   * accountId: 1
   * relatedAccountId: 2
   *
   * means account 1 sent money to account 2.
   *
   * If the logged-in account is accountId:
   * money left the account -> red.
   *
   * If the logged-in account is relatedAccountId:
   * money entered the account -> green.
   */
  /*
   * Decide what color the transaction amount should be.
   *
   * Deposit:
   * money comes IN -> green
   *
   * Withdraw:
   * money goes OUT -> red
   *
   * Transfer:
   * depends on whether the logged-in account
   * sent or received the money.
   */
  getAmountClass(transaction: Transaction): string {
    // Deposits add money to the account.
    if (transaction.type === 'deposit') {
      return 'amount-positive';
    }

    // Withdrawals remove money from the account.
    if (transaction.type === 'withdraw') {
      return 'amount-negative';
    }

    // Transfers need to check who sent and received the money.
    if (transaction.type === 'transfer') {
      // Logged-in account sent the money.
      if (transaction.accountId === this.accountId) {
        return 'amount-negative';
      }

      // Logged-in account received the money.
      if (transaction.relatedAccountId === this.accountId) {
        return 'amount-positive';
      }
    }

    return '';
  }
}
