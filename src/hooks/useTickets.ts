import { useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { eventImplementationAbi, getContractAddress } from '@/lib/contracts';

/**
 * Hook for interacting with ticket functionality via proxy contract
 * Handles ticket purchases
 */
export function useTickets(proxyAddress?: `0x${string}`) {
  const chainId = useChainId();
  const contractAddress = proxyAddress || getContractAddress(chainId, 'proxy');

  // Write: Buy ticket
  const {
    writeContract,
    data: hash,
    isPending: isBuying,
    error: buyError,
  } = useWriteContract();

  // Wait for transaction confirmation
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  /**
   * Buy a ticket for an event
   * @param eventId - Event ID
   */
  const buyTicket = async (eventId: bigint) => {
    if (!contractAddress) {
      throw new Error('Contract address is required');
    }

    return writeContract({
      address: contractAddress,
      abi: eventImplementationAbi,
      functionName: 'buyTicket',
      args: [eventId],
    });
  };

  /**
   * Transfer ticket - TODO: Implement with NFT contract
   */
  const transferTicket = async (_from: `0x${string}`, _to: `0x${string}`, _tokenId: bigint) => {
    // This would need the actual NFT contract address, which is event-specific
    // For now, we'll throw an error
    throw new Error('Transfer ticket not yet implemented - needs NFT contract integration');
  };

  return {
    // Write functions
    buyTicket,
    transferTicket,
    isBuying,
    isConfirming,
    isConfirmed,
    buyError,
    transactionHash: hash,

    // Contract info
    ticketAddress: contractAddress,
  };
}
