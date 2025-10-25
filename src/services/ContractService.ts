import {
  createPublicClient,
  http,
  parseEther,
  formatEther,
  type Address,
  type Hash,
  defineChain,
} from "viem";
import { LibStorage } from "../types/contracts";

// Contract addresses - from environment variables
const FACTORY_ADDRESS = ENV.FACTORY_ADDRESS as Address;
const RPC_URL = ENV.RPC_URL;
const CHAIN_ID = ENV.CHAIN_ID;

// Lisk Sepolia Testnet Configuration
const liskSepolia = defineChain({
  id: CHAIN_ID,
  name: "Lisk Sepolia",
  nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: [RPC_URL] },
  },
  blockExplorers: {
    default: {
      name: "Lisk Explorer",
      url: "https://sepolia-blockscout.lisk.com",
    },
  },
  testnet: true,
});

// Contract ABIs
import { FACTORY_ABI, IMPLEMENTATION_ABI } from "../abis/contracts";
import { ENV } from "@/lib/constants";

/**
 * Contract Service for Evenntz Platform on Lisk Network
 *
 * ARCHITECTURE:
 * - Factory creates Organization Proxies (one per organizer)
 * - Each Proxy delegates calls to Implementation contract
 * - We interact with PROXY addresses, implementation handles the logic
 * - Diamond storage pattern prevents storage collisions
 */
class ContractService {
  private readonly publicClient: any;
  private walletClient: any = null;
  private readonly factoryAddress: Address;

  constructor() {
    if (!FACTORY_ADDRESS) {
      throw new Error(
        "NEXT_PUBLIC_FACTORY_ADDRESS is not configured in environment variables",
      );
    }

    this.factoryAddress = FACTORY_ADDRESS;
    this.publicClient = createPublicClient({
      chain: liskSepolia,
      transport: http(RPC_URL),
    });
  }

  /**
   * Set the wallet client for transaction operations
   */
  setWalletClient(walletClient: any) {
    this.walletClient = walletClient;
  }

  /**
   * Get the public client for read operations
   */
  getPublicClient() {
    return this.publicClient;
  }

  /**
   * Verify factory contract is accessible
   */
  async verifyFactoryConnection(): Promise<boolean> {
    try {
      const implementation = await this.getImplementationAddress();
      return !!implementation;
    } catch (error) {
      console.error("Factory connection failed:", error);
      return false;
    }
  }

  /**
   * Get the implementation address from factory
   */
  async getImplementationAddress(): Promise<Address> {
    const implementation = await this.publicClient.readContract({
      address: this.factoryAddress,
      abi: FACTORY_ABI,
      functionName: "implementation",
    });
    return implementation as Address;
  }

  // ============================================================================
  // FACTORY CONTRACT OPERATIONS
  // ============================================================================

  /**
   * Create a new organization proxy
   */
  async createOrganizationProxy(orgName: string): Promise<Hash> {
    if (!this.walletClient) throw new Error("Wallet not connected");

    const hash = await this.walletClient.writeContract({
      address: this.factoryAddress,
      abi: FACTORY_ABI,
      functionName: "createProxy",
      args: [orgName],
    });

    return hash;
  }

  /**
   * Get organization's proxy address
   */
  async getOrganizationProxy(owner: Address): Promise<Address> {
    const proxyAddress = await this.publicClient.readContract({
      address: this.factoryAddress,
      abi: FACTORY_ABI,
      functionName: "getOwnerProxy",
      args: [owner],
    });

    return proxyAddress as Address;
  }

  /**
   * Check if user has a proxy (is registered organization)
   */
  async isOrganizationRegistered(owner: Address): Promise<boolean> {
    try {
      const proxyAddress = await this.getOrganizationProxy(owner);
      return proxyAddress !== "0x0000000000000000000000000000000000000000";
    } catch {
      return false;
    }
  }

  // ============================================================================
  // EVENT MANAGEMENT (THROUGH PROXY)
  // ============================================================================

  /**
   * Create a new event through the organization's proxy
   */
  async createEvent(
    proxyAddress: Address,
    params: {
      name: string;
      ticketPrice: bigint;
      maxTickets: bigint;
      startTime: bigint;
      endTime: bigint;
      ticketUri: string;
      eventType: LibStorage.EventType;
      amountNeededForExpenses: bigint;
    },
  ): Promise<Hash> {
    if (!this.walletClient) throw new Error("Wallet not connected");

    const hash = await this.walletClient.writeContract({
      address: proxyAddress,
      abi: IMPLEMENTATION_ABI,
      functionName: "createEvent",
      args: [
        params.name,
        params.ticketPrice,
        params.maxTickets,
        params.startTime,
        params.endTime,
        params.ticketUri,
        params.eventType,
        params.amountNeededForExpenses,
      ],
    });

    return hash;
  }

