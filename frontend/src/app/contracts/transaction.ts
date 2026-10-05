export type TransactionType =
  | 'DEPOSIT'
  | 'WITHDRAWAL'
  | 'TRANSFER';

export interface Transaction {
  transactionId: number;
  accountId: number;
  type: TransactionType;
  amount: number;
  timestamp: string;
  relatedAccountId?: number;
}