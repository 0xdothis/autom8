/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHAIN_ID: string
  readonly VITE_RPC_URL: string
  readonly VITE_CHAIN_NAME: string
  readonly VITE_BLOCK_EXPLORER: string
  readonly VITE_FACTORY_ADDRESS: string
  readonly VITE_IMPLEMENTATION_ADDRESS: string
  readonly VITE_TICKET_ADDRESS: string
  readonly VITE_PAYROLL_ADDRESS: string
  readonly VITE_SPONSOR_ADDRESS: string
  readonly VITE_WALLETCONNECT_PROJECT_ID: string
  readonly VITE_PINATA_API_KEY: string
  readonly VITE_PINATA_SECRET: string
  readonly VITE_IPFS_GATEWAY: string
  readonly VITE_PLATFORM_FEE_BPS: string
  readonly VITE_PLATFORM_NAME: string
  readonly VITE_ENABLE_SPONSORSHIP: string
  readonly VITE_ENABLE_ANALYTICS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
