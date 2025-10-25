import { useReadContract, useChainId } from "wagmi";
import { globalEventRegistryAbi, getContractAddress } from "@/lib/contracts";

/**
 * Hook for interacting with EventImplementation contract (via proxy)
 * Handles event creation, reading events, and event management
 */
export function useAllEvents(eventsAddress?: `0x${string}`) {
  const chainId = useChainId();
  // Use provided proxy or default proxy address
  const contractAddress =
    eventsAddress || getContractAddress(chainId, "globalRegistry");

  // Read: Get all events from all globalEventManager
  const {
    data: events,
    isLoading: isLoadingEvents,
    refetch: refetchEvents,
  } = useReadContract({
    address: contractAddress,
    abi: globalEventRegistryAbi,
    functionName: "getAllEvent",
    query: {
      enabled: !!contractAddress,
    },
  });

  return {
    // Read functions
    events: (events as any[]) || [],
    eventCount: events ? (events as any[]).length : 0,
    isLoadingEvents,
    refetchEvents,

    // Contract info
    proxyAddress: contractAddress,
  };
}