  /**
   * Get all events for an organization
   */
  async getOrganizationEvents(
    proxyAddress: Address,
  ): Promise<LibStorage.EventStruct[]> {
    const events = await this.publicClient.readContract({
      address: proxyAddress,
      abi: IMPLEMENTATION_ABI,
      functionName: "getAllEvents",
    });

    return events as LibStorage.EventStruct[];
  }

  /**
   * Get specific event information
   */
  async getEventInfo(
    proxyAddress: Address,
    eventId: bigint,
  ): Promise<LibStorage.EventStruct> {
    const event = await this.publicClient.readContract({
      address: proxyAddress,
      abi: IMPLEMENTATION_ABI,
      functionName: "getEventInfo",
      args: [eventId],
    });

    return event as LibStorage.EventStruct;
  }

  // ============================================================================
  // WORKER/PAYROLL MANAGEMENT
  // ============================================================================

  /**
   * Add a single worker to event payroll
   */
  async addWorkerToPayroll(
    proxyAddress: Address,
    salary: bigint,
    description: string,
    employeeAddress: Address,
    eventId: bigint,
  ): Promise<Hash> {
    if (!this.walletClient) throw new Error("Wallet not connected");

    const hash = await this.walletClient.writeContract({
      address: proxyAddress,
      abi: IMPLEMENTATION_ABI,
      functionName: "addWorkerToPayroll",
      args: [salary, description, employeeAddress, eventId],
    });

    return hash;
  }

  /**
   * Add multiple workers to event payroll (bulk operation)
   */
  async addWorkersToPayroll(
    proxyAddress: Address,
    workersInfo: LibStorage.WorkerInfo[],
    eventId: bigint,
  ): Promise<Hash> {
    if (!this.walletClient) throw new Error("Wallet not connected");

    const hash = await this.walletClient.writeContract({
      address: proxyAddress,
      abi: IMPLEMENTATION_ABI,
      functionName: "addWorkersToPayroll",
      args: [workersInfo, eventId],
    });

    return hash;
  }

  /**
   * Update worker salary
   */
  async updateWorkerSalary(
    proxyAddress: Address,
    employeeAddress: Address,
    newSalary: bigint,
    eventId: bigint,
  ): Promise<Hash> {
    if (!this.walletClient) throw new Error("Wallet not connected");

    const hash = await this.walletClient.writeContract({
      address: proxyAddress,
      abi: IMPLEMENTATION_ABI,
      functionName: "updateWorkerSalary",
      args: [employeeAddress, newSalary, eventId],
    });

    return hash;
  }

  /**
   * Get worker information
   */
  async getWorkerInfo(
    proxyAddress: Address,
    employee: Address,
    eventId: bigint,
  ): Promise<LibStorage.WorkerInfo> {
    const workerInfo = await this.publicClient.readContract({
      address: proxyAddress,
      abi: IMPLEMENTATION_ABI,
      functionName: "getWorkerInfo",
      args: [employee, eventId],
    });

    return workerInfo as LibStorage.WorkerInfo;
  }

  /**
   * Get all workers for an event
   */
  async getEventWorkers(
    proxyAddress: Address,
    eventId: bigint,
  ): Promise<LibStorage.WorkerInfo[]> {
    const workers = await this.publicClient.readContract({
      address: proxyAddress,
      abi: IMPLEMENTATION_ABI,
      functionName: "getEventWorkers",
      args: [eventId],
    });

    return workers as LibStorage.WorkerInfo[];
  }

  /**
   * Get total cost for event (all worker salaries)
   */
  async getTotalEventCost(
    proxyAddress: Address,
    eventId: bigint,
  ): Promise<bigint> {
    const totalCost = await this.publicClient.readContract({
      address: proxyAddress,
      abi: IMPLEMENTATION_ABI,
      functionName: "getTotalCost",
      args: [eventId],
    });

    return totalCost as bigint;
  }

  // ============================================================================
  // SPONSORSHIP MANAGEMENT
  // ============================================================================

  /**
   * Sponsor an event
   */
  async sponsorEvent(
    proxyAddress: Address,
    eventId: bigint,
    amount: bigint,
  ): Promise<Hash> {
    if (!this.walletClient) throw new Error("Wallet not connected");

    const hash = await this.walletClient.writeContract({
      address: proxyAddress,
      abi: IMPLEMENTATION_ABI,
      functionName: "sponsorEvent",
      args: [eventId, amount],
      value: amount, // Send ETH with the transaction
    });

    return hash;
  }

