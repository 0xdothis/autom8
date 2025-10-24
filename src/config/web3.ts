// Web3 Configuration for Lisk Sepolia
export const WEB3_CONFIG = {
  // Lisk Sepolia Testnet Configuration
  CHAIN_ID: 4202, // Lisk Sepolia testnet
  CHAIN_NAME: 'Lisk Sepolia Testnet',
  RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.sepolia-api.lisk.com',
  BLOCK_EXPLORER_URL: 'https://sepolia-blockscout.lisk.com',
  
  // Contract Addresses (Lisk Sepolia)
  FACTORY_ADDRESS: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000',
  IMPLEMENTATION_ADDRESS: process.env.NEXT_PUBLIC_IMPLEMENTATION_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000',
  
  // Legacy support (deprecated - use FACTORY_ADDRESS)
  EVENT_FACTORY_ADDRESS: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000',
  PLATFORM_OWNER_ADDRESS: process.env.NEXT_PUBLIC_PLATFORM_OWNER_ADDRESS as `0x${string}`,
  
  // Gas Configuration
  GAS_LIMIT: {
    CREATE_EVENT: BigInt(2000000),
    BUY_TICKET: BigInt(500000),
    LIST_FOR_RESALE: BigInt(300000),
    BUY_RESALE: BigInt(400000),
    CHECK_IN: BigInt(200000)
  },
  
  // Default Gas Price (in wei)
  DEFAULT_GAS_PRICE: BigInt(1000000000), // 1 gwei
  
  // Transaction Timeout (in milliseconds)
  TRANSACTION_TIMEOUT: 300000, // 5 minutes
  
  // Retry Configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 2000, // 2 seconds
} as const;

// Validation
if (!WEB3_CONFIG.FACTORY_ADDRESS || WEB3_CONFIG.FACTORY_ADDRESS === '0x0000000000000000000000000000000000000000') {
  console.warn('⚠️ FACTORY_ADDRESS not set - Please set NEXT_PUBLIC_FACTORY_ADDRESS in .env.local');
}

if (!WEB3_CONFIG.IMPLEMENTATION_ADDRESS || WEB3_CONFIG.IMPLEMENTATION_ADDRESS === '0x0000000000000000000000000000000000000000') {
  console.warn('⚠️ IMPLEMENTATION_ADDRESS not set - Please set NEXT_PUBLIC_IMPLEMENTATION_ADDRESS in .env.local');
}

// Export Lisk Sepolia chain configuration for Wagmi
export const liskSepolia = {
  id: 4202,
  name: 'Lisk Sepolia Testnet',
  network: 'lisk-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Sepolia Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [WEB3_CONFIG.RPC_URL],
    },
    public: {
      http: [WEB3_CONFIG.RPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: WEB3_CONFIG.BLOCK_EXPLORER_URL,
    },
  },
  testnet: true,
} as const;
