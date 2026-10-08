import { Component, Input, inject } from '@angular/core';
import { BankService } from '../../service/bank.service';
import { FormsModule } from '@angular/forms'; 

@Component({
  imports: [FormsModule],
  selector: 'app-transaction',
  styleUrl: './transaction.css',
  templateUrl: './transaction.html',
})
export class Transaction {
  @Input()
  accountId: number = 0;

  private readonly bankService = inject(BankService);

  type: 'deposit' | 'withdraw' | 'transfer' = 'deposit';
  relatedAccountId: number | null = null;
  amount: number = 0.00;
  description: string = ''

  // ngOnInit() {
  //   console.log("init");
  //   this.bankService.loadAccount(this.accountId).subscribe();
  // }

  onSubmit() {
    console.log(this.accountId, this.type, this.relatedAccountId, this.amount, this.description);

    switch (this.type) {
      case 'deposit':
        this.bankService.deposit(this.amount).subscribe();
        break;
    
      case 'withdraw':
        this.bankService.withdraw(this.amount).subscribe();
        break;
    
      case 'transfer':
        this.bankService.transfer(this.relatedAccountId == null ? -1 : this.relatedAccountId, this.amount).subscribe();
        break;
    
      default:
        break;
    }

    this.relatedAccountId = null;
    this.amount = 0.00;
    this.description = '';
  }
}
