# Event Platform Frontend

Modern, production-ready event management platform built with React, TypeScript, Vite, and Web3 technologies.

## 🚀 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Web3**: Wagmi + Viem + RainbowKit
- **Routing**: React Router v6
- **State Management**: React Query + Zustand
- **Forms**: React Hook Form + Zod
- **Animation**: Framer Motion

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Update .env.local with your values
# - VITE_WALLETCONNECT_PROJECT_ID (get from https://cloud.walletconnect.com)
# - IPFS credentials (optional)

# Start development server
npm run dev
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Header, Footer, Sidebar, DashboardLayout)
│   └── ui/             # Base UI components (Button, Card, Input, Modal, Toast, Badge, Skeleton)
├── pages/              # Route pages (11 pages total)
│   ├── Landing.tsx             # Landing page with hero
│   ├── Dashboard.tsx           # Organization dashboard
│   ├── CreateOrganization.tsx  # Deploy proxy contract
│   ├── CreateEvent.tsx         # 5-step event creation wizard
│   ├── EventsList.tsx          # Browse/filter events
│   ├── EventDetails.tsx        # View event + buy tickets
│   ├── MyTickets.tsx           # User's NFT tickets
│   ├── WorkerManagement.tsx    # CRUD workers + payroll
│   ├── Sponsorships.tsx        # Sponsor events + distributions
│   ├── ComponentShowcase.tsx   # UI preview (development)
│   └── NotFound.tsx           # 404 page
├── hooks/              # Custom React hooks (Web3)
│   ├── useFactory.ts   # Factory contract interactions
│   ├── useEvents.ts    # Event queries & mutations
│   ├── useTickets.ts   # Ticket (ERC721) operations
│   ├── useWorkers.ts   # Worker management (Payroll)
│   └── useSponsors.ts  # Sponsorship vault
├── lib/                # Core libraries & configs
│   ├── contracts/      # ABIs + addresses for all contracts
│   ├── wagmi.ts        # Wagmi configuration (Lisk Sepolia)
│   ├── rainbowkit.ts   # RainbowKit theme (customized)
│   ├── constants.ts    # App constants
│   └── utils.ts        # Utility functions (formatting, validation)
├── App.tsx             # Main app with routing
├── main.tsx            # Entry point
└── index.css           # Global styles (Tailwind)
```

## 🎨 Design System

### Colors
- **Primary**: Black (#000000)
- **Secondary**: White (#FFFFFF)
- **Accent**: Gray scale (#171717 - #F5F5F5)
- **Success**: Green (#10B981)
- **Error**: Red (#EF4444)
- **Warning**: Amber (#F59E0B)

### Typography
- **Font Family**: Inter (sans-serif), JetBrains Mono (monospace)
- **Sizes**: text-xs to text-5xl
- **Weights**: 400, 500, 600, 700, 800

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start dev server (http://localhost:3001)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Style

- Use functional components with hooks
- TypeScript strict mode enabled
- ESLint + Prettier for code formatting
- Tailwind CSS for styling (no CSS-in-JS)

### Component Pattern

```typescript
import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', children }: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-lg font-medium transition-all',
        variant === 'primary' && 'bg-black text-white hover:bg-gray-900',
        variant === 'secondary' && 'bg-white text-black border border-gray-300',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-4 py-2 text-base',
        size === 'lg' && 'px-6 py-3 text-lg'
      )}
    >
      {children}
    </button>
  );
}
```

## 📱 Routing Structure

```
/                           → Landing page
/events                     → Events listing (browse all)
/events/:eventId            → Event details (view & buy tickets)
/tickets                    → My tickets (NFT collection)
/create-organization        → Deploy new organization
/create-event               → Create new event (5-step wizard)
/dashboard                  → Dashboard overview
/workers                    → Worker management & payroll
/sponsorships               → Sponsorship management
/component-showcase         → UI component preview (development)
```

## 🔐 Smart Contract Integration

### Contract Addresses (Lisk Sepolia)
- **Factory**: `0xf7bcfef07193a056db8fb2189cccb53b09112c2f`
- **Implementation**: `0xa2f377C60D86a6700c364771D03F8B15c02138aa`
- **Ticket (ERC721)**: `0x594d9530a7d21bb239d769ae2f630727155a984d`
- **Payroll**: `0x4cce2c335dc4e9d9be746f2dff9aee619d618c60`
- **SponsorVault**: `0x152070f6aca4efae25f973447c29ca37acb7ea28`

### Hook Usage Examples

#### Read Contract Data
```typescript
import { useReadContract } from 'wagmi';
import { factoryAbi } from '@/lib/contracts/abis';

const { data: events, isLoading } = useReadContract({
  address: ENV.FACTORY_ADDRESS,
  abi: factoryAbi,
  functionName: 'getAllEvents',
});
```

#### Write to Contract
```typescript
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

