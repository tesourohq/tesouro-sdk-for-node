import type { ClientRequestOptions, GraphQLResult } from '../client';
import type {
  QueryAchNotificationsOfChangeArgs,
  AchNotificationOfChangeCollection,
  QueryAchReturnsArgs,
  AchReturnCollection,
  QueryApplicationEntitiesArgs,
  ApplicationEntitiesOutputCollection,
  QueryApplicationsArgs,
  AcceptorApplicationCollection,
  QueryAsyncReportArgs,
  AsyncReportRequestCollection,
  QueryAuthorizationSummariesArgs,
  AuthorizationSummaryCollection,
  QueryDisputesArgs,
  DisputeCollection,
  QueryFeeSummariesArgs,
  FeeSummaryCollection,
  QueryFeesArgs,
  FeeCollection,
  QueryFundingDisputeEventsArgs,
  FundingDisputeEventOutputCollection,
  QueryFundingSummariesArgs,
  FundingSummaryCollection,
  QueryFundingTransactionsArgs,
  FundingTransactionCollection,
  User,
  Organization,
  QueryPaymentTransactionArgs,
  PaymentTransaction,
  QueryPaymentTransactionSummariesArgs,
  PaymentTransactionSummaryCollection,
  QueryPaymentTransactionsArgs,
  PaymentTransactionCollection,
  QueryPermissionsArgs,
  PermissionCollection,
  QueryUsersArgs,
  UserCollection,
  MutationAuthorizeCustomerInitiatedTransactionArgs,
  AuthorizeCustomerInitiatedTransactionPayload,
  MutationAuthorizeRecurringArgs,
  AuthorizeRecurringPayload,
  MutationCaptureAuthorizationArgs,
  CaptureAuthorizationPayload,
  MutationChangeApplicationArgs,
  ChangeApplicationPayload,
  MutationChangeApplicationEntityArgs,
  ApplicationEntityPayload,
  MutationCreateApplicationArgs,
  CreateApplicationPayload,
  MutationCreateApplicationEntityArgs,
  MutationCreateAsyncReportArgs,
  CreateAsyncReportPayload,
  MutationCreateUserArgs,
  CreateUserPayload,
  MutationDeactivateUserArgs,
  DeactivateUserPayload,
  MutationDecryptApplicationFieldsArgs,
  DecryptApplicationFieldsPayload,
  MutationIncrementAuthorizationArgs,
  IncrementAuthorizationPayload,
  MutationInitiateBankTransferArgs,
  InitiateBankTransferPayload,
  MutationRefundPreviousPaymentArgs,
  RefundPreviousPaymentPayload,
  MutationRespondToDisputeArgs,
  RespondToDisputePayload,
  MutationReverseTransactionArgs,
  ReverseTransactionPayload,
  MutationSubmitApplicationArgs,
  SubmitApplicationPayload,
  MutationSubscribeCardArgs,
  SubscribeCardPayload,
  MutationUnlockUserArgs,
  UnlockUserPayload,
  MutationUpdateUserArgs,
  UpdateUserPayload,
  MutationValidateBankAccountArgs,
  ValidateBankAccountPayload,
  MutationVerifyAccountArgs,
  VerifyAccountPayload,
} from './types';
import { ApiClient } from '../client';

/**
 * Generated client methods for GraphQL operations
 * Extends the base ApiClient with auto-generated typed methods
 */
export class GeneratedApiClient extends ApiClient {
  /**
   * A Notification of Change (NOC), notifies the sender of an ACH payment that information related to the customer’s bank account was inaccurate or outdated, and provides the updated information that needs to be corrected before another payment can be sent from (or to) the account.
   *
   * @param variables - query variables
   * @param options - Additional request options
   * @returns Promise resolving to query result
   */

