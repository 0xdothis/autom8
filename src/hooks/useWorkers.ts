import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { eventImplementationAbi, getContractAddress } from '@/lib/contracts';

/**
 * Hook for interacting with Worker management via proxy
 * Handles worker management and payments
 */
export function useWorkers(proxyAddress?: `0x${string}`) {
  const chainId = useChainId();
  const contractAddress = proxyAddress || getContractAddress(chainId, 'proxy');

  // Write: Add/update/pay workers
  const {
    writeContract,
    data: hash,
    isPending: isProcessing,
    error: processError,
  } = useWriteContract();

  // Wait for transaction confirmation
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Read: Get all workers for an event
  const {
    data: workers,
    isLoading: isLoadingWorkers,
    refetch: refetchWorkers,
  } = useReadContract({
    address: contractAddress,
    abi: eventImplementationAbi,
    functionName: 'getEventWorkers',
    args: proxyAddress ? [proxyAddress] : undefined,
    query: {
      enabled: !!contractAddress && !!proxyAddress,
    },
  });

  // Read: Get worker details
  const useWorkerDetails = (workerAddress?: `0x${string}`) => {
    return useReadContract({
      address: contractAddress,
      abi: eventImplementationAbi,
      functionName: 'workerDetails',
      args: proxyAddress && workerAddress ? [proxyAddress, workerAddress] : undefined,
      query: {
        enabled: !!contractAddress && !!proxyAddress && !!workerAddress,
      },
    });
  };

  // Read: Get total workers for event
  const {
    data: workerCount,
    isLoading: isLoadingCount,
  } = useReadContract({
    address: contractAddress,
    abi: eventImplementationAbi,
    functionName: 'getEventWorkerCount',
    args: proxyAddress ? [proxyAddress] : undefined,
    query: {
      enabled: !!contractAddress && !!proxyAddress,
    },
  });

  /**
   * Add a new worker to the event
   * @param workerAddress - Worker's address
   * @param description - Worker's role/description
   * @param salary - Worker's salary in USDT (with 6 decimals)
   */
  const addWorker = async (
    workerAddress: `0x${string}`,
    description: string,
    salary: bigint
  ) => {
    if (!contractAddress || !proxyAddress) {
      throw new Error('Contract or Proxy address not found');
    }

    return writeContract({
      address: contractAddress,
      abi: eventImplementationAbi,
      functionName: 'addWorker',
      args: [proxyAddress, workerAddress, description, salary],
    });
  };

  /**
   * Update worker's salary
   * @param workerAddress - Worker's address
   * @param newSalary - New salary amount
   */
  const updateWorkerSalary = async (
    workerAddress: `0x${string}`,
    newSalary: bigint
  ) => {
    if (!contractAddress || !proxyAddress) {
      throw new Error('Contract or Proxy address not found');
    }

    return writeContract({
      address: contractAddress,
      abi: eventImplementationAbi,
      functionName: 'updateWorkerSalary',
      args: [proxyAddress, workerAddress, newSalary],
    });
  };

  /**
   * Remove a worker from the event
   * @param workerAddress - Worker's address
   */
  const removeWorker = async (workerAddress: `0x${string}`) => {
    if (!contractAddress || !proxyAddress) {
      throw new Error('Contract or Proxy address not found');
    }

    return writeContract({
      address: contractAddress,
      abi: eventImplementationAbi,
      functionName: 'removeWorker',
      args: [proxyAddress, workerAddress],
    });
  };

  /**
   * Pay all workers for the event
   * @param eventId - Event ID
   */
  const payWorkers = async (eventId: bigint) => {
    if (!contractAddress || !proxyAddress) {
      throw new Error('Contract or Proxy address not found');
    }

    return writeContract({
      address: contractAddress,
      abi: eventImplementationAbi,
      functionName: 'payWorkers',
      args: [proxyAddress, eventId],
    });
  };

  return {
    // Write functions
    addWorker,
    updateWorkerSalary,
    removeWorker,
    payWorkers,
    isProcessing,
    isConfirming,
    isConfirmed,
    processError,
    transactionHash: hash,

    // Read functions
    workers: workers as any[] || [],
    workerCount: workerCount ? Number(workerCount) : 0,
    isLoadingWorkers,
    isLoadingCount,
    refetchWorkers,
    useWorkerDetails,

    // Contract info
    contractAddress,
    proxyAddress,
  };
}