const { writeContract, data: hash } = useWriteContract();
const { isSuccess } = useWaitForTransactionReceipt({ hash });

const handleCreateEvent = async () => {
  writeContract({
    address: proxyAddress,
    abi: implementationAbi,
    functionName: 'createEvent',
    args: [name, ticketPrice, maxTickets, startTime, endTime, ticketUri, eventType, expenses],
  });
};
```

## 🎯 Key Features Implementation Status

### Phase 1 - MVP ✅ COMPLETE
- ✅ Landing page with hero + features
- ✅ Wallet connection (RainbowKit)
- ✅ Create organization (Factory)
- ✅ Create event form (5-step wizard with validation)
- ✅ Buy ticket (ERC721 mint)
- ✅ Event details page (public + owner views)
- ✅ My tickets page (NFT collection with QR codes)
- ✅ Basic dashboard (stats + recent events)

### Phase 2 - Advanced Features ✅ COMPLETE
- ✅ Worker management (CRUD operations)
- ✅ Process payments (batch payroll)
- ✅ Sponsorships (contribute + returns distribution)
- ✅ Event listing (browse + filters)
- ✅ Search & filters (status, type, search)

### Phase 3 - Polish 🚧 IN PROGRESS
- ✅ Loading states (skeletons + spinners)
- ✅ Error handling (comprehensive)
- ✅ Toast notifications (success/error/info)
- 🚧 Animations (Framer Motion) - Partial
- 🚧 Mobile responsive - Needs testing
- ⏳ PWA support - Not started

### Phase 4 - Future Enhancements
- ⏳ QR code scanning for ticket verification
- ⏳ Email notifications (requires backend)
- ⏳ Calendar integration
- ⏳ Social sharing
- ⏳ Multi-language support
- ⏳ Advanced analytics charts

## 🚢 Deployment

### Production Build

```bash
npm run build
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables (Vercel)

Add these in Vercel dashboard:
- `VITE_WALLETCONNECT_PROJECT_ID`
- `VITE_PINATA_API_KEY` (optional)
- `VITE_PINATA_SECRET` (optional)

## 📊 Implementation Summary

### Lines of Code (Frontend)
- **Pages**: ~2,780 lines across 11 files
  - CreateEvent.tsx: ~700 lines (5-step wizard)
  - WorkerManagement.tsx: ~455 lines (CRUD + payroll)
  - Sponsorships.tsx: ~430 lines (sponsor + distribution)
  - EventDetails.tsx: ~390 lines (view + buy)
  - EventsList.tsx: ~320 lines (browse + filter)
  - MyTickets.tsx: ~337 lines (NFT collection)
  - Dashboard.tsx: ~294 lines (overview)
  - CreateOrganization.tsx: ~246 lines (deploy)
  - Landing.tsx: ~100 lines (hero)
  
- **Hooks**: ~820 lines (5 Web3 hooks)
- **Components**: ~600 lines (11 UI components)
- **Total**: ~4,200+ lines of TypeScript/React

### Build Status
✅ **TypeScript compilation**: Passing (all errors fixed)
✅ **Vite build**: Successful (24.56s)
⚠️ **Bundle size**: Some chunks > 500KB (optimization needed)

### Recent Fixes (Latest Session)
- Fixed unused variable errors in 5 files
- Fixed type errors in Sponsorships hook
- Fixed getBlockExplorerUrl parameter order
- Added error logging in all catch blocks
- Fixed array key warnings in Dashboard
- Updated README to match implementation

## 📊 Performance Targets

- **Page Load**: < 2s (needs testing)
- **Time to Interactive**: < 3s (needs testing)
- **Lighthouse Score**: > 90 (needs audit)
- **Bundle Size**: ~3.75MB largest chunk (needs optimization)

## 🧪 Testing (Future)

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

## 📝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

## 🐛 Known Issues & Limitations

### Configuration Required
- ⚠️ WalletConnect requires project ID (get from cloud.walletconnect.com)
- ⚠️ IPFS upload requires Pinata credentials (for event images)
- ⚠️ Block explorer URL needs to be set in `.env.local`

### Technical Limitations
- Gas estimation can fail on complex transactions (use manual gas limits if needed)
- Worker payment requires event ID selection (currently defaults to event ID 1)
- QR code generation uses external API (requires internet connection)
- No pagination on events list (all events loaded at once)

### Testing Needed
- Mobile responsiveness needs thorough testing
- Multiple event handling in worker management
- Sponsor return calculations need edge case testing
- Transaction error handling needs more user testing

## 📚 Resources

- [Viem Docs](https://viem.sh)
- [Wagmi Docs](https://wagmi.sh)
- [RainbowKit Docs](https://www.rainbowkit.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Lisk Sepolia Explorer](https://sepolia-blockscout.lisk.com)

## 📄 License

MIT

---

**Built with ❤️ for the blockchain community**
