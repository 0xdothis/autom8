# Next Steps for Contract Integration

## ✅ What's Done

1. **Contract Addresses**: Updated to real deployed contracts
2. **Factory Hook**: Working with real factory ABI
3. **Events Hook**: Connected to proxy/implementation
4. **Tickets Hook**: Basic buy ticket functionality
5. **Build Errors**: Reduced from 9 to 8 errors

## 🔧 Remaining Build Errors to Fix

### 1. Landing Component Warnings (Low Priority)
- `LiveEventsCarousel.tsx` - Remove unused `isLoadingOrgs`
- `StatsSection.tsx` - Remove unused `isLoadingOrgs`

### 2. Contract Address Issues (HIGH PRIORITY)
- `useSponsors.ts` - Change `'sponsorVault'` to `'proxy'` (all functions are in proxy)
- `useWorkers.ts` - Change `'payroll'` to `'proxy'` (all functions are in proxy)

### 3. Function Signature Updates
- `CreateEvent.tsx` - Change `expenses` to `amountNeeded` in createEvent params
- `EventDetails.tsx` - Remove `ownedTicketsCount` (not in new hook)
- `EventDetails.tsx` - Fix `buyTicket` to only take `eventId` parameter
- `MyTickets.tsx` - Remove unused `useFactory` import

## 🎯 Quick Fixes

Run these replacements:

```typescript
// 1. Fix useSponsors.ts line 11
- const sponsorAddress = getContractAddress(chainId, 'sponsorVault');
+ const sponsorAddress = getContractAddress(chainId, 'proxy');

// 2. Fix useWorkers.ts line 10
- const payrollAddress = getContractAddress(chainId, 'payroll');
+ const payrollAddress = getContractAddress(chainId, 'proxy');

// 3. Fix CreateEvent.tsx - Change parameter name
- expenses: parseEther(formData.expenses || '0'),
+ amountNeeded: parseEther(formData.expenses || '0'),

// 4. Fix EventDetails.tsx - Remove ownedTicketsCount
- const { ownedTicketsCount, buyTicket } = useTickets();
+ const { buyTicket } = useTickets();

// 5. Fix EventDetails.tsx - Update buyTicket call
- await buyTicket(event.id, event.proxyAddress, event.ticketPrice);
+ await buyTicket(event.id);

// 6. Fix MyTickets.tsx - Remove unused import
- import { useFactory, useTickets } from '../hooks';
+ import { useTickets } from '../hooks';
```

## 📋 After Build Fixes

### Update Implementation ABI

The EventImplementation.json file still needs the full ABI. Create a file with:

```bash
cat > src/lib/contracts/abis/EventImplementation.json << 'EOF'
{
  "abi": [
    // PASTE THE FULL IMPLEMENTATION ABI FROM USER'S MESSAGE
    // It starts with "inputs": [{"internalType": "address", "name": "target"...
    // And includes all these functions:
    // - createEvent, buyTicket, getAllEvents, getEventInfo
    // - addWorkerToPayroll, getEventWorkers, pay
    // - sponsorEvent, getAllSponsors
    // etc.
  ]
}
EOF
```

### Test Integration Flow

1. Connect wallet
2. Create organization (if not exists)
3. Create event
4. Buy ticket
5. Add workers
6. Pay workers

## 💡 Key Integration Points

- All operations go through the **proxy** contract
- Proxy delegates calls to implementation
- Need ERC20 token approval before payments
- Use `getOwnerProxy` to check if user has organization
- Event IDs start from 1 (not 0)

## 🚀 Ready to Deploy Checklist

- [ ] Fix all 8 build errors
- [ ] Add full implementation ABI
- [ ] Test create organization
- [ ] Test create event
- [ ] Test buy ticket
- [ ] Test worker management
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add transaction confirmations
