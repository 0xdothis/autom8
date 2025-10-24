// Contract addresses by chain ID - Updated with real deployed contracts

export const CONTRACT_ADDRESSES = {
  // Lisk Sepolia (testnet) - Real deployed contracts
  4202: {
    factory: '0x45ed99be2de81053aca61ce904a21dc6d9342a42', // Factory contract
    proxy: '0xed58e7f03ec0ee2d71e664277a90db163b5c05bf', // Default proxy (UUPS)
    implementation: '0x55eae6abb735c27edb71727b9ead2a5926008249', // Implementation contract
  },
} as const;

export type SupportedChainId = keyof typeof CONTRACT_ADDRESSES;

// Helper to get contract address by chain
export function getContractAddress(
  chainId: number,
  contract: keyof typeof CONTRACT_ADDRESSES[4202]
): `0x${string}` | undefined {
  const addresses = CONTRACT_ADDRESSES[chainId as SupportedChainId];
  return addresses?.[contract] as `0x${string}` | undefined;
}
