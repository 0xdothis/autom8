import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { createConfig, http } from 'wagmi';
import { defineChain } from 'viem';

// Define Lisk Sepolia Testnet chain
const liskSepolia = defineChain({
  id: 4202,
  name: 'Lisk Sepolia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Sepolia Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [(globalThis as any).process?.env?.NEXT_PUBLIC_RPC_URL || 'https://rpc.sepolia-api.lisk.com'],
    },
    public: {
      http: ['https://rpc.sepolia-api.lisk.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://sepolia-blockscout.lisk.com',
    },
  },
  testnet: true,
});

const projectId = (globalThis as any).process?.env?.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

const { connectors: defaultConnectors } = getDefaultWallets({
  appName: 'Evenntz',
  projectId,
});

// Use all default connectors
const connectors = defaultConnectors;

export const config = createConfig({
  chains: [liskSepolia],
  transports: {
    [liskSepolia.id]: http(liskSepolia.rpcUrls.default.http[0]),
  },
  connectors,
  ssr: true,
  // Performance optimizations
  batch: {
    multicall: {
      wait: 16, // 16ms batch delay
    },
  },
  // Reduce polling frequency
  pollingInterval: 4000, // 4 seconds
});
