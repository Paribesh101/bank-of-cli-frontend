import { Account } from '../contracts/account';
import { Transaction } from '../contracts/transaction';
import accounts from './account.json';
import transactions from './transaction.json';

interface JsonTransaction {
  _id: number;
  timestamp: string;
  type: string;
  amount: number;
  account_id: number;
  related_account_id?: number;
}

interface JsonAccount {
    _id: 1,
    username: string,
    password: string,
    first_name: string,
    last_name: string,
    balance: number
}

export function getAccounts() {
    return accounts.map(account => mapAccount(account as JsonAccount));
}

export function getAccountById(id: number) {
    const account: Account = mapAccount(
        accounts.filter(a => a._id == id)[0] as JsonAccount
    );
    return account;
}

export function getTransactions() {
    return transactions.map(transaction => mapTransaction(transaction as JsonTransaction));
}

function mapAccount(account: JsonAccount): Account {
    return {
        id: account._id,
        username: account.username,
        password: account.password,
        firstName: account.first_name,
        lastName: account.last_name,
        balance: account.balance
    }
}

function mapTransaction(transaction: JsonTransaction): Transaction {
    return {
        id: transaction._id,
        timestamp: transaction.timestamp,
        type: transaction.type,
        amount: transaction.amount,
        accountId: transaction.account_id,
        relatedAccountId: transaction.related_account_id
    }
}