  /**
   * Get sponsor information for specific sponsor and event
   */
  async getSponsorInfo(
    proxyAddress: Address,
    sponsor: Address,
    eventId: bigint,
  ): Promise<LibStorage.SponsorInfo> {
    const sponsorInfo = await this.publicClient.readContract({
      address: proxyAddress,
      abi: IMPLEMENTATION_ABI,
      functionName: "getSponsorInfo",
      args: [sponsor, eventId],
    });

    return sponsorInfo as LibStorage.SponsorInfo;
  }

  /**
   * Get total sponsorship for an event
   */
  async getTotalSponsorship(
    proxyAddress: Address,
    eventId: bigint,
  ): Promise<bigint> {
    const totalSponsorship = await this.publicClient.readContract({
      address: proxyAddress,
      abi: IMPLEMENTATION_ABI,
      functionName: "getTotalSponsorship",
      args: [eventId],
    });

    return totalSponsorship as bigint;
  }

  /**
   * Get all sponsors for an event
   */
  async getAllSponsors(
    proxyAddress: Address,
    eventId: bigint,
  ): Promise<LibStorage.SponsorInfo[]> {
    const sponsors = await this.publicClient.readContract({
      address: proxyAddress,
      abi: IMPLEMENTATION_ABI,
      functionName: "getAllSponsors",
      args: [eventId],
    });

    return sponsors as LibStorage.SponsorInfo[];
  }

  // ============================================================================
  // TICKET MANAGEMENT
  // ============================================================================

  /**
   * Buy a ticket for an event
   */
  async buyTicket(proxyAddress: Address, eventId: bigint): Promise<Hash> {
    if (!this.walletClient) throw new Error("Wallet not connected");

    // First get the event info to determine price
    const eventInfo = await this.getEventInfo(proxyAddress, eventId);

    const hash = await this.walletClient.writeContract({
      address: proxyAddress,
      abi: IMPLEMENTATION_ABI,
      functionName: "buyTicket",
      args: [eventId],
      value:
        eventInfo.eventType === LibStorage.EventType.Paid
          ? eventInfo.ticketPrice
          : BigInt(0),
    });

    return hash;
  }

  /**
   * Get ticket sales information
   */
  async getTicketSales(
    proxyAddress: Address,
    eventId: bigint,
  ): Promise<bigint> {
    const ticketsSold = await this.publicClient.readContract({
      address: proxyAddress,
      abi: IMPLEMENTATION_ABI,
      functionName: "getTicketTotalSale",
      args: [eventId],
    });

    return ticketsSold as bigint;
  }

  /**
   * Get event revenue
   */
  async getEventRevenue(
    proxyAddress: Address,
    eventId: bigint,
  ): Promise<bigint> {
    const revenue = await this.publicClient.readContract({
      address: proxyAddress,
      abi: IMPLEMENTATION_ABI,
      functionName: "getEventRevenue",
      args: [eventId],
    });

    return revenue as bigint;
  }

  // ============================================================================
  // PAYMENT PROCESSING
  // ============================================================================

  /**
   * Process payments for all ended events (the main payment function)
   */
  async processPayments(proxyAddress: Address): Promise<Hash> {
    if (!this.walletClient) throw new Error("Wallet not connected");

    const hash = await this.walletClient.writeContract({
      address: proxyAddress,
      abi: IMPLEMENTATION_ABI,
      functionName: "pay",
    });

    return hash;
  }

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /**
   * Get organization owner from proxy
   */
  async getOrganizationOwner(proxyAddress: Address): Promise<Address> {
    const owner = await this.publicClient.readContract({
      address: proxyAddress,
      abi: IMPLEMENTATION_ABI,
      functionName: "getOwner",
    });

    return owner as Address;
  }

  /**
   * Get all contract owners for dependency modules
   */
  async getAllContractOwners(proxyAddress: Address): Promise<Address[]> {
    const owners = await this.publicClient.readContract({
      address: proxyAddress,
      abi: IMPLEMENTATION_ABI,
      functionName: "getAllContractOwner",
    });

    return owners as Address[];
  }

  /**
   * Format currency values
   */
  formatEther(value: bigint): string {
    return formatEther(value);
  }

  /**
   * Parse currency values
   */
  parseEther(value: string): bigint {
    return parseEther(value);
  }
}

// Export singleton instance
export const contractService = new ContractService();
export default ContractService;

