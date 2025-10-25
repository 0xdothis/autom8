/**
 * TypeScript definitions that mirror the smart contract structures
 * These types ensure type safety and 1:1 mapping with contract data
 */

export namespace LibStorage {
  // Enums matching contract enums
  export enum Status {
    Inactive = 0,
    Active = 1,
    SoldOut = 2,
    Ended = 3,
  }

  export enum EventType {
    Free = 0,
    Paid = 1,
  }

  // Core data structures matching contract structs
  export interface EventStruct {
    id: bigint;
    name: string;
    ticketPrice: bigint;
    maxTickets: bigint;
    ticketsSold: bigint;
    totalRevenue: bigint;
    startTime: bigint;
    endTime: bigint;
    status: Status;
    ticketUri: string;
    eventType: EventType;
    creator: string; // Address
    amountNeededForExpenses: bigint;
    isPaid: boolean;
  }

  export interface WorkerInfo {
    salary: bigint;
    paid: boolean;
    description: string;
    employee: string; // Address
    position: bigint;
  }

  export interface SponsorInfo {
    sponsor: string; // Address
    amount: bigint;
    position: bigint;
    eventId: bigint;
    percentageContribution: bigint;
  }

  // Frontend-specific extensions (computed from contract data)
  export interface EventDisplay extends EventStruct {
    // Computed fields for UI
    formattedPrice: string;
    formattedRevenue: string;
    formattedExpenses: string;
    isActive: boolean;
    isSoldOut: boolean;
    hasEnded: boolean;
    daysUntilStart: number;
    totalWorkerCost: string;
    totalSponsorship: string;
    profitAfterExpenses: string;
  }

  export interface WorkerDisplay extends WorkerInfo {
    formattedSalary: string;
    statusBadge: 'pending' | 'paid';
  }

  export interface SponsorDisplay extends SponsorInfo {
    formattedAmount: string;
    formattedPercentage: string;
    expectedReturn: string;
  }
}

// Organization management types
export interface Organization {
  proxyAddress: string;
  ownerAddress: string;
  name: string;
  totalEvents: number;
  totalRevenue: string;
  totalWorkers: number;
  isActive: boolean;
  createdAt: Date;
}

// Transaction result types
export interface TransactionResult {
  hash: string;
  success: boolean;
  error?: string;
  gasUsed?: bigint;
  effectiveGasPrice?: bigint;
}

// Event creation parameters
export interface CreateEventParams {
  name: string;
  ticketPrice: string; // Will be converted to bigint
  maxTickets: number;
  startTime: Date;
  endTime: Date;
  ticketUri: string;
  eventType: LibStorage.EventType;
  amountNeededForExpenses: string; // Will be converted to bigint
  description?: string;
  location?: string;
  imageUrl?: string;
}

// Worker management types
export interface CreateWorkerParams {
  salary: string; // Will be converted to bigint
  description: string;
  employeeAddress: string;
  eventId: string;
}

export interface BulkWorkerParams {
  workers: CreateWorkerParams[];
  eventId: string;
}

// Sponsorship types
export interface SponsorEventParams {
  eventId: string;
  amount: string; // Will be converted to bigint
  sponsorAddress: string;
}

// Analytics and reporting types
export interface EventAnalytics {
  eventId: string;
  ticketsSold: number;
  totalRevenue: string;
  totalExpenses: string;
  totalSponsorship: string;
  netProfit: string;
  workersPaid: number;
  totalWorkers: number;
  sponsorCount: number;
  profitMargin: number;
}

export interface OrganizationAnalytics {
  totalEvents: number;
  activeEvents: number;
  completedEvents: number;
  totalRevenue: string;
  totalExpenses: string;
  totalProfit: string;
  totalTicketsSold: number;
  totalWorkers: number;
  totalSponsors: number;
  averageEventRevenue: string;
  topPerformingEvent: string;
  monthlyGrowth: number;
}

// UI State types
export interface EventFormState {
  step: 'basic' | 'workers' | 'budget' | 'review';
  eventData: Partial<CreateEventParams>;
  workers: CreateWorkerParams[];
  isSubmitting: boolean;
  errors: Record<string, string>;
}

export interface PayrollState {
  workers: LibStorage.WorkerDisplay[];
  totalCost: string;
  unpaidWorkers: number;
  isProcessingPayments: boolean;
  lastPaymentDate?: Date;
}

export interface SponsorshipState {
  sponsors: LibStorage.SponsorDisplay[];
  totalSponsorship: string;
  availableForSponsorship: string;
  isAcceptingSponsors: boolean;
  minimumSponsorship: string;
}

// Error types
export interface ContractError {
  code: string;
  message: string;
  contractFunction: string;
  txHash?: string;
}

// Event types for real-time updates
export interface ContractEventData {
  eventName: string;
  blockNumber: bigint;
  transactionHash: string;
  args: Record<string, any>;
}

// Constants matching contract values
export const CONTRACT_CONSTANTS = {
  ZERO_ADDRESS: '0x0000000000000000000000000000000000000000',
  MAX_WORKERS_PER_EVENT: 100,
  MIN_EVENT_DURATION: 3600, // 1 hour in seconds
  MAX_EVENT_DURATION: 31536000, // 1 year in seconds
  PLATFORM_FEE_PERCENTAGE: 5, // 5% platform fee
} as const;

// Validation helpers
export const ValidationRules = {
  eventName: {
    minLength: 3,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-_]+$/,
  },
  ticketPrice: {
    min: 0,
    max: '1000', // USDT
  },
  maxTickets: {
    min: 1,
    max: 10000,
  },
  workerSalary: {
    min: 0,
    max: '100', // USDT
  },
  sponsorshipAmount: {
    min: '0.01', // USDT
    max: '1000', // USDT
  },
} as const;