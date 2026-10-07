import { Component, Input, inject } from '@angular/core';
import { BankService } from '../../service/bank.service';
import { FormsModule } from '@angular/forms'; 
import { ToastService } from '../../service/toast';

@Component({
  imports: [FormsModule],
  selector: 'app-transaction',
  styleUrl: './transaction.css',
  templateUrl: './transaction.html',
})
export class Transaction {
  private readonly bankService = inject(BankService);
  private readonly toastService = inject(ToastService);

  accountId = sessionStorage.getItem("accountId");

  type: 'deposit' | 'withdraw' | 'transfer' = 'deposit';
  relatedAccountId: number | null = null;
  amount: number = 0.00;
  description: string = ''

  ngOnInit() {
    console.log("init");
    this.bankService.loadAccount(Number(this.accountId || 0)).subscribe();
  }

  onSubmit() {
    console.log(this.accountId, this.type, this.relatedAccountId, this.amount, this.description);

    try {
      switch (this.type) {
        case 'deposit':
          this.bankService.deposit(this.amount).subscribe(() =>
            this.toastService.success("Deposit successful!")
          );
          break;
      
        case 'withdraw':
          this.bankService.withdraw(this.amount).subscribe(() =>
            this.toastService.success("Withdraw successful!")
          );
          break;
      
        case 'transfer':
          this.bankService.transfer(this.relatedAccountId == null ? -1 : this.relatedAccountId, this.amount).subscribe(() =>
            this.toastService.success("Transfer successful!")
          );
          break;
        
        default:
          break;
      }

      this.relatedAccountId = null;
      this.amount = 0.00;
      this.description = '';
    } catch (error: unknown) {
      
    }
  }
}
