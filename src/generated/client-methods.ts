import type { ClientRequestOptions, GraphQLResult } from '../client';
import type {
  QueryGetTransactionArgs,
  Transaction,
  QueryGetUserArgs,
  User,
  QueryGetUserTransactionsArgs,
  QueryListTransactionsArgs,
  QueryListUsersArgs,
  MutationCancelTransactionArgs,
  MutationCreateUserArgs,
  MutationProcessTransactionArgs,
  MutationUpdateTransactionStatusArgs,
  SubscriptionTransactionUpdatesArgs,
} from './types';
import { ApiClient } from '../client';

/**
 * Generated client methods for GraphQL operations
 * Extends the base ApiClient with auto-generated typed methods
 */
export class GeneratedApiClient extends ApiClient {
  /**
   * Get a transaction by its ID
   *
   * @param variables - query variables
   * @param options - Additional request options
   * @returns Promise resolving to query result
   */

  async getTransaction(
    variables: QueryGetTransactionArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ getTransaction: Transaction }>> {
    const query = `query QueryGetTransaction($id: ID!) {
        getTransaction(id: $id) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.query<{ getTransaction: Transaction }, QueryGetTransactionArgs>(
      query,
      variables,
      options
    );
  }

  /**
   * Get a user by their ID
   *
   * @param variables - query variables
   * @param options - Additional request options
   * @returns Promise resolving to query result
   */

  async getUser(
    variables: QueryGetUserArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ getUser: User }>> {
    const query = `query QueryGetUser($id: ID!) {
        getUser(id: $id) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.query<{ getUser: User }, QueryGetUserArgs>(query, variables, options);
  }

  /**
   * Get transactions for a specific user
   *
   * @param variables - query variables
   * @param options - Additional request options
   * @returns Promise resolving to query result
   */

  async getUserTransactions(
    variables: QueryGetUserTransactionsArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ getUserTransactions: Transaction }>> {
    const query = `query QueryGetUserTransactions($filter: TransactionFilter, $limit: Int, $offset: Int, $userId: ID!) {
        getUserTransactions(filter: $filter, limit: $limit, offset: $offset, userId: $userId) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.query<{ getUserTransactions: Transaction }, QueryGetUserTransactionsArgs>(
      query,
      variables,
      options
    );
  }

  /**
   * List transactions with optional filtering and pagination
   *
   * @param variables - query variables
   * @param options - Additional request options
   * @returns Promise resolving to query result
   */

  async listTransactions(
    variables: QueryListTransactionsArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ listTransactions: Transaction }>> {
    const query = `query QueryListTransactions($filter: TransactionFilter, $limit: Int, $offset: Int) {
        listTransactions(filter: $filter, limit: $limit, offset: $offset) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.query<{ listTransactions: Transaction }, QueryListTransactionsArgs>(
      query,
      variables,
      options
    );
  }

  /**
   * List all users with optional pagination
   *
   * @param variables - query variables
   * @param options - Additional request options
   * @returns Promise resolving to query result
   */

  async listUsers(
    variables: QueryListUsersArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ listUsers: User }>> {
    const query = `query QueryListUsers($limit: Int, $offset: Int) {
        listUsers(limit: $limit, offset: $offset) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.query<{ listUsers: User }, QueryListUsersArgs>(query, variables, options);
  }

  /**
   * Cancel a pending transaction
   *
   * @param variables - mutation variables
   * @param options - Additional request options
   * @returns Promise resolving to mutation result
   */

  async cancelTransaction(
    variables: MutationCancelTransactionArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ cancelTransaction: Transaction }>> {
    const mutation = `mutation MutationCancelTransaction($transactionId: ID!) {
        cancelTransaction(transactionId: $transactionId) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.mutate<{ cancelTransaction: Transaction }, MutationCancelTransactionArgs>(
      mutation,
      variables,
      options
    );
  }

  /**
   * Create a new user account
   *
   * @param variables - mutation variables
   * @param options - Additional request options
   * @returns Promise resolving to mutation result
   */

  async createUser(
    variables: MutationCreateUserArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ createUser: User }>> {
    const mutation = `mutation MutationCreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.mutate<{ createUser: User }, MutationCreateUserArgs>(mutation, variables, options);
  }

  /**
   * Process a new transaction
   *
   * @param variables - mutation variables
   * @param options - Additional request options
   * @returns Promise resolving to mutation result
   */

  async processTransaction(
    variables: MutationProcessTransactionArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ processTransaction: Transaction }>> {
    const mutation = `mutation MutationProcessTransaction($input: ProcessTransactionInput!) {
        processTransaction(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.mutate<{ processTransaction: Transaction }, MutationProcessTransactionArgs>(
      mutation,
      variables,
      options
    );
  }

  /**
   * Update transaction status (admin operation)
   *
   * @param variables - mutation variables
   * @param options - Additional request options
   * @returns Promise resolving to mutation result
   */

  async updateTransactionStatus(
    variables: MutationUpdateTransactionStatusArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ updateTransactionStatus: Transaction }>> {
    const mutation = `mutation MutationUpdateTransactionStatus($status: TransactionStatus!, $transactionId: ID!) {
        updateTransactionStatus(status: $status, transactionId: $transactionId) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.mutate<
      { updateTransactionStatus: Transaction },
      MutationUpdateTransactionStatusArgs
    >(mutation, variables, options);
  }

  /**
   * Subscribe to all transaction updates (admin only)
   *
   * @param variables - subscription variables
   * @param options - Additional request options
   * @returns Promise resolving to subscription result
   */

  async allTransactionUpdates(
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ allTransactionUpdates: Transaction }>> {
    const subscription = `subscription SubscriptionAllTransactionUpdates {
        allTransactionUpdates {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.mutate<{ allTransactionUpdates: Transaction }, never>(
      subscription,
      undefined,
      options
    );
  }

  /**
   * Subscribe to transaction status changes for a user
   *
   * @param variables - subscription variables
   * @param options - Additional request options
   * @returns Promise resolving to subscription result
   */

  async transactionUpdates(
    variables: SubscriptionTransactionUpdatesArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ transactionUpdates: Transaction }>> {
    const subscription = `subscription SubscriptionTransactionUpdates($userId: ID!) {
        transactionUpdates(userId: $userId) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.mutate<{ transactionUpdates: Transaction }, SubscriptionTransactionUpdatesArgs>(
      subscription,
      variables,
      options
    );
  }
}

/**
 * Type-safe client with all generated methods
 */
export type TypedApiClient = GeneratedApiClient;
