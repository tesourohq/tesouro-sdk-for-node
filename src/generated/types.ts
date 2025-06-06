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
  /** A 13 to 16 digit number that passes Luhn validation. */
  CardNumber: { input: string; output: string };
  /** An ISO 4217 alpha currency code. (https://en.wikipedia.org/wiki/ISO_4217) */
  CurrencyCodeAlpha: { input: string; output: string };
  Date: { input: Date; output: Date };
  /** The `DateTime` scalar represents an ISO-8601 compliant date time type. */
  DateTime: { input: Date; output: Date };
  /** The `Decimal` scalar type represents a decimal floating-point number. */
  Decimal: { input: number; output: number };
  /** A transaction amount, a number with exactly two decimal places. */
  DecimalAmount: { input: number; output: number };
  /** A transaction amount, a number with up to 6 decimal places. */
  DecimalAmount6: { input: number; output: number };
  /** A valid email address with min length of 3 and max length of 254 with '@' and '.' signs */
  Email: { input: string; output: string };
  /** A 4 digit number. */
  Exact4Digits: { input: string; output: string };
  /** Scalar representing a set of fields. */
  FieldSet: { input: string; output: string };
  /** The LocalTime scalar type is a local time string (i.e., with no associated timezone) in 24-hr HH:mm:ss. */
  LocalTime: { input: string; output: string };
  /** The `Long` scalar type represents non-fractional signed whole 64-bit numeric values. Long can represent values between -(2^63) and 2^63 - 1. */
  Long: { input: number; output: number };
  /** A two-digit number. */
  Max2Digits: { input: string; output: string };
  /** A string up to 15 characters. */
  Max15Text: { input: string; output: string };
  /** A string up to 36 characters. */
  Max36Text: { input: string; output: string };
  /** A string up to 50 characters. */
  Max50Text: { input: string; output: string };
  /** A string up to 100 characters. */
  Max100Text: { input: string; output: string };
  /** A two-digit, zero-padded month. A valid number between 01 to 12. */
  NumericMonth: { input: number; output: number };
  /** A two-digit zero-padded year. A valid number between 00 to 99. */
  NumericYear2Digits: { input: number; output: number };
  /** The four-digit numeric year. YYYY. */
  NumericYear4Digits: { input: number; output: number };
  /** A percentage, formatted as a decimal. e.g., 5.00% will be formatted as 0.05 */
  Percentage: { input: number; output: number };
  /** The `TimeSpan` scalar represents an ISO-8601 compliant duration type. */
  TimeSpan: { input: string; output: string };
  URL: { input: string; output: string };
  UUID: { input: string; output: string };
  /**
   * A LocalDateTime in a specific time zone and with a particular offset to distinguish between otherwise-ambiguous instants.
   * A ZonedDateTime is global, in that it maps to a single Instant.
   */
  ZonedDateTime: { input: Date; output: Date };
  openfed__Scope: { input: string; output: string };
}

/** Input for accepting a dispute. */
export interface AcceptDisputeInput {
  /** A unique ID assigned to a dispute. */
  disputeId: Scalars['UUID']['input'];
}

export interface AcceptedAccountValidation extends AccountValidation, PaymentTransaction {
  __typename?: 'AcceptedAccountValidation';
  acceptor: Acceptor;
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff. */
  activityDate?: Maybe<Scalars['Date']['output']>;
  /** Components of the requested amount that may or may not have been provided by the presenter on the payment transaction request. */
  amountDetails?: Maybe<AmountDetails>;
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /**
   * The amount of convenience fees associated with this transaction
   * @deprecated Use amountDetails.convenienceFee instead.
   */
  convenienceFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Aggregate information for assessed fees */
  fees?: Maybe<FeeDetails>;
  /** A unique identifier assigned by Tesouro for every transaction request received. */
  id: Scalars['UUID']['output'];
  /** Line items associated with the payment transaction. */
  lineItems?: Maybe<Array<LineItem>>;
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  merchantCategory?: Maybe<Scalars['String']['output']>;
  organization: Organization;
  /**
   * The amount of partner fees applicable to this transaction. Partner fees are set by and paid to the partner.
   * @deprecated Use fees.summary.partnerAmount instead.
   */
  partnerFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** From where the customer makes the payment, e.g., In-store, online, or over the phone or through mail order. */
  paymentChannel: PaymentChannel;
  /** The means by which the payment details are captured, e.g., Card swipe, contactless "tap", chip entry "dip", keyed, etc. */
  paymentEntryMode: PaymentEntryMode;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Refers to the various options available for customers to make payments when purchasing a product or service. */
  paymentMethod: PaymentMethod;
  /** The payment network that the transaction was sent across, which may be unaffiliated with the card brand. */
  processingNetwork: Network;
  /** A response code provided by Tesouro identifying the specific approval or decline reason. */
  processorResponseCode: ProcessorResponseCode;
  /** A human readable description of the authorization response code. e.g., Insufficient funds. */
  processorResponseMessage: Scalars['String']['output'];
  /** A unique transaction identifier created by the entity holding the direct relationship with the Acceptor. Tesouro uses this identifier to manage idempotency. */
  reference?: Maybe<Scalars['String']['output']>;
  /** The result of the authorization request, e.g., Approved or Declined. */
  responseType?: Maybe<ResponseType>;
  /**
   * The amount of service fees associated with this transaction
   * @deprecated Use amountDetails.serviceFee instead.
   */
  serviceFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /**
   * The amount of surcharge associated with this transaction
   * @deprecated Use amountDetails.surcharge instead.
   */
  surchargeAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The tax identification number (TIN) is a unique identifier created by the national government and associated with the acceptor at the time the transaction was submitted */
  taxIdentificationNumber?: Maybe<Scalars['String']['output']>;
  /** The various tax amounts collected on the payment transaction. */
  taxes?: Maybe<Taxes>;
  /** The date and time that Tesouro received the transaction, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime: Scalars['DateTime']['output'];
  /** The type of payment transaction, e.g., Authorization, Capture, Sale, Refund, Reversal, etc. */
  transactionType: PaymentTransactionType;
  /** A risk score between 0-1000 indicating the likelihood of fraud for a bank account. The lower the score, the more likely the risk of fraud. Applicable to bank account validations only. */
  validationScore?: Maybe<Scalars['Int']['output']>;
}

export interface AcceptedSale extends PaymentTransaction, Sale {
  __typename?: 'AcceptedSale';
  acceptor: Acceptor;
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff. */
  activityDate?: Maybe<Scalars['Date']['output']>;
  /** Components of the requested amount that may or may not have been provided by the presenter on the payment transaction request. */
  amountDetails?: Maybe<AmountDetails>;
  /** The total approved amount of the transaction, in the transaction currency, before any fees are deducted. */
  approvedAmount: Scalars['Decimal']['output'];
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /**
   * The amount of convenience fees associated with this transaction
   * @deprecated Use amountDetails.convenienceFee instead.
   */
  convenienceFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The currency specified on the transaction request, in ISO 4217 alpha currency code format. */
  currency?: Maybe<Scalars['String']['output']>;
  /** Information that appears on the bank account owner's bank statement and describes the transaction. */
  customerStatementMemo?: Maybe<Scalars['String']['output']>;
  /**
   * The total amount of fees applicable to this transaction.
   * @deprecated Use fees.summary.totalAmount instead.
   */
  feeTotalAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Aggregate information for assessed fees */
  fees?: Maybe<FeeDetails>;
  /** The currency specified on the transaction request, in ISO 4217 alpha currency code format. */
  fundingCurrency?: Maybe<Scalars['String']['output']>;
  /** The total amount of the transaction converted to its funding currency, before any fees are deducted. */
  fundingGrossAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The net amount of the transaction converted to its funding currency, after any fees are deducted. */
  fundingNetAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Details on the funds transfer containing this transaction's funding amount. */
  fundsTransfer?: Maybe<FundsTransfer>;
  /** A unique identifier assigned by Tesouro for every transaction request received. */
  id: Scalars['UUID']['output'];
  /**
   * The amount of interchange fees applicable to the transaction. Interchange fees are set by the card networks, and paid to the bank that issued the card used for the transaction.
   * @deprecated Use fees.summary.interchangeAmount instead.
   */
  interchangeFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Indicates if the funding amount has been released. Defined as having a funds transfer ID and funds transfer release date. */
  isFunded: Scalars['Boolean']['output'];
  /** Line items associated with the payment transaction. */
  lineItems?: Maybe<Array<LineItem>>;
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  merchantCategory?: Maybe<Scalars['String']['output']>;
  /**
   * The amount of network fees applicable to this transaction. Network fees are set by card networks and are paid to the card network.
   * @deprecated Use fees.summary.networkAmount instead.
   */
  networkFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Information concerning the order placed by the customer. */
  order: Order;
  organization: Organization;
  /**
   * The amount of partner fees applicable to this transaction. Partner fees are set by and paid to the partner.
   * @deprecated Use fees.summary.partnerAmount instead.
   */
  partnerFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The card-present or card-not-present channel from which the customer makes a payment, e.g., In-store using a physical card terminal, online, or over the phone or through mail order. */
  paymentChannel: PaymentChannel;
  /** The means by which the payment details are captured, e.g., Card swipe, contactless "tap", chip entry "dip", keyed, etc. */
  paymentEntryMode: PaymentEntryMode;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Refers to the various options available for customers to make payments when purchasing a product or service. */
  paymentMethod: PaymentMethod;
  /** The payment network that the transaction was sent across, which may be unaffiliated with the card brand. */
  processingNetwork: Network;
  /**
   * The amount of processor fees applicable to this transaction. Processor fees are set by and paid to Tesouro.
   * @deprecated Use fees.summary.processorAmount instead.
   */
  processorFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** A response code provided by Tesouro identifying the specific approval or decline reason. */
  processorResponseCode: ProcessorResponseCode;
  /** A human readable description of the authorization response code. e.g., Insufficient funds. */
  processorResponseMessage: Scalars['String']['output'];
  /** A unique transaction identifier created by the entity holding the direct relationship with the Acceptor. Tesouro uses this identifier to manage idempotency. */
  reference?: Maybe<Scalars['String']['output']>;
  /** The transaction amount submitted with the authorization request. */
  requestedAmount: Scalars['Decimal']['output'];
  /** The result of the authorization request, e.g., Approved or Declined. */
  responseType?: Maybe<ResponseType>;
  /**
   * The amount of service fees associated with this transaction
   * @deprecated Use amountDetails.serviceFee instead.
   */
  serviceFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /**
   * The amount of surcharge associated with this transaction
   * @deprecated Use amountDetails.surcharge instead.
   */
  surchargeAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The tax identification number (TIN) is a unique identifier created by the national government and associated with the acceptor at the time the transaction was submitted */
  taxIdentificationNumber?: Maybe<Scalars['String']['output']>;
  /** The various tax amounts collected on the payment transaction. */
  taxes?: Maybe<Taxes>;
  /** A unique 15-digit number that identifies an Automated Clearing House (ACH) transaction. It's used by the bank to track the transaction and resolve issues. */
  traceNumber?: Maybe<Scalars['String']['output']>;
  /** The date and time that Tesouro received the transaction, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime: Scalars['DateTime']['output'];
  /** The type of payment transaction, e.g., Authorization, Capture, Sale, Refund, Reversal, etc. */
  transactionType: PaymentTransactionType;
  /** The date the bank transfer will be debited from or credited to customers account. */
  transferEffectiveDate?: Maybe<Scalars['Date']['output']>;
}

export interface Acceptor {
  __typename?: 'Acceptor';
  /** A summary of authorizations (counts, amounts) for the given transaction date, grouped by acceptor, transaction currency, response code, and payment brand. */
  authorizationSummaries?: Maybe<AuthorizationSummaryCollection>;
  /** The acceptor's city that will appear on a credit card statement.  Maximum 13 characters. */
  billingDescriptorCity: Scalars['String']['output'];
  /** The descriptive name for the acceptor that will appear on a credit card statement.  Maximum 22 characters. */
  billingDescriptorName: Scalars['String']['output'];
  /** The descriptive name for the acceptor's service fee that may appear on a credit card statement.  Maximum 22 characters. */
  billingDescriptorServiceFeeName: Scalars['String']['output'];
  /** The 2-letter abbreviation of the acceptor's state that will appear on a credit card statement. */
  billingDescriptorState: Scalars['String']['output'];
  /** The descriptive name for the acceptor that is different from its legal entity name. Also known as "Doing Business As" (DBA), "trade name", "assumed name", or "fictitious name". */
  businessName: Scalars['String']['output'];
  /** A summary of aggregated fees by acceptor and fee name/program for a specified activity date or funds release date, grouped by fee type, and where applicable, payment brand, product, and funding source. */
  feeSummaries?: Maybe<FeeSummaryCollection>;
  /** An itemized list of applied fees for a given transaction activity date or funds release date. */
  fees?: Maybe<FeeCollection>;
  /** An itemized list of financially impacting dispute events occuring on the pertinent funds release dates. Use this report to track dispute-related money-movements. */
  fundingDisputeEvents?: Maybe<FundingDisputeEventOutputCollection>;
  /** A summary of financial activity for a given funds release date or transaction activity date. Use this report to understand financial impact of daily sales, reconcile sales activity to your bank deposits, or drill deeper into the composition of your funding. */
  fundingSummaries?: Maybe<FundingSummaryCollection>;
  /** An itemized list of funded transactions (captures, sales, and refunds) for the selected transaction activity date or funds release date. */
  fundingTransactions?: Maybe<FundingTransactionCollection>;
  /** The id of the acceptor as defined in their profile. */
  id: Scalars['UUID']['output'];
  /**
   * The descriptive name for the acceptor that is different from its legal entity name. Also known as "Doing Business As" (DBA), "trade name", "assumed name", or "fictitious name".
   * @deprecated Use businessName instead.
   */
  name: Scalars['String']['output'];
  /** A summary of transaction aggregates (counts and amounts, including conveyed transactions) by pertinent transaction type, currency, card brand, and transaction activity date. */
  paymentTransactionSummaries?: Maybe<PaymentTransactionSummaryCollection>;
  /** A list of transaction requests (including conveyed) submitted on the pertinent transaction activity dates. Use this report as an operational tool to reconcile against your internal record of submitted transactions. */
  paymentTransactions?: Maybe<PaymentTransactionCollection>;
  /** The acceptor provided reference as defined in their profile. */
  reference: Scalars['String']['output'];
}

export interface AcceptorAuthorizationSummariesArgs {
  input: AuthorizationSummaryInput;
}

export interface AcceptorFeeSummariesArgs {
  input: FeeSummaryInput;
}

export interface AcceptorFeesArgs {
  input: StandardFeeInput;
}

export interface AcceptorFundingDisputeEventsArgs {
  input: FundingDisputeEventInput;
}

export interface AcceptorFundingSummariesArgs {
  input: FundingSummariesInput;
}

export interface AcceptorFundingTransactionsArgs {
  input: FundingTransactionInput;
}

export interface AcceptorPaymentTransactionSummariesArgs {
  input: PaymentTransactionSummaryInput;
}

export interface AcceptorPaymentTransactionsArgs {
  input: PaymentTransactionsInput;
}

export interface AcceptorApplication {
  __typename?: 'AcceptorApplication';
  applicationEvents?: Maybe<ApplicationEventCollection>;
  applicationIdentityOutput?: Maybe<AcceptorApplicationIdentityOutput>;
  applicationStatus: AcceptorApplicationStatus;
  billingAndFunding?: Maybe<AcceptorApplicationBillingAndFundingOutput>;
  createdBy: Actor;
  createdDateTime: Scalars['DateTime']['output'];
  decisionComponents: Array<DecisionComponent>;
  fundingStatus: FundingStatus;
  id: Scalars['UUID']['output'];
  organization: Organization;
  owners: Array<ApplicationEntityOutput>;
  processingActivity?: Maybe<AcceptorApplicationProcessingActivityOutput>;
  schema?: Maybe<UnderwritingDecisionComponentsSchema>;
  underwriter: Actor;
  underwritingStatus: UnderwritingStatus;
  updatedBy: Actor;
  updatedDateTime: Scalars['DateTime']['output'];
}

export interface AcceptorApplicationApplicationEventsArgs {
  input: ApplicationEventInput;
}

export interface AcceptorApplicationBillingAndFundingInput {
  /** The acceptor's end-of-day time in the provided timezone. */
  acceptorCutoffTime?: InputMaybe<Scalars['LocalTime']['input']>;
  /** Bank account information. */
  bankAccounts?: InputMaybe<Array<BankAccountInput>>;
  /** Id of the Billing Profile. */
  billingProfileId?: InputMaybe<Scalars['UUID']['input']>;
  /** Id of the Funding Profile. */
  fundingProfileId?: InputMaybe<Scalars['UUID']['input']>;
  /** The time zone of the acceptor, standardized by the Internet Assigned Numbers Authority (IANA). IANA time zones follow this convention: {Area}/{Location}, where an area corresponds to a continent or an ocean and the location to a location within the continent. */
  timezone?: InputMaybe<IanaTimezone>;
}

export interface AcceptorApplicationBillingAndFundingOutput {
  __typename?: 'AcceptorApplicationBillingAndFundingOutput';
  /** The acceptor's end-of-day time in the provided timezone. */
  acceptorCutoffTime?: Maybe<Scalars['LocalTime']['output']>;
  /** Bank account information. */
  bankAccounts?: Maybe<Array<BankAccountOutput>>;
  /** Id of the Billing Profile. */
  billingProfileId?: Maybe<Scalars['UUID']['output']>;
  /** Id of the Funding Profile. */
  fundingProfileId?: Maybe<Scalars['UUID']['output']>;
  /** The time zone of the acceptor, standardized by the Internet Assigned Numbers Authority (IANA). IANA time zones follow this convention: {Area}/{Location}, where an area corresponds to a continent or an ocean and the location to a location within the continent. */
  timezone?: Maybe<IanaTimezone>;
}

export interface AcceptorApplicationChangeInput {
  applicationIdentity?: InputMaybe<AcceptorApplicationIdentityInput>;
  billingAndFunding?: InputMaybe<AcceptorApplicationBillingAndFundingInput>;
  id: Scalars['UUID']['input'];
  lastUpdatedDateTime: Scalars['DateTime']['input'];
  owners?: InputMaybe<Array<ApplicationEntityInput>>;
  processingActivity?: InputMaybe<AcceptorApplicationProcessingActivityInput>;
}

export interface AcceptorApplicationCollection {
  __typename?: 'AcceptorApplicationCollection';
  items: Array<AcceptorApplication>;
  pageInfo: PageInfo;
}

export interface AcceptorApplicationCounts {
  __typename?: 'AcceptorApplicationCounts';
  acceptorApplicationStatus: AcceptorApplicationStatus;
  total: Scalars['Int']['output'];
}

export interface AcceptorApplicationCreateInput {
  applicationIdentity?: InputMaybe<AcceptorApplicationIdentityInput>;
  billingAndFunding?: InputMaybe<AcceptorApplicationBillingAndFundingInput>;
  owners?: InputMaybe<Array<ApplicationEntityInput>>;
  processingActivity?: InputMaybe<AcceptorApplicationProcessingActivityInput>;
}

/** Input to select the acceptor application and field for decrypting. */
export interface AcceptorApplicationDecryptionInput {
  acceptorTaxIdDecryptionInput?: InputMaybe<AcceptorTaxIdDecryptionInput>;
  ownerTaxIdDecryptionInput?: InputMaybe<OwnerTaxIdDecryptionInput>;
}

export interface AcceptorApplicationDecryptionPayload {
  __typename?: 'AcceptorApplicationDecryptionPayload';
  acceptorApplicationFieldDecryption?: Maybe<AcceptorApplicationFieldDecryption>;
  errors?: Maybe<Array<ErrorBase>>;
}

export interface AcceptorApplicationFieldDecryption {
  __typename?: 'AcceptorApplicationFieldDecryption';
  owner?: Maybe<Owner>;
  /** The decrypted acceptor tax id number. */
  taxIdentificationNumber?: Maybe<Scalars['String']['output']>;
}

export interface AcceptorApplicationIdentityInput {
  /** The unique identifier used by the Transactor to identify the acceptor. */
  acceptorReference?: InputMaybe<Scalars['String']['input']>;
  /** An optional field that the Transactor would pass to potentially identify multiple Acceptors that roll up to a broader relationship. */
  acceptorRelationshipReference?: InputMaybe<Scalars['String']['input']>;
  acceptorType?: InputMaybe<AcceptorType>;
  address?: InputMaybe<AddressInput>;
  /** The legal structure of a company, which determines its rights, liabilities, and taxation. e.g., LLC, Sole proprietor, C-Corp, etc. */
  businessEntityType?: InputMaybe<BusinessEntityType>;
  /** The descriptive name for the organization that is different from its legal entity name. Also known as "Doing Business As" (DBA), "trade name", "assumed name", or "fictitious name". */
  businessName?: InputMaybe<Scalars['String']['input']>;
  /** Specifies if the pertinent owner has at least 25% ownership, thus making them a beneficial owner. */
  isBeneficialOwner?: InputMaybe<Scalars['Boolean']['input']>;
  /** Set to true when the acceptor is a known trusted acceptor. */
  isKnownAcceptor?: InputMaybe<Scalars['Boolean']['input']>;
  isProcessingStatement?: InputMaybe<Scalars['Boolean']['input']>;
  /** The official, registered name of a business that appears on legal documents, and used to identify the company legall by the government. It is distinct from the "business name",  "Doing Business As" (DBA), "trade name", "assumed name", and "fictitious name". */
  legalEntityName?: InputMaybe<Scalars['String']['input']>;
  /** List of unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. https://www.iso.org/standard/79450.html */
  merchantCategories?: InputMaybe<Array<MerchantCategoryInput>>;
  /** The name of the referral partner if TransactorTypeII is set to "Referral". */
  referralPartner?: InputMaybe<Scalars['String']['input']>;
  /** The telephone number of the organization that is provided on the billing statement for service inquiries. */
  serviceTelephoneNumber?: InputMaybe<Scalars['String']['input']>;
  /** The name of the sponsor bank (aka acquirer) for the acceptor. */
  sponsorBank?: InputMaybe<Scalars['String']['input']>;
  /** The tax identification number of the legal entity. */
  taxIdentificationNumber?: InputMaybe<EntityIdentificationNumberInput>;
  /** The website address for the acceptor. */
  websiteUrl?: InputMaybe<Scalars['URL']['input']>;
}

export interface AcceptorApplicationIdentityOutput {
  __typename?: 'AcceptorApplicationIdentityOutput';
  /** The unique identifier used by the Transactor to identify the acceptor. */
  acceptorReference?: Maybe<Scalars['String']['output']>;
  /** An optional field that the Transactor would pass to potentially identify multiple Acceptors that roll up to a broader relationship. */
  acceptorRelationshipReference?: Maybe<Scalars['String']['output']>;
  acceptorType?: Maybe<AcceptorType>;
  address?: Maybe<AddressOutput>;
  businessEntityType?: Maybe<BusinessEntityType>;
  /** This is intended to ultimately appear as the "Merchant Descriptor" on Cardholder Statement. */
  businessName?: Maybe<Scalars['String']['output']>;
  /** Specifies if the pertinent owner has at least 25% ownership, thus making them a beneficial owner. */
  isBeneficialOwner: Scalars['Boolean']['output'];
  /** Set to true when the acceptor is a known trusted acceptor. */
  isKnownAcceptor: Scalars['Boolean']['output'];
  isProcessingStatement: Scalars['Boolean']['output'];
  /** The Acceptors company name. */
  legalEntityName?: Maybe<Scalars['String']['output']>;
  merchantCategories?: Maybe<Array<MerchantCategory>>;
  /** The tax identification number of the legal entity, obfuscated for protection. */
  obfuscatedTaxIdentificationNumber?: Maybe<EntityIdentificationNumberOutput>;
  referralPartner?: Maybe<Scalars['String']['output']>;
  serviceTelephoneNumber?: Maybe<Scalars['String']['output']>;
  sponsorBank?: Maybe<Scalars['String']['output']>;
  /** The Acceptors website. If the Acceptor is eCommerce, the website URL is required. */
  websiteUrl?: Maybe<Scalars['URL']['output']>;
}

export const AcceptorApplicationPaymentBrandsAccepted = {
  Ach: 'ACH',
  AmericanExpress: 'AMERICAN_EXPRESS',
  Discover: 'DISCOVER',
  Mastercard: 'MASTERCARD',
  Visa: 'VISA',
} as const;

export type AcceptorApplicationPaymentBrandsAccepted =
  (typeof AcceptorApplicationPaymentBrandsAccepted)[keyof typeof AcceptorApplicationPaymentBrandsAccepted];
/** Configuration of payment brands and network-specific identifiers accepted by the acceptor. */
export interface AcceptorApplicationPaymentBrandsInput {
  americanExpressProgram?: InputMaybe<AmericanExpressProgram>;
  /** The Service Establishment (SE) Number is a unique identifier assigned to the acceptor for identification within the American Express network. */
  americanExpressServiceEstablishmentNumber?: InputMaybe<Scalars['String']['input']>;
  /** A unique identifier assigned to the acceptor for identification within the Discover network. */
  discoverMerchantNumber?: InputMaybe<Scalars['String']['input']>;
  /** The type of contract the merchant has with Discover. Retained merchants have a direct relationship with Discover, while acquired merchants have a contract with a Discover acquirer. */
  discoverProgram?: InputMaybe<DiscoverProgram>;
  paymentsAccepted?: InputMaybe<Array<AcceptorApplicationPaymentBrandsAccepted>>;
}

export interface AcceptorApplicationPaymentBrandsOutput {
  __typename?: 'AcceptorApplicationPaymentBrandsOutput';
  americanExpressProgram?: Maybe<AmericanExpressProgram>;
  /** The Service Establishment (SE) Number is a unique identifier assigned to the acceptor for identification within the American Express network, provided when the acceptor is Direct. */
  americanExpressServiceEstablishmentNumber?: Maybe<Scalars['String']['output']>;
  /** A unique identifier assigned to the acceptor for identification within the Discover network, provided when the acceptor is Retained. */
  discoverMerchantNumber?: Maybe<Scalars['String']['output']>;
  /** The type of contract the merchant has with Discover. Retained merchants have a direct relationship with Discover, while acquired merchants have a contract with a Discover acquirer. */
  discoverProgram?: Maybe<DiscoverProgram>;
  paymentsAccepted?: Maybe<Array<AcceptorApplicationPaymentBrandsAccepted>>;
}

export interface AcceptorApplicationProcessingActivityInput {
  /** The average gross sales amount, in the specified currency. */
  averageMonthlySalesAmount?: InputMaybe<Scalars['Decimal']['input']>;
  /** The average amount of a transaction, in the specified currency. */
  averageTicketAmount?: InputMaybe<Scalars['Decimal']['input']>;
  /** The approximate mix of card-not-present (CNP) transactions. Formatted as a decimal., e.g., If CNP transactions make up 80% of total volume, input as 0.8. */
  cardNotPresentMix?: InputMaybe<Scalars['Percentage']['input']>;
  /** The approximate mix of card present (CP) transactions. Formatted as a decimal., e.g., If CP transactions make up 20% of total volume, input as 0.2. */
  cardPresentMix?: InputMaybe<Scalars['Percentage']['input']>;
  /** The approximate rate of chargebacks. Formatted as a decimal, e.g., If the chargeback rate is 0.25%, input as 0.0025. */
  chargebackRate?: InputMaybe<Scalars['Percentage']['input']>;
  /** The currency specified on the transaction requests, in ISO 4217 alpha currency code format. */
  currency?: InputMaybe<Scalars['CurrencyCodeAlpha']['input']>;
  /** The highest amount of a transaction, in the specified currency. */
  highestTicketAmount?: InputMaybe<Scalars['Decimal']['input']>;
  /** Configuration of payment brands and network-specific identifiers accepted by the acceptor. */
  paymentBrands?: InputMaybe<AcceptorApplicationPaymentBrandsInput>;
  /** The approximate rate of refunds. Formatted as a decimal, e.g., If the refund rate is 10% of sales, input as 0.1 */
  refundRate?: InputMaybe<Scalars['Percentage']['input']>;
}

export interface AcceptorApplicationProcessingActivityOutput {
  __typename?: 'AcceptorApplicationProcessingActivityOutput';
  /** The average gross sales amount, in the specified currency. */
  averageMonthlySalesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The average amount of a transaction, in the specified currency. */
  averageTicketAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The approximate mix of card-not-present (CNP) transactions. Formatted as a decimal., e.g., If CNP transactions make up 80% of total volume, input as 0.8. */
  cardNotPresentMix?: Maybe<Scalars['Percentage']['output']>;
  /** The approximate mix of card present (CP) transactions. Formatted as a decimal., e.g., If CP transactions make up 20% of total volume, input as 0.2. */
  cardPresentMix?: Maybe<Scalars['Percentage']['output']>;
  /** The approximate rate of chargebacks. Formatted as a decimal, e.g., If  the chargeback rate is 0.25%, input as 0.0025. */
  chargebackRate?: Maybe<Scalars['Percentage']['output']>;
  /** The currency specified on the transaction requests, in ISO 4217 alpha currency code format. */
  currency?: Maybe<Scalars['CurrencyCodeAlpha']['output']>;
  /** The highest amount of a transaction, in the specified currency. */
  highestTicketAmount?: Maybe<Scalars['Decimal']['output']>;
  paymentBrands?: Maybe<AcceptorApplicationPaymentBrandsOutput>;
  /** The approximate rate of refunds. Formatted as a decimal, e.g., If  the refund rate is 10% of sales, input as 0.1 */
  refundRate?: Maybe<Scalars['Percentage']['output']>;
}

export const AcceptorApplicationStatus = {
  Approved: 'APPROVED',
  ConditionallyApproved: 'CONDITIONALLY_APPROVED',
  Created: 'CREATED',
  Declined: 'DECLINED',
  Pending: 'PENDING',
  Processing: 'PROCESSING',
  Withdrawn: 'WITHDRAWN',
} as const;

export type AcceptorApplicationStatus =
  (typeof AcceptorApplicationStatus)[keyof typeof AcceptorApplicationStatus];
export interface AcceptorApplicationSubmitInput {
  id: Scalars['UUID']['input'];
}

export interface AcceptorCollection {
  __typename?: 'AcceptorCollection';
  items: Array<Acceptor>;
  pageInfo: PageInfo;
}

export interface AcceptorFilterInput {
  clearingPartner?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<GuidFilterInput>;
  organizationId?: InputMaybe<GuidFilterInput>;
  presenterId?: InputMaybe<GuidFilterInput>;
}

export interface AcceptorInput {
  orderBy?: InputMaybe<Array<AcceptorSortTypeInput>>;
  paging: PagingInput;
  where?: InputMaybe<AcceptorFilterInput>;
}

export interface AcceptorNotConfiguredError extends IGraphQlError {
  __typename?: 'AcceptorNotConfiguredError';
  /**
   * The UTC datetime the error occurred.
   * @deprecated Use errorDateTime instead.
   */
  dateTimeUtc: Scalars['DateTime']['output'];
  /** The UTC datetime the error occurred. */
  errorDateTime: Scalars['DateTime']['output'];
  /** A human readable description of the error. */
  message: Scalars['String']['output'];
  /** Tesouro response code indicating the error. */
  processorResponseCode: ProcessorResponseCode;
  /** Unique ID for the transaction assigned by Tesouro. */
  transactionId: Scalars['UUID']['output'];
}

/** This occurs when an acceptor cannot be found because it does not exist or because it is not presented by the submitted presenter. */
export interface AcceptorNotFoundError extends IGraphQlError {
  __typename?: 'AcceptorNotFoundError';
  /**
   * The date and time, in UTC, that the error occured. Formatted as 2024-03-27T02:40:00Z.
   * @deprecated Use errorDateTime instead.
   */
  dateTimeUtc: Scalars['DateTime']['output'];
  /** The date and time, in UTC, that the error occured. Formatted as 2024-03-27T02:40:00Z. */
  errorDateTime: Scalars['DateTime']['output'];
  /** A human readable description of the error. */
  message: Scalars['String']['output'];
  /** The organization Id presented with this transaction. */
  organizationId: Scalars['UUID']['output'];
  /** The presenter Id presented with this transaction. */
  presenterId: Scalars['UUID']['output'];
  /** Tesouro response code indicating the error. */
  processorResponseCode: ProcessorResponseCode;
  /** Unique ID for the transaction assigned by Tesouro. */
  transactionId: Scalars['UUID']['output'];
  /** The invalid acceptor Id. */
  unknownAcceptorId: Scalars['UUID']['output'];
}

export const AcceptorSortField = {
  Id: 'ID',
} as const;

export type AcceptorSortField = (typeof AcceptorSortField)[keyof typeof AcceptorSortField];
export interface AcceptorSortTypeInput {
  field: AcceptorSortField;
  sortDirection: SortingEnumType;
}

/** Input to select an application to view the decrypted acceptor tax id number. */
export interface AcceptorTaxIdDecryptionInput {
  /** The acceptor application id for which sensitive data viewing is requested. */
  applicationId: Scalars['UUID']['input'];
}

export const AcceptorType = {
  Biller: 'BILLER',
  Merchant: 'MERCHANT',
  Seller: 'SELLER',
  SponsoredMerchant: 'SPONSORED_MERCHANT',
  Supplier: 'SUPPLIER',
  Wallet: 'WALLET',
} as const;

export type AcceptorType = (typeof AcceptorType)[keyof typeof AcceptorType];
/** Indicates the type of owner for a bank account. */
export const AccountOwnerType = {
  /** An individual consumer or personal account holder. */
  Consumer: 'CONSUMER',
  /** A corporate or business entity that owns the account. */
  Corporate: 'CORPORATE',
} as const;

export type AccountOwnerType = (typeof AccountOwnerType)[keyof typeof AccountOwnerType];
export interface AccountValidation {
  acceptor: Acceptor;
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff. */
  activityDate?: Maybe<Scalars['Date']['output']>;
  /** Components of the requested amount that may or may not have been provided by the presenter on the payment transaction request. */
  amountDetails?: Maybe<AmountDetails>;
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /**
   * The amount of convenience fees associated with this transaction
   * @deprecated Use amountDetails.convenienceFee instead.
   */
  convenienceFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Aggregate information for assessed fees */
  fees?: Maybe<FeeDetails>;
  /** A unique identifier assigned by Tesouro for every transaction request received. */
  id: Scalars['UUID']['output'];
  /** Line items associated with the payment transaction. */
  lineItems?: Maybe<Array<LineItem>>;
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  merchantCategory?: Maybe<Scalars['String']['output']>;
  organization: Organization;
  /**
   * The amount of partner fees applicable to this transaction. Partner fees are set by and paid to the partner.
   * @deprecated Use fees.summary.partnerAmount instead.
   */
  partnerFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** From where the customer makes the payment, e.g., In-store, online, or over the phone or through mail order. */
  paymentChannel: PaymentChannel;
  /** The means by which the payment details are captured, e.g., Card swipe, contactless "tap", chip entry "dip", keyed, etc. */
  paymentEntryMode: PaymentEntryMode;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Refers to the various options available for customers to make payments when purchasing a product or service. */
  paymentMethod: PaymentMethod;
  /** The payment network that the transaction was sent across, which may be unaffiliated with the card brand. */
  processingNetwork: Network;
  /** A response code provided by Tesouro identifying the specific approval or decline reason. */
  processorResponseCode: ProcessorResponseCode;
  /** A human readable description of the authorization response code. e.g., Insufficient funds. */
  processorResponseMessage: Scalars['String']['output'];
  /** A unique transaction identifier created by the entity holding the direct relationship with the Acceptor. Tesouro uses this identifier to manage idempotency. */
  reference?: Maybe<Scalars['String']['output']>;
  /** The result of the authorization request, e.g., Approved or Declined. */
  responseType?: Maybe<ResponseType>;
  /**
   * The amount of service fees associated with this transaction
   * @deprecated Use amountDetails.serviceFee instead.
   */
  serviceFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /**
   * The amount of surcharge associated with this transaction
   * @deprecated Use amountDetails.surcharge instead.
   */
  surchargeAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The tax identification number (TIN) is a unique identifier created by the national government and associated with the acceptor at the time the transaction was submitted */
  taxIdentificationNumber?: Maybe<Scalars['String']['output']>;
  /** The various tax amounts collected on the payment transaction. */
  taxes?: Maybe<Taxes>;
  /** The date and time that Tesouro received the transaction, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime: Scalars['DateTime']['output'];
  /** The type of payment transaction, e.g., Authorization, Capture, Sale, Refund, Reversal, etc. */
  transactionType: PaymentTransactionType;
}

export interface AchNotificationOfChange {
  __typename?: 'AchNotificationOfChange';
  acceptor?: Maybe<Acceptor>;
  /** The original bank account number. */
  accountNumber: Scalars['String']['output'];
  /** The updated bank account number. */
  accountNumberUpdated?: Maybe<Scalars['String']['output']>;
  /** The type of bank account, either Checking or Savings, specified on the original transaction. */
  accountType: BankAccountType;
  /** The updated bank account type. */
  accountTypeUpdated?: Maybe<BankAccountType>;
  /** The date the notification of change was received by Tesouro. */
  activityDate: Scalars['Date']['output'];
  /** A reader friendly description of the Change reason code. */
  changeReason: Scalars['String']['output'];
  /** A unique code signaling that information in a prior ACH entry needs updating. */
  changeReasonCode: AchNotificationOfChangeCodes;
  /** A unique 36 character identifier created by Tesouro, and assigned to the specific change notification. */
  id: Scalars['UUID']['output'];
  organization?: Maybe<Organization>;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** The original unique nine-digit number identifying the bank. */
  routingNumber: Scalars['String']['output'];
  /** The updated routing number. */
  routingNumberUpdated?: Maybe<Scalars['String']['output']>;
  /** The date Tesouro recognized the transaction that triggered the notification of change. */
  transactionActivityDate: Scalars['Date']['output'];
  /** The transaction amount submitted with the transaction request. */
  transactionAmount: Scalars['Decimal']['output'];
  /** The currency specified on the transaction request, in ISO 4217 alpha currency code format. */
  transactionCurrency: Scalars['String']['output'];
  /** The date and time that Tesouro received the transaction request, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime: Scalars['DateTime']['output'];
  /** The unique 36 character identifier Tesouro assigned to the transaction that triggered the notification of change. */
  transactionId: Scalars['UUID']['output'];
  /** The unique identifier assigned to the transaction by the acceptor (or partner) and included in the original transaction request sent to Tesouro. */
  transactionReference: Scalars['String']['output'];
  /** The type of transaction, either an ACH debit (sale) or ACH debit (refund). */
  transactionType: TransactionType;
}

/** Notification of Change (NOC) Codes and their descriptions for ACH corrections. */
export const AchNotificationOfChangeCodes = {
  /** Incorrect bank account number */
  C01: 'C01',
  /** Incorrect transit/routing number */
  C02: 'C02',
  /** Incorrect transit/routing number and bank account number */
  C03: 'C03',
  /** Bank account name change */
  C04: 'C04',
  /** Incorrect payment code */
  C05: 'C05',
  /** Incorrect bank account number and transit code */
  C06: 'C06',
  /** Incorrect transit/routing number, bank account number and payment code */
  C07: 'C07',
  /** Corrected foreign routing number */
  C08: 'C08',
  /** Incorrect individual ID number */
  C09: 'C09',
  /** Incorrect company name */
  C10: 'C10',
  /** Incorrect company identification */
  C11: 'C11',
  /** Incorrect company name and company ID */
  C12: 'C12',
} as const;

export type AchNotificationOfChangeCodes =
  (typeof AchNotificationOfChangeCodes)[keyof typeof AchNotificationOfChangeCodes];
export interface AchNotificationOfChangeCollection {
  __typename?: 'AchNotificationOfChangeCollection';
  items: Array<AchNotificationOfChange>;
  pageInfo: PageInfo;
}

/** Exactly one of the following fields must be provided. */
export interface AchNotificationOfChangeFilterInput {
  activityDate?: InputMaybe<DateRangeFilterInput>;
  paymentId?: InputMaybe<GuidFilterInput>;
}

export interface AchNotificationOfChangeInput {
  paging: PagingInput;
  where: AchNotificationOfChangeFilterInput;
}

export interface AchReturn {
  __typename?: 'AchReturn';
  acceptor: Acceptor;
  /** The last few numbers of the bank account used as a visual reference to the full account numer. */
  accountNumberEndingIn?: Maybe<Scalars['String']['output']>;
  /** The name of the bank account owner, as provided by the NACHA report. */
  accountOwnerName?: Maybe<Scalars['String']['output']>;
  /** The type of the bank account owner, as provided by the NACHA report. */
  accountOwnerType?: Maybe<AccountOwnerType>;
  /** The type of the bank account, e.g., Checking or Savings. */
  accountType?: Maybe<BankAccountType>;
  /** The date Tesouro received the ach return. */
  activityDate: Scalars['Date']['output'];
  /** The amount of the ach return. */
  amount: Scalars['Decimal']['output'];
  /** The currency specified on the ach return. */
  currency: Scalars['String']['output'];
  /** The unique id of the ach return that was generated by Tesouro. */
  id: Scalars['UUID']['output'];
  organization: Organization;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId?: Maybe<Scalars['UUID']['output']>;
  /** Description of return reason. */
  reason: Scalars['String']['output'];
  /** Nacha Return Codes and associated ISO Status Reason Codes for returns and reversals from the External Code List. */
  reasonCode: AchReturnCode;
  /** A unique nine-digit number that identifies a bank and is used for electronic transactions. It's also known as an ABA routing number, or routing transit number (RTN). */
  routingNumber: Scalars['String']['output'];
  /** A number that a bank can you to investigate and research an ach return. */
  traceNumber: Scalars['String']['output'];
  /** The date Tesouro recognized the orginal ach payment request based upon the acceptor cutoff. */
  transactionActivityDate?: Maybe<Scalars['Date']['output']>;
  /** The transaction amount submitted with the original ach request. */
  transactionAmount: Scalars['Decimal']['output'];
  /** The date and time that Tesouro received the original ach transaction, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime: Scalars['DateTime']['output'];
  /** A unique identifier assigned by Tesouro to the original ach transaction. */
  transactionId: Scalars['UUID']['output'];
  /** A unique identifier from original ach transaction created by the entity holding the direct relationship with the Acceptor. Tesouro uses this identifier to manage idempotency. */
  transactionReference?: Maybe<Scalars['String']['output']>;
  /** A number that a bank can you to investigate and research an ach transaction. */
  transactionTraceNumber: Scalars['String']['output'];
  /** The type of original ach transaction, e.g., Sale or Refund. */
  transactionType: TransactionType;
}

/** Nacha Return Codes and associated ISO Status Reason Codes for returns and reversals from the External Code List. */
export const AchReturnCode = {
  /** Insufficient Funds */
  R01: 'R01',
  /** Account Closed */
  R02: 'R02',
  /** No Account / Unable to Locate Account */
  R03: 'R03',
  /** Invalid Account Number */
  R04: 'R04',
  /** Unauthorized Debit to Consumer Account */
  R05: 'R05',
  /** Returned per ODFI Request */
  R06: 'R06',
  /** Authorization Revoked by Customer */
  R07: 'R07',
  /** Payment Stopped */
  R08: 'R08',
  /** Uncollected Funds */
  R09: 'R09',
  /** Customer Advises Not Authorized */
  R10: 'R10',
  /** Check Truncation Entry Return */
  R11: 'R11',
  /** Branch sold to another financial institution */
  R12: 'R12',
  /** Invalid ACH Routing Number */
  R13: 'R13',
  /** Representative Payee Deceased */
  R14: 'R14',
  /** Beneficiary or Account Holder Deceased */
  R15: 'R15',
  /** Account Frozen */
  R16: 'R16',
  /** File Record Edit Criteria */
  R17: 'R17',
  /** Improper Effective Entry Date */
  R18: 'R18',
  /** Amount Field Error */
  R19: 'R19',
  /** Non-Transaction Account */
  R20: 'R20',
  /** Invalid Company Identification */
  R21: 'R21',
  /** Invalid Individual ID Number */
  R22: 'R22',
  /** Credit Entry Refused by Receiver */
  R23: 'R23',
  /** Duplicate Entry */
  R24: 'R24',
  /** Addenda Error */
  R25: 'R25',
  /** Mandatory Field Error */
  R26: 'R26',
  /** Trace Number Error */
  R27: 'R27',
  /** Routing Number Check Digit Error */
  R28: 'R28',
  /** Corporate Customer Advises Not Authorized */
  R29: 'R29',
  /** RDFI Not Participant in Check Truncation Program */
  R30: 'R30',
  /** Permissible Return Entry */
  R31: 'R31',
  /** RDFI Non-Settlement */
  R32: 'R32',
  /** Return of XCK (destroyed check) Entry */
  R33: 'R33',
  /** Limited Participation DFI */
  R34: 'R34',
  /** Return of Improper Debit Entry */
  R35: 'R35',
  /** Return of Improper Credit Entry */
  R36: 'R36',
  /** Source Document Presented for Payment */
  R37: 'R37',
  /** A stop payment was placed on the source document of the transaction */
  R38: 'R38',
  /** Improper Source Document */
  R39: 'R39',
  /** Return of an automated enrollment entry (ENR) entry */
  R40: 'R40',
  /** Invalid Transaction Code */
  R41: 'R41',
  /** Routing Number / Account Number Mismatch */
  R42: 'R42',
  /** Invalid DFI Account Number */
  R43: 'R43',
  /** Invalid Individual Identifier */
  R44: 'R44',
  /** Invalid Individual Name */
  R45: 'R45',
  /** Invalid Representative Payee Indicator */
  R46: 'R46',
  /** Duplicate Enrollment */
  R47: 'R47',
  /** State Law Affecting Re-presented Check (RCK) Acceptance */
  R50: 'R50',
  /** Item is Ineligible, Notice Not Provided */
  R51: 'R51',
  /** Stop Payment on Item */
  R52: 'R52',
  /** Item and ACH Entry Presented for Payment */
  R53: 'R53',
  /** Misrouted Return */
  R61: 'R61',
  /** Incorrect Trace Number */
  R62: 'R62',
  /** Incorrect Dollar Amount */
  R63: 'R63',
  /** Incorrect Individual Identification */
  R64: 'R64',
  /** Incorrect Transaction Code */
  R65: 'R65',
  /** Incorrect Company Identification */
  R66: 'R66',
  /** Duplicate Return */
  R67: 'R67',
  /** Untimely Return */
  R68: 'R68',
  /** Multiple Errors */
  R69: 'R69',
  /** Permissible Return Entry Not Accepted / Notice Not Provided */
  R70: 'R70',
  /** Misrouted Dishonored Return */
  R71: 'R71',
  /** Untimely Dishonored Return */
  R72: 'R72',
  /** Timely Original Return */
  R73: 'R73',
  /** Corrected Return */
  R74: 'R74',
  /** Return Not a Duplicate */
  R75: 'R75',
  /** No Errors Found */
  R76: 'R76',
  /** Non-Acceptance of R62 Dishonored Return */
  R77: 'R77',
  /** Non-Acceptance of R68 Dishonored Return */
  R78: 'R78',
  /** Incorrect Data in Return Entry */
  R79: 'R79',
  /** International ACH Transaction (IAT) Entry */
  R80: 'R80',
  /** Non-Participant in International ACH Transaction (IAT) Program */
  R81: 'R81',
  /** Invalid Foreign Receiving DFI Identification */
  R82: 'R82',
  /** Foreign Receiving DFI Unable to Settle */
  R83: 'R83',
  /** Entry Not Processed by Gateway */
  R84: 'R84',
  /** Incorrectly Coded Outbound International Payment */
  R85: 'R85',
} as const;

export type AchReturnCode = (typeof AchReturnCode)[keyof typeof AchReturnCode];
export interface AchReturnCollection {
  __typename?: 'AchReturnCollection';
  items: Array<AchReturn>;
  pageInfo: PageInfo;
}

export interface AchReturnFilterInput {
  acceptorId?: InputMaybe<GuidFilterInput>;
  activityDate?: InputMaybe<DateRangeFilterInput>;
  id?: InputMaybe<GuidFilterInput>;
  paymentId?: InputMaybe<GuidFilterInput>;
  reasonCode?: InputMaybe<EnumFilterInputOfAchReturnCodeInput>;
  transactionActivityDate?: InputMaybe<DateRangeFilterInput>;
  transactionId?: InputMaybe<GuidFilterInput>;
  transactionReference?: InputMaybe<StringFilterInput>;
  transactionType?: InputMaybe<EnumFilterInputOfPaymentTransactionTypeInput>;
}

export interface AchReturnsInput {
  paging: PagingInput;
  where: AchReturnFilterInput;
}

export interface Acquirer {
  __typename?: 'Acquirer';
  acquirerBin: Array<AcquirerBin>;
  /** The descriptive name for the acquirer that is different from its legal entity name. Also known as "Doing Business As" (DBA), "trade name", "assumed name", or "fictitious name". */
  businessName: Scalars['String']['output'];
  /** The id of the acquirer as defined in their profile. */
  id: Scalars['UUID']['output'];
}

export interface AcquirerBin {
  __typename?: 'AcquirerBin';
  bin?: Maybe<Scalars['String']['output']>;
  paymentNetwork?: Maybe<Network>;
}

export interface AcquirerTokenDetails {
  __typename?: 'AcquirerTokenDetails';
  /** The value of the acquirer token. */
  token?: Maybe<Scalars['String']['output']>;
  /**
   * The value of the acquirer token.
   * @deprecated Use token instead.
   */
  tokenizedPan?: Maybe<Scalars['String']['output']>;
  /** The wallet provider for this payment method. Null if not applicable. */
  walletType?: Maybe<WalletType>;
}

export interface Actor {
  name: Scalars['String']['output'];
  type: ActorType;
}

export const ActorType = {
  App: 'APP',
  Platform: 'PLATFORM',
  User: 'USER',
} as const;

export type ActorType = (typeof ActorType)[keyof typeof ActorType];
export interface AddressDetails {
  __typename?: 'AddressDetails';
  /** The first line of the address. */
  address1?: Maybe<Scalars['Max100Text']['output']>;
  /** The second line of the address, if applicable. */
  address2?: Maybe<Scalars['Max100Text']['output']>;
  /** The third line of the address, if applicable. */
  address3?: Maybe<Scalars['Max100Text']['output']>;
  /** City, town, or village. */
  city?: Maybe<Scalars['Max100Text']['output']>;
  /** The ISO 3166-1 three-letter country code associated with the address. */
  countryCode?: Maybe<CountryCode>;
  /** The first name of the individual associated with this address. */
  firstName?: Maybe<Scalars['Max50Text']['output']>;
  /** The last name, surname, or family name of the individual associated with this address. */
  lastName?: Maybe<Scalars['Max50Text']['output']>;
  /** A set of specific numbers, and sometimes letters, that help postal services deliver mail. */
  postalCode?: Maybe<Scalars['Max15Text']['output']>;
  /** State or province. */
  state?: Maybe<Scalars['Max100Text']['output']>;
}

export interface AddressDetailsInput {
  /** The first line of the address. */
  address1?: InputMaybe<Scalars['Max100Text']['input']>;
  /** The second line of the address, if applicable. */
  address2?: InputMaybe<Scalars['Max100Text']['input']>;
  /** The third line of the address, if applicable. */
  address3?: InputMaybe<Scalars['Max100Text']['input']>;
  /** City, town, or village. */
  city?: InputMaybe<Scalars['Max100Text']['input']>;
  /** The ISO 3166-1 three-letter country code associated with the address. */
  countryCode?: InputMaybe<CountryCode>;
  /** The first name of the individual associated with this address. */
  firstName?: InputMaybe<Scalars['Max50Text']['input']>;
  /** The last name, surname, or family name of the individual associated with this address. */
  lastName?: InputMaybe<Scalars['Max50Text']['input']>;
  /** A set of specific numbers, and sometimes letters, that help postal services deliver mail. */
  postalCode?: InputMaybe<Scalars['Max15Text']['input']>;
  /** State or province. */
  state?: InputMaybe<Scalars['Max100Text']['input']>;
}

export interface AddressInput {
  /** The first line of the address. */
  address1?: InputMaybe<Scalars['Max100Text']['input']>;
  /** The second line of the address, if applicable. */
  address2?: InputMaybe<Scalars['Max100Text']['input']>;
  /** The third line of the address, if applicable. */
  address3?: InputMaybe<Scalars['Max100Text']['input']>;
  addressType?: InputMaybe<AddressType>;
  /** City, town, or village. */
  city?: InputMaybe<Scalars['Max100Text']['input']>;
  /** The ISO 3166-1 three-letter country code associated with the address. */
  countryCode?: InputMaybe<CountryCode>;
  /** A set of specific numbers, and sometimes letters, that help postal services deliver mail. */
  postalCode?: InputMaybe<Scalars['Max15Text']['input']>;
  /** State or province. */
  state?: InputMaybe<Scalars['Max100Text']['input']>;
}

export interface AddressOutput {
  __typename?: 'AddressOutput';
  /** The first line of the address. */
  address1?: Maybe<Scalars['Max100Text']['output']>;
  /** The second line of the address, if applicable. */
  address2?: Maybe<Scalars['Max100Text']['output']>;
  /** The third line of the address, if applicable. */
  address3?: Maybe<Scalars['Max100Text']['output']>;
  addressType?: Maybe<AddressType>;
  /** City, town, or village. */
  city?: Maybe<Scalars['Max100Text']['output']>;
  /** The ISO 3166-1 three-letter country code associated with the address. */
  countryCode?: Maybe<CountryCode>;
  formattedAddress?: Maybe<Scalars['String']['output']>;
  /** A set of specific numbers, and sometimes letters, that help postal services deliver mail. */
  postalCode?: Maybe<Scalars['Max15Text']['output']>;
  /** State or province. */
  state?: Maybe<Scalars['Max100Text']['output']>;
}

export const AddressType = {
  /** Business address should match the Acceptor's location. */
  BusinessAddress: 'BUSINESS_ADDRESS',
  /** Legal entity address is required for 1099 tax reporting purposes. */
  LegalAddress: 'LEGAL_ADDRESS',
} as const;

export type AddressType = (typeof AddressType)[keyof typeof AddressType];
/** Network address verification service response. */
export interface AddressVerificationResponse {
  __typename?: 'AddressVerificationResponse';
  /** The address verification service (AVS) result, normalized and described by Tesouro. */
  avsResponseCode: AvsResponse;
  /** The response code sent from the network detailing the address verification service (AVS) result. */
  networkCode?: Maybe<Scalars['String']['output']>;
  /** A high level result. e.g., Full match, Partial match, No match, No response, Not attempted */
  responseType: AvsResponseType;
}

/** Advice regarding follow up action for this transaction. */
export interface Advice {
  __typename?: 'Advice';
  /** Network advice code forwarded from the network containing advice regarding retry. */
  networkAdviceCode?: Maybe<Scalars['String']['output']>;
}

/** Types of fees that can be allocated to a transaction. This includes both required network and processing fees as well as optional fees that may be charged by partners. */
export const AllocationFeeType = {
  /** Optional fee charged by the partner entity to the acceptor's customer for the convenience of using alternative payment channels or methods. */
  ConvenienceFee: 'CONVENIENCE_FEE',
  /** Fee paid to the card-issuing bank for processing a card transaction. Set by card networks and calculated based on factors like card type, merchant category, and transaction amount. */
  InterchangeFee: 'INTERCHANGE_FEE',
  /** Fee charged by card networks (e.g., Visa, Mastercard) for using their payment infrastructure and services. */
  NetworkFee: 'NETWORK_FEE',
  /** Fee charged by the partner entity to the acceptor for general payment processing and business services. */
  PartnerFee: 'PARTNER_FEE',
  /** Fee charged by the partner entity to the acceptor. */
  PresenterFee: 'PRESENTER_FEE',
  /** Fee charged by Tesouro for processing transactions and providing payment processing services. */
  ProcessorFee: 'PROCESSOR_FEE',
  /** Optional fee charged by the partner entity to the acceptor's customer for value-added services beyond basic payment processing. */
  ServiceFee: 'SERVICE_FEE',
  /** Optional fee charged by the partner entity to the acceptor's customer to offset payment processing costs, particularly for credit card transactions. */
  Surcharge: 'SURCHARGE',
} as const;

export type AllocationFeeType = (typeof AllocationFeeType)[keyof typeof AllocationFeeType];
export const AllocationType = {
  AcceptorSettlement: 'ACCEPTOR_SETTLEMENT',
  AchReturn: 'ACH_RETURN',
  ConvenienceFee: 'CONVENIENCE_FEE',
  Dispute: 'DISPUTE',
  InterchangeFee: 'INTERCHANGE_FEE',
  NetworkFee: 'NETWORK_FEE',
  OperatingExpense: 'OPERATING_EXPENSE',
  PartnerFee: 'PARTNER_FEE',
  PresenterFee: 'PRESENTER_FEE',
  ProcessorFee: 'PROCESSOR_FEE',
  ServiceFee: 'SERVICE_FEE',
  Settlement: 'SETTLEMENT',
  Surcharge: 'SURCHARGE',
} as const;

export type AllocationType = (typeof AllocationType)[keyof typeof AllocationType];
export const AmericanExpressProgram = {
  Direct: 'DIRECT',
  OptBlue: 'OPT_BLUE',
} as const;

export type AmericanExpressProgram =
  (typeof AmericanExpressProgram)[keyof typeof AmericanExpressProgram];
export interface AmountDetails {
  __typename?: 'AmountDetails';
  /** The amount of cashback requested by the presenter. */
  cashBack?: Maybe<Scalars['Decimal']['output']>;
  /** The total amount of convenience fees collected. */
  convenienceFee?: Maybe<Scalars['Decimal']['output']>;
  /** Total discount amount applied to the order. */
  discount?: Maybe<Scalars['Decimal']['output']>;
  /** Total charges for any import or export duties included in the order. */
  duty?: Maybe<Scalars['Decimal']['output']>;
  /** The amount of gratuity requested by the presenter. */
  gratuity?: Maybe<Scalars['Decimal']['output']>;
  /** The total amount of service fees collected. */
  serviceFee?: Maybe<Scalars['Decimal']['output']>;
  /** Total shipping charges for the transaction. */
  shipping?: Maybe<Scalars['Decimal']['output']>;
  /** The sum of all item costs in the transaction before applying any additional charges such as taxes, or fees. */
  subTotal?: Maybe<Scalars['Decimal']['output']>;
  /** The total amount of surcharge collected. */
  surcharge?: Maybe<Scalars['Decimal']['output']>;
}

export interface AmountDetailsInput {
  /** The base transaction amount intended to be collected by this payment not including any cashback, gratuity, fees, or taxes. */
  baseAmount?: InputMaybe<Scalars['DecimalAmount']['input']>;
  /** The cash back amount. */
  cashBackAmount?: InputMaybe<Scalars['DecimalAmount']['input']>;
  /** The purchasing currency code of the request amount. */
  currency: TransactionAmountCurrencyCode;
  /** Total discount amount applied to the order. */
  discountAmount?: InputMaybe<Scalars['Decimal']['input']>;
  /** Total charges for any import or export duties included in the order. */
  dutyAmount?: InputMaybe<Scalars['Decimal']['input']>;
  /** The gratuity amount. */
  gratuityAmount?: InputMaybe<Scalars['DecimalAmount']['input']>;
  /** The total amount of local tax for this payment transaction request. Local tax is imposed by municipal, city, or regional governments and may include sales tax, service tax, or other location-based levies applicable to the transaction. */
  localTaxAmount?: InputMaybe<Scalars['Decimal']['input']>;
  /** The total amount of national tax for this payment transaction request. National tax is a government-imposed tax at the federal or country level, such as Goods and Services Tax (GST), or federal sales tax. */
  nationalTaxAmount?: InputMaybe<Scalars['Decimal']['input']>;
  /** Total shipping charges for the transaction. */
  shippingAmount?: InputMaybe<Scalars['Decimal']['input']>;
  /** The sum of all item costs in the transaction before applying any additional charges such as taxes, or fees */
  subtotalAmount?: InputMaybe<Scalars['DecimalAmount']['input']>;
  /** The requested amount intended to be collected by this transaction. A positive decimal with precision depending on transaction currency. For example: $10.00 would be 10.00 or 10. */
  totalAmount: Scalars['Decimal']['input'];
  /** The total amount of all taxes for this payment transaction request. Must be present if either local or national tax are present. */
  totalTaxAmount?: InputMaybe<Scalars['Decimal']['input']>;
}

export interface AmountDetailsWithFeesInput {
  /** The base transaction amount intended to be collected by this payment not including any cashback, gratuity, fees, or taxes. */
  baseAmount?: InputMaybe<Scalars['DecimalAmount']['input']>;
  /** The cash back amount. */
  cashBackAmount?: InputMaybe<Scalars['DecimalAmount']['input']>;
  /** The purchasing currency code of the request amount. */
  currency: TransactionAmountCurrencyCode;
  /** Total discount amount applied to the order. */
  discountAmount?: InputMaybe<Scalars['Decimal']['input']>;
  /** Total charges for any import or export duties included in the order. */
  dutyAmount?: InputMaybe<Scalars['Decimal']['input']>;
  /** Any fee amounts. */
  fees?: InputMaybe<Array<InputMaybe<PaymentFeeInput>>>;
  /** The gratuity amount. */
  gratuityAmount?: InputMaybe<Scalars['DecimalAmount']['input']>;
  /** The total amount of local tax for this payment transaction request. Local tax is imposed by municipal, city, or regional governments and may include sales tax, service tax, or other location-based levies applicable to the transaction. */
  localTaxAmount?: InputMaybe<Scalars['Decimal']['input']>;
  /** The total amount of national tax for this payment transaction request. National tax is a government-imposed tax at the federal or country level, such as Goods and Services Tax (GST), or federal sales tax. */
  nationalTaxAmount?: InputMaybe<Scalars['Decimal']['input']>;
  /** Total shipping charges for the transaction. */
  shippingAmount?: InputMaybe<Scalars['Decimal']['input']>;
  /** The sum of all item costs in the transaction before applying any additional charges such as taxes, or fees */
  subtotalAmount?: InputMaybe<Scalars['DecimalAmount']['input']>;
  /** The requested amount intended to be collected by this transaction. A positive decimal with precision depending on transaction currency. For example: $10.00 would be 10.00 or 10. */
  totalAmount: Scalars['Decimal']['input'];
  /** The total amount of all taxes for this payment transaction request. Must be present if either local or national tax are present. */
  totalTaxAmount?: InputMaybe<Scalars['Decimal']['input']>;
}

export interface App {
  __typename?: 'App';
  id: Scalars['UUID']['output'];
}

export interface ApplicationEntitiesFilterInput {
  id?: InputMaybe<GuidFilterInput>;
}

export interface ApplicationEntitiesInput {
  orderBy?: InputMaybe<Array<ApplicationEntitiesSortTypeInput>>;
  paging: PagingInput;
  where: ApplicationEntitiesFilterInput;
}

export interface ApplicationEntitiesOutputCollection {
  __typename?: 'ApplicationEntitiesOutputCollection';
  items: Array<ApplicationEntityOutput>;
  pageInfo: PageInfo;
}

export const ApplicationEntitiesSortField = {
  Id: 'ID',
} as const;

export type ApplicationEntitiesSortField =
  (typeof ApplicationEntitiesSortField)[keyof typeof ApplicationEntitiesSortField];
export interface ApplicationEntitiesSortTypeInput {
  field: ApplicationEntitiesSortField;
  sortDirection: SortingEnumType;
}

export interface ApplicationEntityChangeInput {
  applicationEntity: ApplicationEntityModificationInput;
  applicationId: Scalars['UUID']['input'];
  lastUpdatedDateTime: Scalars['DateTime']['input'];
}

export interface ApplicationEntityCreateInput {
  applicationEntity: ApplicationEntityCreationInput;
  applicationId: Scalars['UUID']['input'];
}

export interface ApplicationEntityCreationInput {
  applicationBusinessEntityInput?: InputMaybe<BusinessEntityCreateInput>;
  applicationPersonEntityInput?: InputMaybe<PersonEntityCreateInput>;
}

export interface ApplicationEntityInput {
  applicationBusinessEntityChangeInput?: InputMaybe<BusinessEntityChangeInput>;
  applicationBusinessEntityCreateInput?: InputMaybe<BusinessEntityCreateInput>;
  applicationPersonEntityChangeInput?: InputMaybe<PersonEntityChangeInput>;
  applicationPersonEntityCreateInput?: InputMaybe<PersonEntityCreateInput>;
}

export interface ApplicationEntityModificationInput {
  applicationBusinessEntityInput?: InputMaybe<BusinessEntityChangeInput>;
  applicationPersonEntityInput?: InputMaybe<PersonEntityChangeInput>;
}

export interface ApplicationEntityOutput {
  address?: Maybe<AddressOutput>;
  emailAddress?: Maybe<Scalars['String']['output']>;
  /** A unique UUID created by Tesouro and assigned to the entity. */
  id?: Maybe<Scalars['UUID']['output']>;
  ipAddress?: Maybe<Scalars['String']['output']>;
  /** The approximate ownership of the acceptor that this owner holds. Formatted as a decimal, e.g., If the owners holds 30%, input as 0.30 */
  ownership?: Maybe<Scalars['Percentage']['output']>;
  personTypes?: Maybe<Array<PersonType>>;
  /** True if this entity should no longer be part of the application. */
  removeEntity?: Maybe<Scalars['Boolean']['output']>;
}

export interface ApplicationEntityPayload {
  __typename?: 'ApplicationEntityPayload';
  applicationEntityOutput?: Maybe<ApplicationEntityOutput>;
  errors?: Maybe<Array<ErrorBase>>;
}

export interface ApplicationEvent {
  __typename?: 'ApplicationEvent';
  applicationId: Scalars['UUID']['output'];
  createdDateTime: Scalars['DateTime']['output'];
  displayInformation: Array<Scalars['String']['output']>;
  eventType: EventType;
  id: Scalars['UUID']['output'];
  triggeredBy?: Maybe<Actor>;
}

export interface ApplicationEventCollection {
  __typename?: 'ApplicationEventCollection';
  items: Array<ApplicationEvent>;
  pageInfo: PageInfo;
}

export interface ApplicationEventInput {
  paging: PagingInput;
}

export interface ApplicationFilterInput {
  id?: InputMaybe<GuidFilterInput>;
}

export interface ApplicationInput {
  orderBy?: InputMaybe<Array<ApplicationSortTypeInput>>;
  paging: PagingInput;
  where: ApplicationFilterInput;
}

export const ApplicationSortField = {
  Id: 'ID',
} as const;

export type ApplicationSortField = (typeof ApplicationSortField)[keyof typeof ApplicationSortField];
export interface ApplicationSortTypeInput {
  field: ApplicationSortField;
  sortDirection: SortingEnumType;
}

/** Defines when a policy shall be executed. */
export const ApplyPolicy = {
  /** After the resolver was executed. */
  AfterResolver: 'AFTER_RESOLVER',
  /** Before the resolver was executed. */
  BeforeResolver: 'BEFORE_RESOLVER',
  /** The policy is applied in the validation step before the execution. */
  Validation: 'VALIDATION',
} as const;

export type ApplyPolicy = (typeof ApplyPolicy)[keyof typeof ApplyPolicy];
export interface ApprovedAuthorization extends Authorization, PaymentTransaction {
  __typename?: 'ApprovedAuthorization';
  acceptor: Acceptor;
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff. */
  activityDate?: Maybe<Scalars['Date']['output']>;
  /** The result of the address verification service (AVS), which checks if the cardholder address submitted with the transaction matches what is on record with the issuer. */
  addressVerification?: Maybe<AvsResponse>;
  /** Components of the requested amount that may or may not have been provided by the presenter on the payment transaction request. */
  amountDetails?: Maybe<AmountDetails>;
  /** How much of the requested authorization amount was approved. */
  approvedAmount: Scalars['Decimal']['output'];
  /** Specifies that the approved authorization will be automatically captured. */
  automaticCapture?: Maybe<Scalars['Boolean']['output']>;
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /** Specifies if the transaction will be acquired by Tesouro or conveyed to another network for funding. */
  conveyedStatus?: Maybe<ConveyedStatus>;
  /** The currency specified on the transaction request, in ISO 4217 alpha currency code format. */
  currency?: Maybe<Scalars['String']['output']>;
  /** Aggregate information for assessed fees */
  fees?: Maybe<FeeDetails>;
  /** A unique identifier assigned by Tesouro for every transaction request received. */
  id: Scalars['UUID']['output'];
  /** Line items associated with the payment transaction. */
  lineItems?: Maybe<Array<LineItem>>;
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  merchantCategory?: Maybe<Scalars['String']['output']>;
  /** The result of the name verification service, which checks if the cardholder name submitted with the transaction matches what is on record with the issuer. */
  nameVerification?: Maybe<NameVerificationResponseCode>;
  /** A six-digit code returned from the card network on an approved authorization, and displayed on the customer's receipt. */
  networkApprovalCode?: Maybe<Scalars['String']['output']>;
  /** A response code provided by the card network identifying the specific approval or decline reason. */
  networkResponseCode?: Maybe<Scalars['String']['output']>;
  /** A unique value created by the card network and assigned to the transaction and returned to Tesouro in the authorization response. The card network uses this value to maintain an audit trail throughout the life cycle of the transaction and all related transactions, such as reversals, adjustments, confirmations and charge-backs. */
  networkTransactionId?: Maybe<Scalars['String']['output']>;
  /** Information concerning the order placed by the customer. */
  order: Order;
  organization: Organization;
  /** The card-present or card-not-present channel from which the customer makes a payment, e.g., In-store using a physical card terminal, online, or over the phone or through mail order. */
  paymentChannel: PaymentChannel;
  /** The means by which the payment details are captured, e.g., Card swipe, contactless "tap", chip entry "dip", keyed, etc. */
  paymentEntryMode: PaymentEntryMode;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Refers to the various options available for customers to make payments when purchasing a product or service. */
  paymentMethod: PaymentMethod;
  /** The payment network that the transaction was sent across, which may be unaffiliated with the card brand. */
  processingNetwork: Network;
  /** A response code provided by Tesouro identifying the specific approval or decline reason. */
  processorResponseCode: ProcessorResponseCode;
  /** A human readable description of the authorization response code. e.g., Insufficient funds. */
  processorResponseMessage: Scalars['String']['output'];
  /** A unique transaction identifier created by the entity holding the direct relationship with the Acceptor. Tesouro uses this identifier to manage idempotency. */
  reference?: Maybe<Scalars['String']['output']>;
  /** The transaction amount submitted with the authorization request. */
  requestedAmount: Scalars['Decimal']['output'];
  /** The result of the authorization request, e.g., Approved or Declined. */
  responseType?: Maybe<ResponseType>;
  /** The result of the card security code verification service, which checks if the CVV2/CVC2/CID submitted with the transaction matches what is on record with the issuer. */
  securityCodeVerification?: Maybe<SecurityCodeResponse>;
  /** The tax identification number (TIN) is a unique identifier created by the national government and associated with the acceptor at the time the transaction was submitted */
  taxIdentificationNumber?: Maybe<Scalars['String']['output']>;
  /** The various tax amounts collected on the payment transaction. */
  taxes?: Maybe<Taxes>;
  /** The date and time that Tesouro received the transaction, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime: Scalars['DateTime']['output'];
  /** The type of payment transaction, e.g., Authorization, Capture, Sale, Refund, Reversal, etc. */
  transactionType: PaymentTransactionType;
}

export interface ApprovedCapture extends Capture, PaymentTransaction {
  __typename?: 'ApprovedCapture';
  acceptor: Acceptor;
  /** The Acquirer Reference Number (ARN) is a unique 23 digit number created by Tesouro and assigned to a transaction to allow the acquiring and issuing banks to trace the transaction until it is funded to the bank. */
  acquirerReferenceNumber?: Maybe<Scalars['String']['output']>;
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff. */
  activityDate?: Maybe<Scalars['Date']['output']>;
  /** The result of the address verification service (AVS), which checks if the cardholder address submitted with the transaction matches what is on record with the issuer. */
  addressVerification?: Maybe<AvsResponse>;
  /** Components of the requested amount that may or may not have been provided by the presenter on the payment transaction request. */
  amountDetails?: Maybe<AmountDetails>;
  /** The amount approved for authorization on this transaction */
  approvedAmount: Scalars['Decimal']['output'];
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /**
   * The amount of convenience fees associated with this transaction
   * @deprecated Use amountDetails.convenienceFee instead.
   */
  convenienceFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The currency specified on the transaction request, in ISO 4217 alpha currency code format. */
  currency?: Maybe<Scalars['String']['output']>;
  /**
   * The total amount of fees applicable to this transaction.
   * @deprecated Use fees.summary.totalAmount instead.
   */
  feeTotalAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Aggregate information for assessed fees */
  fees?: Maybe<FeeDetails>;
  /** The currency of the funded transaction, formatted in ISO 4217 alphabetic code. */
  fundingCurrency?: Maybe<Scalars['String']['output']>;
  /** The total amount of the transaction converted to its funding currency, before any fees are deducted. */
  fundingGrossAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The amount to be funded after deducting the applicable fees. Presented in the funding currency. */
  fundingNetAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Details on the funds transfer containing this transaction's funding amount. */
  fundsTransfer?: Maybe<FundsTransfer>;
  /** A unique identifier assigned by Tesouro for every transaction request received. */
  id: Scalars['UUID']['output'];
  /**
   * The amount of interchange fees applicable to the transaction. Interchange fees are set by the card networks, and paid to the bank that issued the card used for the transaction.
   * @deprecated Use fees.summary.interchangeAmount instead.
   */
  interchangeFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Indicates if the funding amount has been released. Defined as having a funds transfer ID and funds transfer release date. */
  isFunded: Scalars['Boolean']['output'];
  /** Indicates if the partner fee was adjusted at the transaction level. */
  isPartnerFeeAdjusted: Scalars['Boolean']['output'];
  /** Line items associated with the payment transaction. */
  lineItems?: Maybe<Array<LineItem>>;
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  merchantCategory?: Maybe<Scalars['String']['output']>;
  /** The result of the name verification service, which checks if the cardholder name submitted with the transaction matches what is on record with the issuer. */
  nameVerification?: Maybe<NameVerificationResponseCode>;
  /** A six-digit code returned from the card network on an approved authorization, and displayed on the customer's receipt. */
  networkApprovalCode?: Maybe<Scalars['String']['output']>;
  /**
   * The amount of network fees applicable to this transaction. Network fees are set by card networks and are paid to the card network.
   * @deprecated Use fees.summary.networkAmount instead.
   */
  networkFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** A response code provided by the card network identifying the specific approval or decline reason. */
  networkResponseCode?: Maybe<Scalars['String']['output']>;
  /** A unique value created by the card network and assigned to the transaction and returned to Tesouro in the authorization response. The card network uses this value to maintain an audit trail throughout the life cycle of the transaction and all related transactions, such as reversals, adjustments, confirmations and charge-backs. */
  networkTransactionId?: Maybe<Scalars['String']['output']>;
  /** Information concerning the order placed by the customer. */
  order: Order;
  organization: Organization;
  /**
   * The amount of partner fees applicable to this transaction. Partner fees are set by and paid to the partner.
   * @deprecated Use fees.summary.partnerAmount instead.
   */
  partnerFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The card-present or card-not-present channel from which the customer makes a payment, e.g., In-store using a physical card terminal, online, or over the phone or through mail order. */
  paymentChannel: PaymentChannel;
  /** The means by which the payment details are captured, e.g., Card swipe, contactless "tap", chip entry "dip", keyed, etc. */
  paymentEntryMode: PaymentEntryMode;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Refers to the various options available for customers to make payments when purchasing a product or service. */
  paymentMethod: PaymentMethod;
  /** The payment network that the transaction was sent across, which may be unaffiliated with the card brand. */
  processingNetwork: Network;
  /**
   * The amount of processor fees applicable to this transaction. Processor fees are set by and paid to Tesouro.
   * @deprecated Use fees.summary.processorAmount instead.
   */
  processorFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** A response code provided by Tesouro identifying the specific approval or decline reason. */
  processorResponseCode: ProcessorResponseCode;
  /** A human readable description of the authorization response code. e.g., Insufficient funds. */
  processorResponseMessage: Scalars['String']['output'];
  /** A unique transaction identifier created by the entity holding the direct relationship with the Acceptor. Tesouro uses this identifier to manage idempotency. */
  reference?: Maybe<Scalars['String']['output']>;
  /** The transaction amount submitted with the authorization request. */
  requestedAmount: Scalars['Decimal']['output'];
  /** The result of the authorization request, e.g., Approved or Declined. */
  responseType?: Maybe<ResponseType>;
  /** The result of the card security code verification service, which checks if the CVV2/CVC2/CID submitted with the transaction matches what is on record with the issuer. */
  securityCodeVerification?: Maybe<SecurityCodeResponse>;
  /**
   * The amount of service fees associated with this transaction
   * @deprecated Use amountDetails.serviceFee instead.
   */
  serviceFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /**
   * The amount of surcharge associated with this transaction
   * @deprecated Use amountDetails.surcharge instead.
   */
  surchargeAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The tax identification number (TIN) is a unique identifier created by the national government and associated with the acceptor at the time the transaction was submitted */
  taxIdentificationNumber?: Maybe<Scalars['String']['output']>;
  /** The various tax amounts collected on the payment transaction. */
  taxes?: Maybe<Taxes>;
  /** The date and time that Tesouro received the transaction, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime: Scalars['DateTime']['output'];
  /** The type of payment transaction, e.g., Authorization, Capture, Sale, Refund, Reversal, etc. */
  transactionType: PaymentTransactionType;
}

export interface ApprovedCardVerification extends CardVerification, PaymentTransaction {
  __typename?: 'ApprovedCardVerification';
  acceptor: Acceptor;
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff. */
  activityDate?: Maybe<Scalars['Date']['output']>;
  /** The result of the address verification service (AVS), which checks if the cardholder address submitted with the transaction matches what is on record with the issuer. */
  addressVerification?: Maybe<AvsResponse>;
  /** Components of the requested amount that may or may not have been provided by the presenter on the payment transaction request. */
  amountDetails?: Maybe<AmountDetails>;
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /** Aggregate information for assessed fees */
  fees?: Maybe<FeeDetails>;
  /** A unique identifier assigned by Tesouro for every transaction request received. */
  id: Scalars['UUID']['output'];
  /** Line items associated with the payment transaction. */
  lineItems?: Maybe<Array<LineItem>>;
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  merchantCategory?: Maybe<Scalars['String']['output']>;
  /** The result of the name verification service, which checks if the cardholder name submitted with the transaction matches what is on record with the issuer. */
  nameVerification?: Maybe<NameVerificationResponseCode>;
  /** A six-digit code returned from the card network on an approved authorization, and displayed on the customer's receipt. */
  networkApprovalCode?: Maybe<Scalars['String']['output']>;
  /** A response code provided by the card network identifying the specific approval or decline reason. */
  networkResponseCode?: Maybe<Scalars['String']['output']>;
  /** A unique value created by the card network and assigned to the transaction and returned to Tesouro in the authorization response. The card network uses this value to maintain an audit trail throughout the life cycle of the transaction and all related transactions, such as reversals, adjustments, confirmations and charge-backs. */
  networkTransactionId?: Maybe<Scalars['String']['output']>;
  organization: Organization;
  /** The card-present or card-not-present channel from which the customer makes a payment, e.g., In-store using a physical card terminal, online, or over the phone or through mail order. */
  paymentChannel: PaymentChannel;
  /** The means by which the payment details are captured, e.g., Card swipe, contactless "tap", chip entry "dip", keyed, etc. */
  paymentEntryMode: PaymentEntryMode;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Refers to the various options available for customers to make payments when purchasing a product or service. */
  paymentMethod: PaymentMethod;
  /** The payment network that the transaction was sent across, which may be unaffiliated with the card brand. */
  processingNetwork: Network;
  /** A response code provided by Tesouro identifying the specific approval or decline reason. */
  processorResponseCode: ProcessorResponseCode;
  /** A human readable description of the authorization response code. e.g., Insufficient funds. */
  processorResponseMessage: Scalars['String']['output'];
  /** A unique transaction identifier created by the entity holding the direct relationship with the Acceptor. Tesouro uses this identifier to manage idempotency. */
  reference?: Maybe<Scalars['String']['output']>;
  /** The result of the authorization request, e.g., Approved or Declined. */
  responseType?: Maybe<ResponseType>;
  /** The result of the card security code verification service, which checks if the CVV2/CVC2/CID submitted with the transaction matches what is on record with the issuer. */
  securityCodeVerification?: Maybe<SecurityCodeResponse>;
  /** The tax identification number (TIN) is a unique identifier created by the national government and associated with the acceptor at the time the transaction was submitted */
  taxIdentificationNumber?: Maybe<Scalars['String']['output']>;
  /** The various tax amounts collected on the payment transaction. */
  taxes?: Maybe<Taxes>;
  /** The date and time that Tesouro received the transaction, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime: Scalars['DateTime']['output'];
  /** The type of payment transaction, e.g., Authorization, Capture, Sale, Refund, Reversal, etc. */
  transactionType: PaymentTransactionType;
}

export interface ApprovedIncrementalAuthorization
  extends IncrementalAuthorization,
    PaymentTransaction {
  __typename?: 'ApprovedIncrementalAuthorization';
  acceptor: Acceptor;
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff. */
  activityDate?: Maybe<Scalars['Date']['output']>;
  /** The result of the address verification service (AVS), which checks if the cardholder address submitted with the transaction matches what is on record with the issuer. */
  addressVerification?: Maybe<AvsResponse>;
  /** Components of the requested amount that may or may not have been provided by the presenter on the payment transaction request. */
  amountDetails?: Maybe<AmountDetails>;
  /** How much of the requested incremental authorization amount was approved. */
  approvedAmount: Scalars['Decimal']['output'];
  /** Specifies that the approved authorization will be automatically captured. */
  automaticCapture?: Maybe<Scalars['Boolean']['output']>;
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /** Specifies if the transaction will be acquired by Tesouro or conveyed to another network for funding. */
  conveyedStatus?: Maybe<ConveyedStatus>;
  /** The currency specified on the transaction request, in ISO 4217 alpha currency code format. */
  currency?: Maybe<Scalars['String']['output']>;
  /** Aggregate information for assessed fees */
  fees?: Maybe<FeeDetails>;
  /** A unique identifier assigned by Tesouro for every transaction request received. */
  id: Scalars['UUID']['output'];
  /** Line items associated with the payment transaction. */
  lineItems?: Maybe<Array<LineItem>>;
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  merchantCategory?: Maybe<Scalars['String']['output']>;
  /** The result of the name verification service, which checks if the cardholder name submitted with the transaction matches what is on record with the issuer. */
  nameVerification?: Maybe<NameVerificationResponseCode>;
  /** A six-digit code returned from the card network on an approved authorization, and displayed on the customer's receipt. */
  networkApprovalCode?: Maybe<Scalars['String']['output']>;
  /** A response code provided by the card network identifying the specific approval or decline reason. */
  networkResponseCode?: Maybe<Scalars['String']['output']>;
  /** A unique value created by the card network and assigned to the transaction and returned to Tesouro in the authorization response. The card network uses this value to maintain an audit trail throughout the life cycle of the transaction and all related transactions, such as reversals, adjustments, confirmations and charge-backs. */
  networkTransactionId?: Maybe<Scalars['String']['output']>;
  /** Information concerning the order placed by the customer. */
  order: Order;
  organization: Organization;
  /** The card-present or card-not-present channel from which the customer makes a payment, e.g., In-store using a physical card terminal, online, or over the phone or through mail order. */
  paymentChannel: PaymentChannel;
  /** The means by which the payment details are captured, e.g., Card swipe, contactless "tap", chip entry "dip", keyed, etc. */
  paymentEntryMode: PaymentEntryMode;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Refers to the various options available for customers to make payments when purchasing a product or service. */
  paymentMethod: PaymentMethod;
  /** The amount previously authorized. */
  previouslyApprovedAmount: Scalars['Decimal']['output'];
  /** The payment network that the transaction was sent across, which may be unaffiliated with the card brand. */
  processingNetwork: Network;
  /** A response code provided by Tesouro identifying the specific approval or decline reason. */
  processorResponseCode: ProcessorResponseCode;
  /** A human readable description of the authorization response code. e.g., Insufficient funds. */
  processorResponseMessage: Scalars['String']['output'];
  /** A unique transaction identifier created by the entity holding the direct relationship with the Acceptor. Tesouro uses this identifier to manage idempotency. */
  reference?: Maybe<Scalars['String']['output']>;
  /** The transaction amount submitted with the authorization request. */
  requestedAmount: Scalars['Decimal']['output'];
  /** The result of the authorization request, e.g., Approved or Declined. */
  responseType?: Maybe<ResponseType>;
  /** The result of the card security code verification service, which checks if the CVV2/CVC2/CID submitted with the transaction matches what is on record with the issuer. */
  securityCodeVerification?: Maybe<SecurityCodeResponse>;
  /** The tax identification number (TIN) is a unique identifier created by the national government and associated with the acceptor at the time the transaction was submitted */
  taxIdentificationNumber?: Maybe<Scalars['String']['output']>;
  /** The various tax amounts collected on the payment transaction. */
  taxes?: Maybe<Taxes>;
  /** The date and time that Tesouro received the transaction, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime: Scalars['DateTime']['output'];
  /** The type of payment transaction, e.g., Authorization, Capture, Sale, Refund, Reversal, etc. */
  transactionType: PaymentTransactionType;
  /** The total authorization amount that will need to be captured, calculated as the previously approved authorization amount plus the incremental authorization amount. */
  updatedAuthorizationAmount: Scalars['Decimal']['output'];
}

export interface ApprovedRefund extends PaymentTransaction, Refund {
  __typename?: 'ApprovedRefund';
  acceptor: Acceptor;
  /** The Acquirer Reference Number (ARN) is a unique 23 digit number created by Tesouro and assigned to a transaction to allow the acquiring and issuing banks to trace the transaction until it is funded to the bank. */
  acquirerReferenceNumber?: Maybe<Scalars['String']['output']>;
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff. */
  activityDate?: Maybe<Scalars['Date']['output']>;
  /** Components of the requested amount that may or may not have been provided by the presenter on the payment transaction request. */
  amountDetails?: Maybe<AmountDetails>;
  /** The amount approved for authorization on this transaction */
  approvedAmount: Scalars['Decimal']['output'];
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /**
   * The amount of convenience fees associated with this transaction
   * @deprecated Use amountDetails.convenienceFee instead.
   */
  convenienceFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The currency specified on the transaction request, in ISO 4217 alpha currency code format. */
  currency?: Maybe<Scalars['String']['output']>;
  /** Information that appears on the bank account owner's bank statement and describes the transaction. */
  customerStatementMemo?: Maybe<Scalars['String']['output']>;
  /**
   * The total amount of fees applicable to this transaction.
   * @deprecated Use fees.summary.totalAmount instead.
   */
  feeTotalAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Aggregate information for assessed fees */
  fees?: Maybe<FeeDetails>;
  /** The currency of the funded transaction, formatted in ISO 4217 alphabetic code. */
  fundingCurrency?: Maybe<Scalars['String']['output']>;
  /** The total amount of the transaction converted to its funding currency, before any fees are deducted. */
  fundingGrossAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The amount to be funded after deducting the applicable fees. Presented in the funding currency. */
  fundingNetAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Details on the funds transfer containing this transaction's funding amount. */
  fundsTransfer?: Maybe<FundsTransfer>;
  /** A unique identifier assigned by Tesouro for every transaction request received. */
  id: Scalars['UUID']['output'];
  /**
   * The amount of interchange fees applicable to the transaction. Interchange fees are set by the card networks, and paid to the bank that issued the card used for the transaction.
   * @deprecated Use fees.summary.interchangeAmount instead.
   */
  interchangeFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Indicates if the funding amount has been released. Defined as having a funds transfer ID and funds transfer release date. */
  isFunded: Scalars['Boolean']['output'];
  /** Line items associated with the payment transaction. */
  lineItems?: Maybe<Array<LineItem>>;
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  merchantCategory?: Maybe<Scalars['String']['output']>;
  /** A six-digit code returned from the card network on an approved authorization, and displayed on the customer's receipt. */
  networkApprovalCode?: Maybe<Scalars['String']['output']>;
  /**
   * The amount of network fees applicable to this transaction. Network fees are set by card networks and are paid to the card network.
   * @deprecated Use fees.summary.networkAmount instead.
   */
  networkFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** A response code provided by the card network identifying the specific approval or decline reason. */
  networkResponseCode?: Maybe<Scalars['String']['output']>;
  /** A unique value created by the card network and assigned to the transaction and returned to Tesouro in the authorization response. The card network uses this value to maintain an audit trail throughout the life cycle of the transaction and all related transactions, such as reversals, adjustments, confirmations and charge-backs. */
  networkTransactionId?: Maybe<Scalars['String']['output']>;
  /** Information concerning the order placed by the customer. */
  order: Order;
  organization: Organization;
  /**
   * The amount of partner fees applicable to this transaction. Partner fees are set by and paid to the partner.
   * @deprecated Use fees.summary.partnerAmount instead.
   */
  partnerFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The card-present or card-not-present channel from which the customer makes a payment, e.g., In-store using a physical card terminal, online, or over the phone or through mail order. */
  paymentChannel: PaymentChannel;
  /** The means by which the payment details are captured, e.g., Card swipe, contactless "tap", chip entry "dip", keyed, etc. */
  paymentEntryMode: PaymentEntryMode;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Refers to the various options available for customers to make payments when purchasing a product or service. */
  paymentMethod: PaymentMethod;
  /** The payment network that the transaction was sent across, which may be unaffiliated with the card brand. */
  processingNetwork: Network;
  /**
   * The amount of processor fees applicable to this transaction. Processor fees are set by and paid to Tesouro.
   * @deprecated Use fees.summary.processorAmount instead.
   */
  processorFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** A response code provided by Tesouro identifying the specific approval or decline reason. */
  processorResponseCode: ProcessorResponseCode;
  /** A human readable description of the authorization response code. e.g., Insufficient funds. */
  processorResponseMessage: Scalars['String']['output'];
  /** A unique transaction identifier created by the entity holding the direct relationship with the Acceptor. Tesouro uses this identifier to manage idempotency. */
  reference?: Maybe<Scalars['String']['output']>;
  /** The transaction amount submitted with the authorization request. */
  requestedAmount: Scalars['Decimal']['output'];
  /** The result of the authorization request, e.g., Approved or Declined. */
  responseType?: Maybe<ResponseType>;
  /**
   * The amount of service fees associated with this transaction
   * @deprecated Use amountDetails.serviceFee instead.
   */
  serviceFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /**
   * The amount of surcharge associated with this transaction
   * @deprecated Use amountDetails.surcharge instead.
   */
  surchargeAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The tax identification number (TIN) is a unique identifier created by the national government and associated with the acceptor at the time the transaction was submitted */
  taxIdentificationNumber?: Maybe<Scalars['String']['output']>;
  /** The various tax amounts collected on the payment transaction. */
  taxes?: Maybe<Taxes>;
  /** A unique 15-digit number that identifies an Automated Clearing House (ACH) transaction. It's used by the bank to track the transaction and resolve issues. */
  traceNumber?: Maybe<Scalars['String']['output']>;
  /** The date and time that Tesouro received the transaction, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime: Scalars['DateTime']['output'];
  /** The type of payment transaction, e.g., Authorization, Capture, Sale, Refund, Reversal, etc. */
  transactionType: PaymentTransactionType;
  /** The date the bank transfer will be debited from or credited to customers account. */
  transferEffectiveDate?: Maybe<Scalars['Date']['output']>;
}

export interface ApprovedRefundAuthorization extends PaymentTransaction, RefundAuthorization {
  __typename?: 'ApprovedRefundAuthorization';
  acceptor: Acceptor;
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff. */
  activityDate?: Maybe<Scalars['Date']['output']>;
  /** Components of the requested amount that may or may not have been provided by the presenter on the payment transaction request. */
  amountDetails?: Maybe<AmountDetails>;
  /** How much of the requested authorization amount was approved. */
  approvedAmount: Scalars['Decimal']['output'];
  /** Specifies that the approved authorization will be automatically captured. */
  automaticCapture?: Maybe<Scalars['Boolean']['output']>;
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /** Specifies if the transaction will be acquired by Tesouro or conveyed to another network for funding. */
  conveyedStatus?: Maybe<ConveyedStatus>;
  /** The currency specified on the transaction request, in ISO 4217 alpha currency code format. */
  currency?: Maybe<Scalars['String']['output']>;
  /** Aggregate information for assessed fees */
  fees?: Maybe<FeeDetails>;
  /** A unique identifier assigned by Tesouro for every transaction request received. */
  id: Scalars['UUID']['output'];
  /** Line items associated with the payment transaction. */
  lineItems?: Maybe<Array<LineItem>>;
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  merchantCategory?: Maybe<Scalars['String']['output']>;
  /** The result of the name verification service, which checks if the cardholder name submitted with the transaction matches what is on record with the issuer. */
  nameVerification?: Maybe<NameVerificationResponseCode>;
  /** A six-digit code returned from the card network on an approved authorization, and displayed on the customer's receipt. */
  networkApprovalCode?: Maybe<Scalars['String']['output']>;
  /** A response code provided by the card network identifying the specific approval or decline reason. */
  networkResponseCode?: Maybe<Scalars['String']['output']>;
  /** A unique value created by the card network and assigned to the transaction and returned to Tesouro in the authorization response. The card network uses this value to maintain an audit trail throughout the life cycle of the transaction and all related transactions, such as reversals, adjustments, confirmations and charge-backs. */
  networkTransactionId?: Maybe<Scalars['String']['output']>;
  /** Information concerning the order placed by the customer. */
  order: Order;
  organization: Organization;
  /** The card-present or card-not-present channel from which the customer makes a payment, e.g., In-store using a physical card terminal, online, or over the phone or through mail order. */
  paymentChannel: PaymentChannel;
  /** The means by which the payment details are captured, e.g., Card swipe, contactless "tap", chip entry "dip", keyed, etc. */
  paymentEntryMode: PaymentEntryMode;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Refers to the various options available for customers to make payments when purchasing a product or service. */
  paymentMethod: PaymentMethod;
  /** The payment network that the transaction was sent across, which may be unaffiliated with the card brand. */
  processingNetwork: Network;
  /** A response code provided by Tesouro identifying the specific approval or decline reason. */
  processorResponseCode: ProcessorResponseCode;
  /** A human readable description of the authorization response code. e.g., Insufficient funds. */
  processorResponseMessage: Scalars['String']['output'];
  /** A unique transaction identifier created by the entity holding the direct relationship with the Acceptor. Tesouro uses this identifier to manage idempotency. */
  reference?: Maybe<Scalars['String']['output']>;
  /** The transaction amount submitted with the authorization request. */
  requestedAmount: Scalars['Decimal']['output'];
  /** The result of the authorization request, e.g., Approved or Declined. */
  responseType?: Maybe<ResponseType>;
  /** The result of the card security code verification service, which checks if the CVV2/CVC2/CID submitted with the transaction matches what is on record with the issuer. */
  securityCodeVerification?: Maybe<SecurityCodeResponse>;
  /** The tax identification number (TIN) is a unique identifier created by the national government and associated with the acceptor at the time the transaction was submitted */
  taxIdentificationNumber?: Maybe<Scalars['String']['output']>;
  /** The various tax amounts collected on the payment transaction. */
  taxes?: Maybe<Taxes>;
  /** The date and time that Tesouro received the transaction, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime: Scalars['DateTime']['output'];
  /** The type of payment transaction, e.g., Authorization, Capture, Sale, Refund, Reversal, etc. */
  transactionType: PaymentTransactionType;
}

export interface ApprovedReversal extends PaymentTransaction, Reversal {
  __typename?: 'ApprovedReversal';
  acceptor: Acceptor;
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff. */
  activityDate?: Maybe<Scalars['Date']['output']>;
  /** The result of the address verification service (AVS), which checks if the cardholder address submitted with the transaction matches what is on record with the issuer. */
  addressVerification?: Maybe<AvsResponse>;
  /** Components of the requested amount that may or may not have been provided by the presenter on the payment transaction request. */
  amountDetails?: Maybe<AmountDetails>;
  /** The amount approved for authorization on this transaction */
  approvedAmount: Scalars['Decimal']['output'];
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /** The currency specified on the transaction request, in ISO 4217 alpha currency code format. */
  currency?: Maybe<Scalars['String']['output']>;
  /** Aggregate information for assessed fees */
  fees?: Maybe<FeeDetails>;
  /** A unique identifier assigned by Tesouro for every transaction request received. */
  id: Scalars['UUID']['output'];
  /** Line items associated with the payment transaction. */
  lineItems?: Maybe<Array<LineItem>>;
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  merchantCategory?: Maybe<Scalars['String']['output']>;
  /** The result of the name verification service, which checks if the cardholder name submitted with the transaction matches what is on record with the issuer. */
  nameVerification?: Maybe<NameVerificationResponseCode>;
  /** A response code provided by the card network identifying the specific approval or decline reason. */
  networkResponseCode?: Maybe<Scalars['String']['output']>;
  /** A unique value created by the card network and assigned to the transaction and returned to Tesouro in the authorization response. The card network uses this value to maintain an audit trail throughout the life cycle of the transaction and all related transactions, such as reversals, adjustments, confirmations and charge-backs. */
  networkTransactionId?: Maybe<Scalars['String']['output']>;
  /** Information concerning the order placed by the customer. */
  order: Order;
  organization: Organization;
  /** The transaction ID of the authorization being reversed. */
  originalAuthorizationTransactionId?: Maybe<Scalars['UUID']['output']>;
  /** The card-present or card-not-present channel from which the customer makes a payment, e.g., In-store using a physical card terminal, online, or over the phone or through mail order. */
  paymentChannel: PaymentChannel;
  /** The means by which the payment details are captured, e.g., Card swipe, contactless "tap", chip entry "dip", keyed, etc. */
  paymentEntryMode: PaymentEntryMode;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Refers to the various options available for customers to make payments when purchasing a product or service. */
  paymentMethod: PaymentMethod;
  /** The payment network that the transaction was sent across, which may be unaffiliated with the card brand. */
  processingNetwork: Network;
  /** A response code provided by Tesouro identifying the specific approval or decline reason. */
  processorResponseCode: ProcessorResponseCode;
  /** A human readable description of the authorization response code. e.g., Insufficient funds. */
  processorResponseMessage: Scalars['String']['output'];
  /** A unique transaction identifier created by the entity holding the direct relationship with the Acceptor. Tesouro uses this identifier to manage idempotency. */
  reference?: Maybe<Scalars['String']['output']>;
  /** The transaction amount submitted with the authorization request. */
  requestedAmount: Scalars['Decimal']['output'];
  /** The result of the authorization request, e.g., Approved or Declined. */
  responseType?: Maybe<ResponseType>;
  /** The result of the card security code verification service, which checks if the CVV2/CVC2/CID submitted with the transaction matches what is on record with the issuer. */
  securityCodeVerification?: Maybe<SecurityCodeResponse>;
  /** The tax identification number (TIN) is a unique identifier created by the national government and associated with the acceptor at the time the transaction was submitted */
  taxIdentificationNumber?: Maybe<Scalars['String']['output']>;
  /** The various tax amounts collected on the payment transaction. */
  taxes?: Maybe<Taxes>;
  /** The date and time that Tesouro received the transaction, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime: Scalars['DateTime']['output'];
  /** The type of payment transaction, e.g., Authorization, Capture, Sale, Refund, Reversal, etc. */
  transactionType: PaymentTransactionType;
}

export interface AsyncReportFilterInput {
  requestedDate: DateFilterInput;
}

export interface AsyncReportInput {
  orderBy?: InputMaybe<Array<AsyncReportsSortTypeInput>>;
  paging: PagingInput;
  where: AsyncReportFilterInput;
}

export interface AsyncReportRequest {
  __typename?: 'AsyncReportRequest';
  description?: Maybe<Scalars['String']['output']>;
  expiresDateTime: Scalars['DateTime']['output'];
  fileName?: Maybe<Scalars['String']['output']>;
  fileSize?: Maybe<Scalars['Long']['output']>;
  fileType: FileTypes;
  generatedDateTime?: Maybe<Scalars['DateTime']['output']>;
  isCompressed: Scalars['Boolean']['output'];
  presenter?: Maybe<Presenter>;
  reportId?: Maybe<Scalars['UUID']['output']>;
  requestId: Scalars['UUID']['output'];
  requestedDateTime: Scalars['DateTime']['output'];
  status: AsyncReportStatus;
  tags?: Maybe<Array<Scalars['String']['output']>>;
  url?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
}

export interface AsyncReportRequestCollection {
  __typename?: 'AsyncReportRequestCollection';
  items: Array<AsyncReportRequest>;
  pageInfo: PageInfo;
}

export interface AsyncReportResponse {
  __typename?: 'AsyncReportResponse';
  /** A unique identifier created by Tesouro and associated with the asynchronous report request. */
  requestId: Scalars['UUID']['output'];
}

export const AsyncReportStatus = {
  AlreadyDownloaded: 'ALREADY_DOWNLOADED',
  Failed: 'FAILED',
  FileGenerated: 'FILE_GENERATED',
  Ready: 'READY',
  Received: 'RECEIVED',
} as const;

export type AsyncReportStatus = (typeof AsyncReportStatus)[keyof typeof AsyncReportStatus];
export interface AsyncReportsDetailsInput {
  /** Tesouro names the files so that the filename is contextual to the data the report contains, e.g., acceptorName_reportType_YYYYMM-DD-to-YYYMMDD_createdOnDate. If you prefer to override Tesouro's file naming and specify your own format, add it here. */
  compressedFileName?: InputMaybe<Scalars['String']['input']>;
  /** Add an optional description to describe the purpose of this report. Maximum 250 characters. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Specify whether the report is needed in compressed format. */
  isCompressed: Scalars['Boolean']['input'];
  /** Tags associated with the report */
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
}

export const AsyncReportsSortField = {
  RequestedDate: 'REQUESTED_DATE',
} as const;

export type AsyncReportsSortField =
  (typeof AsyncReportsSortField)[keyof typeof AsyncReportsSortField];
export interface AsyncReportsSortTypeInput {
  field: AsyncReportsSortField;
  sortDirection: SortingEnumType;
}

export interface Attachment {
  __typename?: 'Attachment';
  fileName: Scalars['String']['output'];
  fileUrl: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  uploadedBy: Actor;
  /** The date and time in UTC that this file was stored in the system. */
  uploadedDateTime: Scalars['DateTime']['output'];
}

export interface AttachmentsRequiredError extends Error {
  __typename?: 'AttachmentsRequiredError';
  message: Scalars['String']['output'];
}

/** An exception that occurs when a user is not able to be authenticated */
export interface AuthenticationError extends Error {
  __typename?: 'AuthenticationError';
  /** The general code for the error */
  code: Scalars['String']['output'];
  /** A human readable description of the error */
  message: Scalars['String']['output'];
}

export interface Authorization {
  acceptor: Acceptor;
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff. */
  activityDate?: Maybe<Scalars['Date']['output']>;
  /** The result of the address verification service (AVS), which checks if the cardholder address submitted with the transaction matches what is on record with the issuer. */
  addressVerification?: Maybe<AvsResponse>;
  /** Components of the requested amount that may or may not have been provided by the presenter on the payment transaction request. */
  amountDetails?: Maybe<AmountDetails>;
  /** Specifies that the approved authorization will be automatically captured. */
  automaticCapture?: Maybe<Scalars['Boolean']['output']>;
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /** The currency specified on the transaction request, in ISO 4217 alpha currency code format. */
  currency?: Maybe<Scalars['String']['output']>;
  /** Aggregate information for assessed fees */
  fees?: Maybe<FeeDetails>;
  /** A unique identifier assigned by Tesouro for every transaction request received. */
  id: Scalars['UUID']['output'];
  /** Line items associated with the payment transaction. */
  lineItems?: Maybe<Array<LineItem>>;
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  merchantCategory?: Maybe<Scalars['String']['output']>;
  /** The result of the name verification service, which checks if the cardholder name submitted with the transaction matches what is on record with the issuer. */
  nameVerification?: Maybe<NameVerificationResponseCode>;
  /** A response code provided by the card network identifying the specific approval or decline reason. */
  networkResponseCode?: Maybe<Scalars['String']['output']>;
  /** A unique value created by the card network and assigned to the transaction and returned to Tesouro in the authorization response. The card network uses this value to maintain an audit trail throughout the life cycle of the transaction and all related transactions, such as reversals, adjustments, confirmations and charge-backs. */
  networkTransactionId?: Maybe<Scalars['String']['output']>;
  /** Information concerning the order placed by the customer. */
  order: Order;
  organization: Organization;
  /** The card-present or card-not-present channel from which the customer makes a payment, e.g., In-store using a physical card terminal, online, or over the phone or through mail order. */
  paymentChannel: PaymentChannel;
  /** The means by which the payment details are captured, e.g., Card swipe, contactless "tap", chip entry "dip", keyed, etc. */
  paymentEntryMode: PaymentEntryMode;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Refers to the various options available for customers to make payments when purchasing a product or service. */
  paymentMethod: PaymentMethod;
  /** The payment network that the transaction was sent across, which may be unaffiliated with the card brand. */
  processingNetwork: Network;
  /** A response code provided by Tesouro identifying the specific approval or decline reason. */
  processorResponseCode: ProcessorResponseCode;
  /** A human readable description of the authorization response code. e.g., Insufficient funds. */
  processorResponseMessage: Scalars['String']['output'];
  /** A unique transaction identifier created by the entity holding the direct relationship with the Acceptor. Tesouro uses this identifier to manage idempotency. */
  reference?: Maybe<Scalars['String']['output']>;
  /** The transaction amount submitted with the authorization request. */
  requestedAmount: Scalars['Decimal']['output'];
  /** The result of the authorization request, e.g., Approved or Declined. */
  responseType?: Maybe<ResponseType>;
  /** The result of the card security code verification service, which checks if the CVV2/CVC2/CID submitted with the transaction matches what is on record with the issuer. */
  securityCodeVerification?: Maybe<SecurityCodeResponse>;
  /** The tax identification number (TIN) is a unique identifier created by the national government and associated with the acceptor at the time the transaction was submitted */
  taxIdentificationNumber?: Maybe<Scalars['String']['output']>;
  /** The various tax amounts collected on the payment transaction. */
  taxes?: Maybe<Taxes>;
  /** The date and time that Tesouro received the transaction, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime: Scalars['DateTime']['output'];
  /** The type of payment transaction, e.g., Authorization, Capture, Sale, Refund, Reversal, etc. */
  transactionType: PaymentTransactionType;
}

export interface AuthorizationAmountDetails {
  __typename?: 'AuthorizationAmountDetails';
  /** The approved amount from the network. */
  approvedAmount: Scalars['Decimal']['output'];
  /** The purchasing currency code of the transaction. */
  currency: TransactionAmountCurrencyCode;
  /** The original request amount. */
  requestedAmount: Scalars['Decimal']['output'];
}

/** If the network returns an approval response, the following will be populated. */
export interface AuthorizationApproval extends AuthorizationResponse {
  __typename?: 'AuthorizationApproval';
  /** The date Tesouro received the transaction based on acceptor cutoff time */
  activityDate: Scalars['Date']['output'];
  /** Advice regarding follow up action for this transaction. */
  advice: Advice;
  /** Amount information will be returned here. */
  authorizationAmountDetails: AuthorizationAmountDetails;
  /** Address Verification Service (AVS) is a service provided by the payment brands that determines the match or partial match of the consumer's address information. */
  avsResponseDetails: AddressVerificationResponse;
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /** Details related to the card used on the transaction */
  cardDetails?: Maybe<CardInformation>;
  /** The security code response from the network. */
  cardSecurityCodeResponseDetails: CardSecurityCodeResponseDetails;
  /**
   * Difference between request receipt and response in milliseconds.
   * @deprecated New durations coming soon.
   */
  duration: Scalars['Int']['output'];
  /** Result of Tesouro's idempotency check. If the transaction reference matches that of another transaction from that presenter it will be treated as a duplicate. */
  isDuplicateRequest: Scalars['Boolean']['output'];
  /** Name verification service result provided by the payment brand. */
  nameVerificationResponseDetails: NameVerificationResponseDetails;
  /** A six-digit code returned from the network on APPROVED authorizations, and displayed on the customer's receipt. If the authorization is declined, this field will be blank. */
  networkApprovalCode: Scalars['String']['output'];
  /** The response code from the network. */
  networkResponseDetails: NetworkResponseDetails;
  /** The transaction ID forwarded from the network response. */
  networkTransactionId?: Maybe<Scalars['String']['output']>;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** The system trace audit number sent to the network. */
  systemTraceAuditNumber?: Maybe<Scalars['String']['output']>;
  /** The UTC date and time the transaction was received by Tesouro. */
  timestampUtc: Scalars['DateTime']['output'];
  /** Details associated with the token generated on a tokenization request. */
  tokenDetails?: Maybe<TokenDetails>;
  /** A unique identifier created by Tesouro and assigned to the transaction. */
  transactionId: Scalars['UUID']['output'];
}

export const AuthorizationApprovalStatus = {
  Approved: 'APPROVED',
  Declined: 'DECLINED',
  PartiallyApproved: 'PARTIALLY_APPROVED',
} as const;

export type AuthorizationApprovalStatus =
  (typeof AuthorizationApprovalStatus)[keyof typeof AuthorizationApprovalStatus];
export interface AuthorizationBase {
  /** A unique, 36 character identifier created by Tesouro and assigned to the entity providing the goods or services to the cardholder, such as a Merchant, a Submerchant of a Payment Facilitator, a Seller within a Marketplace, or a Biller of a Consumer Bill Payment Service Provider (CBPS). Historically, processors have called this identifier the Merchant ID (or MID), Outlet ID, or Customer number. */
  acceptorId: Scalars['UUID']['output'];
  /** The billing address associated with the payment method used on the transaction. */
  billToAddress?: Maybe<AddressDetails>;
  /** How the consumer interacts with the acceptor. Defaults to ECOMMERCE if not provided. */
  channel: PaymentChannel;
  /** Details pertaining to the customer's order. */
  orderDetails?: Maybe<OrderDetails>;
  /** A unique identifier created by the entity holding the direct relationship with the Acceptor, and used by that entity for reconciliation and transaction search. Tesouro uses this identifier to manage idempotency. */
  transactionReference: Scalars['Max36Text']['output'];
}

/** If the network returns a declined response, information regarding the decline will be populated here. */
export interface AuthorizationDecline extends AuthorizationResponse {
  __typename?: 'AuthorizationDecline';
  /** The date Tesouro received the transaction based on acceptor cutoff time */
  activityDate: Scalars['Date']['output'];
  /** Advice regarding follow up action for this transaction. */
  advice: Advice;
  /** Address Verification Service (AVS) is a service provided by the payment brands that determines the match or partial match of the consumer's address information. */
  avsResponseDetails: AddressVerificationResponse;
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /** Details related to the card used on the transaction */
  cardDetails?: Maybe<CardInformation>;
  /** The security code response from the network. */
  cardSecurityCodeResponseDetails: CardSecurityCodeResponseDetails;
  /** Specifies the type of response, e.g. SOFT_DECLINE, HARD_DECLINE, REFERRAL. */
  declineType: DeclineType;
  /**
   * Difference between request receipt and response in milliseconds.
   * @deprecated New durations coming soon.
   */
  duration: Scalars['Int']['output'];
  /** Result of Tesouro's idempotency check. If the transaction reference matches that of another transaction from that presenter it will be treated as a duplicate. */
  isDuplicateRequest: Scalars['Boolean']['output'];
  /** A detailed description of the response code. e.g., Insufficient funds. */
  message: Scalars['String']['output'];
  /** Name verification service result provided by the payment brand. */
  nameVerificationResponseDetails: NameVerificationResponseDetails;
  /** The response code from the network. */
  networkResponseDetails: NetworkResponseDetails;
  /** The transaction ID forwarded from the network response. */
  networkTransactionId?: Maybe<Scalars['String']['output']>;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** When an authorization is declined, Tesouro will provide advice on what can be done to remedy, and/or prevent this type of response from occurring in the future. */
  processorAdvice: Scalars['String']['output'];
  /** The system trace audit number sent to the network. */
  systemTraceAuditNumber?: Maybe<Scalars['String']['output']>;
  /** The UTC date and time the transaction was received by Tesouro. */
  timestampUtc: Scalars['DateTime']['output'];
  /** Details associated with the token generated on a tokenization request. */
  tokenDetails?: Maybe<TokenDetails>;
  /** A unique identifier created by Tesouro and assigned to the transaction. */
  transactionId: Scalars['UUID']['output'];
}

/** The intent of the authorization. */
export const AuthorizationIntent = {
  /** The final amount will not differ from the authorized amount. Final authorizations are used for situations where the final amount is known at the time of authorization, such as is typical in retail. All captures corresponding to a final authorization must be submitted within 7 calendar days of the authorization approval date. */
  FinalAuthorization: 'FINAL_AUTHORIZATION',
  /** The final transaction amount may differ from the authorized amount, and may be cancelled or adjusted after the authorization request is approved. Pre-authorizations are often used for situations like hotel reservations and e-commerce purchases, where the goods or services are not immediately available, but will be delivered or rendered within the next 30 days.All captures corresponding to a pre-authorization must be submitted within 30 calendar days of the authorization approval date. */
  PreAuthorization: 'PRE_AUTHORIZATION',
  /** The final transaction amount may differ from the authorized amount, and is not expected to be cancelled after the authorization request is approved. Undefined authorizations are often used for situations like restaurant tips or hotel room service, where the final amount isn't known until later. All captures corresponding to an undefined authorization must be submitted within 7 calendar days of the authorization approval date. */
  UndefinedAuthorization: 'UNDEFINED_AUTHORIZATION',
} as const;

export type AuthorizationIntent = (typeof AuthorizationIntent)[keyof typeof AuthorizationIntent];
export interface AuthorizationResponse {
  /** The date Tesouro received the transaction based on acceptor cutoff time */
  activityDate: Scalars['Date']['output'];
  /** Advice regarding follow up action for this transaction. */
  advice: Advice;
  /** Address Verification Service (AVS) is a service provided by the payment brands that determines the match or partial match of the consumer's address information. */
  avsResponseDetails: AddressVerificationResponse;
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /** Details related to the card used on the transaction */
  cardDetails?: Maybe<CardInformation>;
  /** The security code response from the network. */
  cardSecurityCodeResponseDetails: CardSecurityCodeResponseDetails;
  /**
   * Difference between request receipt and response in milliseconds.
   * @deprecated New durations coming soon.
   */
  duration: Scalars['Int']['output'];
  /** Result of Tesouro's idempotency check. If the transaction reference matches that of another transaction from that presenter it will be treated as a duplicate. */
  isDuplicateRequest: Scalars['Boolean']['output'];
  /** Name verification service result provided by the payment brand. */
  nameVerificationResponseDetails: NameVerificationResponseDetails;
  /** The response code from the network. */
  networkResponseDetails: NetworkResponseDetails;
  /** The transaction ID forwarded from the network response. */
  networkTransactionId?: Maybe<Scalars['String']['output']>;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** The system trace audit number sent to the network. */
  systemTraceAuditNumber?: Maybe<Scalars['String']['output']>;
  /** The UTC date and time the transaction was received by Tesouro. */
  timestampUtc: Scalars['DateTime']['output'];
  /** Details associated with the token generated on a tokenization request. */
  tokenDetails?: Maybe<TokenDetails>;
  /** A unique identifier created by Tesouro and assigned to the transaction. */
  transactionId: Scalars['UUID']['output'];
}

export interface AuthorizationSummariesAsyncInput {
  asyncReportsDetailsInput: AsyncReportsDetailsInput;
  authorizationSummaryReportInput: AuthorizationSummaryAsyncReportInput;
  where: AuthorizationSummaryFilterInput;
}

export interface AuthorizationSummary {
  __typename?: 'AuthorizationSummary';
  acceptor?: Maybe<Acceptor>;
  /** Specifies if the authorization was fully approved, partially approved, or declined. */
  approvalStatus: AuthorizationApprovalStatus;
  /** The Address Verification Service (AVS) result provided by the payment brand that verifies the entered address information matches the address information on file with the issuing bank. */
  avsResponse: Scalars['String']['output'];
  /** The ISO 3166-1 three-letter country code associated with the issuing bank. */
  issuingBankCountry: Scalars['String']['output'];
  /** The name of the issuing bank */
  issuingBankName: Scalars['String']['output'];
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  merchantCategory: Scalars['String']['output'];
  organization: Organization;
  /** Specifies which payment brand was used, e.g., Visa, Mastercard, Discover, American Express, etc. */
  paymentBrand: PaymentBrand;
  /** The card-present or card-not-present channel from which the customer makes a payment, e.g., In-store using a physical card terminal, online, or over the phone or through mail order. */
  paymentChannel: Scalars['String']['output'];
  /** Specifies the source of the card customer's funds , e.g., credit, debit, pre-paid. */
  paymentFundingSource: Scalars['String']['output'];
  /** The product name according to the payment brand (e.g. World Elite Mastercard card), if applicable. */
  paymentProduct: Scalars['String']['output'];
  /** The payment network that the transaction was sent across, which may be unaffiliated with the card brand. */
  processingNetwork: Network;
  /** A normalized response code defined by Tesouro that maps to the network's authorization response code. */
  processorResponseCode: Scalars['String']['output'];
  /** A human readable description of the authorization response code. e.g., Insufficient funds. */
  processorResponseMessage: Scalars['String']['output'];
  /** The response code sent from the network detailing the card security code verification results. */
  securityCodeNetworkResponse: Scalars['String']['output'];
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff */
  transactionActivityDate: Scalars['Date']['output'];
  /** The total amount approved for authorization, which may be different than the total amount requested. */
  transactionAmountApproved: Scalars['Decimal']['output'];
  /** The total amount requested for authorization */
  transactionAmountRequested: Scalars['Decimal']['output'];
  /** The total number of transactions */
  transactionCount: Scalars['Int']['output'];
  /** The currency specified on the transaction, in ISO 4217 alpha currency code format. */
  transactionCurrency: Scalars['String']['output'];
  /** The type of transaction, e.g., Authorization, Capture, Refund, Reversal, Incremental authorization, Authentication. */
  transactionType: PaymentTransactionType;
}

export interface AuthorizationSummaryAsyncReportInput {
  /** The fields to include in the report. */
  fields: Array<AuthorizationSummaryFields>;
  /** Tesouro names the files so that the filename is contextual to the data the report contains, e.g., acceptorName_reportType_YYYYMM-DD-to-YYYMMDD_createdOnDate. If you prefer to override Tesouro's file naming and specify your own format, add it here. */
  fileName?: InputMaybe<Scalars['String']['input']>;
  /** The type of file that the report is saved as, e.g. CSV */
  fileType: FileTypes;
}

export interface AuthorizationSummaryCollection {
  __typename?: 'AuthorizationSummaryCollection';
  items: Array<AuthorizationSummary>;
  pageInfo: PageInfo;
}

export const AuthorizationSummaryFields = {
  AcceptorId: 'ACCEPTOR_ID',
  AcceptorName: 'ACCEPTOR_NAME',
  AcceptorReference: 'ACCEPTOR_REFERENCE',
  ApprovalStatus: 'APPROVAL_STATUS',
  AvsResponse: 'AVS_RESPONSE',
  IssuingBankCountry: 'ISSUING_BANK_COUNTRY',
  IssuingBankName: 'ISSUING_BANK_NAME',
  MerchantCategory: 'MERCHANT_CATEGORY',
  OrganizationId: 'ORGANIZATION_ID',
  PaymentBrand: 'PAYMENT_BRAND',
  PaymentChannel: 'PAYMENT_CHANNEL',
  PaymentFundingSource: 'PAYMENT_FUNDING_SOURCE',
  PaymentProduct: 'PAYMENT_PRODUCT',
  ProcessingNetwork: 'PROCESSING_NETWORK',
  ProcessorResponseCode: 'PROCESSOR_RESPONSE_CODE',
  ProcessorResponseMessage: 'PROCESSOR_RESPONSE_MESSAGE',
  SecurityCodeNetworkResponse: 'SECURITY_CODE_NETWORK_RESPONSE',
  TransactionActivityDate: 'TRANSACTION_ACTIVITY_DATE',
  TransactionAmountApproved: 'TRANSACTION_AMOUNT_APPROVED',
  TransactionAmountRequested: 'TRANSACTION_AMOUNT_REQUESTED',
  TransactionCount: 'TRANSACTION_COUNT',
  TransactionCurrency: 'TRANSACTION_CURRENCY',
  TransactionType: 'TRANSACTION_TYPE',
} as const;

export type AuthorizationSummaryFields =
  (typeof AuthorizationSummaryFields)[keyof typeof AuthorizationSummaryFields];
export interface AuthorizationSummaryFilterInput {
  acceptorId?: InputMaybe<GuidFilterInput>;
  transactionActivityDate: DateRangeFilterInput;
  transactionCurrency?: InputMaybe<Scalars['String']['input']>;
}

export interface AuthorizationSummaryInput {
  orderBy?: InputMaybe<Array<AuthorizationSummarySortTypeInput>>;
  paging: PagingInput;
  where: AuthorizationSummaryFilterInput;
}

export const AuthorizationSummarySortField = {
  ApprovalStatus: 'APPROVAL_STATUS',
  AvsResponse: 'AVS_RESPONSE',
  IssuingBankCountry: 'ISSUING_BANK_COUNTRY',
  IssuingBankName: 'ISSUING_BANK_NAME',
  MerchantCategory: 'MERCHANT_CATEGORY',
  PaymentBrand: 'PAYMENT_BRAND',
  PaymentChannel: 'PAYMENT_CHANNEL',
  PaymentFundingSource: 'PAYMENT_FUNDING_SOURCE',
  PaymentProduct: 'PAYMENT_PRODUCT',
  ProcessingNetwork: 'PROCESSING_NETWORK',
  ProcessorResponseCode: 'PROCESSOR_RESPONSE_CODE',
  SecurityCodeNetworkResponse: 'SECURITY_CODE_NETWORK_RESPONSE',
  TransactionActivityDate: 'TRANSACTION_ACTIVITY_DATE',
  TransactionAmountApproved: 'TRANSACTION_AMOUNT_APPROVED',
  TransactionAmountRequested: 'TRANSACTION_AMOUNT_REQUESTED',
  TransactionCount: 'TRANSACTION_COUNT',
  TransactionCurrency: 'TRANSACTION_CURRENCY',
  TransactionType: 'TRANSACTION_TYPE',
} as const;

export type AuthorizationSummarySortField =
  (typeof AuthorizationSummarySortField)[keyof typeof AuthorizationSummarySortField];
export interface AuthorizationSummarySortTypeInput {
  field: AuthorizationSummarySortField;
  sortDirection: SortingEnumType;
}

export interface AuthorizeCustomerInitiateTransactionCardWithPanDetailsInput {
  /** The card number used in processing the transaction. This is a full PAN. */
  accountNumber: Scalars['CardNumber']['input'];
  /** The two-digit month (MM) of the card's expiration date. */
  expirationMonth: Scalars['NumericMonth']['input'];
  /** The four-digit year (YYYY) of the card's expiration date. */
  expirationYear: Scalars['NumericYear4Digits']['input'];
  /** [DEPRECATED: Use root level channel instead] The card-present or card-not-present channel from which the customer makes a payment, e.g., In-store using a physical card terminal, online, or over the phone or through mail order */
  paymentChannel?: InputMaybe<PanEntryChannel>;
  /** The means by which the card number was entered. */
  paymentEntryMode: PanEntryMode;
  /** The 3 digit number (or 4 digit if American Express) found on the customer's card, or the specific reason if the security code is omitted from the request. */
  securityCode: SecurityCodeInput;
  /** Optional field to be used on customer initiated transactions. Indicates that the presenter intends to store this payment method on file to be used with future merchant initiated transactions. */
  storageIntent?: InputMaybe<StorageIntent>;
  /** The wallet provider for this payment method. Null if not applicable. */
  walletType?: InputMaybe<WalletType>;
}

export interface AuthorizeCustomerInitiatedTransactionAcquirerTokenDetailsInput {
  /** The two-digit month (MM) of the card's expiration date. */
  expirationMonth: Scalars['NumericMonth']['input'];
  /** The four-digit year (YYYY) of the card's expiration date. */
  expirationYear: Scalars['NumericYear4Digits']['input'];
  /** The 3 digit number (or 4 digit if American Express) found on the customer's card, or the specific reason if the security code is omitted from the request. */
  securityCode: SecurityCodeInput;
  /** The value of the acquirer token. */
  token?: InputMaybe<Scalars['String']['input']>;
  /** The value of the acquirer token. */
  tokenizedPan?: InputMaybe<Scalars['String']['input']>;
  /** The wallet provider for this payment method. Null if not applicable. */
  walletType?: InputMaybe<WalletType>;
}

export type AuthorizeCustomerInitiatedTransactionError =
  | AcceptorNotFoundError
  | InternalServiceError
  | InvalidTokenError
  | RouteNotFoundError
  | RuleInViolationError
  | SyntaxOnNetworkResponseError
  | TimeoutOnNetworkResponseError
  | TokenNotFoundError
  | UnknownCardError
  | ValidationFailureError;

/** Input for authorizing a cardholder initiated transaction. */
export interface AuthorizeCustomerInitiatedTransactionInput {
  /** A unique, 36 character identifier created by Tesouro and assigned to the entity providing the goods or services to the cardholder, such as a Merchant, a Submerchant of a Payment Facilitator, a Seller within a Marketplace, or a Biller of a Consumer Bill Payment Service Provider (CBPS). Historically, processors have called this identifier the Merchant ID (or MID), Outlet ID, or Customer number. */
  acceptorId: Scalars['UUID']['input'];
  /** An amount that adjusts the partner fee for this transaction. */
  adjustedPartnerFeeAmount?: InputMaybe<Scalars['Decimal']['input']>;
  /** The intent of the authorization. */
  authorizationIntent?: AuthorizationIntent;
  /** Option to automatically capture this authorization. */
  automaticCapture?: InputMaybe<AutomaticCapture>;
  /** The billing address associated with the payment method used on the transaction. */
  billToAddress?: InputMaybe<AddressDetailsInput>;
  /** [DEPRECATED: Use automaticCapture instead] Automatically capture this authorization. */
  captureIt?: InputMaybe<Scalars['Boolean']['input']>;
  /** How the consumer interacts with the acceptor. Defaults to ECOMMERCE if not provided. */
  channel?: PaymentChannel;
  /** A unique, 36 character identifier created by Tesouro for the purpose of linking together multiple transaction requests and related fees. */
  cohortId?: InputMaybe<Scalars['UUID']['input']>;
  /** Line item details for this order. */
  lineItems?: InputMaybe<Array<LineItemInput>>;
  /** Details pertaining to the customer's order. */
  orderDetails?: InputMaybe<OrderDetailsInput>;
  /** Details regarding the payment method. */
  paymentMethodDetails: AuthorizeCustomerInitiatedTransactionPaymentMethodInput;
  /** Specifies the total amount of the transaction and its currency. */
  transactionAmountDetails: AmountDetailsWithFeesInput;
  /** A unique identifier created by the entity holding the direct relationship with the Acceptor, and used by that entity for reconciliation and transaction search. Tesouro uses this identifier to manage idempotency. */
  transactionReference: Scalars['Max36Text']['input'];
}

export interface AuthorizeCustomerInitiatedTransactionNetworkTokenPassThroughDetailsInput {
  /** The cryptogram generated by the token provider to be used on the transaction. */
  cryptogram: Scalars['String']['input'];
  /** Ecommerce indicator provided by the wallet provider. */
  ecommerceIndicator?: InputMaybe<Scalars['String']['input']>;
  /** The two-digit month (MM) of the card's expiration date. */
  expirationMonth: Scalars['NumericMonth']['input'];
  /** The four-digit year (YYYY) of the card's expiration date. */
  expirationYear: Scalars['NumericYear4Digits']['input'];
  /** [DEPRECATED: Network tokens do not have security codes, so this will be removed.] The 3 digit number (or 4 digit if American Express) found on the customer's card, or the specific reason if the security code is omitted from the request. */
  securityCode?: InputMaybe<SecurityCodeInput>;
  /** The value of the network token. */
  tokenValue: Scalars['String']['input'];
  /** The wallet provider for this payment method. Null if not applicable. */
  walletType?: InputMaybe<WalletType>;
}

export interface AuthorizeCustomerInitiatedTransactionPayload {
  __typename?: 'AuthorizeCustomerInitiatedTransactionPayload';
  authorizationResponse?: Maybe<AuthorizationResponse>;
  errors?: Maybe<Array<AuthorizeCustomerInitiatedTransactionError>>;
}

export interface AuthorizeCustomerInitiatedTransactionPaymentMethodInput {
  acquirerTokenDetails?: InputMaybe<AuthorizeCustomerInitiatedTransactionAcquirerTokenDetailsInput>;
  cardWithPanDetails?: InputMaybe<AuthorizeCustomerInitiateTransactionCardWithPanDetailsInput>;
  networkTokenPassThroughDetails?: InputMaybe<AuthorizeCustomerInitiatedTransactionNetworkTokenPassThroughDetailsInput>;
}

export interface AuthorizeRecurringAcquirerTokenDetailsInput {
  /** The two-digit month (MM) of the card's expiration date. */
  expirationMonth: Scalars['NumericMonth']['input'];
  /** The four-digit year (YYYY) of the card's expiration date. */
  expirationYear: Scalars['NumericYear4Digits']['input'];
  /** The 3 digit number (or 4 digit if American Express) found on the customer's card, or the specific reason if the security code is omitted from the request. */
  securityCode: SecurityCodeInput;
  /** The value of the acquirer token. */
  token?: InputMaybe<Scalars['String']['input']>;
  /** The value of the acquirer token. */
  tokenizedPan?: InputMaybe<Scalars['String']['input']>;
  /** The wallet provider for this payment method. Null if not applicable. */
  walletType?: InputMaybe<WalletType>;
}

export interface AuthorizeRecurringCardWithPanDetailsInput {
  /** The card number used in processing the transaction. This is a full PAN. */
  accountNumber: Scalars['CardNumber']['input'];
  /** The two-digit month (MM) of the card's expiration date. */
  expirationMonth: Scalars['NumericMonth']['input'];
  /** The four-digit year (YYYY) of the card's expiration date. */
  expirationYear: Scalars['NumericYear4Digits']['input'];
  /** [DEPRECATED: Use root level channel instead] The card-present or card-not-present channel from which the customer makes a payment, e.g., In-store using a physical card terminal, online, or over the phone or through mail order */
  paymentChannel?: InputMaybe<PanEntryChannel>;
  /** The means by which the card number was entered. */
  paymentEntryMode: PanEntryMode;
  /** The 3 digit number (or 4 digit if American Express) found on the customer's card, or the specific reason if the security code is omitted from the request. */
  securityCode: SecurityCodeInput;
  /** The wallet provider for this payment method. Null if not applicable. */
  walletType?: InputMaybe<WalletType>;
}

export type AuthorizeRecurringError =
  | AcceptorNotFoundError
  | InternalServiceError
  | InvalidTokenError
  | PriorPaymentNotFoundError
  | RouteNotFoundError
  | RuleInViolationError
  | SyntaxOnNetworkResponseError
  | TimeoutOnNetworkResponseError
  | TokenNotFoundError
  | UnknownCardError
  | ValidationFailureError;

/** Select depending on your method of payment for a recurring transaction. */
export interface AuthorizeRecurringInput {
  /** A unique, 36 character identifier created by Tesouro and assigned to the entity providing the goods or services to the cardholder, such as a Merchant, a Submerchant of a Payment Facilitator, a Seller within a Marketplace, or a Biller of a Consumer Bill Payment Service Provider (CBPS). Historically, processors have called this identifier the Merchant ID (or MID), Outlet ID, or Customer number. */
  acceptorId: Scalars['UUID']['input'];
  /** An amount that adjusts the partner fee for this transaction. */
  adjustedPartnerFeeAmount?: InputMaybe<Scalars['Decimal']['input']>;
  /** Option to automatically capture this authorization. */
  automaticCapture?: InputMaybe<AutomaticCapture>;
  /** The billing address associated with the payment method used on the transaction. */
  billToAddress?: InputMaybe<AddressDetailsInput>;
  /** [DEPRECATED: Use automaticCapture instead] Automatically capture this authorization. */
  captureIt?: InputMaybe<Scalars['Boolean']['input']>;
  /** How the consumer interacts with the acceptor. Defaults to ECOMMERCE if not provided. */
  channel?: PaymentChannel;
  /** Reference to the original customer initiated transaction. If the payment was processed via Tesouro pass the customer initiated transaction payment ID. If payment was processed via another processor pass the merchant initiated transaction pass through data. */
  citReference: CitReferenceInput;
  /** A unique, 36 character identifier created by Tesouro for the purpose of linking together multiple transaction requests and related fees. */
  cohortId?: InputMaybe<Scalars['UUID']['input']>;
  /** Line item details for this order. */
  lineItems?: InputMaybe<Array<LineItemInput>>;
  /** Details pertaining to the customer's order. */
  orderDetails?: InputMaybe<OrderDetailsInput>;
  /** The date of the original purchase. */
  originalPurchaseDate: Scalars['Date']['input'];
  /** Details regarding the payment method. */
  paymentMethodDetails: AuthorizeRecurringPaymentMethodInput;
  /** Specifies the total amount of the transaction and its currency. */
  transactionAmountDetails: AmountDetailsWithFeesInput;
  /** A unique identifier created by the entity holding the direct relationship with the Acceptor, and used by that entity for reconciliation and transaction search. Tesouro uses this identifier to manage idempotency. */
  transactionReference: Scalars['Max36Text']['input'];
}

export interface AuthorizeRecurringNetworkTokenPassThroughDetailsInput {
  /** Ecommerce indicator provided by the wallet provider. */
  ecommerceIndicator?: InputMaybe<Scalars['String']['input']>;
  /** The two-digit month (MM) of the card's expiration date. */
  expirationMonth: Scalars['NumericMonth']['input'];
  /** The four-digit year (YYYY) of the card's expiration date. */
  expirationYear: Scalars['NumericYear4Digits']['input'];
  /** [DEPRECATED: Network tokens do not have security codes, so this will be removed.] The 3 digit number (or 4 digit if American Express) found on the customer's card, or the specific reason if the security code is omitted from the request. */
  securityCode?: InputMaybe<SecurityCodeInput>;
  /** The value of the network token. */
  tokenValue: Scalars['String']['input'];
  /** The wallet provider for this payment method. Null if not applicable. */
  walletType?: InputMaybe<WalletType>;
}

export interface AuthorizeRecurringPayload {
  __typename?: 'AuthorizeRecurringPayload';
  authorizationResponse?: Maybe<AuthorizationResponse>;
  errors?: Maybe<Array<AuthorizeRecurringError>>;
}

export interface AuthorizeRecurringPaymentMethodInput {
  acquirerTokenDetails?: InputMaybe<AuthorizeRecurringAcquirerTokenDetailsInput>;
  cardWithPanDetails?: InputMaybe<AuthorizeRecurringCardWithPanDetailsInput>;
  networkTokenPassThroughDetails?: InputMaybe<AuthorizeRecurringNetworkTokenPassThroughDetailsInput>;
}

/** Options for automatically running a capture following this authorization. */
export const AutomaticCapture = {
  /** Do not automatically submit a capture after this authorization is approved. */
  Never: 'NEVER',
  /** If this authorization approves, automatically submit a capture. */
  OnApproval: 'ON_APPROVAL',
} as const;

export type AutomaticCapture = (typeof AutomaticCapture)[keyof typeof AutomaticCapture];
/** Possible values for address verification result. */
export const AvsResponse = {
  /** Both street address and postal code matches. */
  AddressMatchedPostalcodeMatched: 'ADDRESS_MATCHED_POSTALCODE_MATCHED',
  /** Street address matches, but postal code does not. */
  AddressMatchedPostalcodeMismatched: 'ADDRESS_MATCHED_POSTALCODE_MISMATCHED',
  /** Street address matches, but postal code could not be verified by the issuer. */
  AddressMatchedPostalcodeUnverified: 'ADDRESS_MATCHED_POSTALCODE_UNVERIFIED',
  /** Postal code matches, but street address does not. */
  AddressMismatchedPostalcodeMatched: 'ADDRESS_MISMATCHED_POSTALCODE_MATCHED',
  /** Street address and postal code DO NOT match. */
  AddressMismatchedPostalcodeMismatched: 'ADDRESS_MISMATCHED_POSTALCODE_MISMATCHED',
  /** Postal code matches, but street address could not be verified by the issuer. */
  AddressUnverifiedPostalcodeMatched: 'ADDRESS_UNVERIFIED_POSTALCODE_MATCHED',
  /** Neither the street address nor the postal code could be verified by the issuer. */
  AddressUnverifiedPostalcodeUnverified: 'ADDRESS_UNVERIFIED_POSTALCODE_UNVERIFIED',
  /** Neither a street address nor postal code check was performed by the issuer. */
  AvsNotProcessedRetry: 'AVS_NOT_PROCESSED_RETRY',
  /** Address verification not supported by the issuer. */
  AvsNotSupported: 'AVS_NOT_SUPPORTED',
  /** The status of the address verification was not provided by the issuer. */
  AvsStatusNotProvided: 'AVS_STATUS_NOT_PROVIDED',
} as const;

export type AvsResponse = (typeof AvsResponse)[keyof typeof AvsResponse];
/** A high level description of the Address Verification System (AVS) response. */
export const AvsResponseType = {
  /** The billing address entered fully matches the address on record with the card issuer. */
  FullMatch: 'FULL_MATCH',
  /** AVS was not requested or attempted */
  NotAttempted: 'NOT_ATTEMPTED',
  /** The billing address entered does NOT match the address on record with the card issuer. */
  NoMatch: 'NO_MATCH',
  /** AVS was requested, but the issuer did not respond */
  NoResponse: 'NO_RESPONSE',
  /** The billing address entered partially matches the address on record with the card issuer. */
  PartialMatch: 'PARTIAL_MATCH',
} as const;

export type AvsResponseType = (typeof AvsResponseType)[keyof typeof AvsResponseType];
export interface BankAccount {
  __typename?: 'BankAccount';
  alias: Scalars['String']['output'];
  bankName?: Maybe<Scalars['String']['output']>;
  maskedAccountNumber?: Maybe<Scalars['String']['output']>;
}

export interface BankAccountDetailsInput {
  /** The account number of the bank account. */
  accountNumber: Scalars['String']['input'];
  /** The type of the account owner (e.g., personal, business). */
  accountOwnerType: AccountOwnerType;
  /** The type of the bank account (e.g., consumer, business). */
  bankAccountType: BankAccountType;
  /** The name on the bank account. */
  nameOnAccount: Scalars['String']['input'];
  /** Describes how a customer or business authorized an ACH transaction */
  paymentEntryMode: BankTransferEntryMode;
  /** The type of the recurring payment. */
  recurringType: RecurringType;
  /** The routing number of the bank account. */
  routingNumber: Scalars['String']['input'];
  /** The wallet provider for this payment method. Null if not applicable. */
  walletType?: InputMaybe<WalletType>;
}

export const BankAccountFeesSettlements = {
  FeesOnly: 'FEES_ONLY',
  SettlementsAndFees: 'SETTLEMENTS_AND_FEES',
  SettlementsOnly: 'SETTLEMENTS_ONLY',
} as const;

export type BankAccountFeesSettlements =
  (typeof BankAccountFeesSettlements)[keyof typeof BankAccountFeesSettlements];
export interface BankAccountInput {
  /** The account number of the bank account. */
  accountNumber?: InputMaybe<Scalars['String']['input']>;
  /** The type of the account owner (e.g., personal, business). */
  accountOwnerType?: InputMaybe<AccountOwnerType>;
  bankAccountFeesSettlements?: InputMaybe<BankAccountFeesSettlements>;
  /** The type of the bank account (e.g., savings, demand). */
  bankAccountType?: InputMaybe<BankAccountType>;
  /** Name of the institution where the account is held. */
  financialInstitutionName?: InputMaybe<Scalars['String']['input']>;
  /** The name on the bank account. */
  nameOnAccount?: InputMaybe<Scalars['String']['input']>;
  /** The routing number of the bank account. */
  routingNumber?: InputMaybe<Scalars['String']['input']>;
}

export interface BankAccountOutput {
  __typename?: 'BankAccountOutput';
  /** The type of the account owner (e.g., personal, business). */
  accountOwnerType?: Maybe<AccountOwnerType>;
  bankAccountFeesSettlements?: Maybe<BankAccountFeesSettlements>;
  /** The type of the bank account (e.g., savings, demand). */
  bankAccountType?: Maybe<BankAccountType>;
  /** Name of the institution where the account is held. */
  financialInstitutionName?: Maybe<Scalars['String']['output']>;
  /** The name on the bank account. */
  nameOnAccount?: Maybe<Scalars['String']['output']>;
  /** The account number of the bank account, obfuscated for protection. */
  obfuscatedAccountNumber?: Maybe<Scalars['String']['output']>;
  /** The routing number of the bank account. */
  routingNumber?: Maybe<Scalars['String']['output']>;
}

/** Indicates the type of bank account. */
export const BankAccountType = {
  /** A checking deposit account, typically used for day-to-day transactions, where funds are available on demand. */
  Checking: 'CHECKING',
  /** A savings account, typically used for holding funds with interest, where withdrawals may be limited. */
  Savings: 'SAVINGS',
} as const;

export type BankAccountType = (typeof BankAccountType)[keyof typeof BankAccountType];
export interface BankAcquirerTokenDetailsInput {
  /** The value of the acquirer token. */
  token?: InputMaybe<Scalars['String']['input']>;
  /** The value of the acquirer token. */
  tokenizedPan?: InputMaybe<Scalars['String']['input']>;
  /** The wallet provider for this payment method. Null if not applicable. */
  walletType?: InputMaybe<WalletType>;
}

/** Amount details for an initiate bank account transfer mutation. */
export interface BankAmountDetailsInput {
  /** The currency for the bank account transfer. */
  currency: BankCurrencyCode;
  /** The total amount of the bank transfer. */
  totalAmount: Scalars['Decimal']['input'];
}

export const BankCurrencyCode = {
  Usd: 'USD',
} as const;

export type BankCurrencyCode = (typeof BankCurrencyCode)[keyof typeof BankCurrencyCode];
export interface BankPaymentMethodDetailsResponse {
  __typename?: 'BankPaymentMethodDetailsResponse';
  /** Details associated with the token generated on a tokenization request. */
  acquirerTokenDetails: AcquirerTokenDetails;
  /** Specifies which payment brand was used, e.g., Visa, MasterCard, Discover, American Express, etc. */
  paymentBrand: PaymentBrand;
}

export interface BankPaymentMethodInput {
  acquirerTokenDetails?: InputMaybe<BankAcquirerTokenDetailsInput>;
  bankAccountDetails?: InputMaybe<BankAccountDetailsInput>;
}

/** An electronic movement of funds from one bank account to another. */
export interface BankTransfer extends PaymentMethod {
  __typename?: 'BankTransfer';
  /** The last few numbers of the bank account used as a visual reference to the full account numer. */
  accountNumberEndingIn?: Maybe<Scalars['String']['output']>;
  /** The name of the bank account owner, as provided by the NACHA report. */
  accountOwnerName?: Maybe<Scalars['String']['output']>;
  /** The type of the bank account owner, as provided by the NACHA report. */
  accountOwnerType?: Maybe<AccountOwnerType>;
  /** The type of the bank account, e.g., Checking or Savings. */
  accountType?: Maybe<BankAccountType>;
  /** The acquirer token on file for this payment card, if the card has been used before and the transactor is subscribed to Tesouro's tokenization services. Otherwise, this field's value will be null. */
  acquirerToken?: Maybe<Scalars['String']['output']>;
  /** The brand of payment method used. */
  paymentBrand: PaymentBrand;
  /** A unique nine-digit number that identifies a bank and is used for electronic transactions. It's also known as an ABA routing number, or routing transit number (RTN). */
  routingNumber?: Maybe<Scalars['String']['output']>;
  /** The type of payment method used by the customer to submit the transaction, e.g., Card, Bank transfer, etc. */
  type?: Maybe<PaymentMethodType>;
}

/** If the network returns an approval response, the following will be populated. */
export interface BankTransferApproval extends BankTransferResponse {
  __typename?: 'BankTransferApproval';
  /** The date Tesouro received the transaction based on acceptor cutoff time */
  activityDate: Scalars['Date']['output'];
  /**
   * Difference between request receipt and response in milliseconds.
   * @deprecated New durations coming soon.
   */
  duration: Scalars['Int']['output'];
  /** Result of Tesouro's idempotency check. If the transaction reference matches that of another transaction from that presenter it will be treated as a duplicate. */
  isDuplicateRequest: Scalars['Boolean']['output'];
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** A normalized 4-character response code defined by Tesouro. */
  processorResponseCode: ProcessorResponseCode;
  /** The UTC date and time the transaction was received by Tesouro. */
  timestampUtc: Scalars['DateTime']['output'];
  /** Details associated with the token generated on a tokenization request. */
  tokenDetails?: Maybe<TokenDetails>;
  /** A unique identifier created by Tesouro and assigned to the transaction. */
  transactionId: Scalars['UUID']['output'];
}

/** If the network returns a declined response, information regarding the decline will be populated here. */
export interface BankTransferDecline extends BankTransferResponse {
  __typename?: 'BankTransferDecline';
  /** The date Tesouro received the transaction based on acceptor cutoff time */
  activityDate: Scalars['Date']['output'];
  /** Specifies the type of response, e.g. SOFT_DECLINE, HARD_DECLINE, REFERRAL. */
  declineType: DeclineType;
  /**
   * Difference between request receipt and response in milliseconds.
   * @deprecated New durations coming soon.
   */
  duration: Scalars['Int']['output'];
  /** Result of Tesouro's idempotency check. If the transaction reference matches that of another transaction from that presenter it will be treated as a duplicate. */
  isDuplicateRequest: Scalars['Boolean']['output'];
  /** A detailed description of the response code. e.g., Insufficient funds. */
  message: Scalars['String']['output'];
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** When an authorization is declined, Tesouro will provide advice on what can be done to remedy, and/or prevent this type of response from occurring in the future. */
  processorAdvice: Scalars['String']['output'];
  /** A normalized 4-character response code defined by Tesouro. */
  processorResponseCode: ProcessorResponseCode;
  /** The UTC date and time the transaction was received by Tesouro. */
  timestampUtc: Scalars['DateTime']['output'];
  /** Details associated with the token generated on a tokenization request. */
  tokenDetails?: Maybe<TokenDetails>;
  /** A unique identifier created by Tesouro and assigned to the transaction. */
  transactionId: Scalars['UUID']['output'];
}

export const BankTransferEntryMode = {
  /** Internet-Initiated Entry. */
  Ecommerce: 'ECOMMERCE',
  /** Bank account was manually keyed. */
  Keyed: 'KEYED',
  /** Bank account was stored on file. */
  OnFile: 'ON_FILE',
  /** Telephone-Initiated Entry. */
  Telephone: 'TELEPHONE',
} as const;

export type BankTransferEntryMode =
  (typeof BankTransferEntryMode)[keyof typeof BankTransferEntryMode];
export interface BankTransferResponse {
  /** The date Tesouro received the transaction based on acceptor cutoff time */
  activityDate: Scalars['Date']['output'];
  /**
   * Difference between request receipt and response in milliseconds.
   * @deprecated New durations coming soon.
   */
  duration: Scalars['Int']['output'];
  /** Result of Tesouro's idempotency check. If the transaction reference matches that of another transaction from that presenter it will be treated as a duplicate. */
  isDuplicateRequest: Scalars['Boolean']['output'];
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** A normalized 4-character response code defined by Tesouro. */
  processorResponseCode: ProcessorResponseCode;
  /** The UTC date and time the transaction was received by Tesouro. */
  timestampUtc: Scalars['DateTime']['output'];
  /** Details associated with the token generated on a tokenization request. */
  tokenDetails?: Maybe<TokenDetails>;
  /** A unique identifier created by Tesouro and assigned to the transaction. */
  transactionId: Scalars['UUID']['output'];
}

export interface BaseMutationInput {
  /** A unique, 36 character identifier created by Tesouro and assigned to the entity providing the goods or services to the cardholder, such as a Merchant, a Submerchant of a Payment Facilitator, a Seller within a Marketplace, or a Biller of a Consumer Bill Payment Service Provider (CBPS). Historically, processors have called this identifier the Merchant ID (or MID), Outlet ID, or Customer number. */
  acceptorId: Scalars['UUID']['output'];
  /** A unique identifier created by the entity holding the direct relationship with the Acceptor, and used by that entity for reconciliation and transaction search. Tesouro uses this identifier to manage idempotency. */
  transactionReference: Scalars['Max36Text']['output'];
}

export const BillableType = {
  AccountValidation: 'ACCOUNT_VALIDATION',
  AccountVerification: 'ACCOUNT_VERIFICATION',
  AchCredit: 'ACH_CREDIT',
  AchDebit: 'ACH_DEBIT',
  AchNotificationOfChange: 'ACH_NOTIFICATION_OF_CHANGE',
  AchReturn: 'ACH_RETURN',
  AcquirerToken: 'ACQUIRER_TOKEN',
  AcquirerTokenReferenced: 'ACQUIRER_TOKEN_REFERENCED',
  Authorized: 'AUTHORIZED',
  AuthReversal: 'AUTH_REVERSAL',
  Avs: 'AVS',
  CardVerification: 'CARD_VERIFICATION',
  ClearedCapture: 'CLEARED_CAPTURE',
  ClearedRefund: 'CLEARED_REFUND',
  Dispute: 'DISPUTE',
  IncrementalAuthorization: 'INCREMENTAL_AUTHORIZATION',
  MastercardMerchantLocation: 'MASTERCARD_MERCHANT_LOCATION',
  MiscCreditDebit: 'MISC_CREDIT_DEBIT',
  MisuseOfAuthorization: 'MISUSE_OF_AUTHORIZATION',
  NetSettlementAdjustment: 'NET_SETTLEMENT_ADJUSTMENT',
  NetSettlementInterchange: 'NET_SETTLEMENT_INTERCHANGE',
  ReversedCapture: 'REVERSED_CAPTURE',
  ReversedRefund: 'REVERSED_REFUND',
  ReversedSale: 'REVERSED_SALE',
  Unknown: 'UNKNOWN',
  VisaFanf: 'VISA_FANF',
} as const;

export type BillableType = (typeof BillableType)[keyof typeof BillableType];
/** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
export const BusinessApplicationId = {
  /** Consumer Bill Pay */
  Cb: 'CB',
} as const;

export type BusinessApplicationId =
  (typeof BusinessApplicationId)[keyof typeof BusinessApplicationId];
export interface BusinessEntityChangeInput {
  address?: InputMaybe<AddressInput>;
  businessName?: InputMaybe<Scalars['String']['input']>;
  emailAddress?: InputMaybe<Scalars['String']['input']>;
  /** A unique UUID created by Tesouro and assigned to the entity. */
  id: Scalars['UUID']['input'];
  ipAddress?: InputMaybe<Scalars['String']['input']>;
  legalName?: InputMaybe<Scalars['String']['input']>;
  /** The approximate ownership of the acceptor that this owner holds. Formatted as a decimal, e.g., If the owners holds 30%, input as 0.30. */
  ownership?: InputMaybe<Scalars['Percentage']['input']>;
  personTypes?: InputMaybe<Array<PersonType>>;
  /** True if this entity should no longer be part of the application. */
  removeEntity?: InputMaybe<Scalars['Boolean']['input']>;
  serviceTelephoneNumber?: InputMaybe<Scalars['String']['input']>;
  /** The tax identification number of the legal entity. */
  taxIdentificationNumber?: InputMaybe<EntityIdentificationNumberInput>;
  websiteUrl?: InputMaybe<Scalars['URL']['input']>;
}

export interface BusinessEntityCreateInput {
  address?: InputMaybe<AddressInput>;
  businessName?: InputMaybe<Scalars['String']['input']>;
  emailAddress?: InputMaybe<Scalars['String']['input']>;
  ipAddress?: InputMaybe<Scalars['String']['input']>;
  legalName?: InputMaybe<Scalars['String']['input']>;
  /** The approximate ownership of the acceptor that this owner holds. Formatted as a decimal, e.g., If the owners holds 30%, input as 0.30. */
  ownership?: InputMaybe<Scalars['Percentage']['input']>;
  personTypes?: InputMaybe<Array<PersonType>>;
  serviceTelephoneNumber?: InputMaybe<Scalars['String']['input']>;
  /** The tax identification number of the legal entity. */
  taxIdentificationNumber?: InputMaybe<EntityIdentificationNumberInput>;
  websiteUrl?: InputMaybe<Scalars['URL']['input']>;
}

export interface BusinessEntityOutput extends ApplicationEntityOutput {
  __typename?: 'BusinessEntityOutput';
  address?: Maybe<AddressOutput>;
  businessName?: Maybe<Scalars['String']['output']>;
  emailAddress?: Maybe<Scalars['String']['output']>;
  /** A unique UUID created by Tesouro and assigned to the entity. */
  id?: Maybe<Scalars['UUID']['output']>;
  ipAddress?: Maybe<Scalars['String']['output']>;
  legalName?: Maybe<Scalars['String']['output']>;
  /** The tax identification number of the legal entity, obfuscated for protection. */
  obfuscatedTaxIdentificationNumber?: Maybe<EntityIdentificationNumberOutput>;
  /** The approximate ownership of the acceptor that this owner holds. Formatted as a decimal, e.g., If the owners holds 30%, input as 0.30 */
  ownership?: Maybe<Scalars['Percentage']['output']>;
  personTypes?: Maybe<Array<PersonType>>;
  /** True if this entity should no longer be part of the application. */
  removeEntity?: Maybe<Scalars['Boolean']['output']>;
  serviceTelephoneNumber?: Maybe<Scalars['String']['output']>;
  websiteUrl?: Maybe<Scalars['URL']['output']>;
}

export const BusinessEntityType = {
  Corporation: 'CORPORATION',
  Llc: 'LLC',
  Partnership: 'PARTNERSHIP',
  SoleProprietor: 'SOLE_PROPRIETOR',
} as const;

export type BusinessEntityType = (typeof BusinessEntityType)[keyof typeof BusinessEntityType];
export interface Capture {
  acceptor: Acceptor;
  /** The Acquirer Reference Number (ARN) is a unique 23 digit number created by Tesouro and assigned to a transaction to allow the acquiring and issuing banks to trace the transaction until it is funded to the bank. */
  acquirerReferenceNumber?: Maybe<Scalars['String']['output']>;
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff. */
  activityDate?: Maybe<Scalars['Date']['output']>;
  /** The result of the address verification service (AVS), which checks if the cardholder address submitted with the transaction matches what is on record with the issuer. */
  addressVerification?: Maybe<AvsResponse>;
  /** Components of the requested amount that may or may not have been provided by the presenter on the payment transaction request. */
  amountDetails?: Maybe<AmountDetails>;
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /**
   * The amount of convenience fees associated with this transaction
   * @deprecated Use amountDetails.convenienceFee instead.
   */
  convenienceFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The currency specified on the transaction request, in ISO 4217 alpha currency code format. */
  currency?: Maybe<Scalars['String']['output']>;
  /**
   * The total amount of fees applicable to this transaction.
   * @deprecated Use fees.summary.totalAmount instead.
   */
  feeTotalAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Aggregate information for assessed fees */
  fees?: Maybe<FeeDetails>;
  /** The currency of the funded transaction, formatted in ISO 4217 alphabetic code. */
  fundingCurrency?: Maybe<Scalars['String']['output']>;
  /** The total amount of the transaction converted to its funding currency, before any fees are deducted. */
  fundingGrossAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The amount to be funded after deducting the applicable fees. Presented in the funding currency. */
  fundingNetAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Details on the funds transfer containing this transaction's funding amount. */
  fundsTransfer?: Maybe<FundsTransfer>;
  /** A unique identifier assigned by Tesouro for every transaction request received. */
  id: Scalars['UUID']['output'];
  /**
   * The amount of interchange fees applicable to the transaction. Interchange fees are set by the card networks, and paid to the bank that issued the card used for the transaction.
   * @deprecated Use fees.summary.interchangeAmount instead.
   */
  interchangeFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Indicates if the funding amount has been released. Defined as having a funds transfer ID and funds transfer release date. */
  isFunded: Scalars['Boolean']['output'];
  /** Indicates if the partner fee was adjusted at the transaction level. */
  isPartnerFeeAdjusted: Scalars['Boolean']['output'];
  /** Line items associated with the payment transaction. */
  lineItems?: Maybe<Array<LineItem>>;
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  merchantCategory?: Maybe<Scalars['String']['output']>;
  /** The result of the name verification service, which checks if the cardholder name submitted with the transaction matches what is on record with the issuer. */
  nameVerification?: Maybe<NameVerificationResponseCode>;
  /**
   * The amount of network fees applicable to this transaction. Network fees are set by card networks and are paid to the card network.
   * @deprecated Use fees.summary.networkAmount instead.
   */
  networkFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** A response code provided by the card network identifying the specific approval or decline reason. */
  networkResponseCode?: Maybe<Scalars['String']['output']>;
  /** A unique value created by the card network and assigned to the transaction and returned to Tesouro in the authorization response. The card network uses this value to maintain an audit trail throughout the life cycle of the transaction and all related transactions, such as reversals, adjustments, confirmations and charge-backs. */
  networkTransactionId?: Maybe<Scalars['String']['output']>;
  /** Information concerning the order placed by the customer. */
  order: Order;
  organization: Organization;
  /**
   * The amount of partner fees applicable to this transaction. Partner fees are set by and paid to the partner.
   * @deprecated Use fees.summary.partnerAmount instead.
   */
  partnerFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The card-present or card-not-present channel from which the customer makes a payment, e.g., In-store using a physical card terminal, online, or over the phone or through mail order. */
  paymentChannel: PaymentChannel;
  /** The means by which the payment details are captured, e.g., Card swipe, contactless "tap", chip entry "dip", keyed, etc. */
  paymentEntryMode: PaymentEntryMode;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Refers to the various options available for customers to make payments when purchasing a product or service. */
  paymentMethod: PaymentMethod;
  /** The payment network that the transaction was sent across, which may be unaffiliated with the card brand. */
  processingNetwork: Network;
  /**
   * The amount of processor fees applicable to this transaction. Processor fees are set by and paid to Tesouro.
   * @deprecated Use fees.summary.processorAmount instead.
   */
  processorFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** A response code provided by Tesouro identifying the specific approval or decline reason. */
  processorResponseCode: ProcessorResponseCode;
  /** A human readable description of the authorization response code. e.g., Insufficient funds. */
  processorResponseMessage: Scalars['String']['output'];
  /** A unique transaction identifier created by the entity holding the direct relationship with the Acceptor. Tesouro uses this identifier to manage idempotency. */
  reference?: Maybe<Scalars['String']['output']>;
  /** The transaction amount submitted with the authorization request. */
  requestedAmount: Scalars['Decimal']['output'];
  /** The result of the authorization request, e.g., Approved or Declined. */
  responseType?: Maybe<ResponseType>;
  /** The result of the card security code verification service, which checks if the CVV2/CVC2/CID submitted with the transaction matches what is on record with the issuer. */
  securityCodeVerification?: Maybe<SecurityCodeResponse>;
  /**
   * The amount of service fees associated with this transaction
   * @deprecated Use amountDetails.serviceFee instead.
   */
  serviceFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /**
   * The amount of surcharge associated with this transaction
   * @deprecated Use amountDetails.surcharge instead.
   */
  surchargeAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The tax identification number (TIN) is a unique identifier created by the national government and associated with the acceptor at the time the transaction was submitted */
  taxIdentificationNumber?: Maybe<Scalars['String']['output']>;
  /** The various tax amounts collected on the payment transaction. */
  taxes?: Maybe<Taxes>;
  /** The date and time that Tesouro received the transaction, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime: Scalars['DateTime']['output'];
  /** The type of payment transaction, e.g., Authorization, Capture, Sale, Refund, Reversal, etc. */
  transactionType: PaymentTransactionType;
}

export interface CaptureAmountDetails {
  __typename?: 'CaptureAmountDetails';
  /** The approved amount from the network. */
  approvedAmount: Scalars['Decimal']['output'];
  /** The purchasing currency code of the transaction. */
  currency: TransactionAmountCurrencyCode;
  /** The original request amount. */
  requestedAmount: Scalars['Decimal']['output'];
}

export interface CaptureAuthorizationApproval extends CaptureAuthorizationResponse {
  __typename?: 'CaptureAuthorizationApproval';
  /** The date Tesouro received the transaction based on acceptor cutoff time */
  activityDate: Scalars['Date']['output'];
  /** Amount information will be returned here. */
  captureAmountDetails: CaptureAmountDetails;
  /** Details related to the card used on the transaction */
  cardDetails?: Maybe<CardInformation>;
  /**
   * Difference between request receipt and response in milliseconds.
   * @deprecated New durations coming soon.
   */
  duration: Scalars['Int']['output'];
  /** Result of Tesouro's idempotency check. If the transaction reference matches that of another transaction from that presenter it will be treated as a duplicate. */
  isDuplicateRequest: Scalars['Boolean']['output'];
  /** The response code from the network. */
  networkResponseDetails: NetworkResponseDetails;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** The UTC date and time the transaction was received by Tesouro. */
  timestampUtc: Scalars['DateTime']['output'];
  /** Details associated with the token generated on a tokenization request. */
  tokenDetails?: Maybe<TokenDetails>;
  /** A unique identifier created by Tesouro and assigned to the transaction. */
  transactionId: Scalars['UUID']['output'];
}

export interface CaptureAuthorizationDecline extends CaptureAuthorizationResponse {
  __typename?: 'CaptureAuthorizationDecline';
  /** The date Tesouro received the transaction based on acceptor cutoff time */
  activityDate: Scalars['Date']['output'];
  /** Details related to the card used on the transaction */
  cardDetails?: Maybe<CardInformation>;
  /** Specifies the type of response, e.g. SOFT_DECLINE, HARD_DECLINE, REFERRAL. */
  declineType: DeclineType;
  /**
   * Difference between request receipt and response in milliseconds.
   * @deprecated New durations coming soon.
   */
  duration: Scalars['Int']['output'];
  /** Result of Tesouro's idempotency check. If the transaction reference matches that of another transaction from that presenter it will be treated as a duplicate. */
  isDuplicateRequest: Scalars['Boolean']['output'];
  /** A detailed description of the response code. e.g., Insufficient funds. */
  message: Scalars['String']['output'];
  /** The response code from the network. */
  networkResponseDetails: NetworkResponseDetails;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** When an authorization is declined, Tesouro will provide advice on what can be done to remedy, and/or prevent this type of response from occurring in the future. */
  processorAdvice: Scalars['String']['output'];
  /** The UTC date and time the transaction was received by Tesouro. */
  timestampUtc: Scalars['DateTime']['output'];
  /** Details associated with the token generated on a tokenization request. */
  tokenDetails?: Maybe<TokenDetails>;
  /** A unique identifier created by Tesouro and assigned to the transaction. */
  transactionId: Scalars['UUID']['output'];
}

export type CaptureAuthorizationError =
  | InternalServiceError
  | PriorPaymentNotFoundError
  | RuleInViolationError
  | SyntaxOnNetworkResponseError
  | TimeoutOnNetworkResponseError
  | ValidationFailureError;

/** Top-level input fields for creating a capture transaction for previous authorization. */
export interface CaptureAuthorizationInput {
  /** A unique, 36 character identifier created by Tesouro and assigned to the entity providing the goods or services to the cardholder, such as a Merchant, a Submerchant of a Payment Facilitator, a Seller within a Marketplace, or a Biller of a Consumer Bill Payment Service Provider (CBPS). Historically, processors have called this identifier the Merchant ID (or MID), Outlet ID, or Customer number. */
  acceptorId: Scalars['UUID']['input'];
  /** Line item details for this order. If line items are provided on the capture any line items from the original authorization will be overridden. If line items are provided, transactionAmountDetails must be provided. */
  lineItems?: InputMaybe<Array<LineItemInput>>;
  /** Details pertaining to the customer's order. If null, order details from the original authorization will be used. If provided, all details from the original authorization will be overridden. */
  orderDetails?: InputMaybe<OrderDetailsInput>;
  /** The unique 'paymentId' of the previously authorized payment that is to be captured. */
  paymentId: Scalars['UUID']['input'];
  /** The total count of captures expected for the given authorization. Only applicable for multiple captures for single authorization. For single capture, do not include this field. Maximum 2 digit number. */
  totalCaptureCount?: InputMaybe<Scalars['Max2Digits']['input']>;
  /** An object containing various amount information for a given transaction. If this is omitted the remaining amount pending capture will be used. */
  transactionAmountDetails?: InputMaybe<AmountDetailsInput>;
  /** A unique identifier created by the entity holding the direct relationship with the Acceptor, and used by that entity for reconciliation and transaction search. Tesouro uses this identifier to manage idempotency. */
  transactionReference: Scalars['Max36Text']['input'];
}

export interface CaptureAuthorizationPayload {
  __typename?: 'CaptureAuthorizationPayload';
  captureAuthorizationResponse?: Maybe<CaptureAuthorizationResponse>;
  errors?: Maybe<Array<CaptureAuthorizationError>>;
}

export interface CaptureAuthorizationResponse {
  /** The date Tesouro received the transaction based on acceptor cutoff time */
  activityDate: Scalars['Date']['output'];
  /** Details related to the card used on the transaction */
  cardDetails?: Maybe<CardInformation>;
  /**
   * Difference between request receipt and response in milliseconds.
   * @deprecated New durations coming soon.
   */
  duration: Scalars['Int']['output'];
  /** Result of Tesouro's idempotency check. If the transaction reference matches that of another transaction from that presenter it will be treated as a duplicate. */
  isDuplicateRequest: Scalars['Boolean']['output'];
  /** The response code from the network. */
  networkResponseDetails: NetworkResponseDetails;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** The UTC date and time the transaction was received by Tesouro. */
  timestampUtc: Scalars['DateTime']['output'];
  /** Details associated with the token generated on a tokenization request. */
  tokenDetails?: Maybe<TokenDetails>;
  /** A unique identifier created by Tesouro and assigned to the transaction. */
  transactionId: Scalars['UUID']['output'];
}

/** A cashless payment method where customers pay for their purchases with a card, e.g., debit or credit card. */
export interface Card extends PaymentMethod {
  __typename?: 'Card';
  /** The acquirer token on file for this payment card, if the card has been used before and the transactor is subscribed to Tesouro's tokenization services. Otherwise, this field's value will be null. */
  acquirerToken?: Maybe<Scalars['String']['output']>;
  billToAddress?: Maybe<AddressDetails>;
  /** The brand of payment method used. */
  brand?: Maybe<PaymentBrand>;
  /** The type of account associated with the card, e.g., Consumer, Commercial, Government. */
  consumerType?: Maybe<ConsumerType>;
  /** The two-digit month and four-digit year of the card's expiration date. e.g., MMYYYY */
  expirationDate: Scalars['String']['output'];
  /** The type of card associated with the transaction, e.g., Credit, Debit, Pre-paid, etc. */
  fundingSource?: Maybe<FundingSource>;
  /** The bank identification number (BIN) refers to leading 6-8 digits printed on the payment card, and identifies the bank or financial institution that issued the card to the cardholder. Also known as the Issuer Identification Number (IIN). */
  issuerBin?: Maybe<Scalars['String']['output']>;
  /** The ISO 3166-1 three-letter country code associated with the issuing bank. */
  issuerCountry?: Maybe<Scalars['String']['output']>;
  /** The name of the bank that issued the card. */
  issuerName?: Maybe<Scalars['String']['output']>;
  /** The last four digits of the cardholder's payment card. */
  last4?: Maybe<Scalars['Exact4Digits']['output']>;
  /** The product name according to the card brand, e.g. World Elite Mastercard card, Visa Signature. */
  productName?: Maybe<Scalars['String']['output']>;
  /** The type of payment method used by the customer to submit the transaction, e.g., Card, Bank transfer, etc. */
  type?: Maybe<PaymentMethodType>;
}

export interface CardDetailsSubscriptionInput {
  /** The card number to be subscribed for account updates. This is a full PAN. */
  accountNumber: Scalars['CardNumber']['input'];
  /** The valid expiration month of the card used in processing, presented as two-digit number from 01 to 12. */
  expirationMonth: Scalars['NumericMonth']['input'];
  /** The valid expiration year of the card used in processing, presented as two-digit number, 00-99. */
  expirationYear: Scalars['NumericYear2Digits']['input'];
}

/** Information regarding the card used as payment. */
export interface CardInformation {
  __typename?: 'CardInformation';
  /** The last 4 digits of the cardholder's card number */
  last4?: Maybe<Scalars['Exact4Digits']['output']>;
  /** Specifies which payment brand was used, e.g., Visa, MasterCard, Discover, American Express, etc. */
  paymentBrand: PaymentBrand;
}

export interface CardPaymentMethodDetailsResponse {
  __typename?: 'CardPaymentMethodDetailsResponse';
  /** Details associated with the token generated on a tokenization request. */
  acquirerTokenDetails: AcquirerTokenDetails;
  /** Details related to the card used on the transaction */
  cardDetails: CardInformation;
  /** The response code from the network. */
  networkResponseDetails: NetworkResponseDetails;
  /** Specifies which payment brand was used, e.g., Visa, MasterCard, Discover, American Express, etc. */
  paymentBrand: PaymentBrand;
}

export interface CardSecurityCodeResponseDetails {
  __typename?: 'CardSecurityCodeResponseDetails';
  /** The response code sent from the network detailing the card security code verification results. */
  networkCode?: Maybe<Scalars['String']['output']>;
  /** The card security code verification result, normalized and described by Tesouro. */
  processorCode: SecurityCodeResponse;
}

export interface CardVerification {
  acceptor: Acceptor;
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff. */
  activityDate?: Maybe<Scalars['Date']['output']>;
  /** The result of the address verification service (AVS), which checks if the cardholder address submitted with the transaction matches what is on record with the issuer. */
  addressVerification?: Maybe<AvsResponse>;
  /** Components of the requested amount that may or may not have been provided by the presenter on the payment transaction request. */
  amountDetails?: Maybe<AmountDetails>;
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /** Aggregate information for assessed fees */
  fees?: Maybe<FeeDetails>;
  /** A unique identifier assigned by Tesouro for every transaction request received. */
  id: Scalars['UUID']['output'];
  /** Line items associated with the payment transaction. */
  lineItems?: Maybe<Array<LineItem>>;
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  merchantCategory?: Maybe<Scalars['String']['output']>;
  /** The result of the name verification service, which checks if the cardholder name submitted with the transaction matches what is on record with the issuer. */
  nameVerification?: Maybe<NameVerificationResponseCode>;
  /** A response code provided by the card network identifying the specific approval or decline reason. */
  networkResponseCode?: Maybe<Scalars['String']['output']>;
  /** A unique value created by the card network and assigned to the transaction and returned to Tesouro in the authorization response. The card network uses this value to maintain an audit trail throughout the life cycle of the transaction and all related transactions, such as reversals, adjustments, confirmations and charge-backs. */
  networkTransactionId?: Maybe<Scalars['String']['output']>;
  organization: Organization;
  /** The card-present or card-not-present channel from which the customer makes a payment, e.g., In-store using a physical card terminal, online, or over the phone or through mail order. */
  paymentChannel: PaymentChannel;
  /** The means by which the payment details are captured, e.g., Card swipe, contactless "tap", chip entry "dip", keyed, etc. */
  paymentEntryMode: PaymentEntryMode;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Refers to the various options available for customers to make payments when purchasing a product or service. */
  paymentMethod: PaymentMethod;
  /** The payment network that the transaction was sent across, which may be unaffiliated with the card brand. */
  processingNetwork: Network;
  /** A response code provided by Tesouro identifying the specific approval or decline reason. */
  processorResponseCode: ProcessorResponseCode;
  /** A human readable description of the authorization response code. e.g., Insufficient funds. */
  processorResponseMessage: Scalars['String']['output'];
  /** A unique transaction identifier created by the entity holding the direct relationship with the Acceptor. Tesouro uses this identifier to manage idempotency. */
  reference?: Maybe<Scalars['String']['output']>;
  /** The result of the authorization request, e.g., Approved or Declined. */
  responseType?: Maybe<ResponseType>;
  /** The result of the card security code verification service, which checks if the CVV2/CVC2/CID submitted with the transaction matches what is on record with the issuer. */
  securityCodeVerification?: Maybe<SecurityCodeResponse>;
  /** The tax identification number (TIN) is a unique identifier created by the national government and associated with the acceptor at the time the transaction was submitted */
  taxIdentificationNumber?: Maybe<Scalars['String']['output']>;
  /** The various tax amounts collected on the payment transaction. */
  taxes?: Maybe<Taxes>;
  /** The date and time that Tesouro received the transaction, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime: Scalars['DateTime']['output'];
  /** The type of payment transaction, e.g., Authorization, Capture, Sale, Refund, Reversal, etc. */
  transactionType: PaymentTransactionType;
}

export interface ChangeApplicationInput {
  applicationInput: AcceptorApplicationChangeInput;
}

export interface ChangeApplicationPayload {
  __typename?: 'ChangeApplicationPayload';
  acceptorApplication?: Maybe<AcceptorApplication>;
  errors?: Maybe<Array<ErrorBase>>;
}

/** Pass the Payment ID from the original customer initiated transaction if processed with Tesouro. Otherwise provide the MitPassThrough model. */
export interface CitReferenceInput {
  citPaymentId?: InputMaybe<Scalars['UUID']['input']>;
  mitPassThrough?: InputMaybe<MitPassThroughInput>;
}

export interface Comment {
  __typename?: 'Comment';
  content?: Maybe<Scalars['String']['output']>;
  createdBy: Actor;
  /** The date and time in UTC that this comment was created. */
  createdDateTime: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  lastUpdatedBy: Actor;
  /** The last date and time this was updated in UTC. */
  updatedDateTime: Scalars['DateTime']['output'];
}

export const ConsumerType = {
  All: 'ALL',
  Business: 'BUSINESS',
  Commercial: 'COMMERCIAL',
  Consumer: 'CONSUMER',
  Corporate: 'CORPORATE',
  Government: 'GOVERNMENT',
  Other: 'OTHER',
  Payouts: 'PAYOUTS',
  Unknown: 'UNKNOWN',
} as const;

export type ConsumerType = (typeof ConsumerType)[keyof typeof ConsumerType];
export const ConveyedStatus = {
  /** The transaction is acquired by and funded through the Tesouro platform. */
  Acquired: 'ACQUIRED',
  /** The transaction is conveyed and will be funded through the applicable payment network, e.g. American Express, Discover, Diners Club, etc. */
  Conveyed: 'CONVEYED',
  /** The transaction does not move money, and therefore a conveyed status is not applicable. */
  NotApplicable: 'NOT_APPLICABLE',
} as const;

export type ConveyedStatus = (typeof ConveyedStatus)[keyof typeof ConveyedStatus];
export const CountryCode = {
  /** Aruba */
  Abw: 'ABW',
  /** Afghanistan */
  Afg: 'AFG',
  /** Angola */
  Ago: 'AGO',
  /** Anguilla */
  Aia: 'AIA',
  /** Aland Islands */
  Ala: 'ALA',
  /** Albania */
  Alb: 'ALB',
  /** Andorra */
  And: 'AND',
  /** United Arab Emirates */
  Are: 'ARE',
  /** Argentina */
  Arg: 'ARG',
  /** Armenia */
  Arm: 'ARM',
  /** American Samoa */
  Asm: 'ASM',
  /** Antarctica */
  Ata: 'ATA',
  /** French Southern Territories */
  Atf: 'ATF',
  /** Antigua and Barbuda */
  Atg: 'ATG',
  /** Australia */
  Aus: 'AUS',
  /** Austria */
  Aut: 'AUT',
  /** Azerbaijan */
  Aze: 'AZE',
  /** Burundi */
  Bdi: 'BDI',
  /** Belgium */
  Bel: 'BEL',
  /** Benin */
  Ben: 'BEN',
  /** Bonaire Sint Eustatius and Saba */
  Bes: 'BES',
  /** Burkina Faso */
  Bfa: 'BFA',
  /** Bangladesh */
  Bgd: 'BGD',
  /** Bulgaria */
  Bgr: 'BGR',
  /** Bahrain */
  Bhr: 'BHR',
  /** Bahamas */
  Bhs: 'BHS',
  /** Bosnia and Herzegovina */
  Bih: 'BIH',
  /** Saint Barthélemy */
  Blm: 'BLM',
  /** Belarus */
  Blr: 'BLR',
  /** Belize */
  Blz: 'BLZ',
  /** Bermuda */
  Bmu: 'BMU',
  /** Bolivia */
  Bol: 'BOL',
  /** Brazil */
  Bra: 'BRA',
  /** Barbados */
  Brb: 'BRB',
  /** Brunei Darussalam */
  Brn: 'BRN',
  /** Bhutan */
  Btn: 'BTN',
  /** Bouvet Island */
  Bvt: 'BVT',
  /** Botswana */
  Bwa: 'BWA',
  /** Central African Republic */
  Caf: 'CAF',
  /** Canada */
  Can: 'CAN',
  /** Cocos (Keeling) Islands */
  Cck: 'CCK',
  /** Switzerland */
  Che: 'CHE',
  /** Chile */
  Chl: 'CHL',
  /** China */
  Chn: 'CHN',
  /** Côte d'Ivoire (Ivory Coast) */
  Civ: 'CIV',
  /** Cameroon */
  Cmr: 'CMR',
  /** Democratic Republic of the Congo */
  Cod: 'COD',
  /** Congo */
  Cog: 'COG',
  /** Cook Islands */
  Cok: 'COK',
  /** Colombia */
  Col: 'COL',
  /** Comoros */
  Com: 'COM',
  /** Cabo Verde */
  Cpv: 'CPV',
  /** Costa Rica */
  Cri: 'CRI',
  /** Cuba (Office of foreign assets restricted) */
  Cub: 'CUB',
  /** Curaçao */
  Cuw: 'CUW',
  /** Christmas Island */
  Cxr: 'CXR',
  /** Cayman Islands */
  Cym: 'CYM',
  /** Cyprus */
  Cyp: 'CYP',
  /** Czech Republic */
  Cze: 'CZE',
  /** Germany */
  Deu: 'DEU',
  /** Djibouti */
  Dji: 'DJI',
  /** Dominica */
  Dma: 'DMA',
  /** Denmark */
  Dnk: 'DNK',
  /** Dominican Republic */
  Dom: 'DOM',
  /** Algeria */
  Dza: 'DZA',
  /** Ecuador */
  Ecu: 'ECU',
  /** Egypt */
  Egy: 'EGY',
  /** Eritrea */
  Eri: 'ERI',
  /** Western Sahara */
  Esh: 'ESH',
  /** Spain */
  Esp: 'ESP',
  /** Estonia */
  Est: 'EST',
  /** Ethiopia */
  Eth: 'ETH',
  /** Finland */
  Fin: 'FIN',
  /** Fiji */
  Fji: 'FJI',
  /** Falkland Islands (Malvinas) */
  Flk: 'FLK',
  /** France */
  Fra: 'FRA',
  /** Faroe Islands */
  Fro: 'FRO',
  /** Micronesia (Federated States of) */
  Fsm: 'FSM',
  /** Gabon */
  Gab: 'GAB',
  /** United Kingdom */
  Gbr: 'GBR',
  /** Georgia */
  Geo: 'GEO',
  /** Guernsey */
  Ggy: 'GGY',
  /** Ghana */
  Gha: 'GHA',
  /** Gibraltar */
  Gib: 'GIB',
  /** Guinea */
  Gin: 'GIN',
  /** Guadeloupe */
  Glp: 'GLP',
  /** Gambia */
  Gmb: 'GMB',
  /** Guinea-Bissau */
  Gnb: 'GNB',
  /** Equatorial Guinea */
  Gnq: 'GNQ',
  /** Greece */
  Grc: 'GRC',
  /** Grenada */
  Grd: 'GRD',
  /** Greenland */
  Grl: 'GRL',
  /** Guatemala */
  Gtm: 'GTM',
  /** French Guiana */
  Guf: 'GUF',
  /** Guam */
  Gum: 'GUM',
  /** Guyana */
  Guy: 'GUY',
  /** Hong Kong */
  Hkg: 'HKG',
  /** Heard and McDonald Islands */
  Hmd: 'HMD',
  /** Honduras */
  Hnd: 'HND',
  /** Croatia */
  Hrv: 'HRV',
  /** Haiti */
  Hti: 'HTI',
  /** Hungary */
  Hun: 'HUN',
  /** Indonesia */
  Idn: 'IDN',
  /** Isle of Man */
  Imn: 'IMN',
  /** India */
  Ind: 'IND',
  /** British Indian Ocean Territory */
  Iot: 'IOT',
  /** Ireland */
  Irl: 'IRL',
  /** Iran (Office of foreign assets restricted) */
  Irn: 'IRN',
  /** Iraq */
  Irq: 'IRQ',
  /** Iceland */
  Isl: 'ISL',
  /** Israel */
  Isr: 'ISR',
  /** Italy */
  Ita: 'ITA',
  /** Jamaica */
  Jam: 'JAM',
  /** Jersey */
  Jey: 'JEY',
  /** Jordan */
  Jor: 'JOR',
  /** Japan */
  Jpn: 'JPN',
  /** Kazakhstan */
  Kaz: 'KAZ',
  /** Kenya */
  Ken: 'KEN',
  /** Kyrgyzstan */
  Kgz: 'KGZ',
  /** Cambodia */
  Khm: 'KHM',
  /** Kiribati */
  Kir: 'KIR',
  /** Saint Kitts and Nevis */
  Kna: 'KNA',
  /** Korea, Republic of */
  Kor: 'KOR',
  /** Kuwait */
  Kwt: 'KWT',
  /** Laos */
  Lao: 'LAO',
  /** Lebanon */
  Lbn: 'LBN',
  /** Liberia */
  Lbr: 'LBR',
  /** Libya */
  Lby: 'LBY',
  /** Saint Lucia */
  Lca: 'LCA',
  /** Liechtenstein */
  Lie: 'LIE',
  /** Sri Lanka */
  Lka: 'LKA',
  /** Lesotho */
  Lso: 'LSO',
  /** Lithuania */
  Ltu: 'LTU',
  /** Luxembourg */
  Lux: 'LUX',
  /** Latvia */
  Lva: 'LVA',
  /** Macau */
  Mac: 'MAC',
  /** Saint Martin (French part) */
  Maf: 'MAF',
  /** Morocco */
  Mar: 'MAR',
  /** Monaco */
  Mco: 'MCO',
  /** Moldova */
  Mda: 'MDA',
  /** Madagascar */
  Mdg: 'MDG',
  /** Maldives */
  Mdv: 'MDV',
  /** Mexico */
  Mex: 'MEX',
  /** Marshall Islands */
  Mhl: 'MHL',
  /** North Macedonia */
  Mkd: 'MKD',
  /** Mali */
  Mli: 'MLI',
  /** Malta */
  Mlt: 'MLT',
  /** Myanmar */
  Mmr: 'MMR',
  /** Montenegro */
  Mne: 'MNE',
  /** Mongolia */
  Mng: 'MNG',
  /** Northern Mariana Islands */
  Mnp: 'MNP',
  /** Mozambique */
  Moz: 'MOZ',
  /** Mauritania */
  Mrt: 'MRT',
  /** Montserrat */
  Msr: 'MSR',
  /** Martinique */
  Mtq: 'MTQ',
  /** Mauritius */
  Mus: 'MUS',
  /** Malawi */
  Mwi: 'MWI',
  /** Malaysia */
  Mys: 'MYS',
  /** Mayotte */
  Myt: 'MYT',
  /** Namibia */
  Nam: 'NAM',
  /** New Caledonia */
  Ncl: 'NCL',
  /** Niger */
  Ner: 'NER',
  /** Norfolk Island */
  Nfk: 'NFK',
  /** Nigeria */
  Nga: 'NGA',
  /** Nicaragua */
  Nic: 'NIC',
  /** Niue */
  Niu: 'NIU',
  /** Netherlands */
  Nld: 'NLD',
  /** Norway */
  Nor: 'NOR',
  /** Nepal */
  Npl: 'NPL',
  /** Nauru */
  Nru: 'NRU',
  /** New Zealand */
  Nzl: 'NZL',
  /** Oman */
  Omn: 'OMN',
  /** Pakistan */
  Pak: 'PAK',
  /** Panama */
  Pan: 'PAN',
  /** Pitcairn */
  Pcn: 'PCN',
  /** Peru */
  Per: 'PER',
  /** Philippines */
  Phl: 'PHL',
  /** Palau */
  Plw: 'PLW',
  /** Papua New Guinea */
  Png: 'PNG',
  /** Poland */
  Pol: 'POL',
  /** Puerto Rico */
  Pri: 'PRI',
  /** North Korea (Office of foreign assets restricted) */
  Prk: 'PRK',
  /** Portugal */
  Prt: 'PRT',
  /** Paraguay */
  Pry: 'PRY',
  /** Palestine */
  Pse: 'PSE',
  /** French Polynesia */
  Pyf: 'PYF',
  /** Qatar */
  Qat: 'QAT',
  /** Réunion */
  Reu: 'REU',
  /** Romania */
  Rou: 'ROU',
  /** Russian Federation */
  Rus: 'RUS',
  /** Rwanda */
  Rwa: 'RWA',
  /** Saudi Arabia */
  Sau: 'SAU',
  /** Sudan */
  Sdn: 'SDN',
  /** Senegal */
  Sen: 'SEN',
  /** Singapore */
  Sgp: 'SGP',
  /** South Georgia and the South Sandwich Islands */
  Sgs: 'SGS',
  /** Saint Helena, Ascension and Tristan da Cunha */
  Shn: 'SHN',
  /** Svalbard and Jan Mayen */
  Sjm: 'SJM',
  /** Solomon Islands */
  Slb: 'SLB',
  /** Sierra Leone */
  Sle: 'SLE',
  /** El Salvador */
  Slv: 'SLV',
  /** San Marino */
  Smr: 'SMR',
  /** Somalia */
  Som: 'SOM',
  /** Saint Pierre and Miquelon */
  Spm: 'SPM',
  /** Serbia */
  Srb: 'SRB',
  /** South Sudan */
  Ssd: 'SSD',
  /** Sao Tome and Principe */
  Stp: 'STP',
  /** Suriname */
  Sur: 'SUR',
  /** Slovakia */
  Svk: 'SVK',
  /** Slovenia */
  Svn: 'SVN',
  /** Sweden */
  Swe: 'SWE',
  /** Eswatini */
  Swz: 'SWZ',
  /** Sint Maarten (Dutch part) */
  Sxm: 'SXM',
  /** Seychelles */
  Syc: 'SYC',
  /** Syria (Office of foreign assets restricted) */
  Syr: 'SYR',
  /** Turks and Caicos Islands */
  Tca: 'TCA',
  /** Chad */
  Tcd: 'TCD',
  /** Togo */
  Tgo: 'TGO',
  /** Thailand */
  Tha: 'THA',
  /** Tajikistan */
  Tjk: 'TJK',
  /** Tokelau */
  Tkl: 'TKL',
  /** Turkmenistan */
  Tkm: 'TKM',
  /** Timor-Leste */
  Tls: 'TLS',
  /** Tonga */
  Ton: 'TON',
  /** Trinidad and Tobago */
  Tto: 'TTO',
  /** Tunisia */
  Tun: 'TUN',
  /** Turkey */
  Tur: 'TUR',
  /** Tuvalu */
  Tuv: 'TUV',
  /** Taiwan */
  Twn: 'TWN',
  /** Tanzania */
  Tza: 'TZA',
  /** Uganda */
  Uga: 'UGA',
  /** Ukraine */
  Ukr: 'UKR',
  /** United States Minor Outlying Islands */
  Umi: 'UMI',
  /** Uruguay */
  Ury: 'URY',
  /** United States of America */
  Usa: 'USA',
  /** Uzbekistan */
  Uzb: 'UZB',
  /** Vatican City */
  Vat: 'VAT',
  /** Saint Vincent and the Grenadines */
  Vct: 'VCT',
  /** Venezuela */
  Ven: 'VEN',
  /** British Virgin Islands */
  Vgb: 'VGB',
  /** United States Virgin Islands */
  Vir: 'VIR',
  /** Vietnam */
  Vnm: 'VNM',
  /** Vanuatu */
  Vut: 'VUT',
  /** Wallis and Fortuna Islands */
  Wlf: 'WLF',
  /** Samoa */
  Wsm: 'WSM',
  /** Yemen */
  Yem: 'YEM',
  /** South Africa */
  Zaf: 'ZAF',
  /** Zambia */
  Zmb: 'ZMB',
  /** Zimbabwe */
  Zwe: 'ZWE',
} as const;

export type CountryCode = (typeof CountryCode)[keyof typeof CountryCode];
export interface CreateApplicationInput {
  applicationInput: AcceptorApplicationCreateInput;
}

export interface CreateApplicationPayload {
  __typename?: 'CreateApplicationPayload';
  acceptorApplication?: Maybe<AcceptorApplication>;
  errors?: Maybe<Array<ErrorBase>>;
}

export type CreateAsyncReportError = FailedToCreateAsyncReportError | JwtTokenMissingError;

export interface CreateAsyncReportInput {
  authorizationSummariesInput?: InputMaybe<AuthorizationSummariesAsyncInput>;
  feeSummariesInput?: InputMaybe<FeeSummariesAsyncInput>;
  feesInput?: InputMaybe<FeeAsyncInput>;
  fundingDisputeEventsInput?: InputMaybe<FundingDisputeEventsAsyncInput>;
  fundingSummariesInput?: InputMaybe<FundingSummariesAsyncInput>;
  fundingTransactionsInput?: InputMaybe<FundingTransactionsAsyncInput>;
  paymentTransactionsInput?: InputMaybe<PaymentTransactionsAsyncInput>;
  transactionSummariesInput?: InputMaybe<TransactionSummariesAsyncInput>;
}

export interface CreateAsyncReportPayload {
  __typename?: 'CreateAsyncReportPayload';
  asyncReportResponse?: Maybe<AsyncReportResponse>;
  errors?: Maybe<Array<CreateAsyncReportError>>;
}

export type CreateUserError = AuthenticationError | ForbiddenError;

export interface CreateUserInput {
  email: Scalars['String']['input'];
  jobTitle?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
  permissionIds: Array<Scalars['UUID']['input']>;
}

export interface CreateUserPayload {
  __typename?: 'CreateUserPayload';
  errors?: Maybe<Array<CreateUserError>>;
  user?: Maybe<User>;
}

/** Details of the customer associated with the order. This may be different from the individuals associated with the billing and/or shipping. */
export interface CustomerDetails {
  __typename?: 'CustomerDetails';
  /** The company, if applicable, associated with the order. */
  company?: Maybe<Scalars['Max50Text']['output']>;
  /** The email associated with the order. */
  email?: Maybe<Scalars['Email']['output']>;
  /** The first name of the individual associated with the order. Note, this may be different from the name associated with the shipping and billing addresses. */
  firstName?: Maybe<Scalars['Max50Text']['output']>;
  /** The last name, surname, or family name of the individual associated with the order. This may be different from the name associated with the shipping and billing addresses. */
  lastName?: Maybe<Scalars['Max50Text']['output']>;
  /** The mobile number associated with the order, if different from phone number. */
  mobileNumber?: Maybe<Scalars['Max50Text']['output']>;
  /** The phone number associated with the order. */
  phoneNumber?: Maybe<Scalars['Max50Text']['output']>;
  /** A unique identifier created by the acceptor or organization and assigned to the customer who placed the order. */
  reference?: Maybe<Scalars['String']['output']>;
}

/** Details of the customer associated with the order. This may be different from the individuals associated with the billing and/or shipping. */
export interface CustomerDetailsInput {
  /** The company, if applicable, associated with the order. */
  company?: InputMaybe<Scalars['Max50Text']['input']>;
  /** The email associated with the order. */
  email?: InputMaybe<Scalars['Email']['input']>;
  /** The first name of the individual associated with the order. Note, this may be different from the name associated with the shipping and billing addresses. */
  firstName?: InputMaybe<Scalars['Max50Text']['input']>;
  /** The last name, surname, or family name of the individual associated with the order. This may be different from the name associated with the shipping and billing addresses. */
  lastName?: InputMaybe<Scalars['Max50Text']['input']>;
  /** The mobile number associated with the order, if different from phone number. */
  mobileNumber?: InputMaybe<Scalars['Max50Text']['input']>;
  /** The phone number associated with the order. */
  phoneNumber?: InputMaybe<Scalars['Max50Text']['input']>;
  /** A unique identifier created by the acceptor or organization and assigned to the customer who placed the order. */
  reference?: InputMaybe<Scalars['String']['input']>;
}

export interface DateFilterInput {
  eq?: InputMaybe<Scalars['Date']['input']>;
  gt?: InputMaybe<Scalars['Date']['input']>;
  gte?: InputMaybe<Scalars['Date']['input']>;
  lt?: InputMaybe<Scalars['Date']['input']>;
  lte?: InputMaybe<Scalars['Date']['input']>;
  neq?: InputMaybe<Scalars['Date']['input']>;
  ngt?: InputMaybe<Scalars['Date']['input']>;
  ngte?: InputMaybe<Scalars['Date']['input']>;
  nlt?: InputMaybe<Scalars['Date']['input']>;
  nlte?: InputMaybe<Scalars['Date']['input']>;
}

export interface DateRangeFilterInput {
  gte: Scalars['Date']['input'];
  lte: Scalars['Date']['input'];
}

export type DeactivateUserError = AuthenticationError | ForbiddenError;

export interface DeactivateUserInput {
  userId: Scalars['UUID']['input'];
}

export interface DeactivateUserPayload {
  __typename?: 'DeactivateUserPayload';
  errors?: Maybe<Array<DeactivateUserError>>;
  user?: Maybe<User>;
}

export interface DecisionComponent {
  __typename?: 'DecisionComponent';
  attachments: Array<Attachment>;
  comments: Array<Comment>;
  hasAttachments: Scalars['Boolean']['output'];
  hasComments: Scalars['Boolean']['output'];
  id: Scalars['UUID']['output'];
  items: Array<DecisionComponentItem>;
  lastUpdatedBy: Actor;
  results: Array<DecisionComponentResult>;
  schema?: Maybe<UnderwritingDecisionComponentSchema>;
  status?: Maybe<DecisionComponentStatus>;
  /** The last date and time this was updated in UTC. */
  updatedDateTime: Scalars['DateTime']['output'];
}

export interface DecisionComponentField {
  __typename?: 'DecisionComponentField';
  displayOrder: Scalars['Int']['output'];
  fieldValue?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  lastUpdatedBy: Actor;
  schema?: Maybe<UnderwritingDecisionComponentFieldSchema>;
  status?: Maybe<DecisionComponentFieldStatus>;
  /** The last date and time this was updated in UTC. */
  updatedDateTime: Scalars['DateTime']['output'];
}

export const DecisionComponentFieldStatus = {
  Match: 'MATCH',
  NeedsReview: 'NEEDS_REVIEW',
  NotMatched: 'NOT_MATCHED',
} as const;

export type DecisionComponentFieldStatus =
  (typeof DecisionComponentFieldStatus)[keyof typeof DecisionComponentFieldStatus];
export const DecisionComponentFieldType = {
  Checkbox: 'CHECKBOX',
  DatePicker: 'DATE_PICKER',
  Select: 'SELECT',
  SelectMultiple: 'SELECT_MULTIPLE',
  Textarea: 'TEXTAREA',
  TextField: 'TEXT_FIELD',
  TextFieldMasked: 'TEXT_FIELD_MASKED',
} as const;

export type DecisionComponentFieldType =
  (typeof DecisionComponentFieldType)[keyof typeof DecisionComponentFieldType];
export interface DecisionComponentItem {
  __typename?: 'DecisionComponentItem';
  descriptiveText: Scalars['String']['output'];
  displayOrder: Scalars['Int']['output'];
  fields: Array<DecisionComponentField>;
  id: Scalars['UUID']['output'];
  label: Scalars['String']['output'];
  status?: Maybe<DecisionComponentFieldStatus>;
}

export interface DecisionComponentResult {
  __typename?: 'DecisionComponentResult';
  displayOrder: Scalars['Int']['output'];
  /** The application data being verified by this result. */
  label?: Maybe<Scalars['String']['output']>;
  /** A result of one of the verifications performed by this decision component. */
  status?: Maybe<DecisionComponentResultStatus>;
  /** A detailed description of actions to be taken pertaining to a decision component. */
  statusGuidance?: Maybe<Scalars['String']['output']>;
  /** A short description of the result status as it pertains to a decision component. */
  statusMessage?: Maybe<Scalars['String']['output']>;
}

export const DecisionComponentResultStatus = {
  Deliverable: 'DELIVERABLE',
  Found: 'FOUND',
  NotFound: 'NOT_FOUND',
  NotMatched: 'NOT_MATCHED',
  Residential: 'RESIDENTIAL',
  SimilarMatch: 'SIMILAR_MATCH',
  Undeliverable: 'UNDELIVERABLE',
  Verified: 'VERIFIED',
} as const;

export type DecisionComponentResultStatus =
  (typeof DecisionComponentResultStatus)[keyof typeof DecisionComponentResultStatus];
export const DecisionComponentStatus = {
  Accepted: 'ACCEPTED',
  ActionRequired: 'ACTION_REQUIRED',
} as const;

export type DecisionComponentStatus =
  (typeof DecisionComponentStatus)[keyof typeof DecisionComponentStatus];
/** Type of the decline. */
export const DeclineType = {
  /** The network has declined the transaction. No further action. */
  HardDecline: 'HARD_DECLINE',
  /** The network has referred a specific action. */
  Referral: 'REFERRAL',
  /** Correct decline reason and retry. */
  SoftDecline: 'SOFT_DECLINE',
} as const;

export type DeclineType = (typeof DeclineType)[keyof typeof DeclineType];
export interface DeclinedAuthorization extends Authorization, PaymentTransaction {
  __typename?: 'DeclinedAuthorization';
  acceptor: Acceptor;
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff. */
  activityDate?: Maybe<Scalars['Date']['output']>;
  /** The result of the address verification service (AVS), which checks if the cardholder address submitted with the transaction matches what is on record with the issuer. */
  addressVerification?: Maybe<AvsResponse>;
  /** Components of the requested amount that may or may not have been provided by the presenter on the payment transaction request. */
  amountDetails?: Maybe<AmountDetails>;
  /** Specifies that the approved authorization will be automatically captured. */
  automaticCapture?: Maybe<Scalars['Boolean']['output']>;
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /** The currency specified on the transaction request, in ISO 4217 alpha currency code format. */
  currency?: Maybe<Scalars['String']['output']>;
  /** Specifies the type of decline, e.g. Soft decline, Hard decline, Error, or Referral. */
  declineType: DeclineType;
  /** Aggregate information for assessed fees */
  fees?: Maybe<FeeDetails>;
  /** A unique identifier assigned by Tesouro for every transaction request received. */
  id: Scalars['UUID']['output'];
  /** Line items associated with the payment transaction. */
  lineItems?: Maybe<Array<LineItem>>;
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  merchantCategory?: Maybe<Scalars['String']['output']>;
  /** The result of the name verification service, which checks if the cardholder name submitted with the transaction matches what is on record with the issuer. */
  nameVerification?: Maybe<NameVerificationResponseCode>;
  /** A response code provided by the card network identifying the specific approval or decline reason. */
  networkResponseCode?: Maybe<Scalars['String']['output']>;
  /** A unique value created by the card network and assigned to the transaction and returned to Tesouro in the authorization response. The card network uses this value to maintain an audit trail throughout the life cycle of the transaction and all related transactions, such as reversals, adjustments, confirmations and charge-backs. */
  networkTransactionId?: Maybe<Scalars['String']['output']>;
  /** Information concerning the order placed by the customer. */
  order: Order;
  organization: Organization;
  /** The card-present or card-not-present channel from which the customer makes a payment, e.g., In-store using a physical card terminal, online, or over the phone or through mail order. */
  paymentChannel: PaymentChannel;
  /** The means by which the payment details are captured, e.g., Card swipe, contactless "tap", chip entry "dip", keyed, etc. */
  paymentEntryMode: PaymentEntryMode;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Refers to the various options available for customers to make payments when purchasing a product or service. */
  paymentMethod: PaymentMethod;
  /** The payment network that the transaction was sent across, which may be unaffiliated with the card brand. */
  processingNetwork: Network;
  /** Advice provided by Tesouro on what can be done to remedy, and/or prevent this decline response from occurring in the future. */
  processorAdvice?: Maybe<Scalars['String']['output']>;
  /** A response code provided by Tesouro identifying the specific approval or decline reason. */
  processorResponseCode: ProcessorResponseCode;
  /** A human readable description of the authorization response code. e.g., Insufficient funds. */
  processorResponseMessage: Scalars['String']['output'];
  /** A unique transaction identifier created by the entity holding the direct relationship with the Acceptor. Tesouro uses this identifier to manage idempotency. */
  reference?: Maybe<Scalars['String']['output']>;
  /** The transaction amount submitted with the authorization request. */
  requestedAmount: Scalars['Decimal']['output'];
  /** The result of the authorization request, e.g., Approved or Declined. */
  responseType?: Maybe<ResponseType>;
  /** The result of the card security code verification service, which checks if the CVV2/CVC2/CID submitted with the transaction matches what is on record with the issuer. */
  securityCodeVerification?: Maybe<SecurityCodeResponse>;
  /** The tax identification number (TIN) is a unique identifier created by the national government and associated with the acceptor at the time the transaction was submitted */
  taxIdentificationNumber?: Maybe<Scalars['String']['output']>;
  /** The various tax amounts collected on the payment transaction. */
  taxes?: Maybe<Taxes>;
  /** The date and time that Tesouro received the transaction, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime: Scalars['DateTime']['output'];
  /** The type of payment transaction, e.g., Authorization, Capture, Sale, Refund, Reversal, etc. */
  transactionType: PaymentTransactionType;
}

export interface DeclinedCapture extends Capture, PaymentTransaction {
  __typename?: 'DeclinedCapture';
  acceptor: Acceptor;
  /** The Acquirer Reference Number (ARN) is a unique 23 digit number created by Tesouro and assigned to a transaction to allow the acquiring and issuing banks to trace the transaction until it is funded to the bank. */
  acquirerReferenceNumber?: Maybe<Scalars['String']['output']>;
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff. */
  activityDate?: Maybe<Scalars['Date']['output']>;
  /** The result of the address verification service (AVS), which checks if the cardholder address submitted with the transaction matches what is on record with the issuer. */
  addressVerification?: Maybe<AvsResponse>;
  /** Components of the requested amount that may or may not have been provided by the presenter on the payment transaction request. */
  amountDetails?: Maybe<AmountDetails>;
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /**
   * The amount of convenience fees associated with this transaction
   * @deprecated Use amountDetails.convenienceFee instead.
   */
  convenienceFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The currency specified on the transaction request, in ISO 4217 alpha currency code format. */
  currency?: Maybe<Scalars['String']['output']>;
  /** Specifies the type of decline, e.g. Soft decline, Hard decline, Error, or Referral. */
  declineType: DeclineType;
  /**
   * The total amount of fees applicable to this transaction.
   * @deprecated Use fees.summary.totalAmount instead.
   */
  feeTotalAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Aggregate information for assessed fees */
  fees?: Maybe<FeeDetails>;
  /** The currency of the funded transaction, formatted in ISO 4217 alphabetic code. */
  fundingCurrency?: Maybe<Scalars['String']['output']>;
  /** The total amount of the transaction converted to its funding currency, before any fees are deducted. */
  fundingGrossAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The amount to be funded after deducting the applicable fees. Presented in the funding currency. */
  fundingNetAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Details on the funds transfer containing this transaction's funding amount. */
  fundsTransfer?: Maybe<FundsTransfer>;
  /** A unique identifier assigned by Tesouro for every transaction request received. */
  id: Scalars['UUID']['output'];
  /**
   * The amount of interchange fees applicable to the transaction. Interchange fees are set by the card networks, and paid to the bank that issued the card used for the transaction.
   * @deprecated Use fees.summary.interchangeAmount instead.
   */
  interchangeFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Indicates if the funding amount has been released. Defined as having a funds transfer ID and funds transfer release date. */
  isFunded: Scalars['Boolean']['output'];
  /** Indicates if the partner fee was adjusted at the transaction level. */
  isPartnerFeeAdjusted: Scalars['Boolean']['output'];
  /** Line items associated with the payment transaction. */
  lineItems?: Maybe<Array<LineItem>>;
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  merchantCategory?: Maybe<Scalars['String']['output']>;
  /** The result of the name verification service, which checks if the cardholder name submitted with the transaction matches what is on record with the issuer. */
  nameVerification?: Maybe<NameVerificationResponseCode>;
  /**
   * The amount of network fees applicable to this transaction. Network fees are set by card networks and are paid to the card network.
   * @deprecated Use fees.summary.networkAmount instead.
   */
  networkFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** A response code provided by the card network identifying the specific approval or decline reason. */
  networkResponseCode?: Maybe<Scalars['String']['output']>;
  /** A unique value created by the card network and assigned to the transaction and returned to Tesouro in the authorization response. The card network uses this value to maintain an audit trail throughout the life cycle of the transaction and all related transactions, such as reversals, adjustments, confirmations and charge-backs. */
  networkTransactionId?: Maybe<Scalars['String']['output']>;
  /** Information concerning the order placed by the customer. */
  order: Order;
  organization: Organization;
  /**
   * The amount of partner fees applicable to this transaction. Partner fees are set by and paid to the partner.
   * @deprecated Use fees.summary.partnerAmount instead.
   */
  partnerFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The card-present or card-not-present channel from which the customer makes a payment, e.g., In-store using a physical card terminal, online, or over the phone or through mail order. */
  paymentChannel: PaymentChannel;
  /** The means by which the payment details are captured, e.g., Card swipe, contactless "tap", chip entry "dip", keyed, etc. */
  paymentEntryMode: PaymentEntryMode;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Refers to the various options available for customers to make payments when purchasing a product or service. */
  paymentMethod: PaymentMethod;
  /** The payment network that the transaction was sent across, which may be unaffiliated with the card brand. */
  processingNetwork: Network;
  /** Advice provided by Tesouro on what can be done to remedy, and/or prevent this decline response from occurring in the future. */
  processorAdvice?: Maybe<Scalars['String']['output']>;
  /**
   * The amount of processor fees applicable to this transaction. Processor fees are set by and paid to Tesouro.
   * @deprecated Use fees.summary.processorAmount instead.
   */
  processorFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** A response code provided by Tesouro identifying the specific approval or decline reason. */
  processorResponseCode: ProcessorResponseCode;
  /** A human readable description of the authorization response code. e.g., Insufficient funds. */
  processorResponseMessage: Scalars['String']['output'];
  /** A unique transaction identifier created by the entity holding the direct relationship with the Acceptor. Tesouro uses this identifier to manage idempotency. */
  reference?: Maybe<Scalars['String']['output']>;
  /** The transaction amount submitted with the authorization request. */
  requestedAmount: Scalars['Decimal']['output'];
  /** The result of the authorization request, e.g., Approved or Declined. */
  responseType?: Maybe<ResponseType>;
  /** The result of the card security code verification service, which checks if the CVV2/CVC2/CID submitted with the transaction matches what is on record with the issuer. */
  securityCodeVerification?: Maybe<SecurityCodeResponse>;
  /**
   * The amount of service fees associated with this transaction
   * @deprecated Use amountDetails.serviceFee instead.
   */
  serviceFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /**
   * The amount of surcharge associated with this transaction
   * @deprecated Use amountDetails.surcharge instead.
   */
  surchargeAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The tax identification number (TIN) is a unique identifier created by the national government and associated with the acceptor at the time the transaction was submitted */
  taxIdentificationNumber?: Maybe<Scalars['String']['output']>;
  /** The various tax amounts collected on the payment transaction. */
  taxes?: Maybe<Taxes>;
  /** The date and time that Tesouro received the transaction, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime: Scalars['DateTime']['output'];
  /** The type of payment transaction, e.g., Authorization, Capture, Sale, Refund, Reversal, etc. */
  transactionType: PaymentTransactionType;
}

export interface DeclinedCardVerification extends CardVerification, PaymentTransaction {
  __typename?: 'DeclinedCardVerification';
  acceptor: Acceptor;
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff. */
  activityDate?: Maybe<Scalars['Date']['output']>;
  /** The result of the address verification service (AVS), which checks if the cardholder address submitted with the transaction matches what is on record with the issuer. */
  addressVerification?: Maybe<AvsResponse>;
  /** Components of the requested amount that may or may not have been provided by the presenter on the payment transaction request. */
  amountDetails?: Maybe<AmountDetails>;
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /** Specifies the type of decline, e.g. Soft decline, Hard decline, Error, or Referral. */
  declineType: DeclineType;
  /** Aggregate information for assessed fees */
  fees?: Maybe<FeeDetails>;
  /** A unique identifier assigned by Tesouro for every transaction request received. */
  id: Scalars['UUID']['output'];
  /** Line items associated with the payment transaction. */
  lineItems?: Maybe<Array<LineItem>>;
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  merchantCategory?: Maybe<Scalars['String']['output']>;
  /** The result of the name verification service, which checks if the cardholder name submitted with the transaction matches what is on record with the issuer. */
  nameVerification?: Maybe<NameVerificationResponseCode>;
  /** A response code provided by the card network identifying the specific approval or decline reason. */
  networkResponseCode?: Maybe<Scalars['String']['output']>;
  /** A unique value created by the card network and assigned to the transaction and returned to Tesouro in the authorization response. The card network uses this value to maintain an audit trail throughout the life cycle of the transaction and all related transactions, such as reversals, adjustments, confirmations and charge-backs. */
  networkTransactionId?: Maybe<Scalars['String']['output']>;
  organization: Organization;
  /** The card-present or card-not-present channel from which the customer makes a payment, e.g., In-store using a physical card terminal, online, or over the phone or through mail order. */
  paymentChannel: PaymentChannel;
  /** The means by which the payment details are captured, e.g., Card swipe, contactless "tap", chip entry "dip", keyed, etc. */
  paymentEntryMode: PaymentEntryMode;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Refers to the various options available for customers to make payments when purchasing a product or service. */
  paymentMethod: PaymentMethod;
  /** The payment network that the transaction was sent across, which may be unaffiliated with the card brand. */
  processingNetwork: Network;
  /** Advice provided by Tesouro on what can be done to remedy, and/or prevent this decline response from occurring in the future. */
  processorAdvice?: Maybe<Scalars['String']['output']>;
  /** A response code provided by Tesouro identifying the specific approval or decline reason. */
  processorResponseCode: ProcessorResponseCode;
  /** A human readable description of the authorization response code. e.g., Insufficient funds. */
  processorResponseMessage: Scalars['String']['output'];
  /** A unique transaction identifier created by the entity holding the direct relationship with the Acceptor. Tesouro uses this identifier to manage idempotency. */
  reference?: Maybe<Scalars['String']['output']>;
  /** The result of the authorization request, e.g., Approved or Declined. */
  responseType?: Maybe<ResponseType>;
  /** The result of the card security code verification service, which checks if the CVV2/CVC2/CID submitted with the transaction matches what is on record with the issuer. */
  securityCodeVerification?: Maybe<SecurityCodeResponse>;
  /** The tax identification number (TIN) is a unique identifier created by the national government and associated with the acceptor at the time the transaction was submitted */
  taxIdentificationNumber?: Maybe<Scalars['String']['output']>;
  /** The various tax amounts collected on the payment transaction. */
  taxes?: Maybe<Taxes>;
  /** The date and time that Tesouro received the transaction, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime: Scalars['DateTime']['output'];
  /** The type of payment transaction, e.g., Authorization, Capture, Sale, Refund, Reversal, etc. */
  transactionType: PaymentTransactionType;
}

export interface DeclinedIncrementalAuthorization
  extends IncrementalAuthorization,
    PaymentTransaction {
  __typename?: 'DeclinedIncrementalAuthorization';
  acceptor: Acceptor;
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff. */
  activityDate?: Maybe<Scalars['Date']['output']>;
  /** The result of the address verification service (AVS), which checks if the cardholder address submitted with the transaction matches what is on record with the issuer. */
  addressVerification?: Maybe<AvsResponse>;
  /** Components of the requested amount that may or may not have been provided by the presenter on the payment transaction request. */
  amountDetails?: Maybe<AmountDetails>;
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /** The currency specified on the transaction request, in ISO 4217 alpha currency code format. */
  currency?: Maybe<Scalars['String']['output']>;
  /** Specifies the type of decline, e.g. Soft decline, Hard decline, Error, or Referral. */
  declineType: DeclineType;
  /** Aggregate information for assessed fees */
  fees?: Maybe<FeeDetails>;
  /** A unique identifier assigned by Tesouro for every transaction request received. */
  id: Scalars['UUID']['output'];
  /** Line items associated with the payment transaction. */
  lineItems?: Maybe<Array<LineItem>>;
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  merchantCategory?: Maybe<Scalars['String']['output']>;
  /** The result of the name verification service, which checks if the cardholder name submitted with the transaction matches what is on record with the issuer. */
  nameVerification?: Maybe<NameVerificationResponseCode>;
  /** A response code provided by the card network identifying the specific approval or decline reason. */
  networkResponseCode?: Maybe<Scalars['String']['output']>;
  /** A unique value created by the card network and assigned to the transaction and returned to Tesouro in the authorization response. The card network uses this value to maintain an audit trail throughout the life cycle of the transaction and all related transactions, such as reversals, adjustments, confirmations and charge-backs. */
  networkTransactionId?: Maybe<Scalars['String']['output']>;
  /** Information concerning the order placed by the customer. */
  order: Order;
  organization: Organization;
  /** The card-present or card-not-present channel from which the customer makes a payment, e.g., In-store using a physical card terminal, online, or over the phone or through mail order. */
  paymentChannel: PaymentChannel;
  /** The means by which the payment details are captured, e.g., Card swipe, contactless "tap", chip entry "dip", keyed, etc. */
  paymentEntryMode: PaymentEntryMode;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Refers to the various options available for customers to make payments when purchasing a product or service. */
  paymentMethod: PaymentMethod;
  /** The payment network that the transaction was sent across, which may be unaffiliated with the card brand. */
  processingNetwork: Network;
  /** Advice provided by Tesouro on what can be done to remedy, and/or prevent this decline response from occurring in the future. */
  processorAdvice?: Maybe<Scalars['String']['output']>;
  /** A response code provided by Tesouro identifying the specific approval or decline reason. */
  processorResponseCode: ProcessorResponseCode;
  /** A human readable description of the authorization response code. e.g., Insufficient funds. */
  processorResponseMessage: Scalars['String']['output'];
  /** A unique transaction identifier created by the entity holding the direct relationship with the Acceptor. Tesouro uses this identifier to manage idempotency. */
  reference?: Maybe<Scalars['String']['output']>;
  /** The transaction amount submitted with the authorization request. */
  requestedAmount: Scalars['Decimal']['output'];
  /** The result of the authorization request, e.g., Approved or Declined. */
  responseType?: Maybe<ResponseType>;
  /** The result of the card security code verification service, which checks if the CVV2/CVC2/CID submitted with the transaction matches what is on record with the issuer. */
  securityCodeVerification?: Maybe<SecurityCodeResponse>;
  /** The tax identification number (TIN) is a unique identifier created by the national government and associated with the acceptor at the time the transaction was submitted */
  taxIdentificationNumber?: Maybe<Scalars['String']['output']>;
  /** The various tax amounts collected on the payment transaction. */
  taxes?: Maybe<Taxes>;
  /** The date and time that Tesouro received the transaction, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime: Scalars['DateTime']['output'];
  /** The type of payment transaction, e.g., Authorization, Capture, Sale, Refund, Reversal, etc. */
  transactionType: PaymentTransactionType;
}

export interface DeclinedRefund extends PaymentTransaction, Refund {
  __typename?: 'DeclinedRefund';
  acceptor: Acceptor;
  /** The Acquirer Reference Number (ARN) is a unique 23 digit number created by Tesouro and assigned to a transaction to allow the acquiring and issuing banks to trace the transaction until it is funded to the bank. */
  acquirerReferenceNumber?: Maybe<Scalars['String']['output']>;
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff. */
  activityDate?: Maybe<Scalars['Date']['output']>;
  /** Components of the requested amount that may or may not have been provided by the presenter on the payment transaction request. */
  amountDetails?: Maybe<AmountDetails>;
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /**
   * The amount of convenience fees associated with this transaction
   * @deprecated Use amountDetails.convenienceFee instead.
   */
  convenienceFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The currency specified on the transaction request, in ISO 4217 alpha currency code format. */
  currency?: Maybe<Scalars['String']['output']>;
  /** Specifies the type of decline, e.g. Soft decline, Hard decline, Error, or Referral. */
  declineType: DeclineType;
  /**
   * The total amount of fees applicable to this transaction.
   * @deprecated Use fees.summary.totalAmount instead.
   */
  feeTotalAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Aggregate information for assessed fees */
  fees?: Maybe<FeeDetails>;
  /** The currency of the funded transaction, formatted in ISO 4217 alphabetic code. */
  fundingCurrency?: Maybe<Scalars['String']['output']>;
  /** The total amount of the transaction converted to its funding currency, before any fees are deducted. */
  fundingGrossAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The amount to be funded after deducting the applicable fees. Presented in the funding currency. */
  fundingNetAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Details on the funds transfer containing this transaction's funding amount. */
  fundsTransfer?: Maybe<FundsTransfer>;
  /** A unique identifier assigned by Tesouro for every transaction request received. */
  id: Scalars['UUID']['output'];
  /**
   * The amount of interchange fees applicable to the transaction. Interchange fees are set by the card networks, and paid to the bank that issued the card used for the transaction.
   * @deprecated Use fees.summary.interchangeAmount instead.
   */
  interchangeFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Indicates if the funding amount has been released. Defined as having a funds transfer ID and funds transfer release date. */
  isFunded: Scalars['Boolean']['output'];
  /** Line items associated with the payment transaction. */
  lineItems?: Maybe<Array<LineItem>>;
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  merchantCategory?: Maybe<Scalars['String']['output']>;
  /**
   * The amount of network fees applicable to this transaction. Network fees are set by card networks and are paid to the card network.
   * @deprecated Use fees.summary.networkAmount instead.
   */
  networkFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** A response code provided by the card network identifying the specific approval or decline reason. */
  networkResponseCode?: Maybe<Scalars['String']['output']>;
  /** A unique value created by the card network and assigned to the transaction and returned to Tesouro in the authorization response. The card network uses this value to maintain an audit trail throughout the life cycle of the transaction and all related transactions, such as reversals, adjustments, confirmations and charge-backs. */
  networkTransactionId?: Maybe<Scalars['String']['output']>;
  /** Information concerning the order placed by the customer. */
  order: Order;
  organization: Organization;
  /**
   * The amount of partner fees applicable to this transaction. Partner fees are set by and paid to the partner.
   * @deprecated Use fees.summary.partnerAmount instead.
   */
  partnerFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The card-present or card-not-present channel from which the customer makes a payment, e.g., In-store using a physical card terminal, online, or over the phone or through mail order. */
  paymentChannel: PaymentChannel;
  /** The means by which the payment details are captured, e.g., Card swipe, contactless "tap", chip entry "dip", keyed, etc. */
  paymentEntryMode: PaymentEntryMode;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Refers to the various options available for customers to make payments when purchasing a product or service. */
  paymentMethod: PaymentMethod;
  /** The payment network that the transaction was sent across, which may be unaffiliated with the card brand. */
  processingNetwork: Network;
  /** Advice provided by Tesouro on what can be done to remedy, and/or prevent this decline response from occurring in the future. */
  processorAdvice?: Maybe<Scalars['String']['output']>;
  /**
   * The amount of processor fees applicable to this transaction. Processor fees are set by and paid to Tesouro.
   * @deprecated Use fees.summary.processorAmount instead.
   */
  processorFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** A response code provided by Tesouro identifying the specific approval or decline reason. */
  processorResponseCode: ProcessorResponseCode;
  /** A human readable description of the authorization response code. e.g., Insufficient funds. */
  processorResponseMessage: Scalars['String']['output'];
  /** A unique transaction identifier created by the entity holding the direct relationship with the Acceptor. Tesouro uses this identifier to manage idempotency. */
  reference?: Maybe<Scalars['String']['output']>;
  /** The transaction amount submitted with the authorization request. */
  requestedAmount: Scalars['Decimal']['output'];
  /** The result of the authorization request, e.g., Approved or Declined. */
  responseType?: Maybe<ResponseType>;
  /**
   * The amount of service fees associated with this transaction
   * @deprecated Use amountDetails.serviceFee instead.
   */
  serviceFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /**
   * The amount of surcharge associated with this transaction
   * @deprecated Use amountDetails.surcharge instead.
   */
  surchargeAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The tax identification number (TIN) is a unique identifier created by the national government and associated with the acceptor at the time the transaction was submitted */
  taxIdentificationNumber?: Maybe<Scalars['String']['output']>;
  /** The various tax amounts collected on the payment transaction. */
  taxes?: Maybe<Taxes>;
  /** The date and time that Tesouro received the transaction, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime: Scalars['DateTime']['output'];
  /** The type of payment transaction, e.g., Authorization, Capture, Sale, Refund, Reversal, etc. */
  transactionType: PaymentTransactionType;
}

export interface DeclinedRefundAuthorization extends PaymentTransaction, RefundAuthorization {
  __typename?: 'DeclinedRefundAuthorization';
  acceptor: Acceptor;
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff. */
  activityDate?: Maybe<Scalars['Date']['output']>;
  /** Components of the requested amount that may or may not have been provided by the presenter on the payment transaction request. */
  amountDetails?: Maybe<AmountDetails>;
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /** The currency specified on the transaction request, in ISO 4217 alpha currency code format. */
  currency?: Maybe<Scalars['String']['output']>;
  /** Specifies the type of decline, e.g. Soft decline, Hard decline, Error, or Referral. */
  declineType: DeclineType;
  /** Aggregate information for assessed fees */
  fees?: Maybe<FeeDetails>;
  /** A unique identifier assigned by Tesouro for every transaction request received. */
  id: Scalars['UUID']['output'];
  /** Line items associated with the payment transaction. */
  lineItems?: Maybe<Array<LineItem>>;
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  merchantCategory?: Maybe<Scalars['String']['output']>;
  /** The result of the name verification service, which checks if the cardholder name submitted with the transaction matches what is on record with the issuer. */
  nameVerification?: Maybe<NameVerificationResponseCode>;
  /** A response code provided by the card network identifying the specific approval or decline reason. */
  networkResponseCode?: Maybe<Scalars['String']['output']>;
  /** A unique value created by the card network and assigned to the transaction and returned to Tesouro in the authorization response. The card network uses this value to maintain an audit trail throughout the life cycle of the transaction and all related transactions, such as reversals, adjustments, confirmations and charge-backs. */
  networkTransactionId?: Maybe<Scalars['String']['output']>;
  /** Information concerning the order placed by the customer. */
  order: Order;
  organization: Organization;
  /** The card-present or card-not-present channel from which the customer makes a payment, e.g., In-store using a physical card terminal, online, or over the phone or through mail order. */
  paymentChannel: PaymentChannel;
  /** The means by which the payment details are captured, e.g., Card swipe, contactless "tap", chip entry "dip", keyed, etc. */
  paymentEntryMode: PaymentEntryMode;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Refers to the various options available for customers to make payments when purchasing a product or service. */
  paymentMethod: PaymentMethod;
  /** The payment network that the transaction was sent across, which may be unaffiliated with the card brand. */
  processingNetwork: Network;
  /** Advice provided by Tesouro on what can be done to remedy, and/or prevent this decline response from occurring in the future. */
  processorAdvice?: Maybe<Scalars['String']['output']>;
  /** A response code provided by Tesouro identifying the specific approval or decline reason. */
  processorResponseCode: ProcessorResponseCode;
  /** A human readable description of the authorization response code. e.g., Insufficient funds. */
  processorResponseMessage: Scalars['String']['output'];
  /** A unique transaction identifier created by the entity holding the direct relationship with the Acceptor. Tesouro uses this identifier to manage idempotency. */
  reference?: Maybe<Scalars['String']['output']>;
  /** The transaction amount submitted with the authorization request. */
  requestedAmount: Scalars['Decimal']['output'];
  /** The result of the authorization request, e.g., Approved or Declined. */
  responseType?: Maybe<ResponseType>;
  /** The result of the card security code verification service, which checks if the CVV2/CVC2/CID submitted with the transaction matches what is on record with the issuer. */
  securityCodeVerification?: Maybe<SecurityCodeResponse>;
  /** The tax identification number (TIN) is a unique identifier created by the national government and associated with the acceptor at the time the transaction was submitted */
  taxIdentificationNumber?: Maybe<Scalars['String']['output']>;
  /** The various tax amounts collected on the payment transaction. */
  taxes?: Maybe<Taxes>;
  /** The date and time that Tesouro received the transaction, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime: Scalars['DateTime']['output'];
  /** The type of payment transaction, e.g., Authorization, Capture, Sale, Refund, Reversal, etc. */
  transactionType: PaymentTransactionType;
}

export interface DeclinedReversal extends PaymentTransaction, Reversal {
  __typename?: 'DeclinedReversal';
  acceptor: Acceptor;
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff. */
  activityDate?: Maybe<Scalars['Date']['output']>;
  /** The result of the address verification service (AVS), which checks if the cardholder address submitted with the transaction matches what is on record with the issuer. */
  addressVerification?: Maybe<AvsResponse>;
  /** Components of the requested amount that may or may not have been provided by the presenter on the payment transaction request. */
  amountDetails?: Maybe<AmountDetails>;
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /** The currency specified on the transaction request, in ISO 4217 alpha currency code format. */
  currency?: Maybe<Scalars['String']['output']>;
  /** Specifies the type of decline, e.g. Soft decline, Hard decline, Error, or Referral. */
  declineType: DeclineType;
  /** Aggregate information for assessed fees */
  fees?: Maybe<FeeDetails>;
  /** A unique identifier assigned by Tesouro for every transaction request received. */
  id: Scalars['UUID']['output'];
  /** Line items associated with the payment transaction. */
  lineItems?: Maybe<Array<LineItem>>;
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  merchantCategory?: Maybe<Scalars['String']['output']>;
  /** The result of the name verification service, which checks if the cardholder name submitted with the transaction matches what is on record with the issuer. */
  nameVerification?: Maybe<NameVerificationResponseCode>;
  /** A response code provided by the card network identifying the specific approval or decline reason. */
  networkResponseCode?: Maybe<Scalars['String']['output']>;
  /** A unique value created by the card network and assigned to the transaction and returned to Tesouro in the authorization response. The card network uses this value to maintain an audit trail throughout the life cycle of the transaction and all related transactions, such as reversals, adjustments, confirmations and charge-backs. */
  networkTransactionId?: Maybe<Scalars['String']['output']>;
  /** Information concerning the order placed by the customer. */
  order: Order;
  organization: Organization;
  /** The transaction ID of the authorization being reversed. */
  originalAuthorizationTransactionId?: Maybe<Scalars['UUID']['output']>;
  /** The card-present or card-not-present channel from which the customer makes a payment, e.g., In-store using a physical card terminal, online, or over the phone or through mail order. */
  paymentChannel: PaymentChannel;
  /** The means by which the payment details are captured, e.g., Card swipe, contactless "tap", chip entry "dip", keyed, etc. */
  paymentEntryMode: PaymentEntryMode;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Refers to the various options available for customers to make payments when purchasing a product or service. */
  paymentMethod: PaymentMethod;
  /** The payment network that the transaction was sent across, which may be unaffiliated with the card brand. */
  processingNetwork: Network;
  /** Advice provided by Tesouro on what can be done to remedy, and/or prevent this decline response from occurring in the future. */
  processorAdvice?: Maybe<Scalars['String']['output']>;
  /** A response code provided by Tesouro identifying the specific approval or decline reason. */
  processorResponseCode: ProcessorResponseCode;
  /** A human readable description of the authorization response code. e.g., Insufficient funds. */
  processorResponseMessage: Scalars['String']['output'];
  /** A unique transaction identifier created by the entity holding the direct relationship with the Acceptor. Tesouro uses this identifier to manage idempotency. */
  reference?: Maybe<Scalars['String']['output']>;
  /** The transaction amount submitted with the authorization request. */
  requestedAmount: Scalars['Decimal']['output'];
  /** The result of the authorization request, e.g., Approved or Declined. */
  responseType?: Maybe<ResponseType>;
  /** The result of the card security code verification service, which checks if the CVV2/CVC2/CID submitted with the transaction matches what is on record with the issuer. */
  securityCodeVerification?: Maybe<SecurityCodeResponse>;
  /** The tax identification number (TIN) is a unique identifier created by the national government and associated with the acceptor at the time the transaction was submitted */
  taxIdentificationNumber?: Maybe<Scalars['String']['output']>;
  /** The various tax amounts collected on the payment transaction. */
  taxes?: Maybe<Taxes>;
  /** The date and time that Tesouro received the transaction, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime: Scalars['DateTime']['output'];
  /** The type of payment transaction, e.g., Authorization, Capture, Sale, Refund, Reversal, etc. */
  transactionType: PaymentTransactionType;
}

export interface DecryptApplicationFieldsInput {
  acceptorApplicationDecryptionInput: AcceptorApplicationDecryptionInput;
}

export interface DecryptApplicationFieldsPayload {
  __typename?: 'DecryptApplicationFieldsPayload';
  acceptorApplicationDecryptionPayload?: Maybe<AcceptorApplicationDecryptionPayload>;
}

export const DiscoverProgram = {
  Acquired: 'ACQUIRED',
  Retained: 'RETAINED',
} as const;

export type DiscoverProgram = (typeof DiscoverProgram)[keyof typeof DiscoverProgram];
export interface Dispute {
  __typename?: 'Dispute';
  acceptor?: Maybe<Acceptor>;
  acquirer?: Maybe<Acquirer>;
  acquirerReferenceNumber?: Maybe<Scalars['String']['output']>;
  amountContext?: Maybe<DisputeAmountContext>;
  /** @deprecated Use workflowAssignment instead. */
  assignment?: Maybe<DisputeWorkflowAssignment>;
  caseNumber?: Maybe<Scalars['String']['output']>;
  createdDateTime?: Maybe<Scalars['DateTime']['output']>;
  disputeAmount?: Maybe<Scalars['Decimal']['output']>;
  disputeAttachments?: Maybe<Array<DisputeAttachment>>;
  disputeCurrencyCode?: Maybe<Scalars['CurrencyCodeAlpha']['output']>;
  disputeDate?: Maybe<Scalars['Date']['output']>;
  disputeEvents?: Maybe<DisputeEventCollection>;
  disputeFundingAmount?: Maybe<Scalars['Decimal']['output']>;
  disputeFundingCurrency?: Maybe<Scalars['CurrencyCodeAlpha']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastUpdatedUserId?: Maybe<Scalars['UUID']['output']>;
  lifeCycle?: Maybe<DisputeLifeCycle>;
  networkReason?: Maybe<NetworkReason>;
  networkReasonCode?: Maybe<Scalars['String']['output']>;
  networkReasonLabel?: Maybe<Scalars['String']['output']>;
  organization?: Maybe<Organization>;
  paymentBrand?: Maybe<PaymentBrand>;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId?: Maybe<Scalars['UUID']['output']>;
  processingNetwork?: Maybe<Network>;
  processorExpirationDate?: Maybe<Scalars['Date']['output']>;
  respondByDate?: Maybe<Scalars['Date']['output']>;
  status?: Maybe<DisputeStatus>;
  /** @deprecated Will be removed in a future release. */
  transactionId?: Maybe<Scalars['UUID']['output']>;
  updatedDateTime?: Maybe<Scalars['DateTime']['output']>;
  workflowAssignment?: Maybe<DisputeWorkflowAssignment>;
}

export interface DisputeDisputeEventsArgs {
  input: DisputeEventsQueryInput;
}

/** Specifies if the amount of the dispute is equal to the full amount of the original transaction or only a portion of it. */
export const DisputeAmountContext = {
  /** The full amount of the original transaction is being disputed. */
  FullAmount: 'FULL_AMOUNT',
  /** Only a part of the original transaction amount is being disputed. */
  PartialAmount: 'PARTIAL_AMOUNT',
} as const;

export type DisputeAmountContext = (typeof DisputeAmountContext)[keyof typeof DisputeAmountContext];
export interface DisputeAttachment {
  __typename?: 'DisputeAttachment';
  acceptor?: Maybe<Acceptor>;
  acquirer?: Maybe<Acquirer>;
  createdDateTime?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  dispute?: Maybe<Dispute>;
  fileName?: Maybe<Scalars['String']['output']>;
  fileType?: Maybe<FileType>;
  fileUrl?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  organization?: Maybe<Organization>;
}

export interface DisputeCollection {
  __typename?: 'DisputeCollection';
  items: Array<Dispute>;
  pageInfo: PageInfo;
}

export interface DisputeEvent {
  __typename?: 'DisputeEvent';
  acceptor?: Maybe<Acceptor>;
  acquirer?: Maybe<Acquirer>;
  attachment?: Maybe<DisputeAttachment>;
  createdDateTime?: Maybe<Scalars['DateTime']['output']>;
  /** @deprecated Use lifeCycle instead. */
  cycle?: Maybe<DisputeLifeCycle>;
  dateOfEvent?: Maybe<Scalars['Date']['output']>;
  dispute?: Maybe<Dispute>;
  eventType?: Maybe<DisputeEventType>;
  fromQueue?: Maybe<DisputeWorkflowAssignment>;
  id?: Maybe<Scalars['UUID']['output']>;
  lifeCycle?: Maybe<DisputeLifeCycle>;
  organization?: Maybe<Organization>;
  source?: Maybe<DisputeEventSource>;
  status?: Maybe<DisputeStatus>;
  toQueue?: Maybe<DisputeWorkflowAssignment>;
  userId?: Maybe<Scalars['UUID']['output']>;
}

export interface DisputeEventCollection {
  __typename?: 'DisputeEventCollection';
  items: Array<DisputeEvent>;
  pageInfo: PageInfo;
}

export const DisputeEventSource = {
  Api: 'API',
  System: 'SYSTEM',
  User: 'USER',
} as const;

export type DisputeEventSource = (typeof DisputeEventSource)[keyof typeof DisputeEventSource];
export const DisputeEventType = {
  ArbitrationAppealed: 'ARBITRATION_APPEALED',
  ArbitrationRaised: 'ARBITRATION_RAISED',
  DecisionRuledInFavorOfAcceptor: 'DECISION_RULED_IN_FAVOR_OF_ACCEPTOR',
  DecisionRuledInFavorOfIssuer: 'DECISION_RULED_IN_FAVOR_OF_ISSUER',
  DisputeAccepted: 'DISPUTE_ACCEPTED',
  DisputeChallenged: 'DISPUTE_CHALLENGED',
  DisputeRaised: 'DISPUTE_RAISED',
  DisputeReversed: 'DISPUTE_REVERSED',
  DisputeWithdrawn: 'DISPUTE_WITHDRAWN',
  FileAttached: 'FILE_ATTACHED',
  InformationRequested: 'INFORMATION_REQUESTED',
  InformationSent: 'INFORMATION_SENT',
  NoteAdded: 'NOTE_ADDED',
  PreArbitrationRaised: 'PRE_ARBITRATION_RAISED',
  TimeToRespondExpired: 'TIME_TO_RESPOND_EXPIRED',
  WorkflowAssignmentChanged: 'WORKFLOW_ASSIGNMENT_CHANGED',
} as const;

export type DisputeEventType = (typeof DisputeEventType)[keyof typeof DisputeEventType];
export interface DisputeEventsFilterInput {
  acceptorId?: InputMaybe<GuidFilterInput>;
  cycle?: InputMaybe<EnumFilterInputOfDisputeLifeCycleInput>;
  dateOfEvent?: InputMaybe<DateFilterInput>;
  disputeEventBatchId?: InputMaybe<GuidFilterInput>;
  disputeEventType?: InputMaybe<EnumFilterInputOfDisputeEventTypeInput>;
  disputeId?: InputMaybe<GuidFilterInput>;
}

export interface DisputeEventsQueryInput {
  orderBy?: InputMaybe<Array<DisputeEventsSortTypeInput>>;
  paging: PagingInput;
  where: DisputeEventsFilterInput;
}

export const DisputeEventsSortField = {
  /** Sort by the UTC timestamp when the event was created. */
  CreatedDateTime: 'CREATED_DATE_TIME',
  /** Sort by the type of event. */
  EventType: 'EVENT_TYPE',
  /** Sort by the id of the event. */
  Id: 'ID',
  /** Sort by source which created the event. */
  Source: 'SOURCE',
} as const;

export type DisputeEventsSortField =
  (typeof DisputeEventsSortField)[keyof typeof DisputeEventsSortField];
export interface DisputeEventsSortTypeInput {
  field: DisputeEventsSortField;
  sortDirection: SortingEnumType;
}

export const DisputeLifeCycle = {
  Arbitration: 'ARBITRATION',
  Compliance: 'COMPLIANCE',
  FirstChargeback: 'FIRST_CHARGEBACK',
  PreArbitration: 'PRE_ARBITRATION',
  PreCompliance: 'PRE_COMPLIANCE',
  Representment: 'REPRESENTMENT',
  RetrievalRequest: 'RETRIEVAL_REQUEST',
} as const;

export type DisputeLifeCycle = (typeof DisputeLifeCycle)[keyof typeof DisputeLifeCycle];
export const DisputeStatus = {
  /** The dispute case has been accepted by the  organization, or the network has made a final decision, or the deadline for the participants to take action has passed. */
  Closed: 'CLOSED',
  /** The dispute case is pending a response or final decision, and the deadline for challenging the decision has not passed. */
  Open: 'OPEN',
} as const;

export type DisputeStatus = (typeof DisputeStatus)[keyof typeof DisputeStatus];
/** Specifies which party in the dispute processing flow is currently working the dispute */
export const DisputeWorkflowAssignment = {
  /** The dispute is assigned to the pertinent card network (Visa, Mastercard, American Express, or Discover) for next steps. */
  CardNetwork: 'CARD_NETWORK',
  /** The dispute is assigned to the partner entity that created the transaction now being disputed. */
  Partner: 'PARTNER',
  /** The dispute is assigned to the payment processor, i.e., Tesouro, for next steps. */
  Processor: 'PROCESSOR',
} as const;

export type DisputeWorkflowAssignment =
  (typeof DisputeWorkflowAssignment)[keyof typeof DisputeWorkflowAssignment];
export interface DisputesFilterInput {
  acceptorId?: InputMaybe<GuidFilterInput>;
  disputeDate?: InputMaybe<DateFilterInput>;
  disputeId?: InputMaybe<GuidFilterInput>;
  organizationId?: InputMaybe<GuidFilterInput>;
  paymentBrand?: InputMaybe<EnumFilterInputOfPaymentBrandInput>;
  processorExpirationDate?: InputMaybe<DateFilterInput>;
  status?: InputMaybe<EnumFilterInputOfDisputeStatusInput>;
  workflowAssignment?: InputMaybe<EnumFilterInputOfDisputeWorkflowAssignmentInput>;
}

export interface DisputesQueryInput {
  orderBy?: InputMaybe<Array<DisputesSortTypeInput>>;
  paging: PagingInput;
  where: DisputesFilterInput;
}

export const DisputesSortField = {
  /** Sort by the date on which the dispute was reported. */
  DisputeDate: 'DISPUTE_DATE',
  /** Sort by the date by which the current dispute lifecycle must be responded to. */
  RespondByDate: 'RESPOND_BY_DATE',
} as const;

export type DisputesSortField = (typeof DisputesSortField)[keyof typeof DisputesSortField];
export interface DisputesSortTypeInput {
  field: DisputesSortField;
  sortDirection: SortingEnumType;
}

export interface EntityIdentificationNumberInput {
  entityIdentificationNumberType?: InputMaybe<EntityIdentificationNumberType>;
  /** The entity identification number. */
  value?: InputMaybe<Scalars['String']['input']>;
}

export interface EntityIdentificationNumberOutput {
  __typename?: 'EntityIdentificationNumberOutput';
  entityIdentificationNumberType?: Maybe<EntityIdentificationNumberType>;
  /** The obfuscated entity identification number. */
  value?: Maybe<Scalars['String']['output']>;
}

export const EntityIdentificationNumberType = {
  /** Social Security Number. */
  Ssn: 'SSN',
  /** Tax Identification Number. */
  Tin: 'TIN',
} as const;

export type EntityIdentificationNumberType =
  (typeof EntityIdentificationNumberType)[keyof typeof EntityIdentificationNumberType];
export interface EnumFilterInputOfAchReturnCodeInput {
  eq?: InputMaybe<AchReturnCode>;
  in?: InputMaybe<Array<AchReturnCode>>;
  nin?: InputMaybe<Array<AchReturnCode>>;
}

export interface EnumFilterInputOfAllocationFeeTypeInput {
  eq?: InputMaybe<AllocationFeeType>;
  in?: InputMaybe<Array<AllocationFeeType>>;
  nin?: InputMaybe<Array<AllocationFeeType>>;
}

export interface EnumFilterInputOfConveyedStatusInput {
  eq?: InputMaybe<ConveyedStatus>;
  in?: InputMaybe<Array<ConveyedStatus>>;
  nin?: InputMaybe<Array<ConveyedStatus>>;
}

export interface EnumFilterInputOfDisputeEventTypeInput {
  eq?: InputMaybe<DisputeEventType>;
  in?: InputMaybe<Array<DisputeEventType>>;
  nin?: InputMaybe<Array<DisputeEventType>>;
}

export interface EnumFilterInputOfDisputeLifeCycleInput {
  eq?: InputMaybe<DisputeLifeCycle>;
  in?: InputMaybe<Array<DisputeLifeCycle>>;
  nin?: InputMaybe<Array<DisputeLifeCycle>>;
}

export interface EnumFilterInputOfDisputeStatusInput {
  eq?: InputMaybe<DisputeStatus>;
  in?: InputMaybe<Array<DisputeStatus>>;
  nin?: InputMaybe<Array<DisputeStatus>>;
}

export interface EnumFilterInputOfDisputeWorkflowAssignmentInput {
  eq?: InputMaybe<DisputeWorkflowAssignment>;
  in?: InputMaybe<Array<DisputeWorkflowAssignment>>;
  nin?: InputMaybe<Array<DisputeWorkflowAssignment>>;
}

export interface EnumFilterInputOfFundingSourceInput {
  eq?: InputMaybe<FundingSource>;
  in?: InputMaybe<Array<FundingSource>>;
  nin?: InputMaybe<Array<FundingSource>>;
}

export interface EnumFilterInputOfPaymentBrandInput {
  eq?: InputMaybe<PaymentBrand>;
  in?: InputMaybe<Array<PaymentBrand>>;
  nin?: InputMaybe<Array<PaymentBrand>>;
}

export interface EnumFilterInputOfPaymentTransactionTypeInput {
  eq?: InputMaybe<PaymentTransactionType>;
  in?: InputMaybe<Array<PaymentTransactionType>>;
  nin?: InputMaybe<Array<PaymentTransactionType>>;
}

export interface EnumFilterInputOfProcessorResponseCodeInput {
  eq?: InputMaybe<ProcessorResponseCode>;
  in?: InputMaybe<Array<ProcessorResponseCode>>;
  nin?: InputMaybe<Array<ProcessorResponseCode>>;
}

export interface Error {
  message: Scalars['String']['output'];
}

export interface ErrorBase {
  __typename?: 'ErrorBase';
  code: Scalars['String']['output'];
  message: Scalars['String']['output'];
}

export const EventType = {
  Created: 'CREATED',
  FileAttached: 'FILE_ATTACHED',
  Processing: 'PROCESSING',
  SensitiveDataViewed: 'SENSITIVE_DATA_VIEWED',
  Submitted: 'SUBMITTED',
  Updated: 'UPDATED',
} as const;

export type EventType = (typeof EventType)[keyof typeof EventType];
export interface ExpirationDateExceededError extends Error {
  __typename?: 'ExpirationDateExceededError';
  expirationDate: Scalars['Date']['output'];
  message: Scalars['String']['output'];
}

export interface FailedToCreateAsyncReportError extends Error {
  __typename?: 'FailedToCreateAsyncReportError';
  message: Scalars['String']['output'];
}

export interface Fee {
  __typename?: 'Fee';
  acceptor?: Maybe<Acceptor>;
  /** The leading digits of the account. */
  accountNumberPrefix?: Maybe<Scalars['String']['output']>;
  /** The final digits of the account. */
  accountNumberSuffix?: Maybe<Scalars['String']['output']>;
  /** The date the fee was applied */
  activityDate: Scalars['Date']['output'];
  /** The net billable event amount, including any add-ons or deductions. */
  billableEventAmount: Scalars['Decimal']['output'];
  /** The fee's billable event currency code in ISO 4217 alpha currency code format. */
  billableEventCurrency?: Maybe<Scalars['String']['output']>;
  /** The type of billable event, including, but not limited to: Authorization, Capture, Refund, Reversal, Authentication, Dispute, Funds transfer, Misc. adjustment, Token, Account updater, AVS verification, etc. */
  billableEventType?: Maybe<BillableType>;
  /** Specifies the type of account associated with the cardholder's card, e.g., Consumer, Commercial, Government, etc., which has an impact on the interchange qualification. NOTE: This field will present a null, not applicable, or empty value if the fee is not tied to a specific transaction. */
  consumerType?: Maybe<ConsumerType>;
  /** A detailed description of the fee or program */
  description: Scalars['String']['output'];
  /** The total fee amount calculated as a percentage of the transaction amount (including taxes), a flat fee, or a combination of both. */
  feeCalculatedAmount: Scalars['Decimal']['output'];
  /** The type of fee, e.g., Interchange, Network, Processor, etc. */
  feeType: AllocationType;
  /** The total fee amount's currency code in ISO 4217 alpha currency code format. */
  fundingCurrency: Scalars['String']['output'];
  /** The date that Tesouro releases the funds from its bank account to the recipient's bank account. */
  fundsReleaseDate?: Maybe<Scalars['Date']['output']>;
  /** A value created by Tesouro and sent with the funds transfer to the recipient's bank for display on the bank statement. It includes information on who sent the money and the purpose of the payment. The recipient can use this value to help with bank and transaction reconciliation. */
  fundsTransferDescriptor?: Maybe<Scalars['String']['output']>;
  /** A unique identifier created by Tesouro and assigned to the transfer of money to a bank account, that identifies a cohort of funded transactions making up the transfer. */
  fundsTransferId?: Maybe<Scalars['UUID']['output']>;
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. https://www.iso.org/standard/79450.html */
  merchantCategory?: Maybe<Scalars['String']['output']>;
  /** The name of the fee, interchange or wholesale program */
  name: Scalars['String']['output'];
  /** A unique identifier created by the acceptor and assigned to the order placed by the customer. */
  orderReference?: Maybe<Scalars['String']['output']>;
  organization?: Maybe<Organization>;
  /** The specific payment brand used, e.g., Visa, MasterCard, Discover, American Express, etc. */
  paymentBrand?: Maybe<PaymentBrand>;
  /** Specifies the source of the customer's funds , e.g., credit, debit, or pre-paid. */
  paymentFundingSource?: Maybe<FundingSource>;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. NOTE: This field will present a null, not applicable, or empty value if the fee is not tied to a specific transaction. */
  paymentId?: Maybe<Scalars['UUID']['output']>;
  /** The product name according to the payment brand (e.g. World Elite Mastercard card)  NOTE: This field will present a null, not applicable, or empty value if the fee is not tied to a specific transaction. */
  paymentProduct?: Maybe<Scalars['String']['output']>;
  /** Presenter Id */
  presenterId?: Maybe<Scalars['UUID']['output']>;
  /** The applicable payment network, e.g., Visa, Mastercard, etc. */
  processingNetwork?: Maybe<Network>;
  /** The Tesouro product pillar that this fee applies to: "Boarding", "Transaction processing", "Funding", "Risk, Compliance, and Dispute management", or "Reporting". */
  productPillar: ProductPillar;
  /** The decimal used to multiply against the transaction amount to determine the "percentage" portion of the fee rate. */
  rateMultiplier: Scalars['Decimal']['output'];
  /** The unit amount charged on transaction, as part of the fee rate. */
  rateUnitAmount: Scalars['Decimal']['output'];
  /** The date and time that Tesouro received the transaction, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime?: Maybe<Scalars['DateTime']['output']>;
  /** A unique 36 character identifier assigned by Tesouro for every transaction request received. */
  transactionId?: Maybe<Scalars['UUID']['output']>;
  /** A unique identifier created by the entity holding the direct relationship with the Acceptor, and used by that entity for reconciliation and transaction search. Tesouro uses this identifier to manage idempotency. */
  transactionReference?: Maybe<Scalars['String']['output']>;
}

export interface FeeAsyncInput {
  asyncReportsDetailsInput: AsyncReportsDetailsInput;
  feesReportInput: FeesAsyncReportInput;
  where: FeeFilterInput;
}

export interface FeeCollection {
  __typename?: 'FeeCollection';
  items: Array<Fee>;
  pageInfo: PageInfo;
}

export interface FeeDetails {
  __typename?: 'FeeDetails';
  /** An itemized collection of each fee applicable to the transaction entity. */
  items: Array<ItemizedFee>;
  /** Total amount of various fee types. */
  summary: FeeSummaryTotals;
}

export const FeeFields = {
  AcceptorId: 'ACCEPTOR_ID',
  AcceptorName: 'ACCEPTOR_NAME',
  AcceptorReference: 'ACCEPTOR_REFERENCE',
  AccountNumberPrefix: 'ACCOUNT_NUMBER_PREFIX',
  AccountNumberSuffix: 'ACCOUNT_NUMBER_SUFFIX',
  ActivityDate: 'ACTIVITY_DATE',
  BillableEventAmount: 'BILLABLE_EVENT_AMOUNT',
  BillableEventCurrency: 'BILLABLE_EVENT_CURRENCY',
  BillableEventType: 'BILLABLE_EVENT_TYPE',
  ConsumerType: 'CONSUMER_TYPE',
  Description: 'DESCRIPTION',
  FeeCalculatedAmount: 'FEE_CALCULATED_AMOUNT',
  FeeType: 'FEE_TYPE',
  FundingCurrency: 'FUNDING_CURRENCY',
  FundsReleaseDate: 'FUNDS_RELEASE_DATE',
  FundsTransferDescriptor: 'FUNDS_TRANSFER_DESCRIPTOR',
  FundsTransferId: 'FUNDS_TRANSFER_ID',
  MerchantCategory: 'MERCHANT_CATEGORY',
  Name: 'NAME',
  OrderReference: 'ORDER_REFERENCE',
  OrganizationId: 'ORGANIZATION_ID',
  PaymentBrand: 'PAYMENT_BRAND',
  PaymentFundingSource: 'PAYMENT_FUNDING_SOURCE',
  PaymentId: 'PAYMENT_ID',
  PaymentProduct: 'PAYMENT_PRODUCT',
  PlannedFundsReleaseDate: 'PLANNED_FUNDS_RELEASE_DATE',
  PresenterId: 'PRESENTER_ID',
  ProcessingNetwork: 'PROCESSING_NETWORK',
  ProductPillar: 'PRODUCT_PILLAR',
  RateMultiplier: 'RATE_MULTIPLIER',
  RateUnitAmount: 'RATE_UNIT_AMOUNT',
  TransactionDateTime: 'TRANSACTION_DATE_TIME',
  TransactionId: 'TRANSACTION_ID',
  TransactionReference: 'TRANSACTION_REFERENCE',
} as const;

export type FeeFields = (typeof FeeFields)[keyof typeof FeeFields];
export interface FeeFilterInput {
  fundsTransferIdFeeFilter?: InputMaybe<FundsTransferIdFeeFilterInput>;
  standardFeeFilter?: InputMaybe<StandardFeeFilterInput>;
}

export interface FeeInput {
  paging: PagingInput;
  where: FeeFilterInput;
}

export interface FeeSummariesAsyncInput {
  asyncReportsDetailsInput: AsyncReportsDetailsInput;
  feeSummaryReportInput: FeeSummaryAsyncReportInput;
  where: FeeSummaryFilterInput;
}

export interface FeeSummary {
  __typename?: 'FeeSummary';
  acceptor?: Maybe<Acceptor>;
  /** The total amount of the billable type and used to calculate the Fee when a fee rate multiplier is part of the fee rate.. */
  billableEventAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Billable type of the fee */
  billableEventType?: Maybe<BillableType>;
  /** The date the fee was applied */
  feeActivityDate: Scalars['Date']['output'];
  /** The total amount of fees applied. */
  feeAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The number of fees */
  feeCount?: Maybe<Scalars['Int']['output']>;
  /** A detailed description of the fee or program. */
  feeDescription?: Maybe<Scalars['String']['output']>;
  /** The name of the fee, interchange or wholesale program. */
  feeName?: Maybe<Scalars['String']['output']>;
  /** A unique identifier created by Tesouro and assigned to each fee allocation. */
  feeProfileId: Scalars['UUID']['output'];
  /** A component of the fee rate; the decimal used to multiply against the transaction amount to determine a 'percent' cost. */
  feeRateMultiplier?: Maybe<Scalars['Decimal']['output']>;
  /** A component of the fee rate; the unit amount charged per item. */
  feeRateUnitAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The type of fee, e.g., Interchange, Network, Processor, etc. */
  feeType?: Maybe<AllocationType>;
  /** The currency of the funded transaction, formatted in ISO 4217 alphabetic code. */
  fundingCurrency?: Maybe<Scalars['String']['output']>;
  /** The date that Tesouro releases the funds from its bank account to the recipient's bank account. */
  fundsReleaseDate?: Maybe<Scalars['Date']['output']>;
  /** A unique identifier created by Tesouro and assigned to the transfer of money to a bank account, that identifies a cohort of funded transactions making up the transfer. */
  fundsTransferId: Scalars['UUID']['output'];
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. NOTE: This field will present a null, not applicable, or empty value if the fee is not tied to a specific transaction. */
  merchantCategory?: Maybe<Scalars['String']['output']>;
  organization: Organization;
  /** Specifies which payment brand was used, e.g., Visa, Mastercard, Discover, American Express, etc. NOTE: This field will present a null, not applicable, or empty value if the fee is not tied to a specific transaction. */
  paymentBrand?: Maybe<PaymentBrand>;
  /** Specifies the source of the card customer's funds , e.g., credit, debit, pre-paid. NOTE: This field will present a null, not applicable, or empty value if the fee is not tied to a specific transaction. */
  paymentFundingSource?: Maybe<FundingSource>;
  /** The product name according to the payment brand (e.g. World Elite Mastercard card)  NOTE: This field will present a null, not applicable, or empty value if the fee is not tied to a specific transaction. */
  paymentProduct?: Maybe<Scalars['String']['output']>;
  /** The payment network that the transaction was sent across, which may be unafilliated with the card brand. NOTE: This field will present a null, not applicable, or empty value if the fee is not tied to a specific transaction. */
  processingNetwork?: Maybe<Network>;
  /** The Tesouro product pillar that this fee applies to, e.g., Transaction processing; Billing & Funding; Risk, Fraud, & Dispute management; Reporting; Boarding; */
  productPillar?: Maybe<ProductPillar>;
}

export interface FeeSummaryAsyncReportInput {
  /** The fields to include in the report. */
  fields: Array<FeeSummaryFields>;
  /** Tesouro names the files so that the filename is contextual to the data the report contains, e.g., acceptorName_reportType_YYYYMM-DD-to-YYYMMDD_createdOnDate. If you prefer to override Tesouro's file naming and specify your own format, add it here. */
  fileName?: InputMaybe<Scalars['String']['input']>;
  /** The type of file that the report is saved as, e.g. CSV */
  fileType: FileTypes;
}

export interface FeeSummaryCollection {
  __typename?: 'FeeSummaryCollection';
  items: Array<FeeSummary>;
  pageInfo: PageInfo;
}

export const FeeSummaryFields = {
  AcceptorId: 'ACCEPTOR_ID',
  AcceptorName: 'ACCEPTOR_NAME',
  AcceptorReference: 'ACCEPTOR_REFERENCE',
  BillableEventAmount: 'BILLABLE_EVENT_AMOUNT',
  BillableEventType: 'BILLABLE_EVENT_TYPE',
  FeeActivityDate: 'FEE_ACTIVITY_DATE',
  FeeAmount: 'FEE_AMOUNT',
  FeeCount: 'FEE_COUNT',
  FeeDescription: 'FEE_DESCRIPTION',
  FeeName: 'FEE_NAME',
  FeeProfileId: 'FEE_PROFILE_ID',
  FeeRateMultiplier: 'FEE_RATE_MULTIPLIER',
  FeeRateUnitAmount: 'FEE_RATE_UNIT_AMOUNT',
  FeeType: 'FEE_TYPE',
  FundingCurrency: 'FUNDING_CURRENCY',
  FundsReleaseDate: 'FUNDS_RELEASE_DATE',
  FundsTransferId: 'FUNDS_TRANSFER_ID',
  MerchantCategory: 'MERCHANT_CATEGORY',
  OrganizationId: 'ORGANIZATION_ID',
  PaymentBrand: 'PAYMENT_BRAND',
  PaymentFundingSource: 'PAYMENT_FUNDING_SOURCE',
  PaymentProduct: 'PAYMENT_PRODUCT',
  ProcessingNetwork: 'PROCESSING_NETWORK',
  ProductPillar: 'PRODUCT_PILLAR',
} as const;

export type FeeSummaryFields = (typeof FeeSummaryFields)[keyof typeof FeeSummaryFields];
export interface FeeSummaryFilterInput {
  acceptorId?: InputMaybe<GuidFilterInput>;
  feeActivityDate?: InputMaybe<DateRangeFilterInput>;
  feeType?: InputMaybe<EnumFilterInputOfAllocationFeeTypeInput>;
  fundingCurrency?: InputMaybe<Scalars['String']['input']>;
  fundsReleaseDate?: InputMaybe<DateRangeFilterInput>;
  fundsTransferId?: InputMaybe<GuidFilterInput>;
  paymentBrand?: InputMaybe<EnumFilterInputOfPaymentBrandInput>;
}

export interface FeeSummaryInput {
  orderBy?: InputMaybe<Array<FeeSummarySortTypeInput>>;
  paging: PagingInput;
  where: FeeSummaryFilterInput;
}

export const FeeSummarySortField = {
  BillableEventType: 'BILLABLE_EVENT_TYPE',
  FeeActivityDate: 'FEE_ACTIVITY_DATE',
  FeeCount: 'FEE_COUNT',
  FeeDescription: 'FEE_DESCRIPTION',
  FeeName: 'FEE_NAME',
  FeeProfileId: 'FEE_PROFILE_ID',
  FeeRateMultiplier: 'FEE_RATE_MULTIPLIER',
  FeeRateUnitAmount: 'FEE_RATE_UNIT_AMOUNT',
  FeeType: 'FEE_TYPE',
  FundingCurrency: 'FUNDING_CURRENCY',
  FundsReleaseDate: 'FUNDS_RELEASE_DATE',
  FundsTransferId: 'FUNDS_TRANSFER_ID',
  MerchantCategory: 'MERCHANT_CATEGORY',
  PaymentBrand: 'PAYMENT_BRAND',
  PaymentFundingSource: 'PAYMENT_FUNDING_SOURCE',
  PaymentProduct: 'PAYMENT_PRODUCT',
  ProcessingNetwork: 'PROCESSING_NETWORK',
  ProductPillar: 'PRODUCT_PILLAR',
} as const;

export type FeeSummarySortField = (typeof FeeSummarySortField)[keyof typeof FeeSummarySortField];
export interface FeeSummarySortTypeInput {
  field: FeeSummarySortField;
  sortDirection: SortingEnumType;
}

export interface FeeSummaryTotals {
  __typename?: 'FeeSummaryTotals';
  /** The total amount of interchange fees collected. */
  interchangeAmount: Scalars['Decimal']['output'];
  /** The total amount of network fees collected. */
  networkAmount: Scalars['Decimal']['output'];
  /** The total amount of partner fees collected. */
  partnerAmount: Scalars['Decimal']['output'];
  /** The total amount of processor fees collected. */
  processorAmount: Scalars['Decimal']['output'];
  /** The total amount of fees collected. */
  totalAmount: Scalars['Decimal']['output'];
}

/** Possible values for applicable fees on given transaction. */
export const FeeType = {
  /** Convenience fee. */
  Convenience: 'CONVENIENCE',
  /** Service fee. */
  Service: 'SERVICE',
  /** Surcharge fee. */
  Surcharge: 'SURCHARGE',
} as const;

export type FeeType = (typeof FeeType)[keyof typeof FeeType];
export interface FeesAsyncReportInput {
  /** The fields to include in the report. */
  fields: Array<FeeFields>;
  /** Tesouro names the files so that the filename is contextual to the data the report contains, e.g., acceptorName_reportType_YYYYMM-DD-to-YYYMMDD_createdOnDate. If you prefer to override Tesouro's file naming and specify your own format, add it here. */
  fileName?: InputMaybe<Scalars['String']['input']>;
  /** The type of file that the report is saved as, e.g. CSV */
  fileType: FileTypes;
}

export const FileType = {
  Bmp: 'BMP',
  Gif: 'GIF',
  Jpeg: 'JPEG',
  Jpg: 'JPG',
  Pdf: 'PDF',
  Png: 'PNG',
  Tif: 'TIF',
  Tiff: 'TIFF',
  Unknown: 'UNKNOWN',
} as const;

export type FileType = (typeof FileType)[keyof typeof FileType];
export const FileTypes = {
  Csv: 'CSV',
} as const;

export type FileTypes = (typeof FileTypes)[keyof typeof FileTypes];
/** An exception that occurs when a user is not authorized to perform the request */
export interface ForbiddenError extends Error {
  __typename?: 'ForbiddenError';
  /** The general code for the error */
  code: Scalars['String']['output'];
  /** A human readable description of the error */
  message: Scalars['String']['output'];
}

export const FundingDisputeEventFields = {
  AcceptorId: 'ACCEPTOR_ID',
  AcceptorName: 'ACCEPTOR_NAME',
  AcceptorReference: 'ACCEPTOR_REFERENCE',
  AcquirerReferenceNumber: 'ACQUIRER_REFERENCE_NUMBER',
  DateOfEvent: 'DATE_OF_EVENT',
  DisputeId: 'DISPUTE_ID',
  FundingAmount: 'FUNDING_AMOUNT',
  FundingCurrency: 'FUNDING_CURRENCY',
  FundsReleaseDate: 'FUNDS_RELEASE_DATE',
  FundsTransferDescriptor: 'FUNDS_TRANSFER_DESCRIPTOR',
  FundsTransferId: 'FUNDS_TRANSFER_ID',
  Id: 'ID',
  LifeCycle: 'LIFE_CYCLE',
  OrganizationId: 'ORGANIZATION_ID',
  PaymentBrand: 'PAYMENT_BRAND',
  PaymentId: 'PAYMENT_ID',
  ProcessingNetwork: 'PROCESSING_NETWORK',
} as const;

export type FundingDisputeEventFields =
  (typeof FundingDisputeEventFields)[keyof typeof FundingDisputeEventFields];
export interface FundingDisputeEventInput {
  paging: PagingInput;
  where: FundingDisputeEventsFilterInput;
}

export interface FundingDisputeEventOutput {
  __typename?: 'FundingDisputeEventOutput';
  acceptor?: Maybe<Acceptor>;
  /** The Acquirer Reference Number (ARN) is a unique 23 digit number created by Tesouro, that was assigned to the original transaction and provided to the acquiring and issuing banks for their purpose of tracing the transaction through the full process until it is funded to the bank. */
  acquirerReferenceNumber: Scalars['String']['output'];
  /** The date the dispute lifecycle was received. */
  dateOfEvent?: Maybe<Scalars['Date']['output']>;
  /** A unique identifier created and used internally by Tesouro, and assigned to the dispute. */
  disputeId: Scalars['UUID']['output'];
  /** The funded amount of the dispute, which may be different from the "dispute amount" if the original transaction's amount was presented in a different currency than its funding currency. */
  fundingAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The currency associated with the dispute funding amount */
  fundingCurrency?: Maybe<Scalars['String']['output']>;
  /** The date the debited or credited funds for the dispute lifecycle were released. */
  fundsReleaseDate?: Maybe<Scalars['Date']['output']>;
  /** A value created by Tesouro and sent with the funds transfer to the recipient's bank for display on the bank statement. It includes information on who sent the money and the purpose of the payment. The recipient can use this value to help with bank and transaction reconciliation. */
  fundsTransferDescriptor?: Maybe<Scalars['String']['output']>;
  /** A unique identifier created by Tesouro and assigned to the transfer of money to a bank account for this dispute, that identifies a cohort of funded transactions making up the transfer. */
  fundsTransferId?: Maybe<Scalars['UUID']['output']>;
  /** A unique identifier created by Tesouro and assigned to the dispute event resulting in the credit or debit. */
  id: Scalars['UUID']['output'];
  /** Specifies where in the life cycle the dispute is at, e.g., Retrieval request, Chargeback, Representment, Pre-arbitration, etc. */
  lifeCycle: DisputeLifeCycle;
  organization: Organization;
  /** The brand of payment method used. */
  paymentBrand?: Maybe<PaymentBrand>;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId?: Maybe<Scalars['UUID']['output']>;
  /** The processing network that the transaction was sent across, which may be unaffiliated with the card brand. */
  processingNetwork?: Maybe<Scalars['String']['output']>;
}

export interface FundingDisputeEventOutputCollection {
  __typename?: 'FundingDisputeEventOutputCollection';
  items: Array<FundingDisputeEventOutput>;
  pageInfo: PageInfo;
}

export interface FundingDisputeEventsAsyncInput {
  asyncReportsDetailsInput: AsyncReportsDetailsInput;
  fundingDisputeEventsReportInput: FundingDisputeEventsAsyncReportInput;
  where: FundingDisputeEventsFilterInput;
}

export interface FundingDisputeEventsAsyncReportInput {
  /** The fields to include in the report. */
  fields: Array<FundingDisputeEventFields>;
  /** Tesouro names the files so that the filename is contextual to the data the report contains, e.g., acceptorName_reportType_YYYYMM-DD-to-YYYMMDD_createdOnDate. If you prefer to override Tesouro's file naming and specify your own format, add it here. */
  fileName?: InputMaybe<Scalars['String']['input']>;
  /** The type of file that the report is saved as, e.g. CSV */
  fileType: FileTypes;
}

export interface FundingDisputeEventsFilterInput {
  acceptorId?: InputMaybe<GuidFilterInput>;
  dateOfEvent?: InputMaybe<DateRangeFilterInput>;
  fundsReleaseDate?: InputMaybe<DateRangeFilterInput>;
  fundsTransferId?: InputMaybe<GuidFilterInput>;
  paymentBrand?: InputMaybe<EnumFilterInputOfPaymentBrandInput>;
}

export const FundingSource = {
  ChargeCard: 'CHARGE_CARD',
  Credit: 'CREDIT',
  Debit: 'DEBIT',
  DeferredDebit: 'DEFERRED_DEBIT',
  Prepaid: 'PREPAID',
  Unknown: 'UNKNOWN',
} as const;

export type FundingSource = (typeof FundingSource)[keyof typeof FundingSource];
export const FundingStatus = {
  Completed: 'COMPLETED',
  Error: 'ERROR',
  NotStarted: 'NOT_STARTED',
  Processing: 'PROCESSING',
} as const;

export type FundingStatus = (typeof FundingStatus)[keyof typeof FundingStatus];
export interface FundingSummariesAsyncInput {
  asyncReportsDetailsInput: AsyncReportsDetailsInput;
  fundingSummaryReportInput: FundingSummariesAsyncReportInput;
  where: FundingSummaryFilterInput;
}

export interface FundingSummariesAsyncReportInput {
  /** The fields to include in the report. */
  fields: Array<FundingSummaryFields>;
  /** Tesouro names the files so that the filename is contextual to the data the report contains, e.g., acceptorName_reportType_YYYYMM-DD-to-YYYMMDD_createdOnDate. If you prefer to override Tesouro's file naming and specify your own format, add it here. */
  fileName?: InputMaybe<Scalars['String']['input']>;
  /** The type of file that the report is saved as, e.g. CSV */
  fileType: FileTypes;
}

export interface FundingSummariesInput {
  orderBy?: InputMaybe<Array<FundingSummarySortTypeInput>>;
  paging: PagingInput;
  where: FundingSummaryFilterInput;
}

export interface FundingSummary {
  __typename?: 'FundingSummary';
  acceptor?: Maybe<Acceptor>;
  /** Total monetary amount of ACH returns from the acceptor. */
  acceptorAchReturnsAmount: Scalars['Decimal']['output'];
  /** Acceptor net funding amount, calculated as [Total net sales + gross dispute + partner fees amounts. */
  acceptorFundingNetAmount: Scalars['Decimal']['output'];
  /** The total amount transferred to the acceptors' bank accounts. */
  acceptorPaymentsAmount: Scalars['Decimal']['output'];
  /** Total monetary amount of ACH returns */
  achReturnsAmount: Scalars['Decimal']['output'];
  /** Total number of ACH returns */
  achReturnsCount: Scalars['Int']['output'];
  /** Total amount of convenience fees charged to the customer. */
  convenienceFeesAmount: Scalars['Decimal']['output'];
  /** Total number of convenience fees charged to the customer. */
  convenienceFeesCount: Scalars['Int']['output'];
  /**
   * The total amount of disputes represented and credited to the acceptor.
   * @deprecated Use disputesCreditAmount instead
   */
  disputeReversalAmount?: Maybe<Scalars['Decimal']['output']>;
  /**
   * The total number of representments
   * @deprecated Use disputesCreditCount instead
   */
  disputeReversalCount?: Maybe<Scalars['Int']['output']>;
  /** The total number of dispute debits and credits applied on your account. Calculated as [Dispute credits count - Dispute debits count] */
  disputesCount: Scalars['Int']['output'];
  /** The amount of financially impacting dispute events (e.g., representments) credited to your account. */
  disputesCreditAmount: Scalars['Decimal']['output'];
  /** The number of financially impacting dispute events (e.g., representments) credited to your account. */
  disputesCreditCount: Scalars['Int']['output'];
  /** The amount of financially impacting dispute events (e.g., 1st chargebacks) debited from your account. */
  disputesDebitAmount: Scalars['Decimal']['output'];
  /** The number of financially impacting dispute events (e.g., 1st chargebacks) debited from your account. */
  disputesDebitCount: Scalars['Int']['output'];
  /**
   * The total amount of financially impacting disputes.
   * @deprecated Use disputesNetAmount instead
   */
  disputesGrossAmount: Scalars['Decimal']['output'];
  /** The net amount of financially impacting dispute events funded to our from your account. Calculated as [Dispute credits - Dispute debits]. */
  disputesNetAmount: Scalars['Decimal']['output'];
  /**
   * The total amount of fees. Calculated as [Interchange + Network fees + Processor fees + Transactor fees].
   * @deprecated Use feesAmount instead.
   */
  feeAmount: Scalars['Decimal']['output'];
  /** The total amount of fees. */
  feesAmount: Scalars['Decimal']['output'];
  /** Total number of fees. */
  feesCount: Scalars['Int']['output'];
  /**
   * The total number of dispute debits and credits applied on your account. Calculated as [Dispute credits count - Dispute debits count]
   * @deprecated Use disputesCount instead.
   */
  fundedDisputesCount: Scalars['Int']['output'];
  /** The currency of the funded transaction, formatted in ISO 4217 alphabetic code. */
  fundingCurrency: Scalars['String']['output'];
  /** The amount transferred from Tesouro to the recipient's bank. */
  fundingNetAmount: Scalars['Decimal']['output'];
  /** The date that Tesouro releases the funds from its bank account to the recipient's bank account. */
  fundsReleaseDate: Scalars['Date']['output'];
  /** A value created by Tesouro and sent with the funds transfer to the recipient's bank for display on the bank statement. It includes information on who sent the money and the purpose of the payment. The recipient can use this value to help with bank and transaction reconciliation. */
  fundsTransferDescriptor?: Maybe<Scalars['String']['output']>;
  /** A unique identifier created by Tesouro and assigned to the transfer of money to a bank account, that identifies a cohort of funded transactions making up the transfer. */
  fundsTransferId: Scalars['UUID']['output'];
  /** A reusable identifier created and used internally by Tesouro, and assigned to the configuration of funding profiles specifying who and/or where the funds transfer is sent. */
  fundsTransferProfileId?: Maybe<Scalars['UUID']['output']>;
  /** A reusable, descriptive name specified by the transactor, labeling who and/or where the funds transfer is going. E.g., the name of a specific acceptor, a group of acceptors, a bank account, etc. */
  fundsTransferProfileName?: Maybe<Scalars['String']['output']>;
  /** Total amount of interchange fees. */
  interchangeFeesAmount: Scalars['Decimal']['output'];
  /** Total number of interchange fees. */
  interchangeFeesCount: Scalars['Int']['output'];
  /** The net amount of miscellaneous adjustments. Calculated as [Miscellaneous credits - Miscellaneous debits]. */
  miscAdjustmentsAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The total amount of miscellaneous credits */
  miscCreditsAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The total number of miscellaneous credits */
  miscCreditsCount?: Maybe<Scalars['Int']['output']>;
  /** The total amount of miscellaneous debits */
  miscDebitsAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The total number of miscellaneous debits */
  miscDebitsCount?: Maybe<Scalars['Int']['output']>;
  /** Total amount of network fees. */
  networkFeesAmount: Scalars['Decimal']['output'];
  /** Total number of network fees. */
  networkFeesCount: Scalars['Int']['output'];
  organization: Organization;
  /** The total amount of partner fees passed onto the acceptor. */
  partnerFeesAmount: Scalars['Decimal']['output'];
  /** Total number of partner fees charged to the acceptor. */
  partnerFeesCount: Scalars['Int']['output'];
  /** Specifies which payment brand was used, e.g., Visa, Mastercard, Discover, American Express, etc. NOTE: This field will present a null, not applicable, or empty value if the fee is not tied to a specific transaction. */
  paymentBrand?: Maybe<PaymentBrand>;
  /** The processing network that the transaction was sent across, which may be unaffiliated with the card brand. NOTE: This field will present a null, not applicable, or empty value if the fee is not tied to a specific transaction. */
  processingNetwork?: Maybe<Network>;
  /** Total amount of processor fees charged by Tesouro. */
  processorFeesAmount: Scalars['Decimal']['output'];
  /** Total number of processor fees. */
  processorFeesCount: Scalars['Int']['output'];
  /** The total number of refunded transactions. */
  refundsCount: Scalars['Int']['output'];
  /** The gross refunds amount before deducting any associated transaction-level fees. */
  refundsGrossAmount: Scalars['Decimal']['output'];
  /** The net reserve amount, if applicable. */
  reservesNetAmount: Scalars['Decimal']['output'];
  /** The total number of captured sale transactions */
  salesCount: Scalars['Int']['output'];
  /** The gross sales amount before deducting any associated transaction-level fees. */
  salesGrossAmount: Scalars['Decimal']['output'];
  /** The net transaction amount, calculated as [Gross sales amount - Gross refunds amount] */
  salesNetAmount: Scalars['Decimal']['output'];
  /** Total amount of service fees charged to the customer. */
  serviceFeesAmount: Scalars['Decimal']['output'];
  /** Total number of service fees charged to the customer. */
  serviceFeesCount: Scalars['Int']['output'];
  /** Total amount of surcharges charged to the customer. */
  surchargeAmount: Scalars['Decimal']['output'];
  /** Total number of surcharges charged to the customer. */
  surchargeCount: Scalars['Int']['output'];
  /** The total amount transferred to third parties. */
  thirdPartyPaymentAmount: Scalars['Decimal']['output'];
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff */
  transactionActivityDate: Scalars['Date']['output'];
  /**
   * The total amount of transactor fees passed onto the acceptor.
   * @deprecated Use partnerFeesAmount instead.
   */
  transactorFeesAmount: Scalars['Decimal']['output'];
}

export interface FundingSummaryCollection {
  __typename?: 'FundingSummaryCollection';
  items: Array<FundingSummary>;
  pageInfo: PageInfo;
}

export const FundingSummaryFields = {
  AcceptorAchReturnsAmount: 'ACCEPTOR_ACH_RETURNS_AMOUNT',
  AcceptorFundingNetAmount: 'ACCEPTOR_FUNDING_NET_AMOUNT',
  AcceptorId: 'ACCEPTOR_ID',
  AcceptorName: 'ACCEPTOR_NAME',
  AcceptorPaymentsAmount: 'ACCEPTOR_PAYMENTS_AMOUNT',
  AcceptorReference: 'ACCEPTOR_REFERENCE',
  AchReturnsAmount: 'ACH_RETURNS_AMOUNT',
  AchReturnsCount: 'ACH_RETURNS_COUNT',
  ConvenienceFeesAmount: 'CONVENIENCE_FEES_AMOUNT',
  ConvenienceFeesCount: 'CONVENIENCE_FEES_COUNT',
  DisputesCount: 'DISPUTES_COUNT',
  DisputesCreditAmount: 'DISPUTES_CREDIT_AMOUNT',
  DisputesCreditCount: 'DISPUTES_CREDIT_COUNT',
  DisputesDebitAmount: 'DISPUTES_DEBIT_AMOUNT',
  DisputesDebitCount: 'DISPUTES_DEBIT_COUNT',
  DisputesGrossAmount: 'DISPUTES_GROSS_AMOUNT',
  DisputesNetAmount: 'DISPUTES_NET_AMOUNT',
  DisputeReversalAmount: 'DISPUTE_REVERSAL_AMOUNT',
  DisputeReversalCount: 'DISPUTE_REVERSAL_COUNT',
  FeeAmount: 'FEE_AMOUNT',
  FundedDisputesCount: 'FUNDED_DISPUTES_COUNT',
  FundingCurrency: 'FUNDING_CURRENCY',
  FundingNetAmount: 'FUNDING_NET_AMOUNT',
  FundsReleaseDate: 'FUNDS_RELEASE_DATE',
  FundsTransferDescriptor: 'FUNDS_TRANSFER_DESCRIPTOR',
  FundsTransferId: 'FUNDS_TRANSFER_ID',
  FundsTransferProfileId: 'FUNDS_TRANSFER_PROFILE_ID',
  FundsTransferProfileName: 'FUNDS_TRANSFER_PROFILE_NAME',
  InterchangeFeesAmount: 'INTERCHANGE_FEES_AMOUNT',
  InterchangeFeesCount: 'INTERCHANGE_FEES_COUNT',
  MiscAdjustmentsAmount: 'MISC_ADJUSTMENTS_AMOUNT',
  MiscCreditsAmount: 'MISC_CREDITS_AMOUNT',
  MiscCreditsCount: 'MISC_CREDITS_COUNT',
  MiscDebitsAmount: 'MISC_DEBITS_AMOUNT',
  MiscDebitsCount: 'MISC_DEBITS_COUNT',
  NetworkFeesAmount: 'NETWORK_FEES_AMOUNT',
  NetworkFeesCount: 'NETWORK_FEES_COUNT',
  OrganizationId: 'ORGANIZATION_ID',
  PartnerFeesAmount: 'PARTNER_FEES_AMOUNT',
  PartnerFeesCount: 'PARTNER_FEES_COUNT',
  PaymentBrand: 'PAYMENT_BRAND',
  ProcessingNetwork: 'PROCESSING_NETWORK',
  ProcessorFeesAmount: 'PROCESSOR_FEES_AMOUNT',
  ProcessorFeesCount: 'PROCESSOR_FEES_COUNT',
  RefundsCount: 'REFUNDS_COUNT',
  RefundsGrossAmount: 'REFUNDS_GROSS_AMOUNT',
  ReservesNetAmount: 'RESERVES_NET_AMOUNT',
  SalesCount: 'SALES_COUNT',
  SalesGrossAmount: 'SALES_GROSS_AMOUNT',
  SalesNetAmount: 'SALES_NET_AMOUNT',
  ServiceFeesAmount: 'SERVICE_FEES_AMOUNT',
  ServiceFeesCount: 'SERVICE_FEES_COUNT',
  SurchargeAmount: 'SURCHARGE_AMOUNT',
  SurchargeCount: 'SURCHARGE_COUNT',
  ThirdPartyPaymentAmount: 'THIRD_PARTY_PAYMENT_AMOUNT',
  TransactionActivityDate: 'TRANSACTION_ACTIVITY_DATE',
  TransactorFeesAmount: 'TRANSACTOR_FEES_AMOUNT',
} as const;

export type FundingSummaryFields = (typeof FundingSummaryFields)[keyof typeof FundingSummaryFields];
export interface FundingSummaryFilterInput {
  acceptorId?: InputMaybe<GuidFilterInput>;
  fundingCurrency?: InputMaybe<StringFilterInput>;
  fundsReleaseDate?: InputMaybe<DateRangeFilterInput>;
  fundsTransferId?: InputMaybe<GuidFilterInput>;
  paymentBrand?: InputMaybe<EnumFilterInputOfPaymentBrandInput>;
  transactionActivityDate?: InputMaybe<DateRangeFilterInput>;
}

export const FundingSummarySortField = {
  FundingCurrency: 'FUNDING_CURRENCY',
  FundingNetAmount: 'FUNDING_NET_AMOUNT',
  FundsReleaseDate: 'FUNDS_RELEASE_DATE',
  FundsTransferId: 'FUNDS_TRANSFER_ID',
  PaymentBrand: 'PAYMENT_BRAND',
  ProcessingNetwork: 'PROCESSING_NETWORK',
  TransactionActivityDate: 'TRANSACTION_ACTIVITY_DATE',
} as const;

export type FundingSummarySortField =
  (typeof FundingSummarySortField)[keyof typeof FundingSummarySortField];
export interface FundingSummarySortTypeInput {
  field: FundingSummarySortField;
  sortDirection: SortingEnumType;
}

export interface FundingTransaction {
  __typename?: 'FundingTransaction';
  acceptor: Acceptor;
  /** The amount of convenience fees associated with this transaction */
  convenienceFeesAmount: Scalars['Decimal']['output'];
  /** The currency of the funded transaction, formatted in ISO 4217 alphabetic code. */
  fundingCurrency: Scalars['String']['output'];
  /** The total amount of the transaction, in the funding currency. */
  fundingGrossAmount: Scalars['Decimal']['output'];
  /** The net funded amount after fees, in the funding currency. */
  fundingNetAmount: Scalars['Decimal']['output'];
  /** The date that Tesouro releases the funds from its bank account to the recipient's bank account. */
  fundsReleaseDate?: Maybe<Scalars['Date']['output']>;
  /** A value created by Tesouro and sent with the funds transfer to the recipient's bank for display on the bank statement. It includes information on who sent the money and the purpose of the payment. The recipient can use this value to help with bank and transaction reconciliation. */
  fundsTransferDescriptor?: Maybe<Scalars['String']['output']>;
  /** A unique identifier created by Tesouro and assigned to the transfer of money to a bank account, that identifies a cohort of funded transactions making up the transfer. */
  fundsTransferId?: Maybe<Scalars['UUID']['output']>;
  /** The amount of interchange associated with this transaction */
  interchangeFeesAmount: Scalars['Decimal']['output'];
  /** Indicates if the partner fee was adjusted at the transaction level. */
  isPartnerFeeAdjusted: Scalars['Boolean']['output'];
  /** The itemized network fees associated with this transaction */
  networkFeesAmount: Scalars['Decimal']['output'];
  organization: Organization;
  /** The amount of partner fees associated with this transaction */
  partnerFeesAmount: Scalars['Decimal']['output'];
  paymentTransaction: PaymentTransaction;
  /** The itemized processor fees associated with this transaction */
  processorFeesAmount: Scalars['Decimal']['output'];
  /** The amount of service fees associated with this transaction */
  serviceFeesAmount: Scalars['Decimal']['output'];
  /** The amount of surcharge associated with this transaction */
  surchargeAmount: Scalars['Decimal']['output'];
  /**
   * The amount of partner fees associated with this transaction
   * @deprecated Use partnerFeesAmount instead.
   */
  transactorFeesAmount: Scalars['Decimal']['output'];
}

export interface FundingTransactionAsyncReportInput {
  /** The fields to include in the report. */
  fields: Array<FundingTransactionFields>;
  /** Tesouro names the files so that the filename is contextual to the data the report contains, e.g., acceptorName_reportType_YYYYMM-DD-to-YYYMMDD_createdOnDate. If you prefer to override Tesouro's file naming and specify your own format, add it here. */
  fileName?: InputMaybe<Scalars['String']['input']>;
  /** The type of file that the report is saved as, e.g. CSV */
  fileType: FileTypes;
}

export interface FundingTransactionCollection {
  __typename?: 'FundingTransactionCollection';
  items: Array<FundingTransaction>;
  pageInfo: PageInfo;
}

export const FundingTransactionFields = {
  AcceptorId: 'ACCEPTOR_ID',
  AcceptorName: 'ACCEPTOR_NAME',
  AcceptorReference: 'ACCEPTOR_REFERENCE',
  AccountNumberEndingIn: 'ACCOUNT_NUMBER_ENDING_IN',
  AccountNumberFirstSix: 'ACCOUNT_NUMBER_FIRST_SIX',
  AccountNumberLastFour: 'ACCOUNT_NUMBER_LAST_FOUR',
  AccountOwnerName: 'ACCOUNT_OWNER_NAME',
  AccountOwnerType: 'ACCOUNT_OWNER_TYPE',
  AccountType: 'ACCOUNT_TYPE',
  AcquirerReferenceNumber: 'ACQUIRER_REFERENCE_NUMBER',
  AcquirerToken: 'ACQUIRER_TOKEN',
  ApprovedAmount: 'APPROVED_AMOUNT',
  AvsResponse: 'AVS_RESPONSE',
  BusinessApplicationId: 'BUSINESS_APPLICATION_ID',
  CaptureOnApproval: 'CAPTURE_ON_APPROVAL',
  CardholderFirstName: 'CARDHOLDER_FIRST_NAME',
  CardholderLastName: 'CARDHOLDER_LAST_NAME',
  CardExpiration: 'CARD_EXPIRATION',
  CashbackAmount: 'CASHBACK_AMOUNT',
  ConsumerType: 'CONSUMER_TYPE',
  ConvenienceFeesAmount: 'CONVENIENCE_FEES_AMOUNT',
  ConveyedStatus: 'CONVEYED_STATUS',
  CustomerReference: 'CUSTOMER_REFERENCE',
  CustomerStatementMemo: 'CUSTOMER_STATEMENT_MEMO',
  DiscountAmount: 'DISCOUNT_AMOUNT',
  DutyAmount: 'DUTY_AMOUNT',
  EntryMode: 'ENTRY_MODE',
  FundingCurrency: 'FUNDING_CURRENCY',
  FundingGrossAmount: 'FUNDING_GROSS_AMOUNT',
  FundingNetAmount: 'FUNDING_NET_AMOUNT',
  FundsReleaseDate: 'FUNDS_RELEASE_DATE',
  FundsTransferDescriptor: 'FUNDS_TRANSFER_DESCRIPTOR',
  FundsTransferId: 'FUNDS_TRANSFER_ID',
  GratuityAmount: 'GRATUITY_AMOUNT',
  InterchangeFeesAmount: 'INTERCHANGE_FEES_AMOUNT',
  IssuingBankCountry: 'ISSUING_BANK_COUNTRY',
  IssuingBankName: 'ISSUING_BANK_NAME',
  IsPartnerFeeAdjusted: 'IS_PARTNER_FEE_ADJUSTED',
  LineItemDetails: 'LINE_ITEM_DETAILS',
  LocalTax: 'LOCAL_TAX',
  MerchantCategory: 'MERCHANT_CATEGORY',
  NameVerification: 'NAME_VERIFICATION',
  NationalTax: 'NATIONAL_TAX',
  NetworkApprovalCode: 'NETWORK_APPROVAL_CODE',
  NetworkAvsResponse: 'NETWORK_AVS_RESPONSE',
  NetworkFeesAmount: 'NETWORK_FEES_AMOUNT',
  NetworkResponseCode: 'NETWORK_RESPONSE_CODE',
  NetworkResponseMessage: 'NETWORK_RESPONSE_MESSAGE',
  OrderReference: 'ORDER_REFERENCE',
  OrganizationId: 'ORGANIZATION_ID',
  PartnerFeesAmount: 'PARTNER_FEES_AMOUNT',
  PaymentBrand: 'PAYMENT_BRAND',
  PaymentChannel: 'PAYMENT_CHANNEL',
  PaymentFundingSource: 'PAYMENT_FUNDING_SOURCE',
  PaymentId: 'PAYMENT_ID',
  PaymentMethodType: 'PAYMENT_METHOD_TYPE',
  PaymentProduct: 'PAYMENT_PRODUCT',
  ProcessingNetwork: 'PROCESSING_NETWORK',
  ProcessorFeesAmount: 'PROCESSOR_FEES_AMOUNT',
  ProcessorResponseCode: 'PROCESSOR_RESPONSE_CODE',
  ProcessorResponseMessage: 'PROCESSOR_RESPONSE_MESSAGE',
  ResponseType: 'RESPONSE_TYPE',
  RoutingNumber: 'ROUTING_NUMBER',
  SecurityCodeNetworkResponse: 'SECURITY_CODE_NETWORK_RESPONSE',
  SecurityCodeNormalizedResponse: 'SECURITY_CODE_NORMALIZED_RESPONSE',
  ServiceFeesAmount: 'SERVICE_FEES_AMOUNT',
  ShippingAmount: 'SHIPPING_AMOUNT',
  ShipFromAddress_01: 'SHIP_FROM_ADDRESS_01',
  ShipFromAddress_02: 'SHIP_FROM_ADDRESS_02',
  ShipFromAddress_03: 'SHIP_FROM_ADDRESS_03',
  ShipFromCity: 'SHIP_FROM_CITY',
  ShipFromCountry: 'SHIP_FROM_COUNTRY',
  ShipFromPostalCode: 'SHIP_FROM_POSTAL_CODE',
  ShipFromStateOrProvince: 'SHIP_FROM_STATE_OR_PROVINCE',
  ShipToAddress_01: 'SHIP_TO_ADDRESS_01',
  ShipToAddress_02: 'SHIP_TO_ADDRESS_02',
  ShipToAddress_03: 'SHIP_TO_ADDRESS_03',
  ShipToCity: 'SHIP_TO_CITY',
  ShipToCountry: 'SHIP_TO_COUNTRY',
  ShipToDetailsIndicator: 'SHIP_TO_DETAILS_INDICATOR',
  ShipToPostalCode: 'SHIP_TO_POSTAL_CODE',
  ShipToStateOrProvince: 'SHIP_TO_STATE_OR_PROVINCE',
  SubtotalAmount: 'SUBTOTAL_AMOUNT',
  SurchargeAmount: 'SURCHARGE_AMOUNT',
  TaxIdentificationNumber: 'TAX_IDENTIFICATION_NUMBER',
  TotalTax: 'TOTAL_TAX',
  TraceNumber: 'TRACE_NUMBER',
  TransactionActivityDate: 'TRANSACTION_ACTIVITY_DATE',
  TransactionAmount: 'TRANSACTION_AMOUNT',
  TransactionCurrency: 'TRANSACTION_CURRENCY',
  TransactionId: 'TRANSACTION_ID',
  TransactionReference: 'TRANSACTION_REFERENCE',
  TransactionTsUtc: 'TRANSACTION_TS_UTC',
  TransactionType: 'TRANSACTION_TYPE',
  TransactorFeesAmount: 'TRANSACTOR_FEES_AMOUNT',
  TransferEffectiveDate: 'TRANSFER_EFFECTIVE_DATE',
} as const;

export type FundingTransactionFields =
  (typeof FundingTransactionFields)[keyof typeof FundingTransactionFields];
export interface FundingTransactionFilterInput {
  acceptorId?: InputMaybe<GuidFilterInput>;
  fundsReleaseDate?: InputMaybe<DateRangeFilterInput>;
  fundsTransferId?: InputMaybe<GuidFilterInput>;
  paymentBrand?: InputMaybe<EnumFilterInputOfPaymentBrandInput>;
  transactionActivityDate?: InputMaybe<DateRangeFilterInput>;
}

export interface FundingTransactionInput {
  paging: PagingInput;
  where: FundingTransactionFilterInput;
}

export interface FundingTransactionsAsyncInput {
  asyncReportsDetailsInput: AsyncReportsDetailsInput;
  fundingTransactionReportInput: FundingTransactionAsyncReportInput;
  where: FundingTransactionFilterInput;
}

export interface FundsTransfer {
  __typename?: 'FundsTransfer';
  acquirerId: Scalars['UUID']['output'];
  bankAccount: BankAccount;
  createdDateTime?: Maybe<Scalars['DateTime']['output']>;
  estimatedBankPostingDate?: Maybe<Scalars['Date']['output']>;
  fundsReleaseDate?: Maybe<Scalars['Date']['output']>;
  fundsTransferDescriptor?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  organizationId: Scalars['UUID']['output'];
  plannedFundsTransferDate: Scalars['Date']['output'];
}

export interface FundsTransferIdFeeFilterInput {
  feeType?: InputMaybe<EnumFilterInputOfAllocationFeeTypeInput>;
  fundsTransferId?: InputMaybe<GuidFilterInput>;
}

export interface GenericPaymentMethod extends PaymentMethod {
  __typename?: 'GenericPaymentMethod';
  /** The acquirer token on file for this payment card, if the card has been used before and the transactor is subscribed to Tesouro's tokenization services. Otherwise, this field's value will be null. */
  acquirerToken?: Maybe<Scalars['String']['output']>;
  /** The type of payment method used by the customer to submit the transaction, e.g., Card, Bank transfer, etc. */
  type?: Maybe<PaymentMethodType>;
}

export interface GenericPaymentTransaction extends PaymentTransaction {
  __typename?: 'GenericPaymentTransaction';
  acceptor: Acceptor;
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff. */
  activityDate?: Maybe<Scalars['Date']['output']>;
  /** Components of the requested amount that may or may not have been provided by the presenter on the payment transaction request. */
  amountDetails?: Maybe<AmountDetails>;
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /** Aggregate information for assessed fees */
  fees?: Maybe<FeeDetails>;
  /** A unique identifier assigned by Tesouro for every transaction request received. */
  id: Scalars['UUID']['output'];
  /** Line items associated with the payment transaction. */
  lineItems?: Maybe<Array<LineItem>>;
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  merchantCategory?: Maybe<Scalars['String']['output']>;
  organization: Organization;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Refers to the various options available for customers to make payments when purchasing a product or service. */
  paymentMethod: PaymentMethod;
  /** The payment network that the transaction was sent across, which may be unaffiliated with the card brand. */
  processingNetwork: Network;
  /** A response code provided by Tesouro identifying the specific approval or decline reason. */
  processorResponseCode: ProcessorResponseCode;
  /** A human readable description of the authorization response code. e.g., Insufficient funds. */
  processorResponseMessage: Scalars['String']['output'];
  /** A unique transaction identifier created by the entity holding the direct relationship with the Acceptor. Tesouro uses this identifier to manage idempotency. */
  reference?: Maybe<Scalars['String']['output']>;
  /** The result of the authorization request, e.g., Approved or Declined. */
  responseType?: Maybe<ResponseType>;
  /** The tax identification number (TIN) is a unique identifier created by the national government and associated with the acceptor at the time the transaction was submitted */
  taxIdentificationNumber?: Maybe<Scalars['String']['output']>;
  /** The various tax amounts collected on the payment transaction. */
  taxes?: Maybe<Taxes>;
  /** The date and time that Tesouro received the transaction, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime: Scalars['DateTime']['output'];
  /** The type of payment transaction, e.g., Authorization, Capture, Sale, Refund, Reversal, etc. */
  transactionType: PaymentTransactionType;
}

export interface GuidFilterInput {
  eq?: InputMaybe<Scalars['UUID']['input']>;
  in?: InputMaybe<Array<Scalars['UUID']['input']>>;
}

/** Interface for declined transaction responses from Tesouro. */
export interface IDeclineResponse {
  /** When an authorization is declined, Tesouro will provide advice on what can be done to remedy and prevent this type of response from occurring in the future. */
  advice: Scalars['String']['output'];
  /** Specifies the type of response, e.g. SOFT_DECLINE, HARD_DECLINE, REFERRAL */
  declineType: DeclineType;
  /** A detailed description of the response code. e.g., Insufficient funds. */
  message: Scalars['String']['output'];
}

/** Base Tesouro error interface. */
export interface IGraphQlError {
  /**
   * The date and time, in UTC, that the error occured. Formatted as 2024-03-27T02:40:00Z.
   * @deprecated Use errorDateTime instead.
   */
  dateTimeUtc: Scalars['DateTime']['output'];
  /** The date and time, in UTC, that the error occured. Formatted as 2024-03-27T02:40:00Z. */
  errorDateTime: Scalars['DateTime']['output'];
  /** A human readable description of the error. */
  message: Scalars['String']['output'];
  /** Tesouro response code indicating the error. */
  processorResponseCode: ProcessorResponseCode;
  /** Unique ID for the transaction assigned by Tesouro. */
  transactionId: Scalars['UUID']['output'];
}

/** The time zone, standardized by the Internet Assigned Numbers Authority (IANA). IANA time zones follow this convention: {Area}/{Location}, where an area corresponds to a continent or an ocean and the location to a location within the continent. */
export const IanaTimezone = {
  /** The America/Chicago IANA time zone. */
  AmericaChicago: 'AMERICA_CHICAGO',
  /** The America/Denver IANA time zone. */
  AmericaDenver: 'AMERICA_DENVER',
  /** The America/Los_Angeles IANA time zone. */
  AmericaLosAngeles: 'AMERICA_LOS_ANGELES',
  /** The America/New_York IANA time zone. */
  AmericaNewYork: 'AMERICA_NEW_YORK',
} as const;

export type IanaTimezone = (typeof IanaTimezone)[keyof typeof IanaTimezone];
export interface IncrementAuthorizationAmountDetails {
  __typename?: 'IncrementAuthorizationAmountDetails';
  /** The approved amount from the network. */
  approvedAmount: Scalars['Decimal']['output'];
  /** The purchasing currency code of the transaction. */
  currency: TransactionAmountCurrencyCode;
  /** The original request amount. */
  requestedAmount: Scalars['Decimal']['output'];
}

export interface IncrementAuthorizationAmountInput {
  /** The base transaction amount intended to be collected by this payment not including any cashback, gratuity, fees, or taxes. */
  baseAmount?: InputMaybe<Scalars['DecimalAmount']['input']>;
  /** The cashback amount. */
  cashBackAmount?: InputMaybe<Scalars['DecimalAmount']['input']>;
  /** The purchasing currency code of the request amount. */
  currency: TransactionAmountCurrencyCode;
  /** The gratuity amount. */
  gratuityAmount?: InputMaybe<Scalars['DecimalAmount']['input']>;
  /** The amount to increment the original authorization by. A positive decimal with precision depending on transaction currency. For example: $10.00 would be 10.00 or 10. */
  totalAmount: Scalars['Decimal']['input'];
}

export interface IncrementAuthorizationApproval extends IncrementAuthorizationResponse {
  __typename?: 'IncrementAuthorizationApproval';
  /** The date Tesouro received the transaction based on acceptor cutoff time */
  activityDate: Scalars['Date']['output'];
  /** Details related to the card used on the transaction */
  cardDetails?: Maybe<CardInformation>;
  /**
   * Difference between request receipt and response in milliseconds.
   * @deprecated New durations coming soon.
   */
  duration: Scalars['Int']['output'];
  /** Amount information will be returned here. */
  incrementAuthorizationAmountDetails: IncrementAuthorizationAmountDetails;
  /** Result of Tesouro's idempotency check. If the transaction reference matches that of another transaction from that presenter it will be treated as a duplicate. */
  isDuplicateRequest: Scalars['Boolean']['output'];
  /** A six-digit code returned from the network on APPROVED authorizations, and displayed on the customer's receipt. If the authorization is declined, this field will be blank. */
  networkApprovalCode: Scalars['String']['output'];
  /** The response code from the network. */
  networkResponseDetails: NetworkResponseDetails;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** The UTC date and time the transaction was received by Tesouro. */
  timestampUtc: Scalars['DateTime']['output'];
  /** Details associated with the token generated on a tokenization request. */
  tokenDetails?: Maybe<TokenDetails>;
  /** A unique identifier created by Tesouro and assigned to the transaction. */
  transactionId: Scalars['UUID']['output'];
}

export interface IncrementAuthorizationDecline extends IncrementAuthorizationResponse {
  __typename?: 'IncrementAuthorizationDecline';
  /** The date Tesouro received the transaction based on acceptor cutoff time */
  activityDate: Scalars['Date']['output'];
  /** Details related to the card used on the transaction */
  cardDetails?: Maybe<CardInformation>;
  /** Specifies the type of response, e.g. SOFT_DECLINE, HARD_DECLINE, REFERRAL. */
  declineType: DeclineType;
  /**
   * Difference between request receipt and response in milliseconds.
   * @deprecated New durations coming soon.
   */
  duration: Scalars['Int']['output'];
  /** Result of Tesouro's idempotency check. If the transaction reference matches that of another transaction from that presenter it will be treated as a duplicate. */
  isDuplicateRequest: Scalars['Boolean']['output'];
  /** A detailed description of the response code. e.g., Insufficient funds. */
  message: Scalars['String']['output'];
  /** The response code from the network. */
  networkResponseDetails: NetworkResponseDetails;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** When an authorization is declined, Tesouro will provide advice on what can be done to remedy, and/or prevent this type of response from occurring in the future. */
  processorAdvice: Scalars['String']['output'];
  /** The UTC date and time the transaction was received by Tesouro. */
  timestampUtc: Scalars['DateTime']['output'];
  /** Details associated with the token generated on a tokenization request. */
  tokenDetails?: Maybe<TokenDetails>;
  /** A unique identifier created by Tesouro and assigned to the transaction. */
  transactionId: Scalars['UUID']['output'];
}

export type IncrementAuthorizationError =
  | InternalServiceError
  | PriorPaymentNotFoundError
  | RuleInViolationError
  | SyntaxOnNetworkResponseError
  | TimeoutOnNetworkResponseError
  | ValidationFailureError;

/** Top-level input fields for creating an incremental transaction for a previous authorization. */
export interface IncrementAuthorizationInput {
  /** A unique, 36 character identifier created by Tesouro and assigned to the entity providing the goods or services to the cardholder, such as a Merchant, a Submerchant of a Payment Facilitator, a Seller within a Marketplace, or a Biller of a Consumer Bill Payment Service Provider (CBPS). Historically, processors have called this identifier the Merchant ID (or MID), Outlet ID, or Customer number. */
  acceptorId: Scalars['UUID']['input'];
  /** The unique 'paymentId' of the previously authorized payment that is to be incremented. */
  paymentId: Scalars['UUID']['input'];
  /** The amount of the incremental authorization. Example: If the initial authorization was $99, and you are submitting an incremental authorization for $20, you will input the incremental amount. e.g. 'totalAmount: 20.00' */
  transactionAmountDetails: IncrementAuthorizationAmountInput;
  /** A unique identifier created by the entity holding the direct relationship with the Acceptor, and used by that entity for reconciliation and transaction search. Tesouro uses this identifier to manage idempotency. */
  transactionReference: Scalars['Max36Text']['input'];
}

export interface IncrementAuthorizationPayload {
  __typename?: 'IncrementAuthorizationPayload';
  errors?: Maybe<Array<IncrementAuthorizationError>>;
  incrementAuthorizationResponse?: Maybe<IncrementAuthorizationResponse>;
}

export interface IncrementAuthorizationResponse {
  /** The date Tesouro received the transaction based on acceptor cutoff time */
  activityDate: Scalars['Date']['output'];
  /** Details related to the card used on the transaction */
  cardDetails?: Maybe<CardInformation>;
  /**
   * Difference between request receipt and response in milliseconds.
   * @deprecated New durations coming soon.
   */
  duration: Scalars['Int']['output'];
  /** Result of Tesouro's idempotency check. If the transaction reference matches that of another transaction from that presenter it will be treated as a duplicate. */
  isDuplicateRequest: Scalars['Boolean']['output'];
  /** The response code from the network. */
  networkResponseDetails: NetworkResponseDetails;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** The UTC date and time the transaction was received by Tesouro. */
  timestampUtc: Scalars['DateTime']['output'];
  /** Details associated with the token generated on a tokenization request. */
  tokenDetails?: Maybe<TokenDetails>;
  /** A unique identifier created by Tesouro and assigned to the transaction. */
  transactionId: Scalars['UUID']['output'];
}

export interface IncrementalAuthorization {
  acceptor: Acceptor;
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff. */
  activityDate?: Maybe<Scalars['Date']['output']>;
  /** The result of the address verification service (AVS), which checks if the cardholder address submitted with the transaction matches what is on record with the issuer. */
  addressVerification?: Maybe<AvsResponse>;
  /** Components of the requested amount that may or may not have been provided by the presenter on the payment transaction request. */
  amountDetails?: Maybe<AmountDetails>;
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /** The currency specified on the transaction request, in ISO 4217 alpha currency code format. */
  currency?: Maybe<Scalars['String']['output']>;
  /** Aggregate information for assessed fees */
  fees?: Maybe<FeeDetails>;
  /** A unique identifier assigned by Tesouro for every transaction request received. */
  id: Scalars['UUID']['output'];
  /** Line items associated with the payment transaction. */
  lineItems?: Maybe<Array<LineItem>>;
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  merchantCategory?: Maybe<Scalars['String']['output']>;
  /** The result of the name verification service, which checks if the cardholder name submitted with the transaction matches what is on record with the issuer. */
  nameVerification?: Maybe<NameVerificationResponseCode>;
  /** A response code provided by the card network identifying the specific approval or decline reason. */
  networkResponseCode?: Maybe<Scalars['String']['output']>;
  /** A unique value created by the card network and assigned to the transaction and returned to Tesouro in the authorization response. The card network uses this value to maintain an audit trail throughout the life cycle of the transaction and all related transactions, such as reversals, adjustments, confirmations and charge-backs. */
  networkTransactionId?: Maybe<Scalars['String']['output']>;
  /** Information concerning the order placed by the customer. */
  order: Order;
  organization: Organization;
  /** The card-present or card-not-present channel from which the customer makes a payment, e.g., In-store using a physical card terminal, online, or over the phone or through mail order. */
  paymentChannel: PaymentChannel;
  /** The means by which the payment details are captured, e.g., Card swipe, contactless "tap", chip entry "dip", keyed, etc. */
  paymentEntryMode: PaymentEntryMode;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Refers to the various options available for customers to make payments when purchasing a product or service. */
  paymentMethod: PaymentMethod;
  /** The payment network that the transaction was sent across, which may be unaffiliated with the card brand. */
  processingNetwork: Network;
  /** A response code provided by Tesouro identifying the specific approval or decline reason. */
  processorResponseCode: ProcessorResponseCode;
  /** A human readable description of the authorization response code. e.g., Insufficient funds. */
  processorResponseMessage: Scalars['String']['output'];
  /** A unique transaction identifier created by the entity holding the direct relationship with the Acceptor. Tesouro uses this identifier to manage idempotency. */
  reference?: Maybe<Scalars['String']['output']>;
  /** The transaction amount submitted with the authorization request. */
  requestedAmount: Scalars['Decimal']['output'];
  /** The result of the authorization request, e.g., Approved or Declined. */
  responseType?: Maybe<ResponseType>;
  /** The result of the card security code verification service, which checks if the CVV2/CVC2/CID submitted with the transaction matches what is on record with the issuer. */
  securityCodeVerification?: Maybe<SecurityCodeResponse>;
  /** The tax identification number (TIN) is a unique identifier created by the national government and associated with the acceptor at the time the transaction was submitted */
  taxIdentificationNumber?: Maybe<Scalars['String']['output']>;
  /** The various tax amounts collected on the payment transaction. */
  taxes?: Maybe<Taxes>;
  /** The date and time that Tesouro received the transaction, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime: Scalars['DateTime']['output'];
  /** The type of payment transaction, e.g., Authorization, Capture, Sale, Refund, Reversal, etc. */
  transactionType: PaymentTransactionType;
}

export type InitiateBankTransferError =
  | AcceptorNotFoundError
  | InternalServiceError
  | InvalidTokenError
  | RouteNotFoundError
  | RuleInViolationError
  | TimeoutOnNetworkResponseError
  | TokenNotFoundError
  | ValidationFailureError;

/** Input for initiating a bank transfer transaction. */
export interface InitiateBankTransferInput {
  /** A unique, 36 character identifier created by Tesouro and assigned to the entity providing the goods or services to the cardholder, such as a Merchant, a Submerchant of a Payment Facilitator, a Seller within a Marketplace, or a Biller of a Consumer Bill Payment Service Provider (CBPS). Historically, processors have called this identifier the Merchant ID (or MID), Outlet ID, or Customer number. */
  acceptorId: Scalars['UUID']['input'];
  /** An amount that adjusts the partner fee for this transaction. */
  adjustedPartnerFeeAmount?: InputMaybe<Scalars['Decimal']['input']>;
  /** Specifies the total amount of the transaction and its currency. */
  amountDetails: BankAmountDetailsInput;
  /** Details pertaining to the customer's billing address. */
  billToAddress?: InputMaybe<AddressDetailsInput>;
  /** How the consumer interacts with the acceptor. Defaults to ECOMMERCE if not provided. */
  channel?: PaymentChannel;
  /** Details pertaining to the customer's order. */
  orderDetails?: InputMaybe<OrderDetailsInput>;
  /** Details regarding the payment method. */
  paymentMethodDetails: BankPaymentMethodInput;
  /** A unique identifier created by the entity holding the direct relationship with the Acceptor, and used by that entity for reconciliation and transaction search. Tesouro uses this identifier to manage idempotency. */
  transactionReference: Scalars['Max36Text']['input'];
}

export interface InitiateBankTransferPayload {
  __typename?: 'InitiateBankTransferPayload';
  bankTransferResponse?: Maybe<BankTransferResponse>;
  errors?: Maybe<Array<InitiateBankTransferError>>;
}

export interface InternalServiceError extends IGraphQlError {
  __typename?: 'InternalServiceError';
  /**
   * The date and time, in UTC, that the error occured. Formatted as 2024-03-27T02:40:00Z.
   * @deprecated Use errorDateTime instead.
   */
  dateTimeUtc: Scalars['DateTime']['output'];
  /** The date and time, in UTC, that the error occured. Formatted as 2024-03-27T02:40:00Z. */
  errorDateTime: Scalars['DateTime']['output'];
  /** A human readable description of the error. */
  message: Scalars['String']['output'];
  /** Tesouro response code indicating the error. */
  processorResponseCode: ProcessorResponseCode;
  /** Unique ID for the transaction assigned by Tesouro. */
  transactionId: Scalars['UUID']['output'];
}

export interface InvalidAssignmentError extends Error {
  __typename?: 'InvalidAssignmentError';
  currentAssignment: DisputeWorkflowAssignment;
  message: Scalars['String']['output'];
  validAssignments: Array<DisputeWorkflowAssignment>;
}

/** Occurs when an acquirer token deTokenizes into a payment method that is not supportedby the current action. */
export interface InvalidTokenError extends IGraphQlError {
  __typename?: 'InvalidTokenError';
  /**
   * The date and time, in UTC, that the error occured. Formatted as 2024-03-27T02:40:00Z.
   * @deprecated Use errorDateTime instead.
   */
  dateTimeUtc: Scalars['DateTime']['output'];
  /** The type of payment method behind the token. */
  deTokenizedPaymentMethodType: Scalars['String']['output'];
  /** The date and time, in UTC, that the error occured. Formatted as 2024-03-27T02:40:00Z. */
  errorDateTime: Scalars['DateTime']['output'];
  expectedPaymentMethodType: Scalars['String']['output'];
  /** A human readable description of the error. */
  message: Scalars['String']['output'];
  /** Tesouro response code indicating the error. */
  processorResponseCode: ProcessorResponseCode;
  /** Unique ID for the transaction assigned by Tesouro. */
  transactionId: Scalars['UUID']['output'];
}

export interface ItemizedFee {
  __typename?: 'ItemizedFee';
  /** The amount tied to the billable event on which the fee is applied. */
  billableEventAmount: Scalars['Decimal']['output'];
  /** The total amount of the fee, calculated as [(billableEventAmount * rateMultiplier) + rateUnitAmount]. e.g., $100.00 * 0.035 + $0.10 = $3.60 */
  calculatedAmount: Scalars['Decimal']['output'];
  /** The currency of the fee amount. */
  currency: Scalars['String']['output'];
  /** The name of the itemized fee or allocation. */
  name: Scalars['String']['output'];
  /** The variable rate, expressed as a decimal, used to calculate the total fee amount. e.g., 3.50% would be expressed as 0.035 */
  rateMultiplier: Scalars['Decimal']['output'];
  /** The fixed amount per transaction used in the rate to calculate the total fee amount. e.g., $0.10 per transaction. */
  rateUnitAmount: Scalars['Decimal']['output'];
  /** The type of fee or allocation, e.g.. Interchange, Network fee, Processor fee, or Partner fee */
  type: AllocationType;
}

export interface JwtTokenMissingError extends Error {
  __typename?: 'JwtTokenMissingError';
  advice: Scalars['String']['output'];
  code: Scalars['String']['output'];
  message: Scalars['String']['output'];
}

export interface LineItem {
  __typename?: 'LineItem';
  /** A specific code used to classify and categorize the type of goods and services being purchased. */
  commodityCode?: Maybe<Scalars['String']['output']>;
  /** Description of the goods or services. */
  description?: Maybe<Scalars['String']['output']>;
  /** Details regarding any discounts applied to the line item. */
  discountAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The total amount of the item. Calculated as [Unit price * Unit quantity] */
  lineItemAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The supplier's unique product identifier, inventory number, or UPC code used to identity a specific product. */
  productCode?: Maybe<Scalars['String']['output']>;
  /** A SKU, or Stock Keeping Unit, is a unique alphanumeric code assigned by a retailer to identify and track each distinct product or product variation within their inventory. */
  productSku?: Maybe<Scalars['String']['output']>;
  /** Tax details applicable to the individual line item. If the item is not taxable, these fields should be set to null. */
  taxDetails?: Maybe<LineItemTaxes>;
  /** The metric used for understanding the quantity of a given line item. e.g., for quantities, use "each" or "piece" for length, use "meter" or "inch" for volume, use "liter" or "gallon" and for weight, use "gram" or "pound", etc. */
  unitOfMeasure?: Maybe<Scalars['String']['output']>;
  /** The "per unit" price of the line item. */
  unitPrice?: Maybe<Scalars['Decimal']['output']>;
  /** The number of units included in the line item. */
  unitQuantity?: Maybe<Scalars['Decimal']['output']>;
}

/** Discount details for the line item. */
export interface LineItemDiscountInput {
  /** An amount discounted at the individual line item level. */
  amount: Scalars['Decimal']['input'];
  /** The rate of the discount, formatted as a decimal. e.g., 5.00% will be formatted as 0.05 */
  rate?: InputMaybe<Scalars['Decimal']['input']>;
  /** If taxes were calculated, you can specify if they were calculated before or after the discount was applied. */
  taxCalculation?: InputMaybe<TaxCalculation>;
}

/** Line-item details about what was purchased with a given order. It includes items, quantity, price, product codes, and other pertinent details. */
export interface LineItemInput {
  /** A specific code used to classify and categorize the type of goods and services being purchased. */
  commodityCode: Scalars['String']['input'];
  /** Description of the goods or services. */
  description: Scalars['String']['input'];
  /** Details regarding any discounts applied to the line item. */
  discount?: InputMaybe<LineItemDiscountInput>;
  /** The total amount of the item. Calculated as [Unit price * Unit quantity] */
  lineItemAmount: Scalars['Decimal']['input'];
  /** The supplier's unique product identifier, inventory number, or UPC code used to identity a specific product. */
  productCode: Scalars['String']['input'];
  /** A SKU, or Stock Keeping Unit, is a unique alphanumeric code assigned by a retailer to identify and track each distinct product or product variation within their inventory. */
  productSku: Scalars['String']['input'];
  /** Tax details applicable to the individual line item. If the item is not taxable, these fields should be set to null. */
  taxes?: InputMaybe<LineItemTaxesInput>;
  /** The metric used for understanding the quantity of a given line item. e.g., for quantities, use "each" or "piece" for length, use "meter" or "inch" for volume, use "liter" or "gallon" and for weight, use "gram" or "pound", etc. */
  unitOfMeasure: Scalars['String']['input'];
  /** The "per unit" price of the line item. */
  unitPrice: Scalars['Decimal']['input'];
  /** The number of units included in the line item. */
  unitQuantity: Scalars['Int']['input'];
}

/** Tax details. */
export interface LineItemTaxInput {
  /** The tax amount. */
  amount: Scalars['Decimal']['input'];
  /** The rate of the tax formatted as a decimal. e.g., 5.10% would be formatted as 0.051. */
  rate?: InputMaybe<Scalars['Decimal']['input']>;
}

export interface LineItemTaxes {
  __typename?: 'LineItemTaxes';
  /** The total amount of local taxes collected. */
  localAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The total amount of national taxes collected. */
  nationalAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The total amount of taxes collected. */
  totalAmount?: Maybe<Scalars['Decimal']['output']>;
}

export interface LineItemTaxesInput {
  localTax?: InputMaybe<LineItemTaxInput>;
  nationalTax?: InputMaybe<LineItemTaxInput>;
  totalAmount: Scalars['Decimal']['input'];
}

export interface MerchantCategory {
  __typename?: 'MerchantCategory';
  /** Unique ISO four digit value used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  code: Scalars['String']['output'];
}

export interface MerchantCategoryInput {
  /** Unique ISO four digit value used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  code: Scalars['String']['input'];
}

/** If the original customer initiated transaction was processed on another platform, you can present details from that payment here to be included in the merchant initiated transaction request to the network. */
export interface MitPassThroughInput {
  /** The network transaction id provided in the response of the customer initiated transaction. */
  citNetworkTransactionId: Scalars['String']['input'];
}

/** Request Async and Downloadable reports */
export interface Mutation {
  __typename?: 'Mutation';
  /** Authorize a customer initiated transaction. */
  authorizeCustomerInitiatedTransaction: AuthorizeCustomerInitiatedTransactionPayload;
  /** For use when authorizing a recurring payment. */
  authorizeRecurring: AuthorizeRecurringPayload;
  /** Capture a previously authorized transaction and return a payload that includes details of the resulting transaction. */
  captureAuthorization: CaptureAuthorizationPayload;
  /** Change an application. */
  changeApplication: ChangeApplicationPayload;
  /** Change an application entity. */
  changeApplicationEntity: ApplicationEntityPayload;
  /** Create an application. */
  createApplication: CreateApplicationPayload;
  /** Create an application entity. */
  createApplicationEntity: ApplicationEntityPayload;
  createAsyncReport: CreateAsyncReportPayload;
  /** Creates a user using the provided information. */
  createUser: CreateUserPayload;
  /** Deactivates a user account. */
  deactivateUser: DeactivateUserPayload;
  /** Decrypt a field on an application and create an audit record. */
  decryptApplicationFields: DecryptApplicationFieldsPayload;
  /** Increment a previously authorized transaction and return a payload that includes details of the resulting transaction. */
  incrementAuthorization: IncrementAuthorizationPayload;
  /** Initiate a bank transfer transaction. */
  initiateBankTransfer: InitiateBankTransferPayload;
  /** Refund a previously authorized payment using its payment ID and return a payload that includes details of the resulting transaction. */
  refundPreviousPayment: RefundPreviousPaymentPayload;
  /** Respond to a dispute. */
  respondToDispute: RespondToDisputePayload;
  /** Reverse a previously processed transaction and return a payload that includes details of the resulting transaction. */
  reverseTransaction: ReverseTransactionPayload;
  /** Submit an application. */
  submitApplication: SubmitApplicationPayload;
  /** Subscribes a card to the AU service and return a payload that includes details of the result. */
  subscribeCard: SubscribeCardPayload;
  /** Unlocks a user account. */
  unlockUser: UnlockUserPayload;
  /** Updates a user using the provided information. */
  updateUser: UpdateUserPayload;
  /** Validate bank account data. */
  validateBankAccount: ValidateBankAccountPayload;
  /** Run an account verification request and return a payload that includes details of the resulting transaction. */
  verifyAccount: VerifyAccountPayload;
}

/** Request Async and Downloadable reports */
export interface MutationAuthorizeCustomerInitiatedTransactionArgs {
  authorizeCustomerInitiatedTransactionInput: AuthorizeCustomerInitiatedTransactionInput;
}

/** Request Async and Downloadable reports */
export interface MutationAuthorizeRecurringArgs {
  authorizeRecurringInput: AuthorizeRecurringInput;
}

/** Request Async and Downloadable reports */
export interface MutationCaptureAuthorizationArgs {
  captureAuthorizationInput: CaptureAuthorizationInput;
}

/** Request Async and Downloadable reports */
export interface MutationChangeApplicationArgs {
  input: ChangeApplicationInput;
}

/** Request Async and Downloadable reports */
export interface MutationChangeApplicationEntityArgs {
  input: ApplicationEntityChangeInput;
}

/** Request Async and Downloadable reports */
export interface MutationCreateApplicationArgs {
  input: CreateApplicationInput;
}

/** Request Async and Downloadable reports */
export interface MutationCreateApplicationEntityArgs {
  input: ApplicationEntityCreateInput;
}

/** Request Async and Downloadable reports */
export interface MutationCreateAsyncReportArgs {
  input: CreateAsyncReportInput;
}

/** Request Async and Downloadable reports */
export interface MutationCreateUserArgs {
  input: CreateUserInput;
}

/** Request Async and Downloadable reports */
export interface MutationDeactivateUserArgs {
  input: DeactivateUserInput;
}

/** Request Async and Downloadable reports */
export interface MutationDecryptApplicationFieldsArgs {
  input: DecryptApplicationFieldsInput;
}

/** Request Async and Downloadable reports */
export interface MutationIncrementAuthorizationArgs {
  incrementAuthorizationInput: IncrementAuthorizationInput;
}

/** Request Async and Downloadable reports */
export interface MutationInitiateBankTransferArgs {
  initiateBankTransferInput: InitiateBankTransferInput;
}

/** Request Async and Downloadable reports */
export interface MutationRefundPreviousPaymentArgs {
  refundPreviousPaymentInput: RefundPreviousPaymentInput;
}

/** Request Async and Downloadable reports */
export interface MutationRespondToDisputeArgs {
  input: RespondToDisputeInput;
}

/** Request Async and Downloadable reports */
export interface MutationReverseTransactionArgs {
  reverseTransactionInput: ReverseTransactionInput;
}

/** Request Async and Downloadable reports */
export interface MutationSubmitApplicationArgs {
  input: SubmitApplicationInput;
}

/** Request Async and Downloadable reports */
export interface MutationSubscribeCardArgs {
  input: SubscribeCardInput;
}

/** Request Async and Downloadable reports */
export interface MutationUnlockUserArgs {
  input: UnlockUserInput;
}

/** Request Async and Downloadable reports */
export interface MutationUpdateUserArgs {
  input: UpdateUserInput;
}

/** Request Async and Downloadable reports */
export interface MutationValidateBankAccountArgs {
  validateBankAccountInput: ValidateBankAccountInput;
}

/** Request Async and Downloadable reports */
export interface MutationVerifyAccountArgs {
  verifyAccountInput: VerifyAccountInput;
}

export const NameVerificationResponseCode = {
  /** The submitted name successfully matched the name associated with the account. */
  Match: 'MATCH',
  /** The name verification was not attempted. */
  NotAttempted: 'NOT_ATTEMPTED',
  /** The submitted name did not match the name associated with the account. */
  NoMatch: 'NO_MATCH',
  /** The name verification was attempted, but a response was not provided by the issuer or processor. */
  NoResponse: 'NO_RESPONSE',
} as const;

export type NameVerificationResponseCode =
  (typeof NameVerificationResponseCode)[keyof typeof NameVerificationResponseCode];
export interface NameVerificationResponseDetails {
  __typename?: 'NameVerificationResponseDetails';
  /** The name verification service result, normalized and described by Tesouro. */
  processorCode: NameVerificationResponseCode;
}

/** Network used to complete the transaction. */
export const Network = {
  /** Automated Clearing House */
  Ach: 'ACH',
  /** American Express */
  AmericanExpress: 'AMERICAN_EXPRESS',
  /** Discover */
  Discover: 'DISCOVER',
  /** Mastercard */
  Mastercard: 'MASTERCARD',
  /** Visa */
  Visa: 'VISA',
} as const;

export type Network = (typeof Network)[keyof typeof Network];
export const NetworkReason = {
  AmericanExpressAuthorizationApprovalExpired: 'AMERICAN_EXPRESS_AUTHORIZATION_APPROVAL_EXPIRED',
  AmericanExpressCancelledRecurringBilling: 'AMERICAN_EXPRESS_CANCELLED_RECURRING_BILLING',
  AmericanExpressCardholderNoLongerDisputesTheCharge:
    'AMERICAN_EXPRESS_CARDHOLDER_NO_LONGER_DISPUTES_THE_CHARGE',
  AmericanExpressCardNotPresent: 'AMERICAN_EXPRESS_CARD_NOT_PRESENT',
  AmericanExpressChargebackReversalExpired: 'AMERICAN_EXPRESS_CHARGEBACK_REVERSAL_EXPIRED',
  AmericanExpressChargebackReversed: 'AMERICAN_EXPRESS_CHARGEBACK_REVERSED',
  AmericanExpressChargeAmountExceedsAuthorizationAmount:
    'AMERICAN_EXPRESS_CHARGE_AMOUNT_EXCEEDS_AUTHORIZATION_AMOUNT',
  AmericanExpressChargeProcessedAsCredit: 'AMERICAN_EXPRESS_CHARGE_PROCESSED_AS_CREDIT',
  AmericanExpressCmCreditedChargebackReversed: 'AMERICAN_EXPRESS_CM_CREDITED_CHARGEBACK_REVERSED',
  AmericanExpressCreditNotProcessed: 'AMERICAN_EXPRESS_CREDIT_NOT_PROCESSED',
  AmericanExpressCreditProcessedAsCharge: 'AMERICAN_EXPRESS_CREDIT_PROCESSED_AS_CHARGE',
  AmericanExpressCurrencyDiscrepancy: 'AMERICAN_EXPRESS_CURRENCY_DISCREPANCY',
  AmericanExpressDealDirect: 'AMERICAN_EXPRESS_DEAL_DIRECT',
  AmericanExpressDuplicateCharge: 'AMERICAN_EXPRESS_DUPLICATE_CHARGE',
  AmericanExpressEmvCounterfeit: 'AMERICAN_EXPRESS_EMV_COUNTERFEIT',
  AmericanExpressEmvLostStolenNonReceived: 'AMERICAN_EXPRESS_EMV_LOST_STOLEN_NON_RECEIVED',
  AmericanExpressFraudFullRecourseProgram: 'AMERICAN_EXPRESS_FRAUD_FULL_RECOURSE_PROGRAM',
  AmericanExpressGoodsServicesCancelled: 'AMERICAN_EXPRESS_GOODS_SERVICES_CANCELLED',
  AmericanExpressGoodsServicesDamagedOrDefective:
    'AMERICAN_EXPRESS_GOODS_SERVICES_DAMAGED_OR_DEFECTIVE',
  AmericanExpressGoodsServicesNotAsDescribed: 'AMERICAN_EXPRESS_GOODS_SERVICES_NOT_AS_DESCRIBED',
  AmericanExpressGoodsServicesNotReceivedOrOnlyPartiallyReceived:
    'AMERICAN_EXPRESS_GOODS_SERVICES_NOT_RECEIVED_OR_ONLY_PARTIALLY_RECEIVED',
  AmericanExpressGoodsServicesReturnedOrRefused:
    'AMERICAN_EXPRESS_GOODS_SERVICES_RETURNED_OR_REFUSED',
  AmericanExpressImmediateChargebackProgram: 'AMERICAN_EXPRESS_IMMEDIATE_CHARGEBACK_PROGRAM',
  AmericanExpressIncorrectChargeAmount: 'AMERICAN_EXPRESS_INCORRECT_CHARGE_AMOUNT',
  AmericanExpressInsufficientReply: 'AMERICAN_EXPRESS_INSUFFICIENT_REPLY',
  AmericanExpressLateSubmission: 'AMERICAN_EXPRESS_LATE_SUBMISSION',
  AmericanExpressLocalRegulatoryLegalDisputes: 'AMERICAN_EXPRESS_LOCAL_REGULATORY_LEGAL_DISPUTES',
  AmericanExpressMissingImprint: 'AMERICAN_EXPRESS_MISSING_IMPRINT',
  AmericanExpressMultipleRoCs: 'AMERICAN_EXPRESS_MULTIPLE_RO_CS',
  AmericanExpressNonMatchingCardNumber: 'AMERICAN_EXPRESS_NON_MATCHING_CARD_NUMBER',
  AmericanExpressNoCardMemberAuthorization: 'AMERICAN_EXPRESS_NO_CARD_MEMBER_AUTHORIZATION',
  AmericanExpressNoFurtherRecourse: 'AMERICAN_EXPRESS_NO_FURTHER_RECOURSE',
  AmericanExpressNoReply: 'AMERICAN_EXPRESS_NO_REPLY',
  AmericanExpressNoShowOrCarDepositCancelled: 'AMERICAN_EXPRESS_NO_SHOW_OR_CAR_DEPOSIT_CANCELLED',
  AmericanExpressNoValidAuthorization: 'AMERICAN_EXPRESS_NO_VALID_AUTHORIZATION',
  AmericanExpressPaidByOtherMeans: 'AMERICAN_EXPRESS_PAID_BY_OTHER_MEANS',
  AmericanExpressPartialImmediateChargebackProgram:
    'AMERICAN_EXPRESS_PARTIAL_IMMEDIATE_CHARGEBACK_PROGRAM',
  AmericanExpressPendingReversalResearch: 'AMERICAN_EXPRESS_PENDING_REVERSAL_RESEARCH',
  AmericanExpressReversalRequestDenied: 'AMERICAN_EXPRESS_REVERSAL_REQUEST_DENIED',
  AmericanExpressSeeAdditionalNotes: 'AMERICAN_EXPRESS_SEE_ADDITIONAL_NOTES',
  AmericanExpressUnassignedCardNumber: 'AMERICAN_EXPRESS_UNASSIGNED_CARD_NUMBER',
  AmericanExpressVehicleRentalCapitalDamagesTheftOrLossOfUse:
    'AMERICAN_EXPRESS_VEHICLE_RENTAL_CAPITAL_DAMAGES_THEFT_OR_LOSS_OF_USE',
  DiscoverAlteredAmount: 'DISCOVER_ALTERED_AMOUNT',
  DiscoverAuthorizationNoncompliance: 'DISCOVER_AUTHORIZATION_NONCOMPLIANCE',
  DiscoverCardholderDisputesQualityOfGoodsOrServices:
    'DISCOVER_CARDHOLDER_DISPUTES_QUALITY_OF_GOODS_OR_SERVICES',
  DiscoverCreditDebitPostedIncorrectly: 'DISCOVER_CREDIT_DEBIT_POSTED_INCORRECTLY',
  DiscoverCreditNotProcessed: 'DISCOVER_CREDIT_NOT_PROCESSED',
  DiscoverDisputeCompliance: 'DISCOVER_DISPUTE_COMPLIANCE',
  DiscoverDoesNotRecognize: 'DISCOVER_DOES_NOT_RECOGNIZE',
  DiscoverDuplicateProcessing: 'DISCOVER_DUPLICATE_PROCESSING',
  DiscoverFraudCardNotPresentTransaction: 'DISCOVER_FRAUD_CARD_NOT_PRESENT_TRANSACTION',
  DiscoverFraudCardPresentTransaction: 'DISCOVER_FRAUD_CARD_PRESENT_TRANSACTION',
  DiscoverFraudChipAndPinTransaction: 'DISCOVER_FRAUD_CHIP_AND_PIN_TRANSACTION',
  DiscoverFraudChipCounterfeitTransaction: 'DISCOVER_FRAUD_CHIP_COUNTERFEIT_TRANSACTION',
  DiscoverGoodFaithInvestigation: 'DISCOVER_GOOD_FAITH_INVESTIGATION',
  DiscoverInvalidCardNumber: 'DISCOVER_INVALID_CARD_NUMBER',
  DiscoverLatePresentation: 'DISCOVER_LATE_PRESENTATION',
  DiscoverNonReceiptOfCashFromAtm: 'DISCOVER_NON_RECEIPT_OF_CASH_FROM_ATM',
  DiscoverNonReceiptOfGoodsServicesCashAtCheckoutOrCashAdvance:
    'DISCOVER_NON_RECEIPT_OF_GOODS_SERVICES_CASH_AT_CHECKOUT_OR_CASH_ADVANCE',
  DiscoverPaidByOtherMeans: 'DISCOVER_PAID_BY_OTHER_MEANS',
  DiscoverRecurringPayments: 'DISCOVER_RECURRING_PAYMENTS',
  MastercardAccountNumberNotOnFile: 'MASTERCARD_ACCOUNT_NUMBER_NOT_ON_FILE',
  MastercardAddendumDispute: 'MASTERCARD_ADDENDUM_DISPUTE',
  MastercardAtmDisputes: 'MASTERCARD_ATM_DISPUTES',
  MastercardCardholderActivatedTerminalCat_3Device:
    'MASTERCARD_CARDHOLDER_ACTIVATED_TERMINAL_CAT_3_DEVICE',
  MastercardCardholderDisputeNotClassifiedElsewhere:
    'MASTERCARD_CARDHOLDER_DISPUTE_NOT_CLASSIFIED_ELSEWHERE',
  MastercardCardholderDisputeOfARecurringTransaction:
    'MASTERCARD_CARDHOLDER_DISPUTE_OF_A_RECURRING_TRANSACTION',
  MastercardChargesForLossTheftOrDamages: 'MASTERCARD_CHARGES_FOR_LOSS_THEFT_OR_DAMAGES',
  MastercardCounterfeitGoods: 'MASTERCARD_COUNTERFEIT_GOODS',
  MastercardCreditNotProcessed: 'MASTERCARD_CREDIT_NOT_PROCESSED',
  MastercardCreditPostedAsAPurchase: 'MASTERCARD_CREDIT_POSTED_AS_A_PURCHASE',
  MastercardCurrencyErrors: 'MASTERCARD_CURRENCY_ERRORS',
  MastercardDigitalGoods_25DollarsOrLess: 'MASTERCARD_DIGITAL_GOODS_25_DOLLARS_OR_LESS',
  MastercardDomesticChargebackDispute: 'MASTERCARD_DOMESTIC_CHARGEBACK_DISPUTE',
  MastercardDuplicationPaidByOtherMeans: 'MASTERCARD_DUPLICATION_PAID_BY_OTHER_MEANS',
  MastercardEmvChipLiabilityShift: 'MASTERCARD_EMV_CHIP_LIABILITY_SHIFT',
  MastercardEmvChipPinLiabilityShift: 'MASTERCARD_EMV_CHIP_PIN_LIABILITY_SHIFT',
  MastercardExpiredChargebackProtectionPeriod: 'MASTERCARD_EXPIRED_CHARGEBACK_PROTECTION_PERIOD',
  MastercardGoodsOrServicesNotProvided: 'MASTERCARD_GOODS_OR_SERVICES_NOT_PROVIDED',
  MastercardGoodsServicesNotAsDescribedOrDefective:
    'MASTERCARD_GOODS_SERVICES_NOT_AS_DESCRIBED_OR_DEFECTIVE',
  MastercardInstallmentBillingDispute: 'MASTERCARD_INSTALLMENT_BILLING_DISPUTE',
  MastercardIssuerDisputeOfARecurringTransaction:
    'MASTERCARD_ISSUER_DISPUTE_OF_A_RECURRING_TRANSACTION',
  MastercardLatePresentment: 'MASTERCARD_LATE_PRESENTMENT',
  MastercardMultipleAuthorizationRequests: 'MASTERCARD_MULTIPLE_AUTHORIZATION_REQUESTS',
  MastercardNoCardholderAuthorization: 'MASTERCARD_NO_CARDHOLDER_AUTHORIZATION',
  MastercardNoShowHotelCharge: 'MASTERCARD_NO_SHOW_HOTEL_CHARGE',
  MastercardPointOfInteractionError: 'MASTERCARD_POINT_OF_INTERACTION_ERROR',
  MastercardQuestionableMerchantActivity: 'MASTERCARD_QUESTIONABLE_MERCHANT_ACTIVITY',
  MastercardRequiredAuthorizationNotObtained: 'MASTERCARD_REQUIRED_AUTHORIZATION_NOT_OBTAINED',
  MastercardTransactionAmountDiffers: 'MASTERCARD_TRANSACTION_AMOUNT_DIFFERS',
  MastercardTransactionDidNotComplete: 'MASTERCARD_TRANSACTION_DID_NOT_COMPLETE',
  MastercardWarningBulletinFile: 'MASTERCARD_WARNING_BULLETIN_FILE',
  None: 'NONE',
  VisaCancelledMerchandiseServices: 'VISA_CANCELLED_MERCHANDISE_SERVICES',
  VisaCancelledRecurring: 'VISA_CANCELLED_RECURRING',
  VisaCardRecoveryBulletin: 'VISA_CARD_RECOVERY_BULLETIN',
  VisaCounterfeitMerchandise: 'VISA_COUNTERFEIT_MERCHANDISE',
  VisaCreditNotProcessed: 'VISA_CREDIT_NOT_PROCESSED',
  VisaDeclinedAuthorization: 'VISA_DECLINED_AUTHORIZATION',
  VisaDuplicateProcessing: 'VISA_DUPLICATE_PROCESSING',
  VisaEmvLiabilityShiftCounterfeitFraud: 'VISA_EMV_LIABILITY_SHIFT_COUNTERFEIT_FRAUD',
  VisaEmvLiabilityShiftNonCounterfeitFraud: 'VISA_EMV_LIABILITY_SHIFT_NON_COUNTERFEIT_FRAUD',
  VisaFraudMonitoringProgram: 'VISA_FRAUD_MONITORING_PROGRAM',
  VisaIncorrectAccountNumber: 'VISA_INCORRECT_ACCOUNT_NUMBER',
  VisaIncorrectAmount: 'VISA_INCORRECT_AMOUNT',
  VisaIncorrectCurrency: 'VISA_INCORRECT_CURRENCY',
  VisaIncorrectTransactionCode: 'VISA_INCORRECT_TRANSACTION_CODE',
  VisaInvalidData: 'VISA_INVALID_DATA',
  VisaLatePresentment: 'VISA_LATE_PRESENTMENT',
  VisaMerchandiseServicesNotReceived: 'VISA_MERCHANDISE_SERVICES_NOT_RECEIVED',
  VisaMisrepresentation: 'VISA_MISREPRESENTATION',
  VisaNonReceiptOfCashOrLoadTransactionValue: 'VISA_NON_RECEIPT_OF_CASH_OR_LOAD_TRANSACTION_VALUE',
  VisaNotAsDescribedOrDefectiveMerchandiseServices:
    'VISA_NOT_AS_DESCRIBED_OR_DEFECTIVE_MERCHANDISE_SERVICES',
  VisaNoAuthorization: 'VISA_NO_AUTHORIZATION',
  VisaOriginalCreditTransactionNotAccepted: 'VISA_ORIGINAL_CREDIT_TRANSACTION_NOT_ACCEPTED',
  VisaOtherFraudCardAbsentEnvironment: 'VISA_OTHER_FRAUD_CARD_ABSENT_ENVIRONMENT',
  VisaOtherFraudCardPresentEnvironment: 'VISA_OTHER_FRAUD_CARD_PRESENT_ENVIRONMENT',
  VisaPaidByOtherMeans: 'VISA_PAID_BY_OTHER_MEANS',
} as const;

export type NetworkReason = (typeof NetworkReason)[keyof typeof NetworkReason];
/** Contains both an abstracted response code and raw network response code. */
export interface NetworkResponseDetails {
  __typename?: 'NetworkResponseDetails';
  /** A response code provided by the card network indicating whether the transaction was approved, or declined. */
  networkResponseCode?: Maybe<Scalars['String']['output']>;
  /** A normalized 4-character response code defined by Tesouro that maps to the network response codes. */
  processorResponseCode: ProcessorResponseCode;
}

export interface NotImplementedError extends Error {
  __typename?: 'NotImplementedError';
  message: Scalars['String']['output'];
}

export interface Order {
  __typename?: 'Order';
  /** An identifier submitted with the transaction to uniquely identify the customer who placed the order. */
  customerReference?: Maybe<Scalars['String']['output']>;
  /** An identifier submitted with the transact[Oion to uniquely identify the order placed by the customer. */
  reference?: Maybe<Scalars['String']['output']>;
  /** The shipping origination address, if applicable. */
  shipFromAddress?: Maybe<AddressDetails>;
  /** The shipping address, if applicable, for where the purchased goods are to be sent. This may be different from the customer or billing address. */
  shipToAddress?: Maybe<AddressDetails>;
}

export interface OrderDetails {
  __typename?: 'OrderDetails';
  /** Details of the customer associated with the order. This may be different from the individuals associated with the billing and/or shipping. */
  customerDetails?: Maybe<CustomerDetails>;
  /** The date and time the order was placed by the customer. */
  orderDateTimeUtc?: Maybe<Scalars['DateTime']['output']>;
  /** A unique identifier created by the acceptor and assigned to the order placed by the customer. */
  orderReference?: Maybe<Scalars['Max36Text']['output']>;
  /** The shipping origination address, if applicable. */
  shipFromAddress?: Maybe<ShipFromAddress>;
  /** The shipping address, if applicable, for where the purchased goods are to be sent. This may be different from the customer or billing address. */
  shipToAddress?: Maybe<AddressDetails>;
}

export interface OrderDetailsInput {
  /** Details of the customer associated with the order. This may be different from the individuals associated with the billing and/or shipping. */
  customerDetails?: InputMaybe<CustomerDetailsInput>;
  /** The date and time the order was placed by the customer. */
  orderDateTimeUtc?: InputMaybe<Scalars['DateTime']['input']>;
  /** A unique identifier created by the acceptor and assigned to the order placed by the customer. */
  orderReference?: InputMaybe<Scalars['Max36Text']['input']>;
  /** The shipping origination address, if applicable. */
  shipFromAddress?: InputMaybe<ShipFromAddressInput>;
  /** The shipping address, if applicable, for where the purchased goods are to be sent. This may be different from the customer or billing address. */
  shipToAddress?: InputMaybe<AddressDetailsInput>;
}

export interface Organization {
  __typename?: 'Organization';
  acceptors?: Maybe<AcceptorCollection>;
  /** A Notification of Change (NOC), notifies the sender of an ACH payment that information related to the customer’s bank account was inaccurate or outdated, and provides the updated information that needs to be corrected before another payment can be sent from (or to) the account. */
  achNotificationsOfChange?: Maybe<AchNotificationOfChangeCollection>;
  /** An itemized list of ach returns for a given transaction activity date or acticity date. */
  achReturns?: Maybe<AchReturnCollection>;
  /** The allowed Merchant Category Codes for acceptors within this organization. */
  allowedMerchantCategories: Array<MerchantCategory>;
  applicationCounts: Array<AcceptorApplicationCounts>;
  /** A summary of authorizations (counts, amounts) for the given transaction date, grouped by acceptor, transaction currency, response code, and payment brand. */
  authorizationSummaries?: Maybe<AuthorizationSummaryCollection>;
  /** The descriptive name for the organization that is different from its legal entity name. Also known as "Doing Business As" (DBA), "trade name", "assumed name", or "fictitious name". */
  businessName: Scalars['String']['output'];
  /** A summary of aggregated fees by acceptor and fee name/program for a specified activity date or funds release date, grouped by fee type, and where applicable, payment brand, product, and funding source. */
  feeSummaries?: Maybe<FeeSummaryCollection>;
  /** An itemized list of applied fees for a given transaction activity date or funds release date. */
  fees?: Maybe<FeeCollection>;
  /** An itemized list of financially impacting dispute events occuring on the pertinent funds release dates. Use this report to track dispute-related money-movements. */
  fundingDisputeEvents?: Maybe<FundingDisputeEventOutputCollection>;
  /** A summary of financial activity for a given funds release date or transaction activity date. Use this report to understand financial impact of daily sales, reconcile sales activity to your bank deposits, or drill deeper into the composition of your funding. */
  fundingSummaries?: Maybe<FundingSummaryCollection>;
  /** An itemized list of funded transactions (captures, sales, and refunds) for the selected transaction activity date or funds release date. */
  fundingTransactions?: Maybe<FundingTransactionCollection>;
  /** The id of the organization as defined in their profile. */
  id: Scalars['UUID']['output'];
  /**
   * The descriptive name for the organization that is different from its legal entity name. Also known as "Doing Business As" (DBA), "trade name", "assumed name", or "fictitious name".
   * @deprecated Use businessName instead.
   */
  name: Scalars['String']['output'];
  /** A summary of transaction aggregates (counts and amounts, including conveyed transactions) by pertinent transaction type, currency, card brand, and transaction activity date. */
  paymentTransactionSummaries?: Maybe<PaymentTransactionSummaryCollection>;
  /** A list of payment transaction requests (including conveyed) submitted on the pertinent transaction activity dates. Use this report as an operational tool to reconcile against your internal record of submitted transactions. */
  paymentTransactions?: Maybe<PaymentTransactionCollection>;
  reportAvailability?: Maybe<Array<ReportAvailability>>;
}

export interface OrganizationAcceptorsArgs {
  input: AcceptorInput;
}

export interface OrganizationAchNotificationsOfChangeArgs {
  input: AchNotificationOfChangeInput;
}

export interface OrganizationAchReturnsArgs {
  input: AchReturnsInput;
}

export interface OrganizationAuthorizationSummariesArgs {
  input: AuthorizationSummaryInput;
}

export interface OrganizationFeeSummariesArgs {
  input: FeeSummaryInput;
}

export interface OrganizationFeesArgs {
  input: FeeInput;
}

export interface OrganizationFundingDisputeEventsArgs {
  input: FundingDisputeEventInput;
}

export interface OrganizationFundingSummariesArgs {
  input: FundingSummariesInput;
}

export interface OrganizationFundingTransactionsArgs {
  input: FundingTransactionInput;
}

export interface OrganizationPaymentTransactionSummariesArgs {
  input: PaymentTransactionSummaryInput;
}

export interface OrganizationPaymentTransactionsArgs {
  input: PaymentTransactionsInput;
}

export interface Owner {
  __typename?: 'Owner';
  /** The decrypted tax id number of the selected owner. */
  taxIdentificationNumber: Scalars['String']['output'];
}

/** Input to select a specific owner from an application to view the owner's decrypted tax id number. */
export interface OwnerTaxIdDecryptionInput {
  /** The acceptor application id for which sensitive data viewing is requested. */
  applicationId: Scalars['UUID']['input'];
  /** The owner id whose tax id number should be decrypted for viewing. */
  ownerId: Scalars['UUID']['input'];
}

export interface PageInfo {
  __typename?: 'PageInfo';
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
}

export interface PagingInput {
  skip: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
}

export const PanEntryChannel = {
  /** A CARD-NOT-PRESENT payment submitted from an online browser or app. */
  Ecomm: 'ECOMM',
  /** A CARD-NOT-PRESENT payment submitted via mail, telephone, fax, or email. */
  Moto: 'MOTO',
} as const;

export type PanEntryChannel = (typeof PanEntryChannel)[keyof typeof PanEntryChannel];
export const PanEntryMode = {
  /** The payment method was manually keyed into the point of sale. */
  Keyed: 'KEYED',
  /** The payment method was loaded from a stored location. */
  OnFile: 'ON_FILE',
  /** Transaction using a payment method not saved on file with the acceptor */
  PaymentMethodNotOnFile: 'PAYMENT_METHOD_NOT_ON_FILE',
  /** Transaction using the customer's payment method on file with the presenter. Often used in subscription models */
  PaymentMethodOnFile: 'PAYMENT_METHOD_ON_FILE',
} as const;

export type PanEntryMode = (typeof PanEntryMode)[keyof typeof PanEntryMode];
/** Payment brand used to complete the transaction. */
export const PaymentBrand = {
  /** Automated Clearing House */
  Ach: 'ACH',
  /** American Express */
  AmericanExpress: 'AMERICAN_EXPRESS',
  /** ATM */
  Atm: 'ATM',
  /** Diners Club International */
  DinersClubInternational: 'DINERS_CLUB_INTERNATIONAL',
  /** Discover */
  Discover: 'DISCOVER',
  /** Electron */
  Electron: 'ELECTRON',
  /** JCB */
  Jcb: 'JCB',
  /** Maestro */
  Maestro: 'MAESTRO',
  /** Mastercard */
  Mastercard: 'MASTERCARD',
  /** Does not apply */
  NotApplicable: 'NOT_APPLICABLE',
  /** PayPal */
  Paypal: 'PAYPAL',
  /** Private Label */
  PrivateLabel: 'PRIVATE_LABEL',
  /** UnionPay */
  UnionPay: 'UNION_PAY',
  /** Visa */
  Visa: 'VISA',
  /** V Pay */
  VPay: 'V_PAY',
} as const;

export type PaymentBrand = (typeof PaymentBrand)[keyof typeof PaymentBrand];
/** How the consumer interacts with the acceptor */
export const PaymentChannel = {
  Ecommerce: 'ECOMMERCE',
  MailOrderTelephoneOrder: 'MAIL_ORDER_TELEPHONE_ORDER',
} as const;

export type PaymentChannel = (typeof PaymentChannel)[keyof typeof PaymentChannel];
/** Possible values for how the payment instrument details are entered. */
export const PaymentEntryMode = {
  /** Payment instrument details provided by means of a payment app on the customer's device. e.g., Apple Pay, Google Pay, etc. */
  ConsumerDeviceApp: 'CONSUMER_DEVICE_APP',
  /** Payment instrument details captured from EMV chip on the card after dipping into the terminal. */
  EmvContact: 'EMV_CONTACT',
  /** Payment instrument details captured from EMV chip on the card after tapping onto the terminal. */
  EmvContactless: 'EMV_CONTACTLESS',
  /** Payment instrument details captured using magnetic stripe from the back of the card after EMV was unsuccessful. */
  FallbackSwipe: 'FALLBACK_SWIPE',
  /** Payment instrument details captured over the phone via an interactive voice prompt. */
  InteractiveVoiceResponse: 'INTERACTIVE_VOICE_RESPONSE',
  /** Payment instrument details captured using keyboard. */
  Keyed: 'KEYED',
  /** Payment instrument details captured from reading the magnetic ink on a paper check. Commonly abbreviated MICR. */
  MagneticInkCharacterRecognition: 'MAGNETIC_INK_CHARACTER_RECOGNITION',
  /** Payment instrument details captured using magnetic stripe from the back of the card. */
  Magstripe: 'MAGSTRIPE',
  /** Payment instrument details captured from emulated chip on the card after tapping onto the terminal. */
  MagstripeContactless: 'MAGSTRIPE_CONTACTLESS',
  /** Payment instrument details captured from mail or telephone order. */
  Moto: 'MOTO',
  /** Payment instrument details captured from the card details stored on file. */
  OnFile: 'ON_FILE',
  /** Payment instrument details captured using a camera to recognize the account information. Commonly abbreviated OCR. */
  OpticalCharacterRecognition: 'OPTICAL_CHARACTER_RECOGNITION',
  /** Entry mode was unused or not applicable for payment. */
  Unused: 'UNUSED',
} as const;

export type PaymentEntryMode = (typeof PaymentEntryMode)[keyof typeof PaymentEntryMode];
/** The fee details input object. */
export interface PaymentFeeInput {
  /** A fee amount applied on the given transaction. */
  feeAmount: Scalars['DecimalAmount']['input'];
  /** A type of fee applied on the given transaction. */
  type: FeeType;
}

export interface PaymentInstrumentSubscriptionInput {
  /** The card details to subscribe for updates. */
  card?: InputMaybe<CardDetailsSubscriptionInput>;
  /** The token details to subscribe for updates. */
  token?: InputMaybe<TokenDetailsSubscriptionInput>;
}

export interface PaymentMethod {
  /** The acquirer token on file for this payment card, if the card has been used before and the transactor is subscribed to Tesouro's tokenization services. Otherwise, this field's value will be null. */
  acquirerToken?: Maybe<Scalars['String']['output']>;
  /** The type of payment method used by the customer to submit the transaction, e.g., Card, Bank transfer, etc. */
  type?: Maybe<PaymentMethodType>;
}

/** Contains the details of the payment method used for the transaction. */
export interface PaymentMethodResponse {
  __typename?: 'PaymentMethodResponse';
  bankPaymentMethodDetails?: Maybe<BankPaymentMethodDetailsResponse>;
  cardPaymentMethodDetails?: Maybe<CardPaymentMethodDetailsResponse>;
}

export const PaymentMethodType = {
  BankAccount: 'BANK_ACCOUNT',
  Card: 'CARD',
  NetworkToken: 'NETWORK_TOKEN',
} as const;

export type PaymentMethodType = (typeof PaymentMethodType)[keyof typeof PaymentMethodType];
export interface PaymentTransaction {
  acceptor: Acceptor;
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff. */
  activityDate?: Maybe<Scalars['Date']['output']>;
  /** Components of the requested amount that may or may not have been provided by the presenter on the payment transaction request. */
  amountDetails?: Maybe<AmountDetails>;
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /** Aggregate information for assessed fees */
  fees?: Maybe<FeeDetails>;
  /** A unique identifier assigned by Tesouro for every transaction request received. */
  id: Scalars['UUID']['output'];
  /** Line items associated with the payment transaction. */
  lineItems?: Maybe<Array<LineItem>>;
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  merchantCategory?: Maybe<Scalars['String']['output']>;
  organization: Organization;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Refers to the various options available for customers to make payments when purchasing a product or service. */
  paymentMethod: PaymentMethod;
  /** The payment network that the transaction was sent across, which may be unaffiliated with the card brand. */
  processingNetwork: Network;
  /** A response code provided by Tesouro identifying the specific approval or decline reason. */
  processorResponseCode: ProcessorResponseCode;
  /** A human readable description of the authorization response code. e.g., Insufficient funds. */
  processorResponseMessage: Scalars['String']['output'];
  /** A unique transaction identifier created by the entity holding the direct relationship with the Acceptor. Tesouro uses this identifier to manage idempotency. */
  reference?: Maybe<Scalars['String']['output']>;
  /** The result of the authorization request, e.g., Approved or Declined. */
  responseType?: Maybe<ResponseType>;
  /** The tax identification number (TIN) is a unique identifier created by the national government and associated with the acceptor at the time the transaction was submitted */
  taxIdentificationNumber?: Maybe<Scalars['String']['output']>;
  /** The various tax amounts collected on the payment transaction. */
  taxes?: Maybe<Taxes>;
  /** The date and time that Tesouro received the transaction, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime: Scalars['DateTime']['output'];
  /** The type of payment transaction, e.g., Authorization, Capture, Sale, Refund, Reversal, etc. */
  transactionType: PaymentTransactionType;
}

export interface PaymentTransactionCollection {
  __typename?: 'PaymentTransactionCollection';
  items: Array<PaymentTransaction>;
  pageInfo: PageInfo;
}

export const PaymentTransactionFields = {
  AcceptorId: 'ACCEPTOR_ID',
  AcceptorName: 'ACCEPTOR_NAME',
  AcceptorReference: 'ACCEPTOR_REFERENCE',
  AccountNumberEndingIn: 'ACCOUNT_NUMBER_ENDING_IN',
  AccountNumberFirstSix: 'ACCOUNT_NUMBER_FIRST_SIX',
  AccountNumberLastFour: 'ACCOUNT_NUMBER_LAST_FOUR',
  AccountOwnerName: 'ACCOUNT_OWNER_NAME',
  AccountOwnerType: 'ACCOUNT_OWNER_TYPE',
  AccountType: 'ACCOUNT_TYPE',
  AcquirerReferenceNumber: 'ACQUIRER_REFERENCE_NUMBER',
  AcquirerToken: 'ACQUIRER_TOKEN',
  Advice: 'ADVICE',
  ApprovedAmount: 'APPROVED_AMOUNT',
  AvsResponse: 'AVS_RESPONSE',
  BusinessApplicationId: 'BUSINESS_APPLICATION_ID',
  CaptureOnApproval: 'CAPTURE_ON_APPROVAL',
  CardholderFirstName: 'CARDHOLDER_FIRST_NAME',
  CardholderLastName: 'CARDHOLDER_LAST_NAME',
  CardExpiration: 'CARD_EXPIRATION',
  CashbackAmount: 'CASHBACK_AMOUNT',
  ConsumerType: 'CONSUMER_TYPE',
  ConvenienceFeesAmount: 'CONVENIENCE_FEES_AMOUNT',
  ConveyedStatus: 'CONVEYED_STATUS',
  CustomerReference: 'CUSTOMER_REFERENCE',
  CustomerStatementMemo: 'CUSTOMER_STATEMENT_MEMO',
  DeclineType: 'DECLINE_TYPE',
  DiscountAmount: 'DISCOUNT_AMOUNT',
  DutyAmount: 'DUTY_AMOUNT',
  EntryMode: 'ENTRY_MODE',
  FundingCurrency: 'FUNDING_CURRENCY',
  FundingGrossAmount: 'FUNDING_GROSS_AMOUNT',
  FundingNetAmount: 'FUNDING_NET_AMOUNT',
  FundsReleaseDate: 'FUNDS_RELEASE_DATE',
  FundsTransferDescriptor: 'FUNDS_TRANSFER_DESCRIPTOR',
  FundsTransferId: 'FUNDS_TRANSFER_ID',
  GratuityAmount: 'GRATUITY_AMOUNT',
  InterchangeFeesAmount: 'INTERCHANGE_FEES_AMOUNT',
  IssuingBankCountry: 'ISSUING_BANK_COUNTRY',
  IssuingBankName: 'ISSUING_BANK_NAME',
  IsFunded: 'IS_FUNDED',
  IsPartnerFeeAdjusted: 'IS_PARTNER_FEE_ADJUSTED',
  LineItemDetails: 'LINE_ITEM_DETAILS',
  LocalTax: 'LOCAL_TAX',
  MerchantCategory: 'MERCHANT_CATEGORY',
  NameVerification: 'NAME_VERIFICATION',
  NationalTax: 'NATIONAL_TAX',
  NetworkApprovalCode: 'NETWORK_APPROVAL_CODE',
  NetworkAvsResponse: 'NETWORK_AVS_RESPONSE',
  NetworkFeesAmount: 'NETWORK_FEES_AMOUNT',
  NetworkResponseCode: 'NETWORK_RESPONSE_CODE',
  NetworkResponseMessage: 'NETWORK_RESPONSE_MESSAGE',
  OrderReference: 'ORDER_REFERENCE',
  OrganizationId: 'ORGANIZATION_ID',
  PartnerFeesAmount: 'PARTNER_FEES_AMOUNT',
  PaymentBrand: 'PAYMENT_BRAND',
  PaymentChannel: 'PAYMENT_CHANNEL',
  PaymentFundingSource: 'PAYMENT_FUNDING_SOURCE',
  PaymentId: 'PAYMENT_ID',
  PaymentMethodType: 'PAYMENT_METHOD_TYPE',
  PaymentProduct: 'PAYMENT_PRODUCT',
  ProcessingNetwork: 'PROCESSING_NETWORK',
  ProcessorFeesAmount: 'PROCESSOR_FEES_AMOUNT',
  ProcessorResponseCode: 'PROCESSOR_RESPONSE_CODE',
  ProcessorResponseMessage: 'PROCESSOR_RESPONSE_MESSAGE',
  ResponseType: 'RESPONSE_TYPE',
  RoutingNumber: 'ROUTING_NUMBER',
  SecurityCodeNetworkResponse: 'SECURITY_CODE_NETWORK_RESPONSE',
  SecurityCodeNormalizedResponse: 'SECURITY_CODE_NORMALIZED_RESPONSE',
  ServiceFeesAmount: 'SERVICE_FEES_AMOUNT',
  ShippingAmount: 'SHIPPING_AMOUNT',
  ShipFromAddress_01: 'SHIP_FROM_ADDRESS_01',
  ShipFromAddress_02: 'SHIP_FROM_ADDRESS_02',
  ShipFromAddress_03: 'SHIP_FROM_ADDRESS_03',
  ShipFromCity: 'SHIP_FROM_CITY',
  ShipFromCountry: 'SHIP_FROM_COUNTRY',
  ShipFromPostalCode: 'SHIP_FROM_POSTAL_CODE',
  ShipFromStateOrProvince: 'SHIP_FROM_STATE_OR_PROVINCE',
  ShipToAddress_01: 'SHIP_TO_ADDRESS_01',
  ShipToAddress_02: 'SHIP_TO_ADDRESS_02',
  ShipToAddress_03: 'SHIP_TO_ADDRESS_03',
  ShipToCity: 'SHIP_TO_CITY',
  ShipToCountry: 'SHIP_TO_COUNTRY',
  ShipToDetailsIndicator: 'SHIP_TO_DETAILS_INDICATOR',
  ShipToPostalCode: 'SHIP_TO_POSTAL_CODE',
  ShipToStateOrProvince: 'SHIP_TO_STATE_OR_PROVINCE',
  SubtotalAmount: 'SUBTOTAL_AMOUNT',
  SurchargeAmount: 'SURCHARGE_AMOUNT',
  TaxIdentificationNumber: 'TAX_IDENTIFICATION_NUMBER',
  TotalTax: 'TOTAL_TAX',
  TraceNumber: 'TRACE_NUMBER',
  TransactionActivityDate: 'TRANSACTION_ACTIVITY_DATE',
  TransactionAmount: 'TRANSACTION_AMOUNT',
  TransactionCurrency: 'TRANSACTION_CURRENCY',
  TransactionId: 'TRANSACTION_ID',
  TransactionProcessingDecision: 'TRANSACTION_PROCESSING_DECISION',
  TransactionReference: 'TRANSACTION_REFERENCE',
  TransactionTsUtc: 'TRANSACTION_TS_UTC',
  TransactionType: 'TRANSACTION_TYPE',
  TransferEffectiveDate: 'TRANSFER_EFFECTIVE_DATE',
  ValidationScore: 'VALIDATION_SCORE',
} as const;

export type PaymentTransactionFields =
  (typeof PaymentTransactionFields)[keyof typeof PaymentTransactionFields];
export interface PaymentTransactionFilterInput {
  acceptorId?: InputMaybe<GuidFilterInput>;
  conveyedStatus?: InputMaybe<EnumFilterInputOfConveyedStatusInput>;
  paymentBrand?: InputMaybe<EnumFilterInputOfPaymentBrandInput>;
  paymentFundingSource?: InputMaybe<EnumFilterInputOfFundingSourceInput>;
  paymentId?: InputMaybe<GuidFilterInput>;
  processorResponseCode?: InputMaybe<EnumFilterInputOfProcessorResponseCodeInput>;
  transactionActivityDate?: InputMaybe<DateRangeFilterInput>;
  transactionCurrency?: InputMaybe<StringFilterInput>;
  transactionId?: InputMaybe<GuidFilterInput>;
  transactionReference?: InputMaybe<StringFilterInput>;
  transactionType?: InputMaybe<EnumFilterInputOfPaymentTransactionTypeInput>;
}

export interface PaymentTransactionSummary {
  __typename?: 'PaymentTransactionSummary';
  acceptor: Acceptor;
  /** Indicator that the transaction was conveyed, or handled by the Tesouro network */
  conveyedStatus: ConveyedStatus;
  organization: Organization;
  /** Specifies which payment brand was used, e.g., Visa, Mastercard, Discover, American Express, etc. */
  paymentBrand?: Maybe<PaymentBrand>;
  /** Specifies the source of the card customer's funds , e.g., credit, debit, pre-paid. */
  paymentFundingSource: FundingSource;
  /** A unique identifier created and used by Tesouro, and assigned to the entity presenting the transaction to Tesouro. */
  presenterId: Scalars['UUID']['output'];
  /** The processing network that the transaction was sent across, which may be unafilliated with the card brand. */
  processingNetwork?: Maybe<Network>;
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff */
  transactionActivityDate: Scalars['Date']['output'];
  /** The total value of the transactions */
  transactionAmount: Scalars['Decimal']['output'];
  /** The total number of transactions */
  transactionCount: Scalars['Int']['output'];
  /** The currency specified on the transaction, in ISO 4217 alpha currency code format. */
  transactionCurrency: Scalars['String']['output'];
  /** Tesouro's decision to approve or decline, or accept or reject the transaction request. Note, this is different than the Authorization response returned from the payment network. */
  transactionProcessingDecision: TransactionRequestResult;
  /** The type of transaction, e.g., Authorization, Capture, Refund, Reversal, Incremental authorization, Authentication. */
  transactionType: PaymentTransactionType;
}

export interface PaymentTransactionSummaryCollection {
  __typename?: 'PaymentTransactionSummaryCollection';
  items: Array<PaymentTransactionSummary>;
  pageInfo: PageInfo;
}

export interface PaymentTransactionSummaryFilterInput {
  acceptorId?: InputMaybe<GuidFilterInput>;
  conveyedStatus?: InputMaybe<EnumFilterInputOfConveyedStatusInput>;
  transactionActivityDate: DateRangeFilterInput;
  transactionCurrency?: InputMaybe<Scalars['String']['input']>;
  transactionType?: InputMaybe<EnumFilterInputOfPaymentTransactionTypeInput>;
}

export interface PaymentTransactionSummaryInput {
  orderBy?: InputMaybe<Array<PaymentTransactionSummarySortTypeInput>>;
  paging: PagingInput;
  where: PaymentTransactionSummaryFilterInput;
}

export const PaymentTransactionSummarySortField = {
  ConveyedStatus: 'CONVEYED_STATUS',
  PaymentBrand: 'PAYMENT_BRAND',
  PaymentFundingSource: 'PAYMENT_FUNDING_SOURCE',
  PresenterId: 'PRESENTER_ID',
  ProcessingNetwork: 'PROCESSING_NETWORK',
  TransactionActivityDate: 'TRANSACTION_ACTIVITY_DATE',
  TransactionAmount: 'TRANSACTION_AMOUNT',
  TransactionCount: 'TRANSACTION_COUNT',
  TransactionCurrency: 'TRANSACTION_CURRENCY',
  TransactionProcessingDecision: 'TRANSACTION_PROCESSING_DECISION',
  TransactionType: 'TRANSACTION_TYPE',
} as const;

export type PaymentTransactionSummarySortField =
  (typeof PaymentTransactionSummarySortField)[keyof typeof PaymentTransactionSummarySortField];
export interface PaymentTransactionSummarySortTypeInput {
  field: PaymentTransactionSummarySortField;
  sortDirection: SortingEnumType;
}

/** The different types of payment transactions. */
export const PaymentTransactionType = {
  /** A request to the cardholder's issuing bank to confirm that the account is active and has enough credit or funds to make the transaction. If approved, the requested amount is put on hold in the cardholder's account. */
  Authorization: 'AUTHORIZATION',
  /** Validates a bank account to ensure that the account belongs to the person or entity that claims to own it. */
  BankAccountValidation: 'BANK_ACCOUNT_VALIDATION',
  /** A request to initiate the flow of funds from the cardholder's issuing bank account to your merchant account. Follows an approved authorization. */
  Capture: 'CAPTURE',
  /** Performs address and card security code checks on a cardholder's account to ensure it is in good standing, without actually charging an amount to the card. */
  CardVerification: 'CARD_VERIFICATION',
  /** A request to adjust the amount of a previously approved authorization before it is captured. */
  IncrementalAuthorization: 'INCREMENTAL_AUTHORIZATION',
  /** A request to send money back to the cardholder's account who has returned a purchase or no longer wants to receive services. */
  Refund: 'REFUND',
  /** A request to the cardholder's issuing bank to confirm that the account is active and capable of completing the refund transaction. */
  RefundAuthorization: 'REFUND_AUTHORIZATION',
  /** A request to cancel a previous transaction request. Authorization reversals notify the cardholder's issuer that all or part of a transaction has been canceled and that the authorization hold should be released. */
  Reversal: 'REVERSAL',
  /** A request to initiate the flow of funds from the customer's bank account to your merchant account. */
  Sale: 'SALE',
} as const;

export type PaymentTransactionType =
  (typeof PaymentTransactionType)[keyof typeof PaymentTransactionType];
export interface PaymentTransactionsAsyncInput {
  asyncReportsDetailsInput: AsyncReportsDetailsInput;
  paymentTransactionsReportInput: PaymentTransactionsAsyncReportInput;
  where: PaymentTransactionFilterInput;
}

export interface PaymentTransactionsAsyncReportInput {
  /** The fields to include in the report. */
  fields: Array<PaymentTransactionFields>;
  /** Tesouro names the files so that the filename is contextual to the data the report contains, e.g., acceptorName_reportType_YYYYMM-DD-to-YYYMMDD_createdOnDate. If you prefer to override Tesouro's file naming and specify your own format, add it here. */
  fileName?: InputMaybe<Scalars['String']['input']>;
  /** The type of file that the report is saved as, e.g. CSV */
  fileType: FileTypes;
}

export interface PaymentTransactionsInput {
  paging: PagingInput;
  where: PaymentTransactionFilterInput;
}

export interface Permission {
  __typename?: 'Permission';
  /** The description of the permission. */
  description?: Maybe<Scalars['String']['output']>;
  /** The id of the permission. */
  id: Scalars['UUID']['output'];
  /** The key of the permission. */
  key: Scalars['String']['output'];
  /** The name of the permission. */
  name: Scalars['String']['output'];
}

export interface PermissionCollection {
  __typename?: 'PermissionCollection';
  items: Array<Permission>;
  pageInfo: PageInfo;
}

export interface PermissionFilterInput {
  id?: InputMaybe<GuidFilterInput>;
  userId?: InputMaybe<GuidFilterInput>;
}

export interface PermissionInput {
  orderBy?: InputMaybe<Array<PermissionSortTypeInput>>;
  paging: PagingInput;
  where?: InputMaybe<PermissionFilterInput>;
}

export const PermissionSortField = {
  Id: 'ID',
} as const;

export type PermissionSortField = (typeof PermissionSortField)[keyof typeof PermissionSortField];
export interface PermissionSortTypeInput {
  field: PermissionSortField;
  sortDirection: SortingEnumType;
}

export interface PersonEntityChangeInput {
  address?: InputMaybe<AddressInput>;
  birthDate?: InputMaybe<Scalars['Date']['input']>;
  emailAddress?: InputMaybe<Scalars['String']['input']>;
  /** A unique UUID created by Tesouro and assigned to the entity. */
  id: Scalars['UUID']['input'];
  ipAddress?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<PersonNameInput>;
  /** The approximate ownership of the acceptor that this owner holds. Formatted as a decimal, e.g., If the owners holds 30%, input as 0.30. */
  ownership?: InputMaybe<Scalars['Percentage']['input']>;
  personTypes?: InputMaybe<Array<PersonType>>;
  /** Required if personType = "Owner", "ControlPerson", "Guarantor". */
  personalIdentificationNumber?: InputMaybe<PersonalIdentificationNumberInput>;
  /** True if this entity should no longer be part of the application. */
  removeEntity?: InputMaybe<Scalars['Boolean']['input']>;
  telephoneNumber?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
}

export interface PersonEntityCreateInput {
  address?: InputMaybe<AddressInput>;
  birthDate?: InputMaybe<Scalars['Date']['input']>;
  emailAddress?: InputMaybe<Scalars['String']['input']>;
  ipAddress?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<PersonNameInput>;
  /** The approximate ownership of the acceptor that this owner holds. Formatted as a decimal, e.g., If the owners holds 30%, input as 0.30. */
  ownership?: InputMaybe<Scalars['Percentage']['input']>;
  personTypes?: InputMaybe<Array<PersonType>>;
  /** Required if personType = "Owner", "ControlPerson", "Guarantor". */
  personalIdentificationNumber?: InputMaybe<PersonalIdentificationNumberInput>;
  telephoneNumber?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
}

export interface PersonEntityOutput extends ApplicationEntityOutput {
  __typename?: 'PersonEntityOutput';
  address?: Maybe<AddressOutput>;
  birthDate?: Maybe<Scalars['Date']['output']>;
  emailAddress?: Maybe<Scalars['String']['output']>;
  /** A unique UUID created by Tesouro and assigned to the entity. */
  id?: Maybe<Scalars['UUID']['output']>;
  ipAddress?: Maybe<Scalars['String']['output']>;
  name?: Maybe<PersonNameOutput>;
  /** Required if PersonType = "Owner", "ControlPerson", "Guarantor". */
  obfuscatedPersonalIdentificationNumber?: Maybe<PersonalIdentificationNumberOutput>;
  /** The approximate ownership of the acceptor that this owner holds. Formatted as a decimal, e.g., If the owners holds 30%, input as 0.30 */
  ownership?: Maybe<Scalars['Percentage']['output']>;
  personTypes?: Maybe<Array<PersonType>>;
  /** True if this entity should no longer be part of the application. */
  removeEntity?: Maybe<Scalars['Boolean']['output']>;
  telephoneNumber?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
}

export interface PersonNameInput {
  /** The person's first name. */
  firstName?: InputMaybe<Scalars['String']['input']>;
  /** The person's last name. */
  lastName?: InputMaybe<Scalars['String']['input']>;
  /** The person's middle name. */
  middleName?: InputMaybe<Scalars['String']['input']>;
  /** The person's name post nominal. */
  postNominal?: InputMaybe<Scalars['String']['input']>;
  /** The person's salutation. */
  salutation?: InputMaybe<Scalars['String']['input']>;
  /** The person's name suffix. */
  suffix?: InputMaybe<Scalars['String']['input']>;
}

export interface PersonNameOutput {
  __typename?: 'PersonNameOutput';
  /** The person's first name. */
  firstName?: Maybe<Scalars['String']['output']>;
  /** The person's last name. */
  lastName?: Maybe<Scalars['String']['output']>;
  /** The person's middle name. */
  middleName?: Maybe<Scalars['String']['output']>;
  /** The person's name post nominal. */
  postNominal?: Maybe<Scalars['String']['output']>;
  /** The person's salutation. */
  salutation?: Maybe<Scalars['String']['output']>;
  /** The person's name suffix. */
  suffix?: Maybe<Scalars['String']['output']>;
}

export const PersonType = {
  Authorized: 'AUTHORIZED',
  Company: 'COMPANY',
  ControlPerson: 'CONTROL_PERSON',
  Guarantor: 'GUARANTOR',
  Owner: 'OWNER',
  PrimaryContact: 'PRIMARY_CONTACT',
} as const;

export type PersonType = (typeof PersonType)[keyof typeof PersonType];
export interface PersonalIdentificationNumberInput {
  /** Always supply a SSN or ITIN if available. */
  personalIdentificationNumberType?: InputMaybe<PersonalIdentificationNumberType>;
  /** The personal identification number. */
  value?: InputMaybe<Scalars['String']['input']>;
}

export interface PersonalIdentificationNumberOutput {
  __typename?: 'PersonalIdentificationNumberOutput';
  /** Always supply a SSN or ITIN if available. */
  personalIdentificationNumberType?: Maybe<PersonalIdentificationNumberType>;
  /** The personal identification number. */
  value?: Maybe<Scalars['String']['output']>;
}

export const PersonalIdentificationNumberType = {
  /** Individual Tax Identification Number. */
  Itin: 'ITIN',
  /** Passport number - only to be used when the person's address is outside of the United States. */
  PassportNumber: 'PASSPORT_NUMBER',
  /** Social Security Number. */
  Ssn: 'SSN',
} as const;

export type PersonalIdentificationNumberType =
  (typeof PersonalIdentificationNumberType)[keyof typeof PersonalIdentificationNumberType];
export interface Platform extends Actor {
  __typename?: 'Platform';
  name: Scalars['String']['output'];
  type: ActorType;
}

export interface Presenter {
  __typename?: 'Presenter';
  /** The descriptive name for the presenter that is different from its legal entity name. Also known as "Doing Business As" (DBA), "trade name", "assumed name", or "fictitious name". */
  businessName: Scalars['String']['output'];
  /** The id of the presenter as defined in their profile. */
  id: Scalars['UUID']['output'];
}

/** This occurs when a prior referenced payment cannot be found */
export interface PriorPaymentNotFoundError extends IGraphQlError {
  __typename?: 'PriorPaymentNotFoundError';
  /**
   * The date and time, in UTC, that the error occured. Formatted as 2024-03-27T02:40:00Z.
   * @deprecated Use errorDateTime instead.
   */
  dateTimeUtc: Scalars['DateTime']['output'];
  /** The date and time, in UTC, that the error occured. Formatted as 2024-03-27T02:40:00Z. */
  errorDateTime: Scalars['DateTime']['output'];
  /** A human readable description of the error. */
  message: Scalars['String']['output'];
  /** Tesouro response code indicating the error. */
  processorResponseCode: ProcessorResponseCode;
  /** Unique ID for the transaction assigned by Tesouro. */
  transactionId: Scalars['UUID']['output'];
  /** The payment id that cannot be found. */
  unknownPaymentId: Scalars['UUID']['output'];
}

/** This occurs when a prior referenced transaction cannot be found */
export interface PriorTransactionNotFoundError extends IGraphQlError {
  __typename?: 'PriorTransactionNotFoundError';
  /**
   * The date and time, in UTC, that the error occured. Formatted as 2024-03-27T02:40:00Z.
   * @deprecated Use errorDateTime instead.
   */
  dateTimeUtc: Scalars['DateTime']['output'];
  /** The date and time, in UTC, that the error occured. Formatted as 2024-03-27T02:40:00Z. */
  errorDateTime: Scalars['DateTime']['output'];
  /** A human readable description of the error. */
  message: Scalars['String']['output'];
  /** Tesouro response code indicating the error. */
  processorResponseCode: ProcessorResponseCode;
  /** Unique ID for the transaction assigned by Tesouro. */
  transactionId: Scalars['UUID']['output'];
  /** The transaction id that cannot be found. */
  unknownTransactionId: Scalars['String']['output'];
}

export const ProcessorResponseCode = {
  /** Full amount approved. */
  A0000: 'A0000',
  /** Partial amount approved. */
  A0001: 'A0001',
  /** Purchase amount approved, not cash. */
  A0002: 'A0002',
  /** P2pe success. */
  A0003: 'A0003',
  /** Account Validated. */
  A0004: 'A0004',
  /** Call issuer. */
  D1001: 'D1001',
  /** Invalid account number. */
  D1002: 'D1002',
  /** Lost or stolen card. */
  D1003: 'D1003',
  /** Frozen account. */
  D1004: 'D1004',
  /** Generic decline. */
  D1005: 'D1005',
  /** Insufficient funds. */
  D1006: 'D1006',
  /** Expired card. */
  D1007: 'D1007',
  /** Stand alone refund not allowed. */
  D1008: 'D1008',
  /** Possible fraud. */
  D1009: 'D1009',
  /** Maximum attempts exceeded. */
  D1010: 'D1010',
  /** Card verification did not match. */
  D1011: 'D1011',
  /** Network System Error. */
  D1012: 'D1012',
  /** Cardholder could not be authenticated. */
  D1013: 'D1013',
  /** Cardholder authentication required. */
  D1014: 'D1014',
  /** Issuer unavailable. */
  D1016: 'D1016',
  /** Negative file match. */
  D1017: 'D1017',
  /** Address verification failed. */
  D1018: 'D1018',
  /** Pick up card. */
  D1019: 'D1019',
  /** Invalid Issuer. */
  D1020: 'D1020',
  /** Transaction not permitted. */
  D1021: 'D1021',
  /** Restricted card. */
  D1022: 'D1022',
  /** Illegal transaction. */
  D1023: 'D1023',
  /** Retry transaction. */
  D1024: 'D1024',
  /** Reversal Failed. */
  D1025: 'D1025',
  /** No account. */
  D1026: 'D1026',
  /** Invalid Pin. */
  D1027: 'D1027',
  /** Exceeds withdrawal amount limit. */
  D1028: 'D1028',
  /** Exceeds withdrawal frequency limit. */
  D1029: 'D1029',
  /** Response received late. */
  D1030: 'D1030',
  /** Chip failure. */
  D1031: 'D1031',
  /** Terminal out of balance. Contact Tesouro. */
  D1032: 'D1032',
  /** Failed velocity check. */
  D1033: 'D1033',
  /** System unavailable. */
  D1034: 'D1034',
  /** Customer cancellation. */
  D1035: 'D1035',
  /** Multi-currency dynamic currency conversion failure. */
  D1036: 'D1036',
  /** Multi-currency invert failure. */
  D1037: 'D1037',
  /** Dynamic currency conversion completed. No auth performed. */
  D1038: 'D1038',
  /** Preferred debit routing denial, process credit as debit. */
  D1039: 'D1039',
  /** Stop payment order. */
  D1040: 'D1040',
  /** Revocation of auth order. */
  D1041: 'D1041',
  /** Revocation of all auth orders. */
  D1042: 'D1042',
  /** Invalid routing number. */
  D1043: 'D1043',
  /** Acceptor not registered for account updates */
  D2516: 'D2516',
  /** System error, call Tesouro. */
  E1001: 'E1001',
  /** Network timeout. */
  E1002: 'E1002',
  /** Request field failed validation. */
  E1003: 'E1003',
  /** Acceptor not found. */
  E1004: 'E1004',
  /** Referenced payment not found. */
  E1005: 'E1005',
  /** Could not parse network response. */
  E1006: 'E1006',
  /** Token not found. */
  E1007: 'E1007',
  /** Acceptor not configured for any network this card can route through. */
  E1008: 'E1008',
  /** Rule violation. */
  E1009: 'E1009',
  /** Invalid token. */
  E1010: 'E1010',
  /** Illegal transaction: The country code is on the Office of Foreign Assets Control (OFAC) sanctions list. */
  E1011: 'E1011',
  /** Accepted. */
  U3000: 'U3000',
  /** No updates found. */
  U3001: 'U3001',
  /** Change in account number. */
  U3002: 'U3002',
  /** Change in expiration date. */
  U3003: 'U3003',
  /** Closed account. */
  U3004: 'U3004',
  /** Contact cardholder. */
  U3005: 'U3005',
  /** Non-participating issuing bank. */
  U3006: 'U3006',
} as const;

export type ProcessorResponseCode =
  (typeof ProcessorResponseCode)[keyof typeof ProcessorResponseCode];
export const ProductPillar = {
  /** Acceptor billing engine and funds disbursement. */
  BillingFunding: 'BILLING_FUNDING',
  /** Due diligence, underwriting, and onboarding. */
  Boarding: 'BOARDING',
  /** Insights and recommendation to optimize transaction processing. */
  Reporting: 'REPORTING',
  /** Risk mitigation, fraud prevention and detection, and dispute management. */
  RiskComplianceDisputeManagement: 'RISK_COMPLIANCE_DISPUTE_MANAGEMENT',
  /** Authorization, capture, and clearing of transactions using various methods and payment credentials. */
  TransactionProcessing: 'TRANSACTION_PROCESSING',
} as const;

export type ProductPillar = (typeof ProductPillar)[keyof typeof ProductPillar];
/** This query returns that status of the async reports */
export interface Query {
  __typename?: 'Query';
  /** A Notification of Change (NOC), notifies the sender of an ACH payment that information related to the customer’s bank account was inaccurate or outdated, and provides the updated information that needs to be corrected before another payment can be sent from (or to) the account. */
  achNotificationsOfChange?: Maybe<AchNotificationOfChangeCollection>;
  /** An itemized list of ach returns. */
  achReturns?: Maybe<AchReturnCollection>;
  /** Retrieves application entities. */
  applicationEntities: ApplicationEntitiesOutputCollection;
  /** Retrieves information about this application. */
  applications: AcceptorApplicationCollection;
  asyncReport?: Maybe<AsyncReportRequestCollection>;
  /** A summary of authorizations (counts, amounts) for the given transaction date, grouped by acceptor, transaction currency, response code, and payment brand. */
  authorizationSummaries?: Maybe<AuthorizationSummaryCollection>;
  /** Retrieve disputes based on query parameters */
  disputes?: Maybe<DisputeCollection>;
  feeSummaries?: Maybe<FeeSummaryCollection>;
  /** An itemized list of applied fees for a given transaction activity date or funds release date. */
  fees?: Maybe<FeeCollection>;
  /** An itemized list of financially impacting dispute events occuring on the pertinent funds release dates. Use this report to track dispute-related money-movements. */
  fundingDisputeEvents?: Maybe<FundingDisputeEventOutputCollection>;
  /** A summary of financial activity for a given funds release date or transaction activity date. Use this report to understand financial impact of daily sales, reconcile sales activity to your bank deposits, or drill deeper into the composition of your funding. */
  fundingSummaries?: Maybe<FundingSummaryCollection>;
  /** An itemized list of funded transactions (captures, sales, and refunds) for the selected transaction activity date or funds release date. */
  fundingTransactions?: Maybe<FundingTransactionCollection>;
  /** Retrieves information about currently authenticated user. */
  me?: Maybe<User>;
  /** Retrieves information about this organization and their relationships. */
  organization: Organization;
  /** A single payment transaction request (including conveyed). */
  paymentTransaction?: Maybe<PaymentTransaction>;
  /** A summary of transaction aggregates (counts and amounts, including conveyed transactions) by pertinent transaction type, currency, card brand, and transaction activity date. */
  paymentTransactionSummaries?: Maybe<PaymentTransactionSummaryCollection>;
  /** A list of payment transaction requests (including conveyed) submitted on the pertinent transaction activity dates. Use this report as an operational tool to reconcile against your internal record of submitted transactions. */
  paymentTransactions?: Maybe<PaymentTransactionCollection>;
  /** Retrieves information about permissions. */
  permissions: PermissionCollection;
  /** Retrieves information about users in the organization. */
  users: UserCollection;
}

/** This query returns that status of the async reports */
export interface QueryAchNotificationsOfChangeArgs {
  input: AchNotificationOfChangeInput;
}

/** This query returns that status of the async reports */
export interface QueryAchReturnsArgs {
  input: AchReturnsInput;
}

/** This query returns that status of the async reports */
export interface QueryApplicationEntitiesArgs {
  input: ApplicationEntitiesInput;
}

/** This query returns that status of the async reports */
export interface QueryApplicationsArgs {
  input: ApplicationInput;
}

/** This query returns that status of the async reports */
export interface QueryAsyncReportArgs {
  input: AsyncReportInput;
}

/** This query returns that status of the async reports */
export interface QueryAuthorizationSummariesArgs {
  input: AuthorizationSummaryInput;
}

/** This query returns that status of the async reports */
export interface QueryDisputesArgs {
  input: DisputesQueryInput;
}

/** This query returns that status of the async reports */
export interface QueryFeeSummariesArgs {
  input: FeeSummaryInput;
}

/** This query returns that status of the async reports */
export interface QueryFeesArgs {
  input: FeeInput;
}

/** This query returns that status of the async reports */
export interface QueryFundingDisputeEventsArgs {
  input: FundingDisputeEventInput;
}

/** This query returns that status of the async reports */
export interface QueryFundingSummariesArgs {
  input: FundingSummariesInput;
}

/** This query returns that status of the async reports */
export interface QueryFundingTransactionsArgs {
  input: FundingTransactionInput;
}

/** This query returns that status of the async reports */
export interface QueryPaymentTransactionArgs {
  id: Scalars['UUID']['input'];
}

/** This query returns that status of the async reports */
export interface QueryPaymentTransactionSummariesArgs {
  input: PaymentTransactionSummaryInput;
}

/** This query returns that status of the async reports */
export interface QueryPaymentTransactionsArgs {
  input: PaymentTransactionsInput;
}

/** This query returns that status of the async reports */
export interface QueryPermissionsArgs {
  input: PermissionInput;
}

/** This query returns that status of the async reports */
export interface QueryUsersArgs {
  input: UserInput;
}

export interface RecordNotFoundError extends Error {
  __typename?: 'RecordNotFoundError';
  id: Scalars['UUID']['output'];
  message: Scalars['String']['output'];
  recordType: Scalars['String']['output'];
}

/** Indicates whether a transaction or event is a one-time occurrence or a repeating occurrence. */
export const RecurringType = {
  /** A transaction or event that occurs repeatedly on a regular basis. */
  Recurring: 'RECURRING',
  /** A one-time transaction or event that occurs only once. */
  Single: 'SINGLE',
} as const;

export type RecurringType = (typeof RecurringType)[keyof typeof RecurringType];
export interface Refund {
  acceptor: Acceptor;
  /** The Acquirer Reference Number (ARN) is a unique 23 digit number created by Tesouro and assigned to a transaction to allow the acquiring and issuing banks to trace the transaction until it is funded to the bank. */
  acquirerReferenceNumber?: Maybe<Scalars['String']['output']>;
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff. */
  activityDate?: Maybe<Scalars['Date']['output']>;
  /** Components of the requested amount that may or may not have been provided by the presenter on the payment transaction request. */
  amountDetails?: Maybe<AmountDetails>;
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /**
   * The amount of convenience fees associated with this transaction
   * @deprecated Use amountDetails.convenienceFee instead.
   */
  convenienceFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The currency specified on the transaction request, in ISO 4217 alpha currency code format. */
  currency?: Maybe<Scalars['String']['output']>;
  /**
   * The total amount of fees applicable to this transaction.
   * @deprecated Use fees.summary.totalAmount instead.
   */
  feeTotalAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Aggregate information for assessed fees */
  fees?: Maybe<FeeDetails>;
  /** The currency of the funded transaction, formatted in ISO 4217 alphabetic code. */
  fundingCurrency?: Maybe<Scalars['String']['output']>;
  /** The total amount of the transaction converted to its funding currency, before any fees are deducted. */
  fundingGrossAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The amount to be funded after deducting the applicable fees. Presented in the funding currency. */
  fundingNetAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Details on the funds transfer containing this transaction's funding amount. */
  fundsTransfer?: Maybe<FundsTransfer>;
  /** A unique identifier assigned by Tesouro for every transaction request received. */
  id: Scalars['UUID']['output'];
  /**
   * The amount of interchange fees applicable to the transaction. Interchange fees are set by the card networks, and paid to the bank that issued the card used for the transaction.
   * @deprecated Use fees.summary.interchangeAmount instead.
   */
  interchangeFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Indicates if the funding amount has been released. Defined as having a funds transfer ID and funds transfer release date. */
  isFunded: Scalars['Boolean']['output'];
  /** Line items associated with the payment transaction. */
  lineItems?: Maybe<Array<LineItem>>;
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  merchantCategory?: Maybe<Scalars['String']['output']>;
  /**
   * The amount of network fees applicable to this transaction. Network fees are set by card networks and are paid to the card network.
   * @deprecated Use fees.summary.networkAmount instead.
   */
  networkFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** A response code provided by the card network identifying the specific approval or decline reason. */
  networkResponseCode?: Maybe<Scalars['String']['output']>;
  /** A unique value created by the card network and assigned to the transaction and returned to Tesouro in the authorization response. The card network uses this value to maintain an audit trail throughout the life cycle of the transaction and all related transactions, such as reversals, adjustments, confirmations and charge-backs. */
  networkTransactionId?: Maybe<Scalars['String']['output']>;
  /** Information concerning the order placed by the customer. */
  order: Order;
  organization: Organization;
  /**
   * The amount of partner fees applicable to this transaction. Partner fees are set by and paid to the partner.
   * @deprecated Use fees.summary.partnerAmount instead.
   */
  partnerFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The card-present or card-not-present channel from which the customer makes a payment, e.g., In-store using a physical card terminal, online, or over the phone or through mail order. */
  paymentChannel: PaymentChannel;
  /** The means by which the payment details are captured, e.g., Card swipe, contactless "tap", chip entry "dip", keyed, etc. */
  paymentEntryMode: PaymentEntryMode;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Refers to the various options available for customers to make payments when purchasing a product or service. */
  paymentMethod: PaymentMethod;
  /** The payment network that the transaction was sent across, which may be unaffiliated with the card brand. */
  processingNetwork: Network;
  /**
   * The amount of processor fees applicable to this transaction. Processor fees are set by and paid to Tesouro.
   * @deprecated Use fees.summary.processorAmount instead.
   */
  processorFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** A response code provided by Tesouro identifying the specific approval or decline reason. */
  processorResponseCode: ProcessorResponseCode;
  /** A human readable description of the authorization response code. e.g., Insufficient funds. */
  processorResponseMessage: Scalars['String']['output'];
  /** A unique transaction identifier created by the entity holding the direct relationship with the Acceptor. Tesouro uses this identifier to manage idempotency. */
  reference?: Maybe<Scalars['String']['output']>;
  /** The transaction amount submitted with the authorization request. */
  requestedAmount: Scalars['Decimal']['output'];
  /** The result of the authorization request, e.g., Approved or Declined. */
  responseType?: Maybe<ResponseType>;
  /**
   * The amount of service fees associated with this transaction
   * @deprecated Use amountDetails.serviceFee instead.
   */
  serviceFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /**
   * The amount of surcharge associated with this transaction
   * @deprecated Use amountDetails.surcharge instead.
   */
  surchargeAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The tax identification number (TIN) is a unique identifier created by the national government and associated with the acceptor at the time the transaction was submitted */
  taxIdentificationNumber?: Maybe<Scalars['String']['output']>;
  /** The various tax amounts collected on the payment transaction. */
  taxes?: Maybe<Taxes>;
  /** The date and time that Tesouro received the transaction, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime: Scalars['DateTime']['output'];
  /** The type of payment transaction, e.g., Authorization, Capture, Sale, Refund, Reversal, etc. */
  transactionType: PaymentTransactionType;
}

export interface RefundAuthorization {
  acceptor: Acceptor;
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff. */
  activityDate?: Maybe<Scalars['Date']['output']>;
  /** Components of the requested amount that may or may not have been provided by the presenter on the payment transaction request. */
  amountDetails?: Maybe<AmountDetails>;
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /** The currency specified on the transaction request, in ISO 4217 alpha currency code format. */
  currency?: Maybe<Scalars['String']['output']>;
  /** Aggregate information for assessed fees */
  fees?: Maybe<FeeDetails>;
  /** A unique identifier assigned by Tesouro for every transaction request received. */
  id: Scalars['UUID']['output'];
  /** Line items associated with the payment transaction. */
  lineItems?: Maybe<Array<LineItem>>;
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  merchantCategory?: Maybe<Scalars['String']['output']>;
  /** The result of the name verification service, which checks if the cardholder name submitted with the transaction matches what is on record with the issuer. */
  nameVerification?: Maybe<NameVerificationResponseCode>;
  /** A response code provided by the card network identifying the specific approval or decline reason. */
  networkResponseCode?: Maybe<Scalars['String']['output']>;
  /** A unique value created by the card network and assigned to the transaction and returned to Tesouro in the authorization response. The card network uses this value to maintain an audit trail throughout the life cycle of the transaction and all related transactions, such as reversals, adjustments, confirmations and charge-backs. */
  networkTransactionId?: Maybe<Scalars['String']['output']>;
  /** Information concerning the order placed by the customer. */
  order: Order;
  organization: Organization;
  /** The card-present or card-not-present channel from which the customer makes a payment, e.g., In-store using a physical card terminal, online, or over the phone or through mail order. */
  paymentChannel: PaymentChannel;
  /** The means by which the payment details are captured, e.g., Card swipe, contactless "tap", chip entry "dip", keyed, etc. */
  paymentEntryMode: PaymentEntryMode;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Refers to the various options available for customers to make payments when purchasing a product or service. */
  paymentMethod: PaymentMethod;
  /** The payment network that the transaction was sent across, which may be unaffiliated with the card brand. */
  processingNetwork: Network;
  /** A response code provided by Tesouro identifying the specific approval or decline reason. */
  processorResponseCode: ProcessorResponseCode;
  /** A human readable description of the authorization response code. e.g., Insufficient funds. */
  processorResponseMessage: Scalars['String']['output'];
  /** A unique transaction identifier created by the entity holding the direct relationship with the Acceptor. Tesouro uses this identifier to manage idempotency. */
  reference?: Maybe<Scalars['String']['output']>;
  /** The transaction amount submitted with the authorization request. */
  requestedAmount: Scalars['Decimal']['output'];
  /** The result of the authorization request, e.g., Approved or Declined. */
  responseType?: Maybe<ResponseType>;
  /** The result of the card security code verification service, which checks if the CVV2/CVC2/CID submitted with the transaction matches what is on record with the issuer. */
  securityCodeVerification?: Maybe<SecurityCodeResponse>;
  /** The tax identification number (TIN) is a unique identifier created by the national government and associated with the acceptor at the time the transaction was submitted */
  taxIdentificationNumber?: Maybe<Scalars['String']['output']>;
  /** The various tax amounts collected on the payment transaction. */
  taxes?: Maybe<Taxes>;
  /** The date and time that Tesouro received the transaction, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime: Scalars['DateTime']['output'];
  /** The type of payment transaction, e.g., Authorization, Capture, Sale, Refund, Reversal, etc. */
  transactionType: PaymentTransactionType;
}

export interface RefundPreviousPaymentAmountDetails {
  __typename?: 'RefundPreviousPaymentAmountDetails';
  /** The approved amount from the network. */
  approvedAmount: Scalars['Decimal']['output'];
  /** The purchasing currency code of the transaction. */
  currency: TransactionAmountCurrencyCode;
  /** The original request amount. */
  requestedAmount: Scalars['Decimal']['output'];
}

export interface RefundPreviousPaymentApproval extends RefundPreviousPaymentResponse {
  __typename?: 'RefundPreviousPaymentApproval';
  /** The date Tesouro received the transaction based on acceptor cutoff time */
  activityDate: Scalars['Date']['output'];
  /**
   * Details related to the card used on the transaction
   * @deprecated Use paymentMethodResponse instead.
   */
  cardDetails?: Maybe<CardInformation>;
  /**
   * Difference between request receipt and response in milliseconds.
   * @deprecated New durations coming soon.
   */
  duration: Scalars['Int']['output'];
  /** Result of Tesouro's idempotency check. If the transaction reference matches that of another transaction from that presenter it will be treated as a duplicate. */
  isDuplicateRequest: Scalars['Boolean']['output'];
  /**
   * A six-digit code returned from the network on APPROVED authorizations, and displayed on the customer's receipt. If the authorization is declined, this field will be blank.
   * @deprecated Use paymentMethodResponse instead.
   */
  networkApprovalCode: Scalars['String']['output'];
  /**
   * The response code from the network.
   * @deprecated Use paymentMethodResponse instead.
   */
  networkResponseDetails: NetworkResponseDetails;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Details related to the payment method used on the transaction */
  paymentMethodResponse: PaymentMethodResponse;
  refundPreviousPaymentAmountDetails: RefundPreviousPaymentAmountDetails;
  /** The UTC date and time the transaction was received by Tesouro. */
  timestampUtc: Scalars['DateTime']['output'];
  /** Details associated with the token generated on a tokenization request. */
  tokenDetails?: Maybe<TokenDetails>;
  /** A unique identifier created by Tesouro and assigned to the transaction. */
  transactionId: Scalars['UUID']['output'];
}

export interface RefundPreviousPaymentDecline extends RefundPreviousPaymentResponse {
  __typename?: 'RefundPreviousPaymentDecline';
  /** The date Tesouro received the transaction based on acceptor cutoff time */
  activityDate: Scalars['Date']['output'];
  /**
   * Details related to the card used on the transaction
   * @deprecated Use paymentMethodResponse instead.
   */
  cardDetails?: Maybe<CardInformation>;
  /** Specifies the type of response, e.g. SOFT_DECLINE, HARD_DECLINE, REFERRAL. */
  declineType: DeclineType;
  /**
   * Difference between request receipt and response in milliseconds.
   * @deprecated New durations coming soon.
   */
  duration: Scalars['Int']['output'];
  /** Result of Tesouro's idempotency check. If the transaction reference matches that of another transaction from that presenter it will be treated as a duplicate. */
  isDuplicateRequest: Scalars['Boolean']['output'];
  /** A detailed description of the response code. e.g., Insufficient funds. */
  message: Scalars['String']['output'];
  /**
   * The response code from the network.
   * @deprecated Use paymentMethodResponse instead.
   */
  networkResponseDetails: NetworkResponseDetails;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Details related to the payment method used on the transaction */
  paymentMethodResponse: PaymentMethodResponse;
  /** When an authorization is declined, Tesouro will provide advice on what can be done to remedy, and/or prevent this type of response from occurring in the future. */
  processorAdvice: Scalars['String']['output'];
  /** The UTC date and time the transaction was received by Tesouro. */
  timestampUtc: Scalars['DateTime']['output'];
  /** Details associated with the token generated on a tokenization request. */
  tokenDetails?: Maybe<TokenDetails>;
  /** A unique identifier created by Tesouro and assigned to the transaction. */
  transactionId: Scalars['UUID']['output'];
}

export type RefundPreviousPaymentError =
  | InternalServiceError
  | PriorPaymentNotFoundError
  | RuleInViolationError
  | SyntaxOnNetworkResponseError
  | TimeoutOnNetworkResponseError
  | ValidationFailureError;

/** Top-level input fields for creating a refund transaction for a previous payment. */
export interface RefundPreviousPaymentInput {
  /** A unique, 36 character identifier created by Tesouro and assigned to the entity providing the goods or services to the cardholder, such as a Merchant, a Submerchant of a Payment Facilitator, a Seller within a Marketplace, or a Biller of a Consumer Bill Payment Service Provider (CBPS). Historically, processors have called this identifier the Merchant ID (or MID), Outlet ID, or Customer number. */
  acceptorId: Scalars['UUID']['input'];
  /** Line item details for this order. If line items are provided on the refund any line items from the original authorization will be overridden. If line items are provided, transactionAmountDetails must be provided. */
  lineItems?: InputMaybe<Array<LineItemInput>>;
  /** Details pertaining to the customer's order. If null, order details from the original authorization will be used. If provided, all details from the original authorization will be overridden. */
  orderDetails?: InputMaybe<OrderDetailsInput>;
  /** The unique 'paymentId' of the payment that is to be refunded. */
  paymentId: Scalars['UUID']['input'];
  /** The partial or full amount of the transaction to be refunded. If you do not specify an amount, Tesouro will refund the full amount. */
  transactionAmountDetails?: InputMaybe<AmountDetailsInput>;
  /** A unique identifier created by the entity holding the direct relationship with the Acceptor, and used by that entity for reconciliation and transaction search. Tesouro uses this identifier to manage idempotency. */
  transactionReference: Scalars['Max36Text']['input'];
}

export interface RefundPreviousPaymentPayload {
  __typename?: 'RefundPreviousPaymentPayload';
  errors?: Maybe<Array<RefundPreviousPaymentError>>;
  refundPreviousPaymentResponse?: Maybe<RefundPreviousPaymentResponse>;
}

/** Contains the details of the payment method used for the transaction. */
export interface RefundPreviousPaymentResponse {
  /** The date Tesouro received the transaction based on acceptor cutoff time */
  activityDate: Scalars['Date']['output'];
  /**
   * Details related to the card used on the transaction
   * @deprecated Use paymentMethodResponse instead.
   */
  cardDetails?: Maybe<CardInformation>;
  /**
   * Difference between request receipt and response in milliseconds.
   * @deprecated New durations coming soon.
   */
  duration: Scalars['Int']['output'];
  /** Result of Tesouro's idempotency check. If the transaction reference matches that of another transaction from that presenter it will be treated as a duplicate. */
  isDuplicateRequest: Scalars['Boolean']['output'];
  /**
   * The response code from the network.
   * @deprecated Use paymentMethodResponse instead.
   */
  networkResponseDetails: NetworkResponseDetails;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Details related to the payment method used on the transaction */
  paymentMethodResponse: PaymentMethodResponse;
  /** The UTC date and time the transaction was received by Tesouro. */
  timestampUtc: Scalars['DateTime']['output'];
  /** Details associated with the token generated on a tokenization request. */
  tokenDetails?: Maybe<TokenDetails>;
  /** A unique identifier created by Tesouro and assigned to the transaction. */
  transactionId: Scalars['UUID']['output'];
}

export interface RefundWithoutPreviousPaymentAcquirerTokenDetailsInput {
  /** The two-digit month (MM) of the card's expiration date. */
  expirationMonth: Scalars['NumericMonth']['input'];
  /** The four-digit year (YYYY) of the card's expiration date. */
  expirationYear: Scalars['NumericYear4Digits']['input'];
  /** The 3 digit number (or 4 digit if American Express) found on the customer's card, or the specific reason if the security code is omitted from the request. */
  securityCode: SecurityCodeInput;
  /** The value of the acquirer token. */
  token?: InputMaybe<Scalars['String']['input']>;
  /** The value of the acquirer token. */
  tokenizedPan?: InputMaybe<Scalars['String']['input']>;
  /** The wallet provider for this payment method. Null if not applicable. */
  walletType?: InputMaybe<WalletType>;
}

export interface RefundWithoutPreviousPaymentAmountDetails {
  __typename?: 'RefundWithoutPreviousPaymentAmountDetails';
  /** The approved amount from the network. */
  approvedAmount: Scalars['Decimal']['output'];
  /** The purchasing currency code of the transaction. */
  currency: TransactionAmountCurrencyCode;
  /** The original request amount. */
  requestedAmount: Scalars['Decimal']['output'];
}

export interface RefundWithoutPreviousPaymentApproval extends RefundWithoutPreviousPaymentResponse {
  __typename?: 'RefundWithoutPreviousPaymentApproval';
  /** The date Tesouro received the transaction based on acceptor cutoff time */
  activityDate: Scalars['Date']['output'];
  /** Details related to the card used on the transaction */
  cardDetails?: Maybe<CardInformation>;
  /**
   * Difference between request receipt and response in milliseconds.
   * @deprecated New durations coming soon.
   */
  duration: Scalars['Int']['output'];
  /** Result of Tesouro's idempotency check. If the transaction reference matches that of another transaction from that presenter it will be treated as a duplicate. */
  isDuplicateRequest: Scalars['Boolean']['output'];
  /** The response code from the network. */
  networkResponseDetails: NetworkResponseDetails;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Amount information will be returned here. */
  refundWithoutPreviousPaymentAmountDetails: RefundWithoutPreviousPaymentAmountDetails;
  /** The UTC date and time the transaction was received by Tesouro. */
  timestampUtc: Scalars['DateTime']['output'];
  /** Details associated with the token generated on a tokenization request. */
  tokenDetails?: Maybe<TokenDetails>;
  /** A unique identifier created by Tesouro and assigned to the transaction. */
  transactionId: Scalars['UUID']['output'];
}

export interface RefundWithoutPreviousPaymentCardWithPanDetailsInput {
  /** The card number used in processing the transaction. This is a full PAN. */
  accountNumber: Scalars['CardNumber']['input'];
  /** The two-digit month (MM) of the card's expiration date. */
  expirationMonth: Scalars['NumericMonth']['input'];
  /** The four-digit year (YYYY) of the card's expiration date. */
  expirationYear: Scalars['NumericYear4Digits']['input'];
  /** [DEPRECATED: Use root level channel instead] The card-present or card-not-present channel from which the customer makes a payment, e.g., In-store using a physical card terminal, online, or over the phone or through mail order */
  paymentChannel?: InputMaybe<PanEntryChannel>;
  /** The means by which the card number was entered. */
  paymentEntryMode: PanEntryMode;
  /** The 3 digit number (or 4 digit if American Express) found on the customer's card, or the specific reason if the security code is omitted from the request. */
  securityCode: SecurityCodeInput;
  /** The wallet provider for this payment method. Null if not applicable. */
  walletType?: InputMaybe<WalletType>;
}

export interface RefundWithoutPreviousPaymentDecline extends RefundWithoutPreviousPaymentResponse {
  __typename?: 'RefundWithoutPreviousPaymentDecline';
  /** The date Tesouro received the transaction based on acceptor cutoff time */
  activityDate: Scalars['Date']['output'];
  /** Details related to the card used on the transaction */
  cardDetails?: Maybe<CardInformation>;
  /** Specifies the type of response, e.g. SOFT_DECLINE, HARD_DECLINE, REFERRAL. */
  declineType: DeclineType;
  /**
   * Difference between request receipt and response in milliseconds.
   * @deprecated New durations coming soon.
   */
  duration: Scalars['Int']['output'];
  /** Result of Tesouro's idempotency check. If the transaction reference matches that of another transaction from that presenter it will be treated as a duplicate. */
  isDuplicateRequest: Scalars['Boolean']['output'];
  /** A detailed description of the response code. e.g., Insufficient funds. */
  message: Scalars['String']['output'];
  /** The response code from the network. */
  networkResponseDetails: NetworkResponseDetails;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** When an authorization is declined, Tesouro will provide advice on what can be done to remedy, and/or prevent this type of response from occurring in the future. */
  processorAdvice: Scalars['String']['output'];
  /** The UTC date and time the transaction was received by Tesouro. */
  timestampUtc: Scalars['DateTime']['output'];
  /** Details associated with the token generated on a tokenization request. */
  tokenDetails?: Maybe<TokenDetails>;
  /** A unique identifier created by Tesouro and assigned to the transaction. */
  transactionId: Scalars['UUID']['output'];
}

export type RefundWithoutPreviousPaymentError =
  | AcceptorNotFoundError
  | InternalServiceError
  | InvalidTokenError
  | RouteNotFoundError
  | RuleInViolationError
  | SyntaxOnNetworkResponseError
  | TimeoutOnNetworkResponseError
  | TokenNotFoundError
  | UnknownCardError
  | ValidationFailureError;

/** Use if the original payment has expired or is not available. */
export interface RefundWithoutPreviousPaymentInput {
  /** A unique, 36 character identifier created by Tesouro and assigned to the entity providing the goods or services to the cardholder, such as a Merchant, a Submerchant of a Payment Facilitator, a Seller within a Marketplace, or a Biller of a Consumer Bill Payment Service Provider (CBPS). Historically, processors have called this identifier the Merchant ID (or MID), Outlet ID, or Customer number. */
  acceptorId: Scalars['UUID']['input'];
  /** How the consumer interacts with the acceptor. Defaults to ECOMMERCE if not provided. */
  channel?: PaymentChannel;
  /** Line item details for this order. */
  lineItems?: InputMaybe<Array<LineItemInput>>;
  /** Details pertaining to the customer's order. */
  orderDetails?: InputMaybe<OrderDetailsInput>;
  /** Details regarding the payment method. */
  paymentMethodDetails: RefundWithoutPreviousPaymentPaymentMethodInput;
  /** The billing address associated with the payment method being refunded. */
  refundToAddress?: InputMaybe<AddressDetailsInput>;
  /** Specifies the total amount of the transaction and its currency. */
  transactionAmountDetails: AmountDetailsInput;
  /** A unique identifier created by the entity holding the direct relationship with the Acceptor, and used by that entity for reconciliation and transaction search. Tesouro uses this identifier to manage idempotency. */
  transactionReference: Scalars['Max36Text']['input'];
}

export interface RefundWithoutPreviousPaymentNetworkTokenPassThroughDetailsInput {
  /** The cryptogram generated by the token provider to be used on the transaction. */
  cryptogram: Scalars['String']['input'];
  /** Ecommerce indicator provided by the wallet provider. */
  ecommerceIndicator?: InputMaybe<Scalars['String']['input']>;
  /** The two-digit month (MM) of the card's expiration date. */
  expirationMonth: Scalars['NumericMonth']['input'];
  /** The four-digit year (YYYY) of the card's expiration date. */
  expirationYear: Scalars['NumericYear4Digits']['input'];
  /** [DEPRECATED: Network tokens do not have security codes, so this will be removed.] The 3 digit number (or 4 digit if American Express) found on the customer's card, or the specific reason if the security code is omitted from the request. */
  securityCode?: InputMaybe<SecurityCodeInput>;
  /** The value of the network token. */
  tokenValue: Scalars['String']['input'];
  /** The wallet provider for this payment method. Null if not applicable. */
  walletType?: InputMaybe<WalletType>;
}

export interface RefundWithoutPreviousPaymentPayload {
  __typename?: 'RefundWithoutPreviousPaymentPayload';
  errors?: Maybe<Array<RefundWithoutPreviousPaymentError>>;
  refundWithoutPreviousPaymentResponse?: Maybe<RefundWithoutPreviousPaymentResponse>;
}

export interface RefundWithoutPreviousPaymentPaymentMethodInput {
  acquirerTokenDetails?: InputMaybe<RefundWithoutPreviousPaymentAcquirerTokenDetailsInput>;
  cardWithPanDetails?: InputMaybe<RefundWithoutPreviousPaymentCardWithPanDetailsInput>;
  networkTokenPassThroughDetails?: InputMaybe<RefundWithoutPreviousPaymentNetworkTokenPassThroughDetailsInput>;
}

export interface RefundWithoutPreviousPaymentResponse {
  /** The date Tesouro received the transaction based on acceptor cutoff time */
  activityDate: Scalars['Date']['output'];
  /** Details related to the card used on the transaction */
  cardDetails?: Maybe<CardInformation>;
  /**
   * Difference between request receipt and response in milliseconds.
   * @deprecated New durations coming soon.
   */
  duration: Scalars['Int']['output'];
  /** Result of Tesouro's idempotency check. If the transaction reference matches that of another transaction from that presenter it will be treated as a duplicate. */
  isDuplicateRequest: Scalars['Boolean']['output'];
  /** The response code from the network. */
  networkResponseDetails: NetworkResponseDetails;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** The UTC date and time the transaction was received by Tesouro. */
  timestampUtc: Scalars['DateTime']['output'];
  /** Details associated with the token generated on a tokenization request. */
  tokenDetails?: Maybe<TokenDetails>;
  /** A unique identifier created by Tesouro and assigned to the transaction. */
  transactionId: Scalars['UUID']['output'];
}

export interface ReportAvailability {
  __typename?: 'ReportAvailability';
  /** The latest available date for querying reports with the selected date type. This date will vary based on data processing timelines. */
  availabilityEndDate?: Maybe<Scalars['Date']['output']>;
  /** The first available date for querying reports with the selected date type. This date will vary based on data processing timelines. */
  availabilityStartDate?: Maybe<Scalars['Date']['output']>;
  /** Specifies the type of date available for report queries, such as the activity date or funding date. */
  dateType: ReportAvailabilityDateType;
}

export const ReportAvailabilityDateType = {
  ActivityDate: 'ACTIVITY_DATE',
  FundingDate: 'FUNDING_DATE',
} as const;

export type ReportAvailabilityDateType =
  (typeof ReportAvailabilityDateType)[keyof typeof ReportAvailabilityDateType];
/** The input fields for challenging a dispute's first chargeback. */
export interface RepresentFirstChargebackInput {
  /** A list of dispute attachment IDs to submit as evidence for the challenge. */
  attachmentIds: Array<Scalars['UUID']['input']>;
  /** The ID of the dispute to challenge. */
  disputeId: Scalars['UUID']['input'];
}

export type RespondToDisputeError =
  | AttachmentsRequiredError
  | AuthenticationError
  | ExpirationDateExceededError
  | ForbiddenError
  | InvalidAssignmentError
  | NotImplementedError
  | RecordNotFoundError;

/** Top-level input type for responding to a dispute. */
export interface RespondToDisputeInput {
  accept?: InputMaybe<AcceptDisputeInput>;
  represent?: InputMaybe<RepresentFirstChargebackInput>;
}

export interface RespondToDisputePayload {
  __typename?: 'RespondToDisputePayload';
  dispute?: Maybe<Dispute>;
  errors?: Maybe<Array<RespondToDisputeError>>;
}

export interface Response {
  __typename?: 'Response';
  code: Scalars['String']['output'];
  message: Scalars['String']['output'];
}

/** The types of responses on authorization requests */
export const ResponseType = {
  Approval: 'APPROVAL',
  HardDecline: 'HARD_DECLINE',
  Reject: 'REJECT',
  SoftDecline: 'SOFT_DECLINE',
} as const;

export type ResponseType = (typeof ResponseType)[keyof typeof ResponseType];
export interface Reversal {
  acceptor: Acceptor;
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff. */
  activityDate?: Maybe<Scalars['Date']['output']>;
  /** The result of the address verification service (AVS), which checks if the cardholder address submitted with the transaction matches what is on record with the issuer. */
  addressVerification?: Maybe<AvsResponse>;
  /** Components of the requested amount that may or may not have been provided by the presenter on the payment transaction request. */
  amountDetails?: Maybe<AmountDetails>;
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /** The currency specified on the transaction request, in ISO 4217 alpha currency code format. */
  currency?: Maybe<Scalars['String']['output']>;
  /** Aggregate information for assessed fees */
  fees?: Maybe<FeeDetails>;
  /** A unique identifier assigned by Tesouro for every transaction request received. */
  id: Scalars['UUID']['output'];
  /** Line items associated with the payment transaction. */
  lineItems?: Maybe<Array<LineItem>>;
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  merchantCategory?: Maybe<Scalars['String']['output']>;
  /** The result of the name verification service, which checks if the cardholder name submitted with the transaction matches what is on record with the issuer. */
  nameVerification?: Maybe<NameVerificationResponseCode>;
  /** A response code provided by the card network identifying the specific approval or decline reason. */
  networkResponseCode?: Maybe<Scalars['String']['output']>;
  /** A unique value created by the card network and assigned to the transaction and returned to Tesouro in the authorization response. The card network uses this value to maintain an audit trail throughout the life cycle of the transaction and all related transactions, such as reversals, adjustments, confirmations and charge-backs. */
  networkTransactionId?: Maybe<Scalars['String']['output']>;
  /** Information concerning the order placed by the customer. */
  order: Order;
  organization: Organization;
  /** The transaction ID of the authorization being reversed. */
  originalAuthorizationTransactionId?: Maybe<Scalars['UUID']['output']>;
  /** The card-present or card-not-present channel from which the customer makes a payment, e.g., In-store using a physical card terminal, online, or over the phone or through mail order. */
  paymentChannel: PaymentChannel;
  /** The means by which the payment details are captured, e.g., Card swipe, contactless "tap", chip entry "dip", keyed, etc. */
  paymentEntryMode: PaymentEntryMode;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Refers to the various options available for customers to make payments when purchasing a product or service. */
  paymentMethod: PaymentMethod;
  /** The payment network that the transaction was sent across, which may be unaffiliated with the card brand. */
  processingNetwork: Network;
  /** A response code provided by Tesouro identifying the specific approval or decline reason. */
  processorResponseCode: ProcessorResponseCode;
  /** A human readable description of the authorization response code. e.g., Insufficient funds. */
  processorResponseMessage: Scalars['String']['output'];
  /** A unique transaction identifier created by the entity holding the direct relationship with the Acceptor. Tesouro uses this identifier to manage idempotency. */
  reference?: Maybe<Scalars['String']['output']>;
  /** The transaction amount submitted with the authorization request. */
  requestedAmount: Scalars['Decimal']['output'];
  /** The result of the authorization request, e.g., Approved or Declined. */
  responseType?: Maybe<ResponseType>;
  /** The result of the card security code verification service, which checks if the CVV2/CVC2/CID submitted with the transaction matches what is on record with the issuer. */
  securityCodeVerification?: Maybe<SecurityCodeResponse>;
  /** The tax identification number (TIN) is a unique identifier created by the national government and associated with the acceptor at the time the transaction was submitted */
  taxIdentificationNumber?: Maybe<Scalars['String']['output']>;
  /** The various tax amounts collected on the payment transaction. */
  taxes?: Maybe<Taxes>;
  /** The date and time that Tesouro received the transaction, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime: Scalars['DateTime']['output'];
  /** The type of payment transaction, e.g., Authorization, Capture, Sale, Refund, Reversal, etc. */
  transactionType: PaymentTransactionType;
}

export interface ReversalAmountDetails {
  __typename?: 'ReversalAmountDetails';
  /** The approved amount from the network. */
  approvedAmount: Scalars['Decimal']['output'];
  /** The purchasing currency code of the transaction. */
  currency: TransactionAmountCurrencyCode;
  /** The original request amount. */
  requestedAmount: Scalars['Decimal']['output'];
}

export interface ReverseTransactionAmountInput {
  /** The base transaction amount intended to be collected by this payment not including any cashback, gratuity, fees, or taxes. */
  baseAmount?: InputMaybe<Scalars['DecimalAmount']['input']>;
  /** The cash back amount. */
  cashBackAmount?: InputMaybe<Scalars['DecimalAmount']['input']>;
  /** The purchasing currency code of the request amount. */
  currency: TransactionAmountCurrencyCode;
  /** The gratuity amount. */
  gratuityAmount?: InputMaybe<Scalars['DecimalAmount']['input']>;
  /** The sum of all item costs in the transaction before applying any additional charges such as taxes, or fees */
  subtotalAmount?: InputMaybe<Scalars['DecimalAmount']['input']>;
  /** The requested amount intended to be collected by this transaction. A positive decimal with precision depending on transaction currency. For example: $10.00 would be 10.00 or 10. */
  totalAmount: Scalars['Decimal']['input'];
}

export interface ReverseTransactionApproval extends ReverseTransactionResponse {
  __typename?: 'ReverseTransactionApproval';
  /** The date Tesouro received the transaction based on acceptor cutoff time */
  activityDate: Scalars['Date']['output'];
  /** Details related to the card used on the transaction */
  cardDetails?: Maybe<CardInformation>;
  /**
   * Difference between request receipt and response in milliseconds.
   * @deprecated New durations coming soon.
   */
  duration: Scalars['Int']['output'];
  /** Result of Tesouro's idempotency check. If the transaction reference matches that of another transaction from that presenter it will be treated as a duplicate. */
  isDuplicateRequest: Scalars['Boolean']['output'];
  /** The response code from the network. */
  networkResponseDetails: NetworkResponseDetails;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Amount information will be returned here. */
  reversalAmountDetails: ReversalAmountDetails;
  /** The UTC date and time the transaction was received by Tesouro. */
  timestampUtc: Scalars['DateTime']['output'];
  /** Details associated with the token generated on a tokenization request. */
  tokenDetails?: Maybe<TokenDetails>;
  /** A unique identifier created by Tesouro and assigned to the transaction. */
  transactionId: Scalars['UUID']['output'];
}

export interface ReverseTransactionDecline extends ReverseTransactionResponse {
  __typename?: 'ReverseTransactionDecline';
  /** The date Tesouro received the transaction based on acceptor cutoff time */
  activityDate: Scalars['Date']['output'];
  /** Details related to the card used on the transaction */
  cardDetails?: Maybe<CardInformation>;
  /** A detailed description of the response code. e.g., Insufficient funds. */
  declineType: DeclineType;
  /**
   * Difference between request receipt and response in milliseconds.
   * @deprecated New durations coming soon.
   */
  duration: Scalars['Int']['output'];
  /** Result of Tesouro's idempotency check. If the transaction reference matches that of another transaction from that presenter it will be treated as a duplicate. */
  isDuplicateRequest: Scalars['Boolean']['output'];
  /** A detailed description of the response code. e.g., Insufficient funds. */
  message: Scalars['String']['output'];
  /** The response code from the network. */
  networkResponseDetails: NetworkResponseDetails;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** When an authorization is declined, Tesouro will provide advice on what can be done to remedy, and/or prevent this type of response from occurring in the future. */
  processorAdvice: Scalars['String']['output'];
  /** The UTC date and time the transaction was received by Tesouro. */
  timestampUtc: Scalars['DateTime']['output'];
  /** Details associated with the token generated on a tokenization request. */
  tokenDetails?: Maybe<TokenDetails>;
  /** A unique identifier created by Tesouro and assigned to the transaction. */
  transactionId: Scalars['UUID']['output'];
}

export type ReverseTransactionError =
  | InternalServiceError
  | PriorTransactionNotFoundError
  | RuleInViolationError
  | SyntaxOnNetworkResponseError
  | TimeoutOnNetworkResponseError
  | ValidationFailureError;

/** Top-level input fields for creating a reversal transaction for a previous transaction. */
export interface ReverseTransactionInput {
  /** A unique, 36 character identifier created by Tesouro and assigned to the entity providing the goods or services to the cardholder, such as a Merchant, a Submerchant of a Payment Facilitator, a Seller within a Marketplace, or a Biller of a Consumer Bill Payment Service Provider (CBPS). Historically, processors have called this identifier the Merchant ID (or MID), Outlet ID, or Customer number. */
  acceptorId: Scalars['UUID']['input'];
  /** The partial or full amount of the transaction to be reversed. If you do not specify an amount, Tesouro will reverse the full amount. */
  transactionAmountDetails?: InputMaybe<ReverseTransactionAmountInput>;
  /** The unique 'transactionId' of the previously authorized transaction that is to be reversed. */
  transactionId: Scalars['UUID']['input'];
  /** A unique identifier created by the entity holding the direct relationship with the Acceptor, and used by that entity for reconciliation and transaction search. Tesouro uses this identifier to manage idempotency. */
  transactionReference: Scalars['Max36Text']['input'];
}

export interface ReverseTransactionPayload {
  __typename?: 'ReverseTransactionPayload';
  errors?: Maybe<Array<ReverseTransactionError>>;
  reverseTransactionResponse?: Maybe<ReverseTransactionResponse>;
}

export interface ReverseTransactionResponse {
  /** The date Tesouro received the transaction based on acceptor cutoff time */
  activityDate: Scalars['Date']['output'];
  /** Details related to the card used on the transaction */
  cardDetails?: Maybe<CardInformation>;
  /**
   * Difference between request receipt and response in milliseconds.
   * @deprecated New durations coming soon.
   */
  duration: Scalars['Int']['output'];
  /** Result of Tesouro's idempotency check. If the transaction reference matches that of another transaction from that presenter it will be treated as a duplicate. */
  isDuplicateRequest: Scalars['Boolean']['output'];
  /** The response code from the network. */
  networkResponseDetails: NetworkResponseDetails;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** The UTC date and time the transaction was received by Tesouro. */
  timestampUtc: Scalars['DateTime']['output'];
  /** Details associated with the token generated on a tokenization request. */
  tokenDetails?: Maybe<TokenDetails>;
  /** A unique identifier created by Tesouro and assigned to the transaction. */
  transactionId: Scalars['UUID']['output'];
}

/** Occurs when there is no boarded route with Tesouro to process the presented payment method. */
export interface RouteNotFoundError extends IGraphQlError {
  __typename?: 'RouteNotFoundError';
  /** The current list of payment brands Tesouro has routes to support. */
  boardedPaymentBrandsForAcceptor: Array<PaymentBrand>;
  /**
   * The date and time, in UTC, that the error occured. Formatted as 2024-03-27T02:40:00Z.
   * @deprecated Use errorDateTime instead.
   */
  dateTimeUtc: Scalars['DateTime']['output'];
  /** The date and time, in UTC, that the error occured. Formatted as 2024-03-27T02:40:00Z. */
  errorDateTime: Scalars['DateTime']['output'];
  /** A human readable description of the error. */
  message: Scalars['String']['output'];
  /** The assigned payment brand of the payment method presented for processing. */
  paymentBrand: PaymentBrand;
  /** Tesouro response code indicating the error. */
  processorResponseCode: ProcessorResponseCode;
  /** Unique ID for the transaction assigned by Tesouro. */
  transactionId: Scalars['UUID']['output'];
}

/** This occurs when an internal Tesouro business rule is in violation. */
export interface RuleInViolationError extends IGraphQlError {
  __typename?: 'RuleInViolationError';
  /** Advice on how to overcome the rule in the future. */
  advice: Scalars['String']['output'];
  /**
   * The date and time, in UTC, that the error occured. Formatted as 2024-03-27T02:40:00Z.
   * @deprecated Use errorDateTime instead.
   */
  dateTimeUtc: Scalars['DateTime']['output'];
  /** The date and time, in UTC, that the error occured. Formatted as 2024-03-27T02:40:00Z. */
  errorDateTime: Scalars['DateTime']['output'];
  /** An explanation of why the rule exists. */
  explanationOfRule: Scalars['String']['output'];
  /** A human readable description of the error. */
  message: Scalars['String']['output'];
  /** Tesouro response code indicating the error. */
  processorResponseCode: ProcessorResponseCode;
  /** The name of the rule in violation */
  ruleName: RuleName;
  /** Unique ID for the transaction assigned by Tesouro. */
  transactionId: Scalars['UUID']['output'];
}

/** List of possible rules that can be in violation. */
export const RuleName = {
  /** Acceptor IDs between follow up and original transactions must match. */
  AcceptorIdMismatch: 'ACCEPTOR_ID_MISMATCH',
  /** The requested capture amount exceeds the original authorized amount of the payment. */
  CaptureExceedsAuthorizedAmount: 'CAPTURE_EXCEEDS_AUTHORIZED_AMOUNT',
  /** The payment is already fully captured. */
  FullyCaptured: 'FULLY_CAPTURED',
  /** A payment that has been fully reversed cannot be referenced. */
  FullyReversed: 'FULLY_REVERSED',
  /** The transaction to be reversed is an invalid type. */
  InvalidTransactionTypeToReverse: 'INVALID_TRANSACTION_TYPE_TO_REVERSE',
  /** The referenced transaction must have been approved to follow up. */
  OriginalNotApproved: 'ORIGINAL_NOT_APPROVED',
  /** Payment has already been refunded. */
  PaymentAlreadyRefunded: 'PAYMENT_ALREADY_REFUNDED',
  /** The payment has not been captured and cannot be refunded. */
  PaymentNotCaptured: 'PAYMENT_NOT_CAPTURED',
  /** The amount of a refund exceeded the amount of the payment to be refunded. */
  RefundExceedsOriginalAmount: 'REFUND_EXCEEDS_ORIGINAL_AMOUNT',
  /** The amount of a refund exceeded the refundable amount. */
  RefundExceedsRefundableAmount: 'REFUND_EXCEEDS_REFUNDABLE_AMOUNT',
  /** The amount of a reversal exceeded the amount of the transaction to be reversed. */
  ReversalExceedsOriginalAmount: 'REVERSAL_EXCEEDS_ORIGINAL_AMOUNT',
  /** Reversals of captures must be for the full captured amount. */
  ReversalOfCaptureMustBeFullAmount: 'REVERSAL_OF_CAPTURE_MUST_BE_FULL_AMOUNT',
  /** Reversals of refunds must be for the full refunded amount. */
  ReversalOfRefundMustBeFullAmount: 'REVERSAL_OF_REFUND_MUST_BE_FULL_AMOUNT',
  /** A reversal must be on the same activity day as the original transaction. */
  ReversalWindowExpired: 'REVERSAL_WINDOW_EXPIRED',
} as const;

export type RuleName = (typeof RuleName)[keyof typeof RuleName];
export interface Sale {
  acceptor: Acceptor;
  /** The date Tesouro recognized the payment request based upon the acceptor cutoff. */
  activityDate?: Maybe<Scalars['Date']['output']>;
  /** Components of the requested amount that may or may not have been provided by the presenter on the payment transaction request. */
  amountDetails?: Maybe<AmountDetails>;
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /**
   * The amount of convenience fees associated with this transaction
   * @deprecated Use amountDetails.convenienceFee instead.
   */
  convenienceFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The currency specified on the transaction request, in ISO 4217 alpha currency code format. */
  currency?: Maybe<Scalars['String']['output']>;
  /**
   * The total amount of fees applicable to this transaction.
   * @deprecated Use fees.summary.totalAmount instead.
   */
  feeTotalAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Aggregate information for assessed fees */
  fees?: Maybe<FeeDetails>;
  /** The currency specified on the transaction request, in ISO 4217 alpha currency code format. */
  fundingCurrency?: Maybe<Scalars['String']['output']>;
  /** The total amount of the transaction converted to its funding currency, before any fees are deducted. */
  fundingGrossAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The net amount of the transaction converted to its funding currency, after any fees are deducted. */
  fundingNetAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Details on the funds transfer containing this transaction's funding amount. */
  fundsTransfer?: Maybe<FundsTransfer>;
  /** A unique identifier assigned by Tesouro for every transaction request received. */
  id: Scalars['UUID']['output'];
  /**
   * The amount of interchange fees applicable to the transaction. Interchange fees are set by the card networks, and paid to the bank that issued the card used for the transaction.
   * @deprecated Use fees.summary.interchangeAmount instead.
   */
  interchangeFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Indicates if the funding amount has been released. Defined as having a funds transfer ID and funds transfer release date. */
  isFunded: Scalars['Boolean']['output'];
  /** Line items associated with the payment transaction. */
  lineItems?: Maybe<Array<LineItem>>;
  /** Unique ISO four digit values used to classify merchants and their transactions into specific categories based on the type of business, trade or services supplied. */
  merchantCategory?: Maybe<Scalars['String']['output']>;
  /**
   * The amount of network fees applicable to this transaction. Network fees are set by card networks and are paid to the card network.
   * @deprecated Use fees.summary.networkAmount instead.
   */
  networkFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** Information concerning the order placed by the customer. */
  order: Order;
  organization: Organization;
  /**
   * The amount of partner fees applicable to this transaction. Partner fees are set by and paid to the partner.
   * @deprecated Use fees.summary.partnerAmount instead.
   */
  partnerFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The card-present or card-not-present channel from which the customer makes a payment, e.g., In-store using a physical card terminal, online, or over the phone or through mail order. */
  paymentChannel: PaymentChannel;
  /** The means by which the payment details are captured, e.g., Card swipe, contactless "tap", chip entry "dip", keyed, etc. */
  paymentEntryMode: PaymentEntryMode;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** Refers to the various options available for customers to make payments when purchasing a product or service. */
  paymentMethod: PaymentMethod;
  /** The payment network that the transaction was sent across, which may be unaffiliated with the card brand. */
  processingNetwork: Network;
  /**
   * The amount of processor fees applicable to this transaction. Processor fees are set by and paid to Tesouro.
   * @deprecated Use fees.summary.processorAmount instead.
   */
  processorFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /** A response code provided by Tesouro identifying the specific approval or decline reason. */
  processorResponseCode: ProcessorResponseCode;
  /** A human readable description of the authorization response code. e.g., Insufficient funds. */
  processorResponseMessage: Scalars['String']['output'];
  /** A unique transaction identifier created by the entity holding the direct relationship with the Acceptor. Tesouro uses this identifier to manage idempotency. */
  reference?: Maybe<Scalars['String']['output']>;
  /** The transaction amount submitted with the authorization request. */
  requestedAmount: Scalars['Decimal']['output'];
  /** The result of the authorization request, e.g., Approved or Declined. */
  responseType?: Maybe<ResponseType>;
  /**
   * The amount of service fees associated with this transaction
   * @deprecated Use amountDetails.serviceFee instead.
   */
  serviceFeesAmount?: Maybe<Scalars['Decimal']['output']>;
  /**
   * The amount of surcharge associated with this transaction
   * @deprecated Use amountDetails.surcharge instead.
   */
  surchargeAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The tax identification number (TIN) is a unique identifier created by the national government and associated with the acceptor at the time the transaction was submitted */
  taxIdentificationNumber?: Maybe<Scalars['String']['output']>;
  /** The various tax amounts collected on the payment transaction. */
  taxes?: Maybe<Taxes>;
  /** The date and time that Tesouro received the transaction, in UTC. Formatted as 2024-03-27T02:40:00Z */
  transactionDateTime: Scalars['DateTime']['output'];
  /** The type of payment transaction, e.g., Authorization, Capture, Sale, Refund, Reversal, etc. */
  transactionType: PaymentTransactionType;
}

/** Either the security code value or omission reason. */
export interface SecurityCodeInput {
  omissionReason?: InputMaybe<SecurityCodeOmissionReason>;
  value?: InputMaybe<Scalars['String']['input']>;
}

/** Reason for omitting the security code. */
export const SecurityCodeOmissionReason = {
  /** The security code is present, but not legible. */
  Illegible: 'ILLEGIBLE',
  /** The security code is not imprinted on the card. */
  NotImprinted: 'NOT_IMPRINTED',
  /** The acceptor is not requesting the security code. */
  VerificationNotRequested: 'VERIFICATION_NOT_REQUESTED',
} as const;

export type SecurityCodeOmissionReason =
  (typeof SecurityCodeOmissionReason)[keyof typeof SecurityCodeOmissionReason];
/** Possible response values for the card security code verification result. */
export const SecurityCodeResponse = {
  /** The security code submitted successfully matched the code on the card. */
  Match: 'MATCH',
  /** The card security code verification was not attempted. */
  NotAttempted: 'NOT_ATTEMPTED',
  /** The security code submitted did not match the code on the card. */
  NoMatch: 'NO_MATCH',
  /** The card security code verification was attempted, but a response was not provided by the issuer or processor. */
  NoResponse: 'NO_RESPONSE',
} as const;

export type SecurityCodeResponse = (typeof SecurityCodeResponse)[keyof typeof SecurityCodeResponse];
export interface ShipFromAddress {
  __typename?: 'ShipFromAddress';
  postalCode: Scalars['String']['output'];
}

export interface ShipFromAddressInput {
  postalCode: Scalars['String']['input'];
}

export const SortingEnumType = {
  Asc: 'ASC',
  Desc: 'DESC',
} as const;

export type SortingEnumType = (typeof SortingEnumType)[keyof typeof SortingEnumType];
export interface StandardFeeFilterInput {
  acceptorId?: InputMaybe<GuidFilterInput>;
  activityDate?: InputMaybe<DateRangeFilterInput>;
  billableEventCurrency?: InputMaybe<Scalars['String']['input']>;
  feeType?: InputMaybe<EnumFilterInputOfAllocationFeeTypeInput>;
  fundingCurrency?: InputMaybe<Scalars['String']['input']>;
  fundsReleaseDate?: InputMaybe<DateRangeFilterInput>;
  paymentBrand?: InputMaybe<EnumFilterInputOfPaymentBrandInput>;
  paymentId?: InputMaybe<GuidFilterInput>;
}

export interface StandardFeeInput {
  paging: PagingInput;
  where: StandardFeeFilterInput;
}

/** Optional field to be used on customer initiated transactions. Indicates that the presenter intends to store this payment method on file to be used with future merchant initiated transactions. */
export const StorageIntent = {
  /** The presenter has received consent from the cardholder to store their card details on file. */
  StoreOnFile: 'STORE_ON_FILE',
} as const;

export type StorageIntent = (typeof StorageIntent)[keyof typeof StorageIntent];
export interface StringFilterInput {
  eq?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
}

export interface SubmitApplicationInput {
  applicationInput: AcceptorApplicationSubmitInput;
}

export interface SubmitApplicationPayload {
  __typename?: 'SubmitApplicationPayload';
  acceptorApplication?: Maybe<AcceptorApplication>;
  errors?: Maybe<Array<ErrorBase>>;
}

export type SubscribeCardError =
  | AcceptorNotConfiguredError
  | InternalServiceError
  | ValidationFailureError;

/** Top-level input fields for subscribing a card to the AU service. */
export interface SubscribeCardInput {
  /** A unique ID assigned to an acceptor during on-boarding. */
  acceptorId: Scalars['UUID']['input'];
  /** The payment instrument for the given unsubscription. */
  paymentInstrument: PaymentInstrumentSubscriptionInput;
  /** A unique reference generated by the presenter per transaction request that can be used to reconcile requests and responses. Maximum 36 characters. */
  transactionReference: Scalars['Max36Text']['input'];
}

export interface SubscribeCardPayload {
  __typename?: 'SubscribeCardPayload';
  errors?: Maybe<Array<SubscribeCardError>>;
  subscribeCardResponse?: Maybe<SubscribeCardResponse>;
}

export interface SubscribeCardResponse {
  __typename?: 'SubscribeCardResponse';
  response: Response;
  /** An unique identifier assigned by Tesouro for every transaction request received. This Id should be used for subsequent updates/ actions on the transaction. */
  transactionId?: Maybe<Scalars['UUID']['output']>;
  transactionReference: Scalars['String']['output'];
}

export interface SyntaxOnNetworkResponseError extends IGraphQlError {
  __typename?: 'SyntaxOnNetworkResponseError';
  /** The network the transaction request was attempted with. */
  attemptedNetwork: Network;
  /**
   * The date and time, in UTC, that the error occured. Formatted as 2024-03-27T02:40:00Z.
   * @deprecated Use errorDateTime instead.
   */
  dateTimeUtc: Scalars['DateTime']['output'];
  /** The date and time, in UTC, that the error occured. Formatted as 2024-03-27T02:40:00Z. */
  errorDateTime: Scalars['DateTime']['output'];
  /** A human readable description of the error. */
  message: Scalars['String']['output'];
  /** Tesouro response code indicating the error. */
  processorResponseCode: ProcessorResponseCode;
  /** Unique ID for the transaction assigned by Tesouro. */
  transactionId: Scalars['UUID']['output'];
}

export const TaxCalculation = {
  PostDiscount: 'POST_DISCOUNT',
  PreDiscount: 'PRE_DISCOUNT',
} as const;

export type TaxCalculation = (typeof TaxCalculation)[keyof typeof TaxCalculation];
export interface Taxes {
  __typename?: 'Taxes';
  /** The total amount of local taxes collected. */
  localAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The total amount of national taxes collected. */
  nationalAmount?: Maybe<Scalars['Decimal']['output']>;
  /** The total amount of taxes collected. */
  totalAmount: Scalars['Decimal']['output'];
}

export interface TimeoutOnNetworkResponseError extends IGraphQlError {
  __typename?: 'TimeoutOnNetworkResponseError';
  /** The network the authorization was attempted. */
  attemptedNetwork: Network;
  /**
   * The date and time, in UTC, that the error occured. Formatted as 2024-03-27T02:40:00Z.
   * @deprecated Use errorDateTime instead.
   */
  dateTimeUtc: Scalars['DateTime']['output'];
  /** The date and time, in UTC, that the error occured. Formatted as 2024-03-27T02:40:00Z. */
  errorDateTime: Scalars['DateTime']['output'];
  /** A human readable description of the error. */
  message: Scalars['String']['output'];
  /** Tesouro response code indicating the error. */
  processorResponseCode: ProcessorResponseCode;
  /** Unique ID for the transaction assigned by Tesouro. */
  transactionId: Scalars['UUID']['output'];
  /** The amount of time Tesouro waited for a response in milliseconds. */
  waitTime: Scalars['Int']['output'];
}

/** If transaction was tokenized this contains relevant tokenization information. */
export interface TokenDetails {
  __typename?: 'TokenDetails';
  /** The value of the acquirer token. */
  token?: Maybe<Scalars['String']['output']>;
  /**
   * The value of the acquirer token.
   * @deprecated Use token instead.
   */
  tokenizedPan?: Maybe<Scalars['String']['output']>;
}

export interface TokenDetailsSubscriptionInput {
  /** The valid expiration month of the card used in processing, presented as two-digit number from 01 to 12. */
  expirationMonth: Scalars['NumericMonth']['input'];
  /** The valid expiration year of the card used in processing, presented as a four-digit number, 0000 to 9999. */
  expirationYear: Scalars['NumericYear4Digits']['input'];
  /** The token to be subscribed for account updates. */
  token: Scalars['String']['input'];
}

export interface TokenNotFoundError extends IGraphQlError {
  __typename?: 'TokenNotFoundError';
  /**
   * The date and time, in UTC, that the error occured. Formatted as 2024-03-27T02:40:00Z.
   * @deprecated Use errorDateTime instead.
   */
  dateTimeUtc: Scalars['DateTime']['output'];
  /** The date and time, in UTC, that the error occured. Formatted as 2024-03-27T02:40:00Z. */
  errorDateTime: Scalars['DateTime']['output'];
  /** A human readable description of the error. */
  message: Scalars['String']['output'];
  /** Tesouro response code indicating the error. */
  processorResponseCode: ProcessorResponseCode;
  /** Unique ID for the transaction assigned by Tesouro. */
  transactionId: Scalars['UUID']['output'];
}

/** Current processor supported purchasing currency codes. */
export const TransactionAmountCurrencyCode = {
  /** United States Dollar. Precision of 2 places after the decimal. */
  Usd: 'USD',
} as const;

export type TransactionAmountCurrencyCode =
  (typeof TransactionAmountCurrencyCode)[keyof typeof TransactionAmountCurrencyCode];
export const TransactionRequestResult = {
  Accepted: 'ACCEPTED',
  Approved: 'APPROVED',
  Declined: 'DECLINED',
  Rejected: 'REJECTED',
} as const;

export type TransactionRequestResult =
  (typeof TransactionRequestResult)[keyof typeof TransactionRequestResult];
export interface TransactionSummariesAsyncInput {
  asyncReportsDetailsInput: AsyncReportsDetailsInput;
  transactionSummaryReportInput: TransactionSummaryAsyncReportInput;
  where: PaymentTransactionSummaryFilterInput;
}

export interface TransactionSummaryAsyncReportInput {
  /** The fields to include in the report. */
  fields: Array<TransactionSummaryFields>;
  /** Tesouro names the files so that the filename is contextual to the data the report contains, e.g., acceptorName_reportType_YYYYMM-DD-to-YYYMMDD_createdOnDate. If you prefer to override Tesouro's file naming and specify your own format, add it here. */
  fileName?: InputMaybe<Scalars['String']['input']>;
  /** The type of file that the report is saved as, e.g. CSV */
  fileType: FileTypes;
}

export const TransactionSummaryFields = {
  AcceptorId: 'ACCEPTOR_ID',
  AcceptorName: 'ACCEPTOR_NAME',
  AcceptorReference: 'ACCEPTOR_REFERENCE',
  ConveyedStatus: 'CONVEYED_STATUS',
  OrganizationId: 'ORGANIZATION_ID',
  PaymentBrand: 'PAYMENT_BRAND',
  PaymentFundingSource: 'PAYMENT_FUNDING_SOURCE',
  PresenterId: 'PRESENTER_ID',
  ProcessingNetwork: 'PROCESSING_NETWORK',
  TransactionActivityDate: 'TRANSACTION_ACTIVITY_DATE',
  TransactionAmount: 'TRANSACTION_AMOUNT',
  TransactionCount: 'TRANSACTION_COUNT',
  TransactionCurrency: 'TRANSACTION_CURRENCY',
  TransactionProcessingDecision: 'TRANSACTION_PROCESSING_DECISION',
  TransactionType: 'TRANSACTION_TYPE',
} as const;

export type TransactionSummaryFields =
  (typeof TransactionSummaryFields)[keyof typeof TransactionSummaryFields];
/** Possible values for transaction types. */
export const TransactionType = {
  /** Account validation transaction. */
  AccountValidation: 'ACCOUNT_VALIDATION',
  /** Card verification transaction. */
  AccountVerification: 'ACCOUNT_VERIFICATION',
  /** Card authorization. */
  Authorization: 'AUTHORIZATION',
  /** Capture previous authorization. */
  Capture: 'CAPTURE',
  /** Clearing of previous capture. */
  Clearing: 'CLEARING',
  /** Incremental authorization. */
  IncrementalAuthorization: 'INCREMENTAL_AUTHORIZATION',
  /** Refund transaction. */
  Refund: 'REFUND',
  /** Authorization for refund. */
  RefundAuthorization: 'REFUND_AUTHORIZATION',
  /** Reversal / Void transaction. */
  Reversal: 'REVERSAL',
  /** Sale / charge. */
  Sale: 'SALE',
} as const;

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];
export interface UnderwritingDecisionComponentFieldSchema {
  __typename?: 'UnderwritingDecisionComponentFieldSchema';
  /** A JSON-type path of the location within the application of the field. */
  associatedApplicationField: Scalars['String']['output'];
  fieldType: DecisionComponentFieldType;
  /** A description of the decision component field. */
  helperText: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  /** Boolean with value true if the given field is no longer used by the decision component. */
  isDisabled: Scalars['Boolean']['output'];
  /** Boolean with value true if the given field is not modifiable. */
  isReadOnly: Scalars['Boolean']['output'];
  /** The field name formatted for display. */
  label: Scalars['String']['output'];
}

export interface UnderwritingDecisionComponentItemSchema {
  __typename?: 'UnderwritingDecisionComponentItemSchema';
  id: Scalars['UUID']['output'];
  label: Scalars['String']['output'];
  underwritingDecisionComponentFieldSchemas: Array<UnderwritingDecisionComponentFieldSchema>;
}

export interface UnderwritingDecisionComponentSchema {
  __typename?: 'UnderwritingDecisionComponentSchema';
  id: Scalars['UUID']['output'];
  label: Scalars['String']['output'];
  underwritingDecisionComponentItemSchemas: Array<UnderwritingDecisionComponentItemSchema>;
}

export interface UnderwritingDecisionComponentsSchema {
  __typename?: 'UnderwritingDecisionComponentsSchema';
  /** The date and time this was created in UTC. */
  createdDateTime: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  underwritingDecisionComponentSchemas: Array<UnderwritingDecisionComponentSchema>;
  version: Scalars['String']['output'];
}

export const UnderwritingStatus = {
  Accepted: 'ACCEPTED',
  ActionRequired: 'ACTION_REQUIRED',
  Error: 'ERROR',
  NotAccepted: 'NOT_ACCEPTED',
  NotStarted: 'NOT_STARTED',
  Processing: 'PROCESSING',
  ServiceUnavailable: 'SERVICE_UNAVAILABLE',
} as const;

export type UnderwritingStatus = (typeof UnderwritingStatus)[keyof typeof UnderwritingStatus];
export interface UnknownCardError extends IGraphQlError {
  __typename?: 'UnknownCardError';
  /**
   * The date and time, in UTC, that the error occured. Formatted as 2024-03-27T02:40:00Z.
   * @deprecated Use errorDateTime instead.
   */
  dateTimeUtc: Scalars['DateTime']['output'];
  /** The date and time, in UTC, that the error occured. Formatted as 2024-03-27T02:40:00Z. */
  errorDateTime: Scalars['DateTime']['output'];
  /** A human readable description of the error. */
  message: Scalars['String']['output'];
  /** Tesouro response code indicating the error. */
  processorResponseCode: ProcessorResponseCode;
  /** Unique ID for the transaction assigned by Tesouro. */
  transactionId: Scalars['UUID']['output'];
}

export type UnlockUserError = AuthenticationError | ForbiddenError;

export interface UnlockUserInput {
  userId: Scalars['UUID']['input'];
}

export interface UnlockUserPayload {
  __typename?: 'UnlockUserPayload';
  errors?: Maybe<Array<UnlockUserError>>;
  user?: Maybe<User>;
}

export type UpdateUserError = AuthenticationError | ForbiddenError;

export interface UpdateUserInput {
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  jobTitle?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  permissionIds?: InputMaybe<Array<Scalars['UUID']['input']>>;
}

export interface UpdateUserPayload {
  __typename?: 'UpdateUserPayload';
  errors?: Maybe<Array<UpdateUserError>>;
  user?: Maybe<User>;
}

export interface User extends Actor {
  __typename?: 'User';
  /** The id of the organization that the user is associated with. */
  defaultOrganizationId: Scalars['UUID']['output'];
  /** The email address of the user. */
  email: Scalars['String']['output'];
  /** The id of the user as defined in their profile. */
  id: Scalars['UUID']['output'];
  /** The job title of the user. */
  jobTitle?: Maybe<Scalars['String']['output']>;
  /** Last time the user logged in. */
  lastLoggedInDateTime?: Maybe<Scalars['DateTime']['output']>;
  /** The name of the user. */
  name: Scalars['String']['output'];
  organization?: Maybe<Organization>;
  permissions?: Maybe<Array<Permission>>;
  /** The status of the user. */
  status: UserStatus;
  type: ActorType;
}

export interface UserCollection {
  __typename?: 'UserCollection';
  items: Array<User>;
  pageInfo: PageInfo;
}

export interface UserFilterInput {
  id?: InputMaybe<GuidFilterInput>;
}

export interface UserInput {
  orderBy?: InputMaybe<Array<UserSortTypeInput>>;
  paging: PagingInput;
  where?: InputMaybe<UserFilterInput>;
}

export const UserSortField = {
  Id: 'ID',
} as const;

export type UserSortField = (typeof UserSortField)[keyof typeof UserSortField];
export interface UserSortTypeInput {
  field: UserSortField;
  sortDirection: SortingEnumType;
}

export const UserStatus = {
  Active: 'ACTIVE',
  Inactive: 'INACTIVE',
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
/** If the network validates a bank account, the following will be populated. */
export interface ValidateBankAccountApproval extends ValidateBankAccountResponse {
  __typename?: 'ValidateBankAccountApproval';
  /** The date Tesouro received the transaction based on acceptor cutoff time */
  activityDate: Scalars['Date']['output'];
  /**
   * Difference between request receipt and response in milliseconds.
   * @deprecated New durations coming soon.
   */
  duration: Scalars['Int']['output'];
  /** Result of Tesouro's idempotency check. If the transaction reference matches that of another transaction from that presenter it will be treated as a duplicate. */
  isDuplicateRequest: Scalars['Boolean']['output'];
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** A normalized 4-character response code defined by Tesouro. */
  processorResponseCode: ProcessorResponseCode;
  /** The UTC date and time the transaction was received by Tesouro. */
  timestampUtc: Scalars['DateTime']['output'];
  /** Details associated with the token generated on a tokenization request. */
  tokenDetails?: Maybe<TokenDetails>;
  /** A unique identifier created by Tesouro and assigned to the transaction. */
  transactionId: Scalars['UUID']['output'];
  /** The validation score provided to Tesouro by the validation provider. */
  validationProviderScore: Scalars['Int']['output'];
}

/** If the network returns a declined response, information regarding the decline will be populated here. */
export interface ValidateBankAccountDecline extends ValidateBankAccountResponse {
  __typename?: 'ValidateBankAccountDecline';
  /** The date Tesouro received the transaction based on acceptor cutoff time */
  activityDate: Scalars['Date']['output'];
  /** Specifies the type of response, e.g. SOFT_DECLINE, HARD_DECLINE, REFERRAL. */
  declineType: DeclineType;
  /**
   * Difference between request receipt and response in milliseconds.
   * @deprecated New durations coming soon.
   */
  duration: Scalars['Int']['output'];
  /** Result of Tesouro's idempotency check. If the transaction reference matches that of another transaction from that presenter it will be treated as a duplicate. */
  isDuplicateRequest: Scalars['Boolean']['output'];
  /** A detailed description of the response code. e.g., Insufficient funds. */
  message: Scalars['String']['output'];
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** When an authorization is declined, Tesouro will provide advice on what can be done to remedy, and/or prevent this type of response from occurring in the future. */
  processorAdvice: Scalars['String']['output'];
  /** A normalized 4-character response code defined by Tesouro. */
  processorResponseCode: ProcessorResponseCode;
  /** The UTC date and time the transaction was received by Tesouro. */
  timestampUtc: Scalars['DateTime']['output'];
  /** Details associated with the token generated on a tokenization request. */
  tokenDetails?: Maybe<TokenDetails>;
  /** A unique identifier created by Tesouro and assigned to the transaction. */
  transactionId: Scalars['UUID']['output'];
  /** The validation score provided to Tesouro by the validation provider. */
  validationProviderScore: Scalars['Int']['output'];
}

export type ValidateBankAccountError =
  | AcceptorNotFoundError
  | InternalServiceError
  | InvalidTokenError
  | RouteNotFoundError
  | RuleInViolationError
  | TimeoutOnNetworkResponseError
  | TokenNotFoundError
  | ValidationFailureError;

/** Mutation which returns the validity of a bank account. */
export interface ValidateBankAccountInput {
  /** A unique, 36 character identifier created by Tesouro and assigned to the entity providing the goods or services to the cardholder, such as a Merchant, a Submerchant of a Payment Facilitator, a Seller within a Marketplace, or a Biller of a Consumer Bill Payment Service Provider (CBPS). Historically, processors have called this identifier the Merchant ID (or MID), Outlet ID, or Customer number. */
  acceptorId: Scalars['UUID']['input'];
  /** Details pertaining to the customer's billing address. */
  billToAddress?: InputMaybe<AddressDetailsInput>;
  /** How the consumer interacts with the acceptor. Defaults to ECOMMERCE if not provided. */
  channel?: PaymentChannel;
  /** Details pertaining to the customer's order. */
  orderDetails?: InputMaybe<OrderDetailsInput>;
  /** The bank account or tokenized bank account to be validated. */
  paymentMethodDetails: BankPaymentMethodInput;
  /** A unique identifier created by the entity holding the direct relationship with the Acceptor, and used by that entity for reconciliation and transaction search. Tesouro uses this identifier to manage idempotency. */
  transactionReference: Scalars['Max36Text']['input'];
}

export interface ValidateBankAccountPayload {
  __typename?: 'ValidateBankAccountPayload';
  errors?: Maybe<Array<ValidateBankAccountError>>;
  validateBankAccountResponse?: Maybe<ValidateBankAccountResponse>;
}

export interface ValidateBankAccountResponse {
  /** The date Tesouro received the transaction based on acceptor cutoff time */
  activityDate: Scalars['Date']['output'];
  /**
   * Difference between request receipt and response in milliseconds.
   * @deprecated New durations coming soon.
   */
  duration: Scalars['Int']['output'];
  /** Result of Tesouro's idempotency check. If the transaction reference matches that of another transaction from that presenter it will be treated as a duplicate. */
  isDuplicateRequest: Scalars['Boolean']['output'];
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** A normalized 4-character response code defined by Tesouro. */
  processorResponseCode: ProcessorResponseCode;
  /** The UTC date and time the transaction was received by Tesouro. */
  timestampUtc: Scalars['DateTime']['output'];
  /** Details associated with the token generated on a tokenization request. */
  tokenDetails?: Maybe<TokenDetails>;
  /** A unique identifier created by Tesouro and assigned to the transaction. */
  transactionId: Scalars['UUID']['output'];
  /** The validation score provided to Tesouro by the validation provider. */
  validationProviderScore: Scalars['Int']['output'];
}

export interface ValidationFailureError extends IGraphQlError {
  __typename?: 'ValidationFailureError';
  /**
   * The date and time, in UTC, that the error occured. Formatted as 2024-03-27T02:40:00Z.
   * @deprecated Use errorDateTime instead.
   */
  dateTimeUtc: Scalars['DateTime']['output'];
  /** The date and time, in UTC, that the error occured. Formatted as 2024-03-27T02:40:00Z. */
  errorDateTime: Scalars['DateTime']['output'];
  /** The name of the graphql field in error. */
  fieldName: Scalars['String']['output'];
  /** The path to the graphql field in error. */
  fieldPath: Scalars['String']['output'];
  /** A human readable description of the error. */
  message: Scalars['String']['output'];
  /** Tesouro response code indicating the error. */
  processorResponseCode: ProcessorResponseCode;
  /** Unique ID for the transaction assigned by Tesouro. */
  transactionId: Scalars['UUID']['output'];
  /** The value of the graphql field in error. */
  valueInError: Scalars['String']['output'];
}

export interface VerifyAccountAcquirerTokenDetailsInput {
  /** The two-digit month (MM) of the card's expiration date. */
  expirationMonth: Scalars['NumericMonth']['input'];
  /** The four-digit year (YYYY) of the card's expiration date. */
  expirationYear: Scalars['NumericYear4Digits']['input'];
  /** The 3 digit number (or 4 digit if American Express) found on the customer's card, or the specific reason if the security code is omitted from the request. */
  securityCode: SecurityCodeInput;
  /** The value of the acquirer token. */
  token?: InputMaybe<Scalars['String']['input']>;
  /** The value of the acquirer token. */
  tokenizedPan?: InputMaybe<Scalars['String']['input']>;
  /** The wallet provider for this payment method. Null if not applicable. */
  walletType?: InputMaybe<WalletType>;
}

export interface VerifyAccountApproval extends VerifyAccountResponse {
  __typename?: 'VerifyAccountApproval';
  /** The date Tesouro received the transaction based on acceptor cutoff time */
  activityDate: Scalars['Date']['output'];
  /** Advice regarding follow up action for this transaction. */
  advice: Advice;
  /** Address Verification Service (AVS) is a service provided by the payment brands that determines the match or partial match of the consumer's address information. */
  avsResponseDetails: AddressVerificationResponse;
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /** Details related to the card used on the transaction */
  cardDetails?: Maybe<CardInformation>;
  /** The security code response from the network. */
  cardSecurityCodeResponseDetails: CardSecurityCodeResponseDetails;
  /**
   * Difference between request receipt and response in milliseconds.
   * @deprecated New durations coming soon.
   */
  duration: Scalars['Int']['output'];
  /** Result of Tesouro's idempotency check. If the transaction reference matches that of another transaction from that presenter it will be treated as a duplicate. */
  isDuplicateRequest: Scalars['Boolean']['output'];
  /** Name verification service result provided by the payment brand. */
  nameVerificationResponseDetails: NameVerificationResponseDetails;
  /** A six-digit code returned from the network on APPROVED authorizations, and displayed on the customer's receipt. If the authorization is declined, this field will be blank. */
  networkApprovalCode: Scalars['String']['output'];
  /** The response code from the network. */
  networkResponseDetails: NetworkResponseDetails;
  /** The transaction ID forwarded from the network response. */
  networkTransactionId?: Maybe<Scalars['String']['output']>;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** The system trace audit number sent to the network. */
  systemTraceAuditNumber?: Maybe<Scalars['String']['output']>;
  /** The UTC date and time the transaction was received by Tesouro. */
  timestampUtc: Scalars['DateTime']['output'];
  /** Details associated with the token generated on a tokenization request. */
  tokenDetails?: Maybe<TokenDetails>;
  /** A unique identifier created by Tesouro and assigned to the transaction. */
  transactionId: Scalars['UUID']['output'];
}

export interface VerifyAccountCardWithPanDetailsInput {
  /** The card number used in processing the transaction. This is a full PAN. */
  accountNumber: Scalars['CardNumber']['input'];
  /** The two-digit month (MM) of the card's expiration date. */
  expirationMonth: Scalars['NumericMonth']['input'];
  /** The four-digit year (YYYY) of the card's expiration date. */
  expirationYear: Scalars['NumericYear4Digits']['input'];
  /** [DEPRECATED: Use root level channel instead] The card-present or card-not-present channel from which the customer makes a payment, e.g., In-store using a physical card terminal, online, or over the phone or through mail order */
  paymentChannel?: InputMaybe<PanEntryChannel>;
  /** The means by which the card number was entered. */
  paymentEntryMode: PanEntryMode;
  /** The 3 digit number (or 4 digit if American Express) found on the customer's card, or the specific reason if the security code is omitted from the request. */
  securityCode: SecurityCodeInput;
  /** Optional field to be used on customer initiated transactions. Indicates that the presenter intends to store this payment method on file to be used with future merchant initiated transactions. */
  storageIntent?: InputMaybe<StorageIntent>;
  /** The wallet provider for this payment method. Null if not applicable. */
  walletType?: InputMaybe<WalletType>;
}

export interface VerifyAccountDecline extends VerifyAccountResponse {
  __typename?: 'VerifyAccountDecline';
  /** The date Tesouro received the transaction based on acceptor cutoff time */
  activityDate: Scalars['Date']['output'];
  /** Advice regarding follow up action for this transaction. */
  advice: Advice;
  /** Address Verification Service (AVS) is a service provided by the payment brands that determines the match or partial match of the consumer's address information. */
  avsResponseDetails: AddressVerificationResponse;
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /** Details related to the card used on the transaction */
  cardDetails?: Maybe<CardInformation>;
  /** The security code response from the network. */
  cardSecurityCodeResponseDetails: CardSecurityCodeResponseDetails;
  /** Specifies the type of response, e.g. SOFT_DECLINE, HARD_DECLINE, REFERRAL. */
  declineType: DeclineType;
  /**
   * Difference between request receipt and response in milliseconds.
   * @deprecated New durations coming soon.
   */
  duration: Scalars['Int']['output'];
  /** Result of Tesouro's idempotency check. If the transaction reference matches that of another transaction from that presenter it will be treated as a duplicate. */
  isDuplicateRequest: Scalars['Boolean']['output'];
  /** A detailed description of the response code. e.g., Insufficient funds. */
  message: Scalars['String']['output'];
  /** Name verification service result provided by the payment brand. */
  nameVerificationResponseDetails: NameVerificationResponseDetails;
  /** The response code from the network. */
  networkResponseDetails: NetworkResponseDetails;
  /** The transaction ID forwarded from the network response. */
  networkTransactionId?: Maybe<Scalars['String']['output']>;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** When an authorization is declined, Tesouro will provide advice on what can be done to remedy, and/or prevent this type of response from occurring in the future. */
  processorAdvice: Scalars['String']['output'];
  /** The system trace audit number sent to the network. */
  systemTraceAuditNumber?: Maybe<Scalars['String']['output']>;
  /** The UTC date and time the transaction was received by Tesouro. */
  timestampUtc: Scalars['DateTime']['output'];
  /** Details associated with the token generated on a tokenization request. */
  tokenDetails?: Maybe<TokenDetails>;
  /** A unique identifier created by Tesouro and assigned to the transaction. */
  transactionId: Scalars['UUID']['output'];
}

export type VerifyAccountError =
  | AcceptorNotFoundError
  | InternalServiceError
  | InvalidTokenError
  | RouteNotFoundError
  | RuleInViolationError
  | SyntaxOnNetworkResponseError
  | TimeoutOnNetworkResponseError
  | TokenNotFoundError
  | UnknownCardError
  | ValidationFailureError;

/** Select depending on the method of payment you would like to verify. */
export interface VerifyAccountInput {
  /** A unique, 36 character identifier created by Tesouro and assigned to the entity providing the goods or services to the cardholder, such as a Merchant, a Submerchant of a Payment Facilitator, a Seller within a Marketplace, or a Biller of a Consumer Bill Payment Service Provider (CBPS). Historically, processors have called this identifier the Merchant ID (or MID), Outlet ID, or Customer number. */
  acceptorId: Scalars['UUID']['input'];
  /** The billing address associated with the payment method used on the transaction. */
  billToAddress?: InputMaybe<AddressDetailsInput>;
  /** How the consumer interacts with the acceptor. Defaults to ECOMMERCE if not provided. */
  channel?: PaymentChannel;
  /** Details pertaining to the customer's order. */
  orderDetails?: InputMaybe<OrderDetailsInput>;
  /** Details regarding the payment method. */
  paymentMethodDetails: VerifyAccountPaymentMethodInput;
  /** A unique identifier created by the entity holding the direct relationship with the Acceptor, and used by that entity for reconciliation and transaction search. Tesouro uses this identifier to manage idempotency. */
  transactionReference: Scalars['Max36Text']['input'];
}

export interface VerifyAccountNetworkTokenPassThroughDetailsInput {
  /** The cryptogram generated by the token provider to be used on the transaction. */
  cryptogram: Scalars['String']['input'];
  /** Ecommerce indicator provided by the wallet provider. */
  ecommerceIndicator?: InputMaybe<Scalars['String']['input']>;
  /** The two-digit month (MM) of the card's expiration date. */
  expirationMonth: Scalars['NumericMonth']['input'];
  /** The four-digit year (YYYY) of the card's expiration date. */
  expirationYear: Scalars['NumericYear4Digits']['input'];
  /** [DEPRECATED: Network tokens do not have security codes, so this will be removed.] The 3 digit number (or 4 digit if American Express) found on the customer's card, or the specific reason if the security code is omitted from the request. */
  securityCode?: InputMaybe<SecurityCodeInput>;
  /** The value of the network token. */
  tokenValue: Scalars['String']['input'];
  /** The wallet provider for this payment method. Null if not applicable. */
  walletType?: InputMaybe<WalletType>;
}

export interface VerifyAccountPayload {
  __typename?: 'VerifyAccountPayload';
  errors?: Maybe<Array<VerifyAccountError>>;
  verifyAccountResponse?: Maybe<VerifyAccountResponse>;
}

export interface VerifyAccountPaymentMethodInput {
  acquirerTokenDetails?: InputMaybe<VerifyAccountAcquirerTokenDetailsInput>;
  cardWithPanDetails?: InputMaybe<VerifyAccountCardWithPanDetailsInput>;
  networkTokenPassThroughDetails?: InputMaybe<VerifyAccountNetworkTokenPassThroughDetailsInput>;
}

export interface VerifyAccountResponse {
  /** The date Tesouro received the transaction based on acceptor cutoff time */
  activityDate: Scalars['Date']['output'];
  /** Advice regarding follow up action for this transaction. */
  advice: Advice;
  /** Address Verification Service (AVS) is a service provided by the payment brands that determines the match or partial match of the consumer's address information. */
  avsResponseDetails: AddressVerificationResponse;
  /** The business application identifier (BAI) is a value provided by Visa to identify the type of transfer that is being performed. */
  businessApplicationId?: Maybe<BusinessApplicationId>;
  /** Details related to the card used on the transaction */
  cardDetails?: Maybe<CardInformation>;
  /** The security code response from the network. */
  cardSecurityCodeResponseDetails: CardSecurityCodeResponseDetails;
  /**
   * Difference between request receipt and response in milliseconds.
   * @deprecated New durations coming soon.
   */
  duration: Scalars['Int']['output'];
  /** Result of Tesouro's idempotency check. If the transaction reference matches that of another transaction from that presenter it will be treated as a duplicate. */
  isDuplicateRequest: Scalars['Boolean']['output'];
  /** Name verification service result provided by the payment brand. */
  nameVerificationResponseDetails: NameVerificationResponseDetails;
  /** The response code from the network. */
  networkResponseDetails: NetworkResponseDetails;
  /** The transaction ID forwarded from the network response. */
  networkTransactionId?: Maybe<Scalars['String']['output']>;
  /** A unique 36 character identifier created by Tesouro and assigned to a group of transactions in the same payment request cohort. e.g., An authorization request, incremental authorization request, and the final capture would have the same paymentID. */
  paymentId: Scalars['UUID']['output'];
  /** The system trace audit number sent to the network. */
  systemTraceAuditNumber?: Maybe<Scalars['String']['output']>;
  /** The UTC date and time the transaction was received by Tesouro. */
  timestampUtc: Scalars['DateTime']['output'];
  /** Details associated with the token generated on a tokenization request. */
  tokenDetails?: Maybe<TokenDetails>;
  /** A unique identifier created by Tesouro and assigned to the transaction. */
  transactionId: Scalars['UUID']['output'];
}

/** The wallet provider for this payment method. Null if not applicable. */
export const WalletType = {
  /** The payment method was provided through Apple Pay. */
  ApplePay: 'APPLE_PAY',
  /** The payment method was provided through Google Pay. */
  GooglePay: 'GOOGLE_PAY',
} as const;

export type WalletType = (typeof WalletType)[keyof typeof WalletType];