  async achNotificationsOfChange(
    variables: QueryAchNotificationsOfChangeArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ achNotificationsOfChange: AchNotificationOfChangeCollection }>> {
    const query = `query QueryAchNotificationsOfChange($input: AchNotificationOfChangeInput!) {
        achNotificationsOfChange(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.query<
      { achNotificationsOfChange: AchNotificationOfChangeCollection },
      QueryAchNotificationsOfChangeArgs
    >(query, variables, options);
  }

  /**
   * An itemized list of ach returns.
   *
   * @param variables - query variables
   * @param options - Additional request options
   * @returns Promise resolving to query result
   */

  async achReturns(
    variables: QueryAchReturnsArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ achReturns: AchReturnCollection }>> {
    const query = `query QueryAchReturns($input: AchReturnsInput!) {
        achReturns(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.query<{ achReturns: AchReturnCollection }, QueryAchReturnsArgs>(
      query,
      variables,
      options
    );
  }

  /**
   * Retrieves application entities.
   *
   * @param variables - query variables
   * @param options - Additional request options
   * @returns Promise resolving to query result
   */

  async applicationEntities(
    variables: QueryApplicationEntitiesArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ applicationEntities: ApplicationEntitiesOutputCollection }>> {
    const query = `query QueryApplicationEntities($input: ApplicationEntitiesInput!) {
        applicationEntities(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.query<
      { applicationEntities: ApplicationEntitiesOutputCollection },
      QueryApplicationEntitiesArgs
    >(query, variables, options);
  }

  /**
   * Retrieves information about this application.
   *
   * @param variables - query variables
   * @param options - Additional request options
   * @returns Promise resolving to query result
   */

  async applications(
    variables: QueryApplicationsArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ applications: AcceptorApplicationCollection }>> {
    const query = `query QueryApplications($input: ApplicationInput!) {
        applications(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.query<{ applications: AcceptorApplicationCollection }, QueryApplicationsArgs>(
      query,
      variables,
      options
    );
  }

  /**
   * Query operation for asyncReport
   *
   * @param variables - query variables
   * @param options - Additional request options
   * @returns Promise resolving to query result
   */

  async asyncReport(
    variables: QueryAsyncReportArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ asyncReport: AsyncReportRequestCollection }>> {
    const query = `query QueryAsyncReport($input: AsyncReportInput!) {
        asyncReport(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.query<{ asyncReport: AsyncReportRequestCollection }, QueryAsyncReportArgs>(
      query,
      variables,
      options
    );
  }

  /**
   * A summary of authorizations (counts, amounts) for the given transaction date, grouped by acceptor, transaction currency, response code, and payment brand.
   *
   * @param variables - query variables
   * @param options - Additional request options
   * @returns Promise resolving to query result
   */

  async authorizationSummaries(
    variables: QueryAuthorizationSummariesArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ authorizationSummaries: AuthorizationSummaryCollection }>> {
    const query = `query QueryAuthorizationSummaries($input: AuthorizationSummaryInput!) {
        authorizationSummaries(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.query<
      { authorizationSummaries: AuthorizationSummaryCollection },
      QueryAuthorizationSummariesArgs
    >(query, variables, options);
  }

  /**
   * Retrieve disputes based on query parameters
   *
   * @param variables - query variables
   * @param options - Additional request options
   * @returns Promise resolving to query result
   */

  async disputes(
    variables: QueryDisputesArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ disputes: DisputeCollection }>> {
    const query = `query QueryDisputes($input: DisputesQueryInput!) {
        disputes(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.query<{ disputes: DisputeCollection }, QueryDisputesArgs>(
      query,
      variables,
      options
    );
  }

  /**
   * Query operation for feeSummaries
   *
   * @param variables - query variables
   * @param options - Additional request options
   * @returns Promise resolving to query result
   */

  async feeSummaries(
    variables: QueryFeeSummariesArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ feeSummaries: FeeSummaryCollection }>> {
    const query = `query QueryFeeSummaries($input: FeeSummaryInput!) {
        feeSummaries(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.query<{ feeSummaries: FeeSummaryCollection }, QueryFeeSummariesArgs>(
      query,
      variables,
      options
    );
  }

  /**
   * An itemized list of applied fees for a given transaction activity date or funds release date.
   *
   * @param variables - query variables
   * @param options - Additional request options
   * @returns Promise resolving to query result
   */

  async fees(
    variables: QueryFeesArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ fees: FeeCollection }>> {
    const query = `query QueryFees($input: FeeInput!) {
        fees(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.query<{ fees: FeeCollection }, QueryFeesArgs>(query, variables, options);
  }

  /**
   * An itemized list of financially impacting dispute events occuring on the pertinent funds release dates. Use this report to track dispute-related money-movements.
   *
   * @param variables - query variables
   * @param options - Additional request options
   * @returns Promise resolving to query result
   */

  async fundingDisputeEvents(
    variables: QueryFundingDisputeEventsArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ fundingDisputeEvents: FundingDisputeEventOutputCollection }>> {
    const query = `query QueryFundingDisputeEvents($input: FundingDisputeEventInput!) {
        fundingDisputeEvents(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.query<
      { fundingDisputeEvents: FundingDisputeEventOutputCollection },
      QueryFundingDisputeEventsArgs
    >(query, variables, options);
  }

  /**
   * A summary of financial activity for a given funds release date or transaction activity date. Use this report to understand financial impact of daily sales, reconcile sales activity to your bank deposits, or drill deeper into the composition of your funding.
   *
   * @param variables - query variables
   * @param options - Additional request options
   * @returns Promise resolving to query result
   */

  async fundingSummaries(
    variables: QueryFundingSummariesArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ fundingSummaries: FundingSummaryCollection }>> {
    const query = `query QueryFundingSummaries($input: FundingSummariesInput!) {
        fundingSummaries(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.query<{ fundingSummaries: FundingSummaryCollection }, QueryFundingSummariesArgs>(
      query,
      variables,
      options
    );
  }

  /**
   * An itemized list of funded transactions (captures, sales, and refunds) for the selected transaction activity date or funds release date.
   *
   * @param variables - query variables
   * @param options - Additional request options
   * @returns Promise resolving to query result
   */

  async fundingTransactions(
    variables: QueryFundingTransactionsArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ fundingTransactions: FundingTransactionCollection }>> {
    const query = `query QueryFundingTransactions($input: FundingTransactionInput!) {
        fundingTransactions(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.query<
      { fundingTransactions: FundingTransactionCollection },
      QueryFundingTransactionsArgs
    >(query, variables, options);
  }

  /**
   * Retrieves information about currently authenticated user.
   *
   * @param variables - query variables
   * @param options - Additional request options
   * @returns Promise resolving to query result
   */

  async me(
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ me: User }>> {
    const query = `query QueryMe {
        me {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.query<{ me: User }, never>(query, undefined, options);
  }

  /**
   * Retrieves information about this organization and their relationships.
   *
   * @param variables - query variables
   * @param options - Additional request options
   * @returns Promise resolving to query result
   */

  async organization(
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ organization: Organization }>> {
    const query = `query QueryOrganization {
        organization {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.query<{ organization: Organization }, never>(query, undefined, options);
  }

  /**
   * A single payment transaction request (including conveyed).
   *
   * @param variables - query variables
   * @param options - Additional request options
   * @returns Promise resolving to query result
   */

  async paymentTransaction(
    variables: QueryPaymentTransactionArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ paymentTransaction: PaymentTransaction }>> {
    const query = `query QueryPaymentTransaction($id: UUID!) {
        paymentTransaction(id: $id) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.query<{ paymentTransaction: PaymentTransaction }, QueryPaymentTransactionArgs>(
      query,
      variables,
      options
    );
  }

  /**
   * A summary of transaction aggregates (counts and amounts, including conveyed transactions) by pertinent transaction type, currency, card brand, and transaction activity date.
   *
   * @param variables - query variables
   * @param options - Additional request options
   * @returns Promise resolving to query result
   */

  async paymentTransactionSummaries(
    variables: QueryPaymentTransactionSummariesArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ paymentTransactionSummaries: PaymentTransactionSummaryCollection }>> {
    const query = `query QueryPaymentTransactionSummaries($input: PaymentTransactionSummaryInput!) {
        paymentTransactionSummaries(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.query<
      { paymentTransactionSummaries: PaymentTransactionSummaryCollection },
      QueryPaymentTransactionSummariesArgs
    >(query, variables, options);
  }

  /**
   * A list of payment transaction requests (including conveyed) submitted on the pertinent transaction activity dates. Use this report as an operational tool to reconcile against your internal record of submitted transactions.
   *
   * @param variables - query variables
   * @param options - Additional request options
   * @returns Promise resolving to query result
   */

  async paymentTransactions(
    variables: QueryPaymentTransactionsArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ paymentTransactions: PaymentTransactionCollection }>> {
    const query = `query QueryPaymentTransactions($input: PaymentTransactionsInput!) {
        paymentTransactions(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.query<
      { paymentTransactions: PaymentTransactionCollection },
      QueryPaymentTransactionsArgs
    >(query, variables, options);
  }

  /**
   * Retrieves information about permissions.
   *
   * @param variables - query variables
   * @param options - Additional request options
   * @returns Promise resolving to query result
   */

  async permissions(
    variables: QueryPermissionsArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ permissions: PermissionCollection }>> {
    const query = `query QueryPermissions($input: PermissionInput!) {
        permissions(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.query<{ permissions: PermissionCollection }, QueryPermissionsArgs>(
      query,
      variables,
      options
    );
  }

  /**
   * Retrieves information about users in the organization.
   *
   * @param variables - query variables
   * @param options - Additional request options
   * @returns Promise resolving to query result
   */

  async users(
    variables: QueryUsersArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ users: UserCollection }>> {
    const query = `query QueryUsers($input: UserInput!) {
        users(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.query<{ users: UserCollection }, QueryUsersArgs>(query, variables, options);
  }

  /**
   * Authorize a customer initiated transaction.
   *
   * @param variables - mutation variables
   * @param options - Additional request options
   * @returns Promise resolving to mutation result
   */

  async authorizeCustomerInitiatedTransaction(
    variables: MutationAuthorizeCustomerInitiatedTransactionArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<
    GraphQLResult<{
      authorizeCustomerInitiatedTransaction: AuthorizeCustomerInitiatedTransactionPayload;
    }>
  > {
    const mutation = `mutation MutationAuthorizeCustomerInitiatedTransaction($authorizeCustomerInitiatedTransactionInput: AuthorizeCustomerInitiatedTransactionInput!) {
        authorizeCustomerInitiatedTransaction(authorizeCustomerInitiatedTransactionInput: $authorizeCustomerInitiatedTransactionInput) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.mutate<
      { authorizeCustomerInitiatedTransaction: AuthorizeCustomerInitiatedTransactionPayload },
      MutationAuthorizeCustomerInitiatedTransactionArgs
    >(mutation, variables, options);
  }

  /**
   * For use when authorizing a recurring payment.
   *
   * @param variables - mutation variables
   * @param options - Additional request options
   * @returns Promise resolving to mutation result
   */

  async authorizeRecurring(
    variables: MutationAuthorizeRecurringArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ authorizeRecurring: AuthorizeRecurringPayload }>> {
    const mutation = `mutation MutationAuthorizeRecurring($authorizeRecurringInput: AuthorizeRecurringInput!) {
        authorizeRecurring(authorizeRecurringInput: $authorizeRecurringInput) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.mutate<
      { authorizeRecurring: AuthorizeRecurringPayload },
      MutationAuthorizeRecurringArgs
    >(mutation, variables, options);
  }

  /**
   * Capture a previously authorized transaction and return a payload that includes details of the resulting transaction.
   *
   * @param variables - mutation variables
   * @param options - Additional request options
   * @returns Promise resolving to mutation result
   */

  async captureAuthorization(
    variables: MutationCaptureAuthorizationArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ captureAuthorization: CaptureAuthorizationPayload }>> {
    const mutation = `mutation MutationCaptureAuthorization($captureAuthorizationInput: CaptureAuthorizationInput!) {
        captureAuthorization(captureAuthorizationInput: $captureAuthorizationInput) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.mutate<
      { captureAuthorization: CaptureAuthorizationPayload },
      MutationCaptureAuthorizationArgs
    >(mutation, variables, options);
  }

  /**
   * Change an application.
   *
   * @param variables - mutation variables
   * @param options - Additional request options
   * @returns Promise resolving to mutation result
   */

  async changeApplication(
    variables: MutationChangeApplicationArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ changeApplication: ChangeApplicationPayload }>> {
    const mutation = `mutation MutationChangeApplication($input: ChangeApplicationInput!) {
        changeApplication(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.mutate<
      { changeApplication: ChangeApplicationPayload },
      MutationChangeApplicationArgs
    >(mutation, variables, options);
  }

  /**
   * Change an application entity.
   *
   * @param variables - mutation variables
   * @param options - Additional request options
   * @returns Promise resolving to mutation result
   */

  async changeApplicationEntity(
    variables: MutationChangeApplicationEntityArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ changeApplicationEntity: ApplicationEntityPayload }>> {
    const mutation = `mutation MutationChangeApplicationEntity($input: ApplicationEntityChangeInput!) {
        changeApplicationEntity(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.mutate<
      { changeApplicationEntity: ApplicationEntityPayload },
      MutationChangeApplicationEntityArgs
    >(mutation, variables, options);
  }

  /**
   * Create an application.
   *
   * @param variables - mutation variables
   * @param options - Additional request options
   * @returns Promise resolving to mutation result
   */

  async createApplication(
    variables: MutationCreateApplicationArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ createApplication: CreateApplicationPayload }>> {
    const mutation = `mutation MutationCreateApplication($input: CreateApplicationInput!) {
        createApplication(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.mutate<
      { createApplication: CreateApplicationPayload },
      MutationCreateApplicationArgs
    >(mutation, variables, options);
  }

  /**
   * Create an application entity.
   *
   * @param variables - mutation variables
   * @param options - Additional request options
   * @returns Promise resolving to mutation result
   */

  async createApplicationEntity(
    variables: MutationCreateApplicationEntityArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ createApplicationEntity: ApplicationEntityPayload }>> {
    const mutation = `mutation MutationCreateApplicationEntity($input: ApplicationEntityCreateInput!) {
        createApplicationEntity(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.mutate<
      { createApplicationEntity: ApplicationEntityPayload },
      MutationCreateApplicationEntityArgs
    >(mutation, variables, options);
  }

  /**
   * Mutation operation for createAsyncReport
   *
   * @param variables - mutation variables
   * @param options - Additional request options
   * @returns Promise resolving to mutation result
   */

  async createAsyncReport(
    variables: MutationCreateAsyncReportArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ createAsyncReport: CreateAsyncReportPayload }>> {
    const mutation = `mutation MutationCreateAsyncReport($input: CreateAsyncReportInput!) {
        createAsyncReport(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.mutate<
      { createAsyncReport: CreateAsyncReportPayload },
      MutationCreateAsyncReportArgs
    >(mutation, variables, options);
  }

  /**
   * Creates a user using the provided information.
   *
   * @param variables - mutation variables
   * @param options - Additional request options
   * @returns Promise resolving to mutation result
   */

  async createUser(
    variables: MutationCreateUserArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ createUser: CreateUserPayload }>> {
    const mutation = `mutation MutationCreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.mutate<{ createUser: CreateUserPayload }, MutationCreateUserArgs>(
      mutation,
      variables,
      options
    );
  }

  /**
   * Deactivates a user account.
   *
   * @param variables - mutation variables
   * @param options - Additional request options
   * @returns Promise resolving to mutation result
   */

  async deactivateUser(
    variables: MutationDeactivateUserArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ deactivateUser: DeactivateUserPayload }>> {
    const mutation = `mutation MutationDeactivateUser($input: DeactivateUserInput!) {
        deactivateUser(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.mutate<{ deactivateUser: DeactivateUserPayload }, MutationDeactivateUserArgs>(
      mutation,
      variables,
      options
    );
  }

  /**
   * Decrypt a field on an application and create an audit record.
   *
   * @param variables - mutation variables
   * @param options - Additional request options
   * @returns Promise resolving to mutation result
   */

  async decryptApplicationFields(
    variables: MutationDecryptApplicationFieldsArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ decryptApplicationFields: DecryptApplicationFieldsPayload }>> {
    const mutation = `mutation MutationDecryptApplicationFields($input: DecryptApplicationFieldsInput!) {
        decryptApplicationFields(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.mutate<
      { decryptApplicationFields: DecryptApplicationFieldsPayload },
      MutationDecryptApplicationFieldsArgs
    >(mutation, variables, options);
  }

  /**
   * Increment a previously authorized transaction and return a payload that includes details of the resulting transaction.
   *
   * @param variables - mutation variables
   * @param options - Additional request options
   * @returns Promise resolving to mutation result
   */

  async incrementAuthorization(
    variables: MutationIncrementAuthorizationArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ incrementAuthorization: IncrementAuthorizationPayload }>> {
    const mutation = `mutation MutationIncrementAuthorization($incrementAuthorizationInput: IncrementAuthorizationInput!) {
        incrementAuthorization(incrementAuthorizationInput: $incrementAuthorizationInput) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.mutate<
      { incrementAuthorization: IncrementAuthorizationPayload },
      MutationIncrementAuthorizationArgs
    >(mutation, variables, options);
  }

  /**
   * Initiate a bank transfer transaction.
   *
   * @param variables - mutation variables
   * @param options - Additional request options
   * @returns Promise resolving to mutation result
   */

  async initiateBankTransfer(
    variables: MutationInitiateBankTransferArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ initiateBankTransfer: InitiateBankTransferPayload }>> {
    const mutation = `mutation MutationInitiateBankTransfer($initiateBankTransferInput: InitiateBankTransferInput!) {
        initiateBankTransfer(initiateBankTransferInput: $initiateBankTransferInput) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.mutate<
      { initiateBankTransfer: InitiateBankTransferPayload },
      MutationInitiateBankTransferArgs
    >(mutation, variables, options);
  }

  /**
   * Refund a previously authorized payment using its payment ID and return a payload that includes details of the resulting transaction.
   *
   * @param variables - mutation variables
   * @param options - Additional request options
   * @returns Promise resolving to mutation result
   */

  async refundPreviousPayment(
    variables: MutationRefundPreviousPaymentArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ refundPreviousPayment: RefundPreviousPaymentPayload }>> {
    const mutation = `mutation MutationRefundPreviousPayment($refundPreviousPaymentInput: RefundPreviousPaymentInput!) {
        refundPreviousPayment(refundPreviousPaymentInput: $refundPreviousPaymentInput) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.mutate<
      { refundPreviousPayment: RefundPreviousPaymentPayload },
      MutationRefundPreviousPaymentArgs
    >(mutation, variables, options);
  }

  /**
   * Respond to a dispute.
   *
   * @param variables - mutation variables
   * @param options - Additional request options
   * @returns Promise resolving to mutation result
   */

  async respondToDispute(
    variables: MutationRespondToDisputeArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ respondToDispute: RespondToDisputePayload }>> {
    const mutation = `mutation MutationRespondToDispute($input: RespondToDisputeInput!) {
        respondToDispute(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.mutate<{ respondToDispute: RespondToDisputePayload }, MutationRespondToDisputeArgs>(
      mutation,
      variables,
      options
    );
  }

  /**
   * Reverse a previously processed transaction and return a payload that includes details of the resulting transaction.
   *
   * @param variables - mutation variables
   * @param options - Additional request options
   * @returns Promise resolving to mutation result
   */

  async reverseTransaction(
    variables: MutationReverseTransactionArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ reverseTransaction: ReverseTransactionPayload }>> {
    const mutation = `mutation MutationReverseTransaction($reverseTransactionInput: ReverseTransactionInput!) {
        reverseTransaction(reverseTransactionInput: $reverseTransactionInput) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.mutate<
      { reverseTransaction: ReverseTransactionPayload },
      MutationReverseTransactionArgs
    >(mutation, variables, options);
  }

  /**
   * Submit an application.
   *
   * @param variables - mutation variables
   * @param options - Additional request options
   * @returns Promise resolving to mutation result
   */

  async submitApplication(
    variables: MutationSubmitApplicationArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ submitApplication: SubmitApplicationPayload }>> {
    const mutation = `mutation MutationSubmitApplication($input: SubmitApplicationInput!) {
        submitApplication(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.mutate<
      { submitApplication: SubmitApplicationPayload },
      MutationSubmitApplicationArgs
    >(mutation, variables, options);
  }

  /**
   * Subscribes a card to the AU service and return a payload that includes details of the result.
   *
   * @param variables - mutation variables
   * @param options - Additional request options
   * @returns Promise resolving to mutation result
   */

  async subscribeCard(
    variables: MutationSubscribeCardArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ subscribeCard: SubscribeCardPayload }>> {
    const mutation = `mutation MutationSubscribeCard($input: SubscribeCardInput!) {
        subscribeCard(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.mutate<{ subscribeCard: SubscribeCardPayload }, MutationSubscribeCardArgs>(
      mutation,
      variables,
      options
    );
  }

  /**
   * Unlocks a user account.
   *
   * @param variables - mutation variables
   * @param options - Additional request options
   * @returns Promise resolving to mutation result
   */

  async unlockUser(
    variables: MutationUnlockUserArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ unlockUser: UnlockUserPayload }>> {
    const mutation = `mutation MutationUnlockUser($input: UnlockUserInput!) {
        unlockUser(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.mutate<{ unlockUser: UnlockUserPayload }, MutationUnlockUserArgs>(
      mutation,
      variables,
      options
    );
  }

  /**
   * Updates a user using the provided information.
   *
   * @param variables - mutation variables
   * @param options - Additional request options
   * @returns Promise resolving to mutation result
   */

  async updateUser(
    variables: MutationUpdateUserArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ updateUser: UpdateUserPayload }>> {
    const mutation = `mutation MutationUpdateUser($input: UpdateUserInput!) {
        updateUser(input: $input) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.mutate<{ updateUser: UpdateUserPayload }, MutationUpdateUserArgs>(
      mutation,
      variables,
      options
    );
  }

  /**
   * Validate bank account data.
   *
   * @param variables - mutation variables
   * @param options - Additional request options
   * @returns Promise resolving to mutation result
   */

  async validateBankAccount(
    variables: MutationValidateBankAccountArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ validateBankAccount: ValidateBankAccountPayload }>> {
    const mutation = `mutation MutationValidateBankAccount($validateBankAccountInput: ValidateBankAccountInput!) {
        validateBankAccount(validateBankAccountInput: $validateBankAccountInput) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.mutate<
      { validateBankAccount: ValidateBankAccountPayload },
      MutationValidateBankAccountArgs
    >(mutation, variables, options);
  }

  /**
   * Run an account verification request and return a payload that includes details of the resulting transaction.
   *
   * @param variables - mutation variables
   * @param options - Additional request options
   * @returns Promise resolving to mutation result
   */

  async verifyAccount(
    variables: MutationVerifyAccountArgs,
    options: Omit<ClientRequestOptions, 'variables'> = {}
  ): Promise<GraphQLResult<{ verifyAccount: VerifyAccountPayload }>> {
    const mutation = `mutation MutationVerifyAccount($verifyAccountInput: VerifyAccountInput!) {
        verifyAccount(verifyAccountInput: $verifyAccountInput) {
          # TODO: Add field selection based on return type
          __typename
        }
      }`;

    return this.mutate<{ verifyAccount: VerifyAccountPayload }, MutationVerifyAccountArgs>(
      mutation,
      variables,
      options
    );
  }
}

/**
 * Type-safe client with all generated methods
 */
export type TypedApiClient = GeneratedApiClient;
