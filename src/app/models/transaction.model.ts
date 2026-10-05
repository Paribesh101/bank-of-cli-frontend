export type TransactionType = 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';

export interface Transaction {
    transactionId: number;
    accountId: number;
    relatedAccountId: number | null;
    transactionType: TransactionType;
    amount: number;
    timestamp: string;
}

export interface TransactionRequest {
    accountId: number;
    relatedAccountId: number | null;
    transactionType: TransactionType;
    amount: number;
}

export interface TransactionResponse {
    success: boolean;
    newBalance: number | null;
    message: string;
}


