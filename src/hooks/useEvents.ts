import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { eventImplementationAbi } from "@/lib/contracts";

/**
 * Hook for interacting with EventImplementation contract (via proxy)
 * Handles event creation, reading events, and event management
 */
export function useEvents(proxyAddress?: `0x${string}`) {
  // Use provided proxy or default proxy address
  const contractAddress = proxyAddress;

  // Write: Create event
  const {
    writeContract,
    data: hash,
    isPending: isCreating,
    error: createError,
  } = useWriteContract();

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Read: Get all events from a proxy
  const {
    data: events,
    isLoading: isLoadingEvents,
    refetch: refetchEvents,
  } = useReadContract({
    address: contractAddress,
    abi: eventImplementationAbi,
    functionName: "getAllEvents",
    query: {
      enabled: !!contractAddress,
    },
  });

  // Read: Get single event details
  const useEventDetails = (eventId?: bigint) => {
    return useReadContract({
      address: contractAddress,
      abi: eventImplementationAbi,
      functionName: "getEventInfo",
      args: eventId !== undefined ? [eventId] : undefined,
      query: {
        enabled: !!contractAddress && eventId !== undefined,
      },
    });
  };

  /**
   * Create a new event
   * @param params - Event parameters
   */
  const createEvent = async (params: {
    name: string;
    ticketPrice: bigint;
    maxTickets: bigint;
    startTime: bigint;
    endTime: bigint;
    ticketUri: string;
    eventType: number; // 0 = FREE, 1 = PAID
    amountNeeded: bigint;
    _category: string;
    _location: string;
    _tags: string[];
  }) => {
    if (!contractAddress) {
      throw new Error("Proxy address is required");
    }

    return writeContract({
      address: contractAddress,
      abi: eventImplementationAbi,
      functionName: "createEvent",
      args: [
        params.name,
        params.ticketPrice,
        params.maxTickets,
        params.startTime,
        params.endTime,
        params.ticketUri,
        params.eventType,
        params.amountNeeded,
        params._category,
        params._location,
        params._tags,
      ],
    });
  };

  /**
   * Process payments for an event (pay workers)
   */
  const processPayments = async () => {
    if (!contractAddress) {
      throw new Error("Proxy address is required");
    }

    return writeContract({
      address: contractAddress,
      abi: eventImplementationAbi,
      functionName: "pay",
      args: [],
    });
  };

  return {
    // Write functions
    createEvent,
    processPayments,
    isCreating,
    isConfirming,
    isConfirmed,
    createError,
    transactionHash: hash,

    // Read functions
    events: (events as any[]) || [],
    eventCount: events ? (events as any[]).length : 0,
    isLoadingEvents,
    refetchEvents,
    useEventDetails,

    // Contract info
    proxyAddress: contractAddress,
  };
}
