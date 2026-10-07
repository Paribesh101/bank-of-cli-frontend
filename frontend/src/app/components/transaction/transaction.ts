import { Component, inject, OnInit } from '@angular/core';
import { BankService } from '../../service/bank.service';
import { FormsModule } from '@angular/forms'; 

@Component({
  imports: [FormsModule],
  selector: 'app-transaction',
  styleUrl: './transaction.css',
  templateUrl: './transaction.html',
})
export class Transaction {
  private readonly bankService = inject(BankService);
  readonly accountId = 1;

  type: 'deposit' | 'withdraw' | 'transfer' = 'deposit';
  username: string = '';
  amount: number = 0.00;
  description: string = ''

  ngOnInit() {
    console.log("init");
    this.bankService.loadAccount(this.accountId).subscribe();
  }

  onSubmit() {
    switch (this.type) {
      case 'deposit':
        this.bankService.deposit(this.amount);
        break;
    
      case 'withdraw':
        this.bankService.withdraw(this.amount);
        break;
    
      case 'transfer':
        this.bankService.transfer(100/*this.username*/, this.amount);
        break;
    
      default:
        break;
    }

    this.username = '';
    this.amount = 0.00;
    this.description = '';
  }



  private deposit(amount: number) {
    this.bankService.deposit(amount)
  }

}
