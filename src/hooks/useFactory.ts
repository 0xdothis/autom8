import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { eventFactoryAbi, getContractAddress } from '@/lib/contracts';

/**
 * Hook for interacting with the EventFactory contract
 * Handles organization creation and fetching user organizations
 */
export function useFactory() {
  const { address } = useAccount();
  const chainId = useChainId();
  const factoryAddress = getContractAddress(chainId, 'factory');

  // Write: Create a new organization (deploys proxy)
  const { 
    writeContract, 
    data: hash, 
    isPending: isCreating,
    error: createError 
  } = useWriteContract();

  // Wait for transaction confirmation
  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Read: Get user's proxy address
  const {
    data: userProxyAddress,
    isLoading: isLoadingOrgs,
    refetch: refetchOrganizations,
  } = useReadContract({
    address: factoryAddress,
    abi: eventFactoryAbi,
    functionName: 'getOwnerProxy',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!factoryAddress,
    },
  });

  // Hook to get a specific proxy from the proxiesList array
  const useProxyAtIndex = (index: number) => {
    return useReadContract({
      address: factoryAddress,
      abi: eventFactoryAbi,
      functionName: 'proxiesList',
      args: [BigInt(index)],
      query: {
        enabled: !!factoryAddress && index >= 0,
      },
    });
  };

  /**
   * Create a new organization
   * @param name - Organization name (string)
   */
  const createOrganization = async (name: string) => {
    if (!factoryAddress) {
      throw new Error('Factory contract address not found for this chain');
    }

    return writeContract({
      address: factoryAddress,
      abi: eventFactoryAbi,
      functionName: 'createProxy',
      args: [name],
    });
  };

  // Convert single proxy address to array format for compatibility
  const userOrganizations = userProxyAddress && userProxyAddress !== '0x0000000000000000000000000000000000000000' 
    ? [userProxyAddress] 
    : [];

  return {
    // Write functions
    createOrganization,
    isCreating,
    isConfirming,
    isConfirmed,
    createError,
    transactionHash: hash,

    // Read functions
    userOrganizations: userOrganizations as `0x${string}`[],
    isLoadingOrgs,
    refetchOrganizations,
    useProxyAtIndex,

    // Contract info
    factoryAddress,
  };
}
