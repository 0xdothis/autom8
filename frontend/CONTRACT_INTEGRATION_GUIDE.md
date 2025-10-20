# Contract Integration Guide

## ✅ Completed

### 1. Contract Addresses Updated
- **Factory**: `0x45ed99be2de81053aca61ce904a21dc6d9342a42`
- **Proxy (UUPS)**: `0xed58e7f03ec0ee2d71e664277a90db163b5c05bf`
- **Implementation**: `0x55eae6abb735c27edb71727b9ead2a5926008249`

Location: `src/lib/contracts/addresses.ts`

### 2. Factory ABI Updated
- Updated EventFactory.json with real deployed contract ABI
- Includes all functions: `createProxy`, `getOwnerProxy`, etc.

Location: `src/lib/contracts/abis/EventFactory.json`

### 3. Hooks Updated
- ✅ `useFactory.ts` - Uses real factory contract
- ✅ `useEvents.ts` - Uses proxy/implementation contract
- ⏳ `useTickets.ts` - Needs completion
- ⏳ `useWorkers.ts` - Needs updating
- ⏳ `useSponsors.ts` - Needs updating

## 🔄 In Progress - Implementation ABI

The Implementation contract ABI needs to be added to `EventImplementation.json`. Here's the complete ABI to use:

```json
{
  "abi": [
    // ADD THE FULL IMPLEMENTATION ABI HERE (from user's message)
    // Key functions:
    // - createEvent
    // - buyTicket
    // - getAllEvents
    // - getEventInfo
    // - addWorkerToPayroll
    // - getEventWorkers
    // - sponsorEvent
    // - getAllSponsors
    // - pay (for worker payments)
  ]
}
```

## 📋 Next Steps

### Step 1: Update EventImplementation.json
Replace the contents of `src/lib/contracts/abis/EventImplementation.json` with the implementation ABI provided by the user.

### Step 2: Update Remaining Hooks

**useWorkers.ts**:
```typescript
import { useReadContract, useWriteContract } from 'wagmi';
import { CONTRACT_ADDRESSES, eventImplementationAbi } from '@/lib/contracts';

export function useWorkers(proxyAddress?: `0x${string}`) {
  const contractAddress = proxyAddress || CONTRACT_ADDRESSES[4202].proxy;
  
  // Read workers for an event
  const { data: workers } = useReadContract({
    address: contractAddress,
    abi: eventImplementationAbi,
    functionName: 'getEventWorkers',
    args: eventId ? [eventId] : undefined,
  });
  
  // Add worker
  const { writeContract: addWorker } = useWriteContract();
  
  const addWorkerToPayroll = async (
    salary: bigint,
    description: string,
    employeeAddress: `0x${string}`,
    eventId: bigint
  ) => {
    return writeContract({
      address: contractAddress,
      abi: eventImplementationAbi,
      functionName: 'addWorkerToPayroll',
      args: [salary, description, employeeAddress, eventId],
    });
  };
  
  // Pay workers
  const payWorkers = async () => {
    return writeContract({
      address: contractAddress,
      abi: eventImplementationAbi,
      functionName: 'pay',
      args: [],
    });
  };
  
  return { workers, addWorkerToPayroll, payWorkers, ... };
}
```

**useSponsors.ts**:
```typescript
// Similar pattern - use sponsorEvent, getAllSponsors, getSponsorInfo
```

**useTickets.ts**:
```typescript
// Update to use buyTicket from implementation
// Note: Tickets are NFTs minted by the implementation contract
```

### Step 3: Update Page Components

**CreateEvent.tsx**:
- Use `useEvents` hook with user's proxy address
- Call `createEvent` with proper parameters
- Handle event types (FREE=0, PAID=1)

**EventsList.tsx**:
- Fetch events using `getAllEvents` from proxy
- Display event details
- Filter by status

**EventDetails.tsx**:
- Use `getEventInfo` for single event
- Show workers, sponsors tabs
- Owner can manage event

**WorkerManagement.tsx**:
- ✅ Already updated with event selector
- Use `addWorkerToPayroll` and `pay` functions

**Sponsorships.tsx**:
- Use `sponsorEvent` to sponsor
- Show sponsor list with `getAllSponsors`
- Display contribution percentages

### Step 4: Add ERC20 Token Support

Most functions require ERC20 token approval first:

```typescript
// Add to all payment hooks
import { erc20Abi } from 'viem';

const { writeContract: approveToken } = useWriteContract();

const approvePayment = async (amount: bigint, spenderAddress: `0x${string}`) => {
  const paymentTokenAddress = '0x...'; // Get from factory
  return approveToken({
    address: paymentTokenAddress,
    abi: erc20Abi,
    functionName: 'approve',
    args: [spenderAddress, amount],
  });
};
```

### Step 5: Test Flow

1. **Create Organization**: Call `createProxy` → get proxy address
2. **Create Event**: Call `createEvent` on proxy
3. **Buy Ticket**: Approve tokens → call `buyTicket`
4. **Add Workers**: Call `addWorkerToPayroll`
5. **Sponsor Event**: Approve tokens → call `sponsorEvent`
6. **Pay Workers**: After event ends, call `pay`

## 🐛 Known Issues to Fix

1. **MyTickets.tsx** - User undid changes, needs re-implementation
2. **Unused variables** - Clean up in landing components
3. **Build warnings** - Fix TypeScript strict mode issues

## 📝 Contract Architecture Notes

- **Factory**: Deploys proxies for each organization
- **Proxy (UUPS)**: User's organization contract
- **Implementation**: Logic contract with all functions
- All calls go through the proxy, which delegates to implementation
- Each user gets ONE proxy (check with `getOwnerProxy`)

## 🔗 Useful Contract Functions

### Factory
- `createProxy(orgName)` - Create organization
- `getOwnerProxy(address)` - Get user's proxy

### Implementation (via Proxy)
- `createEvent(...)` - Create new event
- `getAllEvents()` - Get all events
- `buyTicket(eventId)` - Purchase ticket
- `addWorkerToPayroll(...)` - Add worker
- `pay()` - Pay all workers
- `sponsorEvent(eventId, amount)` - Sponsor event

## 💡 Integration Tips

1. Always check if user has a proxy first
2. Approve tokens before payment functions
3. Use proper BigInt conversions
4. Handle loading/error states
5. Show transaction confirmations
6. Refresh data after transactions
