import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { defineChain } from 'viem';
import { ENV } from './constants';

// Define Lisk Sepolia chain
export const liskSepolia = defineChain({
  id: ENV.CHAIN_ID,
  name: ENV.CHAIN_NAME,
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [ENV.RPC_URL],
    },
    public: {
      http: [ENV.RPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: ENV.BLOCK_EXPLORER,
    },
  },
  testnet: true,
});

// Wagmi configuration
export const wagmiConfig = getDefaultConfig({
  appName: ENV.PLATFORM_NAME,
  projectId: ENV.WALLETCONNECT_PROJECT_ID,
  chains: [liskSepolia],
  transports: {
    [liskSepolia.id]: http(),
  },
  ssr: false,
});
