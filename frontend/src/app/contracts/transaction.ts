// export type TransactionType =
//   | 'deposit'
//   | 'withdraw'
//   | 'transfer';

export interface Transaction {
  id: number;
  timestamp: string;
  type: string;
  amount: number;
  accountId: number;
  relatedAccountId?: number;
}