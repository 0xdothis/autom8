import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { eventImplementationAbi, getContractAddress } from '@/lib/contracts';

/**
 * Hook for interacting with Sponsor functions via proxy
 * Handles sponsorship contributions and sponsor management
 */
export function useSponsors(proxyAddress?: `0x${string}`) {
  const { address } = useAccount();
  const chainId = useChainId();
  const contractAddress = proxyAddress || getContractAddress(chainId, 'proxy');

  // Write: Sponsor event
  const {
    writeContract,
    data: hash,
    isPending: isSponsoring,
    error: sponsorError,
  } = useWriteContract();

  // Wait for transaction confirmation
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Read: Get all sponsors for an event
  const {
    data: sponsors,
    isLoading: isLoadingSponsors,
    refetch: refetchSponsors,
  } = useReadContract({
    address: contractAddress,
    abi: eventImplementationAbi,
    functionName: 'getEventSponsors',
    args: proxyAddress ? [proxyAddress] : undefined,
    query: {
      enabled: !!contractAddress && !!proxyAddress,
    },
  });

  // Read: Get sponsor details
  const useSponsorDetails = (sponsorAddress?: `0x${string}`) => {
    return useReadContract({
      address: contractAddress,
      abi: eventImplementationAbi,
      functionName: 'sponsorDetails',
      args: proxyAddress && sponsorAddress ? [proxyAddress, sponsorAddress] : undefined,
      query: {
        enabled: !!contractAddress && !!proxyAddress && !!sponsorAddress,
      },
    });
  };

  // Read: Get total sponsorship amount for event
  const {
    data: totalSponsorship,
    isLoading: isLoadingTotal,
  } = useReadContract({
    address: contractAddress,
    abi: eventImplementationAbi,
    functionName: 'getTotalSponsorshipAmount',
    args: proxyAddress ? [proxyAddress] : undefined,
    query: {
      enabled: !!contractAddress && !!proxyAddress,
    },
  });

  // Read: Get sponsor count for event
  const {
    data: sponsorCount,
    isLoading: isLoadingCount,
  } = useReadContract({
    address: contractAddress,
    abi: eventImplementationAbi,
    functionName: 'getSponsorCount',
    args: proxyAddress ? [proxyAddress] : undefined,
    query: {
      enabled: !!contractAddress && !!proxyAddress,
    },
  });

  // Read: Check if user is a sponsor
  const {
    data: isSponsor,
    isLoading: isCheckingSponsor,
  } = useReadContract({
    address: contractAddress,
    abi: eventImplementationAbi,
    functionName: 'isSponsor',
    args: proxyAddress && address ? [proxyAddress, address] : undefined,
    query: {
      enabled: !!contractAddress && !!proxyAddress && !!address,
    },
  });

  /**
   * Sponsor an event
   * @param amount - Sponsorship amount in USDT (with 6 decimals)
   */
  const sponsorEvent = async (amount: bigint) => {
    if (!contractAddress || !proxyAddress) {
      throw new Error('Contract or Proxy address not found');
    }

    return writeContract({
      address: contractAddress,
      abi: eventImplementationAbi,
      functionName: 'sponsorEvent',
      args: [proxyAddress, amount],
    });
  };

  /**
   * Distribute sponsorship returns to sponsors
   * @param eventId - Event ID
   */
  const distributeReturns = async (eventId: bigint) => {
    if (!contractAddress || !proxyAddress) {
      throw new Error('Contract or Proxy address not found');
    }

    return writeContract({
      address: contractAddress,
      abi: eventImplementationAbi,
      functionName: 'distributeReturns',
      args: [proxyAddress, eventId],
    });
  };

  /**
   * Calculate expected returns for a sponsor
   * @param sponsorAddress - Sponsor's address
   * @param totalRevenue - Total revenue from event
   */
  const calculateReturns = async (sponsorAddress: `0x${string}`, totalRevenue: bigint) => {
    if (!contractAddress || !proxyAddress) {
      throw new Error('Contract or Proxy address not found');
    }

    return writeContract({
      address: contractAddress,
      abi: eventImplementationAbi,
      functionName: 'calculateReturns',
      args: [proxyAddress, sponsorAddress, totalRevenue],
    });
  };

  return {
    // Write functions
    sponsorEvent,
    distributeReturns,
    calculateReturns,
    isSponsoring,
    isConfirming,
    isConfirmed,
    sponsorError,
    transactionHash: hash,

    // Read functions
    sponsors: sponsors as any[] || [],
    totalSponsorship: (totalSponsorship as bigint | undefined) ?? 0n,
    sponsorCount: sponsorCount ? Number(sponsorCount) : 0,
    isSponsor: isSponsor ?? false,
    isLoadingSponsors,
    isLoadingTotal,
    isLoadingCount,
    isCheckingSponsor,
    refetchSponsors,
    useSponsorDetails,

    // Contract info
    contractAddress,
    proxyAddress,
  };
}
