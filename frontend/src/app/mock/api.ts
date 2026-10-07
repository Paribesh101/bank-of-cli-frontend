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
    _id: number,
    username: string,
    password: string,
    first_name: string,
    last_name: string,
    balance: number
}


export function addAccount(account: Account): Account {
    // Pretends to add an account and return it with the id and balance filled
    return {
        id: 6,
        username: account.username,
        password: account.password,
        firstName: account.firstName,
        lastName: account.lastName,
        balance: 0
    }
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

export function getTransactionsByAccountId(id: number) {
    return transactions
        .filter(transaction => transaction.account_id == id)
            .map(transaction => mapTransaction(transaction as JsonTransaction));
}

export function deposit(amount: number, accountId: number) {
    const selectedAccount: JsonAccount = accounts.filter(account => account._id == accountId)[0] as JsonAccount;
    if (!selectedAccount)
        throw new Error("Could not find account with id: " + accountId);
}

export function withdraw(amount: number, accountId: number) {
    const selectedAccount: JsonAccount = accounts.filter(account => account._id == accountId)[0] as JsonAccount;
    if (!selectedAccount)
        throw new Error("Could not find account with id: " + accountId);
}

export function transfer(amount: number, accountId: number, relatedAccountId: number) {
    const selectedAccount: JsonAccount = accounts.filter(account => account._id == accountId)[0] as JsonAccount;
    if (!selectedAccount)
        throw new Error("Could not find account with id: " + accountId);
    const relatedAccount: JsonAccount = accounts.filter(account => account._id == relatedAccountId)[0] as JsonAccount;
    if (!relatedAccount)
        throw new Error("Could not find related account with id: " + relatedAccountId);
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