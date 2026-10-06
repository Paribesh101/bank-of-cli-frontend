import { Injectable, InjectionToken, computed, inject, signal } from '@angular/core';
import { Observable, defer, finalize, forkJoin, map, tap, timer } from 'rxjs';
import { Account } from '../contracts/account';
import { Transaction } from '../contracts/transaction';
import { getAccounts, getTransactions } from '../mock/api';

/* ============================================================================
 * 1. TYPES
 * ========================================================================== */

export type TransactionType = 'deposit' | 'withdraw' | 'transfer';

/** What the UI is allowed to see. Passwords never leave the service layer. */
export type AccountSummary = Omit<Account, 'password'>;

export interface TransactionResult {
  account: AccountSummary;   // account state AFTER the transaction
  transaction: Transaction;  // the newly recorded transaction
}

export type BankErrorCode =
  | 'INVALID_AMOUNT'
  | 'INSUFFICIENT_FUNDS'
  | 'ACCOUNT_NOT_FOUND'
  | 'SAME_ACCOUNT'
  | 'NO_ACTIVE_ACCOUNT';

/** One error type for the whole app, so modals/toasts can switch on `code`. */
export class BankError extends Error {
  constructor(public readonly code: BankErrorCode, message: string) {
    super(message);
    this.name = 'BankError';
  }
}

/* ============================================================================
 * 2. DATA SOURCE ABSTRACTION (Dependency Inversion)
 * BankService depends on this interface, never on the mock directly.
 * When the real backend exists, write an HttpBankDataSource that implements
 * the same interface and register it in app.config.ts:
 *
 *   providers: [{ provide: BANK_DATA_SOURCE, useClass: HttpBankDataSource }]
 *
 * No component and no line of BankService has to change.
 * ========================================================================== */

export interface BankDataSource {
  getAccount(id: number): Observable<AccountSummary>;
  getTransactions(accountId: number): Observable<Transaction[]>;
  deposit(accountId: number, amount: number): Observable<TransactionResult>;
  withdraw(accountId: number, amount: number): Observable<TransactionResult>;
  transfer(fromId: number, toId: number, amount: number): Observable<TransactionResult>;
}

export const BANK_DATA_SOURCE = new InjectionToken<BankDataSource>('BankDataSource', {
  providedIn: 'root',
  factory: () => new MockBankDataSource(),
});

/* ============================================================================
 * 3. SHARED RULES (used by both the client-side checks and the mock "server")
 * ========================================================================== */

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function assertValidAmount(amount: number): void {
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
    throw new BankError('INVALID_AMOUNT', 'Amount must be a number greater than 0.');
  }
  const cents = amount * 100;
  if (Math.abs(cents - Math.round(cents)) > 1e-9) {
    throw new BankError('INVALID_AMOUNT', 'Amount cannot have more than 2 decimal places.');
  }
}

function assertSufficientFunds(balance: number, amount: number): void {
  if (amount > balance) {
    throw new BankError('INSUFFICIENT_FUNDS', 'Insufficient funds for this transaction.');
  }
}

function toSummary(account: Account): AccountSummary {
  const { password: _password, ...summary } = account;
  return summary;
}

/* ============================================================================
 * 4. MOCK DATA SOURCE (pretends to be the backend)
 * ========================================================================== */

const MOCK_LATENCY_MS = 600;

export class MockBankDataSource implements BankDataSource {
  private readonly accounts: Account[] = getAccounts().map((a) => ({ ...a }));
  private readonly transactions: Transaction[] = getTransactions().map((t) => ({ ...t }));

  constructor(private readonly latencyMs: number = MOCK_LATENCY_MS) {}

  getAccount(id: number): Observable<AccountSummary> {
    return this.respond(() => toSummary(this.findAccount(id)));
  }

  getTransactions(accountId: number): Observable<Transaction[]> {
    return this.respond(() => {
      this.findAccount(accountId);
      return this.transactions
        .filter((t) => t.accountId === accountId || t.relatedAccountId === accountId)
        .sort((a, b) => b.id - a.id) // newest first
        .map((t) => ({ ...t }));
    });
  }

  deposit(accountId: number, amount: number): Observable<TransactionResult> {
    return this.respond(() => {
      assertValidAmount(amount);
      const account = this.findAccount(accountId);
      account.balance = roundMoney(account.balance + amount);
      return { account: toSummary(account), transaction: this.record('deposit', amount, accountId) };
    });
  }

  withdraw(accountId: number, amount: number): Observable<TransactionResult> {
    return this.respond(() => {
      assertValidAmount(amount);
      const account = this.findAccount(accountId);
      assertSufficientFunds(account.balance, amount);
      account.balance = roundMoney(account.balance - amount);
      return { account: toSummary(account), transaction: this.record('withdraw', amount, accountId) };
    });
  }

  transfer(fromId: number, toId: number, amount: number): Observable<TransactionResult> {
    return this.respond(() => {
      assertValidAmount(amount);
      if (fromId === toId) {
        throw new BankError('SAME_ACCOUNT', 'You cannot transfer money to your own account.');
      }
      const from = this.findAccount(fromId);
      const to = this.findAccount(toId);
      assertSufficientFunds(from.balance, amount);
      from.balance = roundMoney(from.balance - amount);
      to.balance = roundMoney(to.balance + amount);
      return { account: toSummary(from), transaction: this.record('transfer', amount, fromId, toId) };
    });
  }

