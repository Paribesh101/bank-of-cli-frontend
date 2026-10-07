import { AfterViewInit, Component, effect, inject, OnInit, ViewChild } from '@angular/core';

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
export class History implements OnInit, AfterViewInit {
  private readonly bankService = inject(BankService);

  displayedColumns: string[] = ['timestamp', 'type', 'amount'];

  dataSource = new MatTableDataSource<Transaction>([]);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor() {
    
    effect(() => {
      this.dataSource.data = this.bankService.transactions();
    });
  }

  ngOnInit(): void {
    /*TEMPORARY:*/
    if (this.bankService.account() === null) {
      this.bankService.loadAccount(1).subscribe({
        error: (error) => {
          console.error('Could not load transaction history:', error);
        },
      });
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.dataSource.filter = input.value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
