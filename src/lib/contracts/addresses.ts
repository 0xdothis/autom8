// Contract addresses by chain ID - Updated with real deployed contracts

import { ENV } from "../constants";

export const CONTRACT_ADDRESSES = {
  // Lisk Sepolia (testnet) - Real deployed contracts
  4202: {
    factory: ENV.FACTORY_ADDRESS, // Factory contract
    proxy: ENV.PROXY_ADDRESS, // Default proxy (UUPS)
    implementation: ENV.IMPLEMENTATION_ADDRESS, // Implementation contract
    globalRegistry: ENV.MANAGEMENT_ADDRESS, // Manage all events created
  },
} as const;

export type SupportedChainId = keyof typeof CONTRACT_ADDRESSES;

// Helper to get contract address by chain
export function getContractAddress(
  chainId: number,
  contract: keyof (typeof CONTRACT_ADDRESSES)[4202],
): `0x${string}` | undefined {
  const addresses = CONTRACT_ADDRESSES[chainId as SupportedChainId];
  return addresses?.[contract] as `0x${string}` | undefined;
}
