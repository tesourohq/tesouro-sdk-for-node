export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: Date; output: Date };
  JSON: { input: Record<string, any>; output: Record<string, any> };
}

export interface CreateUserInput {
  /** User's email address (must be unique) */
  email: Scalars['String']['input'];
  /** User's display name */
  name: Scalars['String']['input'];
}

export const Currency = {
  Brl: 'BRL',
  Eur: 'EUR',
  Gbp: 'GBP',
  Usd: 'USD',
} as const;

export type Currency = (typeof Currency)[keyof typeof Currency];
export interface Mutation {
  __typename?: 'Mutation';
  /** Cancel a pending transaction */
  cancelTransaction: Transaction;
  /** Create a new user account */
  createUser: User;
  /** Process a new transaction */
  processTransaction: Transaction;
  /** Update transaction status (admin operation) */
  updateTransactionStatus: Transaction;
}

export interface MutationCancelTransactionArgs {
  transactionId: Scalars['ID']['input'];
}

export interface MutationCreateUserArgs {
  input: CreateUserInput;
}

export interface MutationProcessTransactionArgs {
  input: ProcessTransactionInput;
}

export interface MutationUpdateTransactionStatusArgs {
  status: TransactionStatus;
  transactionId: Scalars['ID']['input'];
}

export interface ProcessTransactionInput {
  /** Transaction amount in minor units */
  amount: Scalars['Int']['input'];
  /** Currency for the transaction */
  currency: Currency;
  /** Optional metadata for the transaction */
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  /** ID of the user making the transaction */
  userId: Scalars['ID']['input'];
}

export interface Query {
  __typename?: 'Query';
  /** Get a transaction by its ID */
  getTransaction?: Maybe<Transaction>;
  /** Get a user by their ID */
  getUser?: Maybe<User>;
  /** Get transactions for a specific user */
  getUserTransactions: Array<Transaction>;
  /** List transactions with optional filtering and pagination */
  listTransactions: Array<Transaction>;
  /** List all users with optional pagination */
  listUsers: Array<User>;
}

export interface QueryGetTransactionArgs {
  id: Scalars['ID']['input'];
}

export interface QueryGetUserArgs {
  id: Scalars['ID']['input'];
}

export interface QueryGetUserTransactionsArgs {
  filter?: InputMaybe<TransactionFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  userId: Scalars['ID']['input'];
}

export interface QueryListTransactionsArgs {
  filter?: InputMaybe<TransactionFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}

export interface QueryListUsersArgs {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}

export interface Subscription {
  __typename?: 'Subscription';
  /** Subscribe to all transaction updates (admin only) */
  allTransactionUpdates: Transaction;
  /** Subscribe to transaction status changes for a user */
  transactionUpdates: Transaction;
}

export interface SubscriptionTransactionUpdatesArgs {
  userId: Scalars['ID']['input'];
}

export interface Transaction {
  __typename?: 'Transaction';
  /** Transaction amount in minor units (e.g., cents) */
  amount: Scalars['Int']['output'];
  /** When the transaction was created */
  createdAt: Scalars['DateTime']['output'];
  /** Currency of the transaction */
  currency: Currency;
  /** Unique identifier for the transaction */
  id: Scalars['ID']['output'];
  /** Additional metadata for the transaction */
  metadata?: Maybe<Scalars['JSON']['output']>;
  /** Current status of the transaction */
  status: TransactionStatus;
  /** When the transaction was last updated */
  updatedAt: Scalars['DateTime']['output'];
  /** User who owns this transaction */
  user: User;
}

export interface TransactionFilter {
  /** Filter by currency */
  currency?: InputMaybe<Currency>;
  /** Filter by date range start */
  fromDate?: InputMaybe<Scalars['DateTime']['input']>;
  /** Filter by maximum amount */
  maxAmount?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by minimum amount */
  minAmount?: InputMaybe<Scalars['Int']['input']>;
  /** Filter by transaction status */
  status?: InputMaybe<TransactionStatus>;
  /** Filter by date range end */
  toDate?: InputMaybe<Scalars['DateTime']['input']>;
}

export const TransactionStatus = {
  Cancelled: 'CANCELLED',
  Completed: 'COMPLETED',
  Failed: 'FAILED',
  Pending: 'PENDING',
  Processing: 'PROCESSING',
} as const;

export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus];
export interface User {
  __typename?: 'User';
  /** When the user account was created */
  createdAt: Scalars['DateTime']['output'];
  /** User's email address */
  email: Scalars['String']['output'];
  /** Unique identifier for the user */
  id: Scalars['ID']['output'];
  /** User's display name */
  name: Scalars['String']['output'];
  /** User's associated transactions */
  transactions: Array<Transaction>;
}
