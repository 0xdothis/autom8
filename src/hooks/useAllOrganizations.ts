import { useState, useEffect } from "react";
import { useReadContract, useChainId } from "wagmi";
import { eventImplementationAbi, getContractAddress } from "@/lib/contracts";
import { getKnownProxies } from "@/lib/contracts/known-proxies";

/** interface Event {
  id: bigint;
  name: string;
  ticketPrice: bigint;
  maxTickets: bigint;
  ticketsSold: bigint;
  startTime: bigint;
  endTime: bigint;
  eventType: number;
  amountNeeded: bigint;
  proxyAddress: string;
} */

/**
 * Hook to discover all organizations and their events
 * This tries to fetch proxies from the Factory by querying proxiesList array indices
 * Until we get an error (which means we've reached the end)
 */
export function useAllOrganizations() {
  const chainId = useChainId();
  const factoryAddress = getContractAddress(chainId, "factory");
  const [allProxies, setAllProxies] = useState<`0x${string}`[]>([]);
  //const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [isLoadingProxies, setIsLoadingProxies] = useState(true);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  // Start by getting known proxies
  useEffect(() => {
    const knownProxies = getKnownProxies();
    if (knownProxies.length > 0) {
      setAllProxies(knownProxies);
      setIsLoadingProxies(false);
    }
  }, []);

  // Try to discover more proxies from the Factory by querying indices
  // This is a workaround since the contract doesn't have a getProxiesCount function
  useEffect(() => {
    if (!factoryAddress) return;

    const discoverProxies = async () => {
      const discovered: `0x${string}`[] = [...getKnownProxies()];

      // Try querying proxiesList indices 0-50 (adjust as needed)
      // We'll stop when we get an error or zero address
      for (let i = 0; i < 50; i++) {
        try {
          // This is a hack - we can't easily do this without a contract call library
          // For now, we'll just use the known proxies from the config file
          break;
        } catch (error) {
          break;
        }
      }

      const unique = [...new Set(discovered)].filter(
        (addr) => addr !== "0x0000000000000000000000000000000000000000",
      );

      setAllProxies(unique);
      setIsLoadingProxies(false);
    };

    discoverProxies();
  }, [factoryAddress]);

  // Fetch events from all proxies
  useEffect(() => {
    if (allProxies.length === 0) {
      setIsLoadingEvents(false);
      return;
    }

    const fetchAllEvents = async () => {
      setIsLoadingEvents(true);

      // For now, we'll just return the proxies list
      // The EventsList component will need to fetch events per proxy
      setIsLoadingEvents(false);
    };

    fetchAllEvents();
  }, [allProxies]);

  return {
    allProxies,
    //allEvents,
    isLoadingProxies,
    isLoadingEvents,
    proxiesCount: allProxies.length,
  };
}

/**
 * Hook to fetch events from a specific proxy
 */
export function useProxyEvents(proxyAddress?: `0x${string}`) {
  const { data: events, isLoading } = useReadContract({
    address: proxyAddress,
    abi: eventImplementationAbi,
    functionName: "getAllEvents",
    query: {
      enabled: !!proxyAddress,
    },
  });

  return {
    events: (events as any[]) || [],
    isLoading,
  };
}
