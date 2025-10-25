// Environment variables with type safety
export const ENV = {
  CHAIN_ID: Number(import.meta.env.VITE_CHAIN_ID),
  RPC_URL: import.meta.env.VITE_RPC_URL,
  CHAIN_NAME: import.meta.env.VITE_CHAIN_NAME,
  BLOCK_EXPLORER: import.meta.env.VITE_BLOCK_EXPLORER,

  // Contract addresses on Lisk Sepolia
  FACTORY_ADDRESS: import.meta.env.VITE_FACTORY_ADDRESS as `0x${string}`,
  PROXY_ADDRESS: import.meta.env.VITE_PROXY_ADDRESS as `0x${string}`,
  IMPLEMENTATION_ADDRESS: import.meta.env
    .VITE_IMPLEMENTATION_ADDRESS as `0x${string}`,
  MANAGEMENT_ADDRESS: import.meta.env
    .VITE_EVENT_MANAGER_ADDRESS as `0x${string}`,

  // WalletConnect
  WALLETCONNECT_PROJECT_ID:
    import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ||
    "b9d77b9a957022836a3892a02a415fbf",

  // IPFS
  PINATA_API_KEY: import.meta.env.VITE_PINATA_API_KEY,
  PINATA_SECRET: import.meta.env.VITE_PINATA_SECRET,
  IPFS_GATEWAY: import.meta.env.VITE_IPFS_GATEWAY,

  // Platform
  PLATFORM_FEE_BPS: Number(import.meta.env.VITE_PLATFORM_FEE_BPS),
  PLATFORM_NAME: import.meta.env.VITE_PLATFORM_NAME,

  // Feature flags
  ENABLE_SPONSORSHIP: import.meta.env.VITE_ENABLE_SPONSORSHIP,
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS,
} as const;

// Platform constants
export const CONSTANTS = {
  // Time
  SECONDS_PER_DAY: 86400,
  MILLISECONDS_PER_SECOND: 1000,

  // Pagination
  EVENTS_PER_PAGE: 12,
  WORKERS_PER_PAGE: 20,
  SPONSORS_PER_PAGE: 20,

  // Validation
  MIN_EVENT_NAME_LENGTH: 3,
  MAX_EVENT_NAME_LENGTH: 100,
  MIN_TICKET_PRICE: 0,
  MAX_TICKETS: 100000,

  // UI
  TOAST_DURATION: 5000,
  DEBOUNCE_DELAY: 300,

  // Formatting
  ADDRESS_DISPLAY_LENGTH: 10, // Shows: 0x1234...5678
  HASH_DISPLAY_LENGTH: 14,
} as const;

// Event status enum
export enum EventStatus {
  DRAFT = "draft",
  UPCOMING = "upcoming",
  ACTIVE = "active",
  ENDED = "ended",
  COMPLETED = "completed",
}

// Event type enum (from contract)
export enum EventType {
  FREE = 0,
  PAID = 1,
}

// LocalStorage keys
export const STORAGE_KEYS = {
  ORGANIZATION_ADDRESS: "org_address",
  THEME: "theme",
  WALLET_CONNECTED: "wallet_connected",
} as const;
