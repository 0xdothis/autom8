/**
 * React hooks for contract interactions
 * These hooks provide a clean interface between React components and the contract service
 */

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { contractService } from '../services/ContractService';
import { LibStorage, Organization, EventAnalytics, CreateEventParams, CreateWorkerParams } from '../types/contracts';
import type { Address } from 'viem';

// ============================================================================
// ORGANIZATION MANAGEMENT HOOKS
// ============================================================================

/**
 * Hook for managing organization registration and proxy creation
 */
export function useOrganization() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set wallet client when available
  useEffect(() => {
    if (walletClient) {
      contractService.setWalletClient(walletClient);
    }
  }, [walletClient]);

  // Load organization data when address changes
  useEffect(() => {
    if (address) {
      loadOrganization();
    } else {
      setOrganization(null);
    }
  }, [address]);

  const loadOrganization = useCallback(async () => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      const isRegistered = await contractService.isOrganizationRegistered(address);
      
      if (isRegistered) {
        const proxyAddress = await contractService.getOrganizationProxy(address);
        const events = await contractService.getOrganizationEvents(proxyAddress);
        
        // Calculate organization stats
        const totalRevenue = events.reduce((sum, event) => sum + event.totalRevenue, BigInt(0));
        
        const org: Organization = {
          proxyAddress,
          ownerAddress: address,
          name: 'Organization', // This would come from off-chain data
          totalEvents: events.length,
          totalRevenue: contractService.formatEther(totalRevenue),
          totalWorkers: 0, // Would need to calculate from all events
          isActive: true,
          createdAt: new Date(), // Would come from off-chain data
        };

        setOrganization(org);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load organization');
    } finally {
      setLoading(false);
    }
  }, [address]);

  const createOrganization = useCallback(async (orgName: string) => {
    if (!address || !walletClient) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const hash = await contractService.createOrganizationProxy(orgName);
      
      // Wait for transaction confirmation using the contract service's public client
      const client = contractService.getPublicClient();
      const receipt = await client.waitForTransactionReceipt({ hash });
      
      if (receipt.status === 'success') {
        // Reload organization data
        await loadOrganization();
        return hash;
      } else {
        throw new Error('Transaction failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create organization';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [address, walletClient, loadOrganization]);

  return {
    organization,
    loading,
    error,
    createOrganization,
    isRegistered: !!organization,
    refetch: loadOrganization,
  };
}

// ============================================================================
// EVENT MANAGEMENT HOOKS
// ============================================================================

/**
 * Hook for managing events within an organization
 */
export function useEvents(proxyAddress?: string) {
  const [events, setEvents] = useState<LibStorage.EventDisplay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    if (!proxyAddress) return;

    setLoading(true);
    setError(null);

    try {
      const rawEvents = await contractService.getOrganizationEvents(proxyAddress as Address);
      
      // Transform raw events to display format
      const displayEvents: LibStorage.EventDisplay[] = rawEvents.map(event => ({
        ...event,
        formattedPrice: contractService.formatEther(event.ticketPrice),
        formattedRevenue: contractService.formatEther(event.totalRevenue),
        formattedExpenses: contractService.formatEther(event.amountNeededForExpenses),
        isActive: event.status === LibStorage.Status.Active,
        isSoldOut: event.status === LibStorage.Status.SoldOut,
        hasEnded: event.status === LibStorage.Status.Ended,
        daysUntilStart: Math.ceil((Number(event.startTime) * 1000 - Date.now()) / (1000 * 60 * 60 * 24)),
        totalWorkerCost: '0', // Will be calculated separately
        totalSponsorship: '0', // Will be calculated separately
        profitAfterExpenses: '0', // Will be calculated separately
      }));

      setEvents(displayEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [proxyAddress]);

  const createEvent = useCallback(async (params: CreateEventParams) => {
    if (!proxyAddress) throw new Error('No organization proxy found');

    setLoading(true);
    setError(null);

    try {
      const contractParams = {
        name: params.name,
        ticketPrice: contractService.parseEther(params.ticketPrice),
        maxTickets: BigInt(params.maxTickets),
        startTime: BigInt(Math.floor(params.startTime.getTime() / 1000)),
        endTime: BigInt(Math.floor(params.endTime.getTime() / 1000)),
        ticketUri: params.ticketUri,
        eventType: params.eventType,
        amountNeededForExpenses: contractService.parseEther(params.amountNeededForExpenses),
      };

      const hash = await contractService.createEvent(proxyAddress as Address, contractParams);
      
      // Reload events after creation
      await loadEvents();
      
      return hash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create event';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [proxyAddress, loadEvents]);

  const buyTicket = useCallback(async (eventId: string) => {
    if (!proxyAddress) throw new Error('No organization proxy found');

    const hash = await contractService.buyTicket(proxyAddress as Address, BigInt(eventId));
    await loadEvents(); // Refresh events after ticket purchase
    return hash;
  }, [proxyAddress, loadEvents]);

  return {
    events,
    loading,
    error,
    loadEvents,
    createEvent,
    buyTicket,
    refetch: loadEvents,
  };
}

// ============================================================================
// WORKER MANAGEMENT HOOKS
// ============================================================================

/**
 * Hook for managing workers/payroll for an event
 */
export function useWorkers(proxyAddress?: string, eventId?: string) {
  const [workers, setWorkers] = useState<LibStorage.WorkerDisplay[]>([]);
  const [totalCost, setTotalCost] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWorkers = useCallback(async () => {
    if (!proxyAddress || !eventId) return;

    setLoading(true);
    setError(null);

    try {
      const rawWorkers = await contractService.getEventWorkers(proxyAddress as Address, BigInt(eventId));
      const cost = await contractService.getTotalEventCost(proxyAddress as Address, BigInt(eventId));

      const displayWorkers: LibStorage.WorkerDisplay[] = rawWorkers.map(worker => ({
        ...worker,
        formattedSalary: contractService.formatEther(worker.salary),
        statusBadge: worker.paid ? 'paid' : 'pending',
      }));

      setWorkers(displayWorkers);
      setTotalCost(contractService.formatEther(cost));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workers');
    } finally {
      setLoading(false);
    }
  }, [proxyAddress, eventId]);

  const addWorker = useCallback(async (params: CreateWorkerParams) => {
    if (!proxyAddress || !eventId) throw new Error('Missing proxy or event ID');

    setLoading(true);
    setError(null);

    try {
      const hash = await contractService.addWorkerToPayroll(
        proxyAddress as Address,
        contractService.parseEther(params.salary),
        params.description,
        params.employeeAddress as Address,
        BigInt(eventId)
      );

      await loadWorkers(); // Refresh after adding
      return hash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add worker';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [proxyAddress, eventId, loadWorkers]);

  const updateWorkerSalary = useCallback(async (workerAddress: string, newSalary: string) => {
    if (!proxyAddress || !eventId) throw new Error('Missing proxy or event ID');

    const hash = await contractService.updateWorkerSalary(
      proxyAddress as Address,
      workerAddress as Address,
      contractService.parseEther(newSalary),
      BigInt(eventId)
    );

    await loadWorkers(); // Refresh after update
    return hash;
  }, [proxyAddress, eventId, loadWorkers]);

  return {
    workers,
    totalCost,
    loading,
    error,
    loadWorkers,
    addWorker,
    updateWorkerSalary,
    refetch: loadWorkers,
  };
}

// ============================================================================
// SPONSORSHIP HOOKS
// ============================================================================

/**
 * Hook for managing event sponsorships
 */
export function useSponsorship(proxyAddress?: string, eventId?: string) {
  const [sponsors, setSponsors] = useState<LibStorage.SponsorDisplay[]>([]);
  const [totalSponsorship, setTotalSponsorship] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSponsorship = useCallback(async () => {
    if (!proxyAddress || !eventId) return;

    setLoading(true);
    setError(null);

    try {
      const rawSponsors = await contractService.getAllSponsors(proxyAddress as Address, BigInt(eventId));
      const total = await contractService.getTotalSponsorship(proxyAddress as Address, BigInt(eventId));

      const displaySponsors: LibStorage.SponsorDisplay[] = rawSponsors.map(sponsor => ({
        ...sponsor,
        formattedAmount: contractService.formatEther(sponsor.amount),
        formattedPercentage: `${Number(sponsor.percentageContribution) / 100}%`,
        expectedReturn: '0', // Would be calculated based on revenue sharing
      }));

      setSponsors(displaySponsors);
      setTotalSponsorship(contractService.formatEther(total));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sponsorship data');
    } finally {
      setLoading(false);
    }
  }, [proxyAddress, eventId]);

  const sponsorEvent = useCallback(async (amount: string) => {
    if (!proxyAddress || !eventId) throw new Error('Missing proxy or event ID');

    setLoading(true);
    setError(null);

    try {
      const hash = await contractService.sponsorEvent(
        proxyAddress as Address,
        BigInt(eventId),
        contractService.parseEther(amount)
      );

      await loadSponsorship(); // Refresh after sponsoring
      return hash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sponsor event';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [proxyAddress, eventId, loadSponsorship]);

  return {
    sponsors,
    totalSponsorship,
    loading,
    error,
    loadSponsorship,
    sponsorEvent,
    refetch: loadSponsorship,
  };
}

// ============================================================================
// PAYMENT PROCESSING HOOKS
// ============================================================================

/**
 * Hook for processing post-event payments
 */
export function usePayments(proxyAddress?: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processPayments = useCallback(async () => {
    if (!proxyAddress) throw new Error('No organization proxy found');

    setLoading(true);
    setError(null);

    try {
      const hash = await contractService.processPayments(proxyAddress as Address);
      return hash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process payments';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [proxyAddress]);

  return {
    processPayments,
    loading,
    error,
  };
}

// ============================================================================
// ANALYTICS HOOKS
// ============================================================================

/**
 * Hook for event analytics
 */
export function useEventAnalytics(proxyAddress?: string, eventId?: string) {
  const [analytics, setAnalytics] = useState<EventAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async () => {
    if (!proxyAddress || !eventId) return;

    setLoading(true);
    setError(null);

    try {
      const [workers, sponsors, ticketsSold, revenue] = await Promise.all([
        contractService.getEventWorkers(proxyAddress as Address, BigInt(eventId)),
        contractService.getAllSponsors(proxyAddress as Address, BigInt(eventId)),
        contractService.getTicketSales(proxyAddress as Address, BigInt(eventId)),
        contractService.getEventRevenue(proxyAddress as Address, BigInt(eventId)),
      ]);

      const totalExpenses = workers.reduce((sum, worker) => sum + worker.salary, BigInt(0));
      const totalSponsorship = sponsors.reduce((sum, sponsor) => sum + sponsor.amount, BigInt(0));
      const netProfit = revenue + totalSponsorship - totalExpenses;

      const analyticsData: EventAnalytics = {
        eventId,
        ticketsSold: Number(ticketsSold),
        totalRevenue: contractService.formatEther(revenue),
        totalExpenses: contractService.formatEther(totalExpenses),
        totalSponsorship: contractService.formatEther(totalSponsorship),
        netProfit: contractService.formatEther(netProfit),
        workersPaid: workers.filter(w => w.paid).length,
        totalWorkers: workers.length,
        sponsorCount: sponsors.length,
        profitMargin: revenue > 0 ? Number(netProfit * BigInt(100) / revenue) : 0,
      };

      setAnalytics(analyticsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [proxyAddress, eventId]);

  return {
    analytics,
    loading,
    error,
    loadAnalytics,
    refetch: loadAnalytics,
  };
}