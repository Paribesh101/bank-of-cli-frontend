export type TransactionType =
  | 'deposit'
  | 'withdraw'
  | 'transfer';

export interface Transaction {
  _id: number;
  timestamp: string;
  type: TransactionType;
  amount: number;
  account_id: number;
  related_account_id?: number;
}