  /** Runs `work` after the simulated delay. Thrown errors become Observable errors. */
  private respond<T>(work: () => T): Observable<T> {
    return timer(this.latencyMs).pipe(map(() => work()));
  }

  private findAccount(id: number): Account {
    const account = this.accounts.find((a) => a.id === id);
    if (!account) {
      throw new BankError('ACCOUNT_NOT_FOUND', `Account #${id} was not found.`);
    }
    return account;
  }

  private record(
    type: TransactionType,
    amount: number,
    accountId: number,
    relatedAccountId?: number,
  ): Transaction {
    const transaction: Transaction = {
      id: this.transactions.reduce((max, t) => Math.max(max, t.id), 0) + 1,
      accountId,
      type,
      amount,
      timestamp: new Date().toISOString(),
      ...(relatedAccountId !== undefined && { relatedAccountId }),
    };
    this.transactions.push(transaction);
    return { ...transaction };
  }
}

/* ============================================================================
 * 5. BANK SERVICE (the only thing components inject)
 * - Holds the active account + its history as signals, so every component
 *   showing balance/history updates automatically after a transaction.
 * - Validates on the client first (fast feedback), then calls the data source.
 * - Every method returns an Observable; errors are always BankError.
 * ========================================================================== */

@Injectable({ providedIn: 'root' })
export class BankService {
  private readonly api = inject(BANK_DATA_SOURCE);

  private readonly _account = signal<AccountSummary | null>(null);
  private readonly _transactions = signal<Transaction[]>([]);
  private readonly _pending = signal(0);

  /** The logged-in user's account, or null before loadAccount() / after clear(). */
  readonly account = this._account.asReadonly();
  /** History for the active account, newest first. Includes incoming transfers. */
  readonly transactions = this._transactions.asReadonly();
  readonly balance = computed(() => this._account()?.balance ?? 0);
  readonly hasTransactions = computed(() => this._transactions().length > 0);
  /** True while any request made through this service is in flight (for spinners). */
  readonly isLoading = computed(() => this._pending() > 0);

  /** Call once after a successful login. Loads the account and its history. */
  loadAccount(accountId: number): Observable<AccountSummary> {
    return this.track(
      forkJoin({
        account: this.api.getAccount(accountId),
        transactions: this.api.getTransactions(accountId),
      }).pipe(
        tap(({ account, transactions }) => {
          this._account.set(account);
          this._transactions.set(transactions);
        }),
        map(({ account }) => account),
      ),
    );
  }

  refreshTransactions(): Observable<Transaction[]> {
    return this.track(
      defer(() => this.api.getTransactions(this.requireAccountId())).pipe(
        tap((transactions) => this._transactions.set(transactions)),
      ),
    );
  }

  deposit(amount: number): Observable<TransactionResult> {
    return this.runTransaction(() => {
      assertValidAmount(amount);
      return this.api.deposit(this.requireAccountId(), amount);
    });
  }

  withdraw(amount: number): Observable<TransactionResult> {
    return this.runTransaction(() => {
      assertValidAmount(amount);
      assertSufficientFunds(this.balance(), amount);
      return this.api.withdraw(this.requireAccountId(), amount);
    });
  }

  transfer(toAccountId: number, amount: number): Observable<TransactionResult> {
    return this.runTransaction(() => {
      assertValidAmount(amount);
      if (!Number.isInteger(toAccountId) || toAccountId <= 0) {
        throw new BankError('ACCOUNT_NOT_FOUND', 'Please enter a valid recipient account ID.');
      }
      const fromId = this.requireAccountId();
      if (toAccountId === fromId) {
        throw new BankError('SAME_ACCOUNT', 'You cannot transfer money to your own account.');
      }
      assertSufficientFunds(this.balance(), amount);
      return this.api.transfer(fromId, toAccountId, amount);
    });
  }

  /**
   * Helper for the history table: 'in' means money came into the active
   * account (deposit or incoming transfer), 'out' means it left.
   */
  getDirection(transaction: Transaction): 'in' | 'out' {
    if (transaction.type === 'deposit') return 'in';
    if (transaction.type === 'transfer') {
      return transaction.accountId === this._account()?.id ? 'out' : 'in';
    }
    return 'out';
  }

  /** Call on logout. */
  clear(): void {
    this._account.set(null);
    this._transactions.set([]);
  }

  private runTransaction(request: () => Observable<TransactionResult>): Observable<TransactionResult> {
    return this.track(
      defer(request).pipe(
        tap(({ account, transaction }) => {
          this._account.set(account);
          this._transactions.update((list) => [transaction, ...list]);
        }),
      ),
    );
  }

  private requireAccountId(): number {
    const account = this._account();
    if (!account) {
      throw new BankError('NO_ACTIVE_ACCOUNT', 'No account is loaded. Please log in again.');
    }
    return account.id;
  }

  /** Counts in-flight requests so `isLoading` stays correct with parallel calls. */
  private track<T>(source: Observable<T>): Observable<T> {
    return defer(() => {
      this._pending.update((n) => n + 1);
      return source.pipe(finalize(() => this._pending.update((n) => n - 1)));
    });
  }
}
