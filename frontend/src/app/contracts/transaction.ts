export interface Transaction {
  id?: number;
  accountId: number;
  type: string;
  amount: number;
  timestamp: string;
  relatedAccountId?: number;
}