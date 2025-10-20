# Event Platform Frontend - Implementation Roadmap

## 🎯 Project Overview
A modern, production-ready event management platform built on blockchain technology. Users can create organizations, manage events with NFT tickets, handle worker payroll, and accept sponsorships - all powered by smart contracts on Lisk Sepolia.

---

## 🎨 Design System

### Color Palette
```
Primary: Black (#000000)
Secondary: White (#FFFFFF)
Accent: Gray shades (#171717, #262626, #404040, #737373, #A3A3A3, #D4D4D4, #F5F5F5)
Success: #10B981 (Green)
Error: #EF4444 (Red)
Warning: #F59E0B (Amber)
Info: #3B82F6 (Blue)
```

### Typography
- **Headings**: Inter/Geist Sans - Bold, tracking-tight
- **Body**: Inter/Geist Sans - Regular
- **Mono**: Geist Mono - for addresses, transaction hashes

### Motion
- Smooth page transitions (Framer Motion)
- Micro-interactions on buttons/cards
- Skeleton loaders for async data
- Toast notifications for feedback

---

## 📁 Project Structure

```
frontend/
├── public/
│   ├── logo.svg
│   ├── hero-bg.svg
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── icons/          # SVG icons
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── DashboardLayout.tsx
│   │   ├── ui/             # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Dropdown.tsx
│   │   ├── web3/
│   │   │   ├── ConnectButton.tsx
│   │   │   ├── WalletInfo.tsx
│   │   │   └── NetworkSwitcher.tsx
│   │   └── features/       # Feature-specific components
│   │       ├── landing/
│   │       ├── events/
│   │       ├── dashboard/
│   │       ├── tickets/
│   │       ├── workers/
│   │       └── sponsors/
│   ├── pages/
│   │   ├── Landing.tsx
│   │   ├── Dashboard.tsx
│   │   ├── CreateOrganization.tsx
│   │   ├── CreateEvent.tsx
│   │   ├── EventDetails.tsx
│   │   ├── MyTickets.tsx
│   │   ├── WorkerManagement.tsx
│   │   └── Sponsorships.tsx
│   ├── hooks/
│   │   ├── useFactory.ts           # Factory contract interactions
│   │   ├── useImplementation.ts    # Event implementation contract
│   │   ├── useTickets.ts           # ERC721 ticket operations
│   │   ├── useWorkers.ts           # Payroll management
│   │   ├── useSponsors.ts          # Sponsorship vault
│   │   ├── useEvents.ts            # Event queries & mutations
│   │   ├── useOrganization.ts      # Org proxy management
│   │   └── useTransactions.ts      # TX status & history
│   ├── lib/
│   │   ├── contracts/
│   │   │   ├── abis/              # Contract ABIs
│   │   │   ├── addresses.ts       # Contract addresses by chain
│   │   │   └── types.ts           # Generated types from ABIs
│   │   ├── wagmi.ts               # Wagmi config
│   │   ├── rainbowkit.ts          # RainbowKit theme
│   │   ├── utils.ts               # Helper functions
│   │   └── constants.ts           # App constants
│   ├── types/
│   │   ├── contracts.ts           # Smart contract types
│   │   ├── events.ts              # Event-related types
│   │   └── api.ts                 # API response types
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── .env.local
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## 🚀 User Flows

### 1. Landing Page Flow
**Purpose**: Convert visitors into users, explain value proposition

**Sections**:
1. **Hero Section**
   - Headline: "Blockchain-Powered Event Management"
   - Subheadline: "Create events, sell NFT tickets, manage teams, and accept sponsorships—all on-chain"
   - CTA: "Launch Your Organization" + "Explore Events"
   - Background: Gradient mesh with subtle animation
   - Wallet connect in header (non-intrusive)

2. **Features Grid** (4 columns)
   - **NFT Tickets**: ERC721 tokens as event tickets, transferable, verifiable
   - **Worker Payroll**: Add team members, set salaries, automate post-event payments
   - **Sponsorships**: Accept funding, auto-distribute % returns to sponsors
   - **Smart Contracts**: UUPS upgradeable, Factory→Proxy→Implementation pattern

3. **How It Works** (Timeline/Steps)
   - Step 1: Create Organization (Factory deploys your Proxy)
   - Step 2: Create Event (set date, price, capacity)
   - Step 3: Sell Tickets (ERC721 minted on purchase)
   - Step 4: Event Ends (process payments: workers → sponsors → platform)
   - Visual flow diagram with icons

4. **Live Events Preview**
   - Horizontal scrolling carousel
   - Show 3-4 active events (fetched from contracts)
   - Card: Event name, date, ticket price, tickets sold/available
   - Click → Event Details page

5. **Stats Section**
   - Total Organizations
   - Total Events Created
   - Total Tickets Sold
   - Total Value Locked
   - Fetched from contracts in real-time

6. **Testimonials/Social Proof** (Optional)
   - Could show recent transactions
   - Or founder/team message about vision

7. **Footer**
   - Links: Dashboard, Docs, GitHub, Twitter
   - Legal: Privacy Policy, Terms
   - Network indicator (Lisk Sepolia)

**User Actions**:
- Click "Launch Your Organization" → Redirect to Create Organization (requires wallet)
- Click "Explore Events" → Redirect to Events Listing
- Click "Connect Wallet" (Header) → RainbowKit modal

---

### 2. Create Organization Flow
**Route**: `/create-organization`

**Purpose**: Deploy a new proxy contract for the user's organization

**UI/UX**:
- Simple form (single page)
- **Field**: Organization Name (required, 3-50 chars)
- **Preview**: Show what their org dashboard will look like
- **CTA**: "Deploy Organization" button
- **Wallet Required**: Must be connected
- **Transaction Flow**:
  1. User clicks "Deploy"
  2. Show modal with transaction preview (gas estimate)
  3. User confirms in wallet
  4. Show loading state with TX hash link
  5. On success → Redirect to Dashboard with org address

**Post-Creation**:
- Store org proxy address in localStorage (for quick access)
- Show success toast with org address (copy button)

---

### 3. Dashboard Flow
**Route**: `/dashboard` or `/dashboard/:orgAddress`

**Purpose**: Central hub for organization owners to manage everything

**Layout**:
- **Sidebar Navigation**:
  - Overview
  - Events (Create, Active, Past)
  - Workers (Add, Manage, Payments)
  - Sponsorships (View, Accept)
  - Analytics
  - Settings

- **Main Content Area** (changes based on sidebar selection)

**Overview Tab** (Default):
- **Org Info Card**:
  - Organization name
  - Proxy address (copy button)
  - Owner address
  - Creation date
  
- **Quick Stats** (4 cards):
  - Total Events: 12
  - Active Events: 3
  - Total Revenue: 24.5 ETH
  - Workers: 8
  
- **Recent Activity Feed**:
  - Latest ticket sales
  - Worker payments processed
  - Sponsorships received
  - Timestamps + TX links
  
- **Quick Actions**:
  - Create Event (big button)
  - Add Worker
  - View Sponsorships

---

### 4. Create Event Flow
**Route**: `/dashboard/events/create`

**Purpose**: Create a new event with all parameters

**Multi-Step Form** (Wizard Pattern):

**Step 1: Basic Info**
- Event Name (required)
- Event Type: Free / Paid (radio buttons)
- Location (optional text)
- Cover Image (IPFS upload)

**Step 2: Date & Time**
- Start Date + Time
- End Date + Time
- Timezone (auto-detect, allow override)
- Validation: Start < End, Start > Now

**Step 3: Ticketing**
- Max Tickets (number, min 1)
- Ticket Price (if Paid, in USDT/ETH)
- Ticket NFT Metadata URI (IPFS link)
- Preview ticket design

**Step 4: Budget**
- Amount Needed for Expenses (USDT)
- Explanation: This helps sponsors understand funding needs

**Step 5: Review & Submit**
- Summary of all inputs
- Estimated gas cost
- Terms checkbox: "I agree to platform 5% fee"
- "Create Event" button

**Transaction Flow**:
- User confirms → Wallet signs TX
- Show pending state (spinner + TX hash)
- On success → Redirect to Event Details
- On error → Show error message, allow retry

---

### 5. Event Details Flow
**Route**: `/events/:eventId`

**Purpose**: Show all event info, sell tickets, manage event

**Public View** (Anyone can see):
- **Hero Section**:
  - Event cover image
  - Event name, date, time
  - Location
  - Ticket price
  - Tickets available: X / Y
  - Status badge: Upcoming / Active / Ended / Completed
  
- **Buy Ticket Section** (if active):
  - "Buy Ticket" button (requires wallet)
  - Shows user's ticket if already purchased (NFT display)
  - QR code for ticket (after purchase)
  
- **Event Stats**:
  - Tickets sold
  - Total revenue
  - Sponsorships received
  - Workers assigned

- **Sponsorship Opportunity** (if active):
  - "Sponsor This Event" button
  - Input amount (USDT)
  - Shows % return calculation (based on total revenue)

**Owner View** (If connected wallet == event creator):
- **Additional Actions**:
  - Edit Event (if not started)
  - Add Workers
  - Process Payments (if ended & not paid)
  - View Analytics
  
- **Management Tabs**:
  - **Attendees**: List of ticket holders (addresses)
  - **Workers**: List with salaries, payment status
  - **Sponsors**: List with amounts, % contributions
  - **Revenue Breakdown**: Chart showing ticket sales, sponsorships, expenses

---

### 6. My Tickets Flow
**Route**: `/tickets`

**Purpose**: User's personal ticket collection (NFTs they own)

**UI**:
- **Grid of Ticket Cards**:
  - Event name
  - Event date
  - Ticket ID
  - QR code (click to expand)
  - Event status (upcoming, active, past)
  - "View Event" link
  
- **Filters**:
  - Upcoming / Past
  - Search by event name
  
- **Empty State**:
  - "No tickets yet"
  - CTA: "Explore Events"

**Ticket Card Details** (Expandable):
- Full NFT metadata
- IPFS image/animation
- Transfer ticket (send to another address)
- View on block explorer

---

### 7. Worker Management Flow
**Route**: `/dashboard/workers`

**Purpose**: Organization owners manage team and payroll

**UI Layout**:

**Header**:
- "Add Worker" button (opens modal)
- Search bar
- Filter: All / Paid / Unpaid

**Workers Table**:
| Worker Address | Description | Salary (USDT) | Events | Status | Actions |
|---|---|---|---|---|---|
| 0x1234...5678 | Event Coordinator | 500 | 3 events | Paid | View, Edit, Remove |

**Add Worker Modal**:
- Worker Address (input with ENS support)
- Description/Role (text)
- Salary (USDT amount)
- Assign to Event (dropdown, optional)
- "Add Worker" button

**Worker Details Page** (Click row):
- Full address
- Total earnings
- Payment history (table with dates, amounts, TX hashes)
- Events worked on (list with links)
- Edit/Remove actions

**Batch Actions**:
- Select multiple workers
- "Pay Selected" button
- Shows total amount, confirms TX

---

### 8. Sponsorships Flow
**Route**: `/dashboard/sponsorships`

**Purpose**: View all sponsorships received across events

**UI Layout**:

**Summary Cards** (Top):
- Total Sponsorships Received
- Total Sponsors
- Average Sponsorship Amount

**Sponsors Table**:
| Sponsor Address | Event | Amount (USDT) | % Contribution | Date | Status | TX Hash |
|---|---|---|---|---|---|---|
| 0xabcd...1234 | Event Name | 1000 | 2.5% | Oct 15, 2025 | Distributed | 0x... |

**Sponsor Details Modal** (Click row):
- Full sponsor address
- Event details
- Sponsorship amount
- % contribution calculation
- Expected returns
- Distribution status
- TX hash link

**Call-to-Action**:
- "How Sponsorships Work" info section
- Encourages event organizers to promote sponsorship opportunities

---

### 9. Event Analytics Flow
**Route**: `/dashboard/events/:eventId/analytics`

**Purpose**: Deep dive into event performance metrics

**Charts & Visualizations**:

1. **Revenue Overview** (Line Chart):
   - Ticket sales over time
   - Sponsorships over time
   - Cumulative revenue

2. **Ticket Sales** (Bar Chart):
   - Sales per day
   - Peak sale times

3. **Financial Breakdown** (Pie Chart):
   - Ticket Revenue: 60%
   - Sponsorships: 30%
   - Expenses: 10%

4. **Attendance Projections**:
   - Tickets sold vs. available
   - Sell-through rate
   - Estimated final attendance

5. **Geographic Distribution** (if location data available):
   - Map showing ticket holder locations

6. **ROI Calculator** (for sponsors):
   - Input: Sponsorship amount
   - Output: Expected return based on current projections

---

## 🔐 Authentication & Authorization

### Wallet Connection
- **RainbowKit** integration for wallet connection
- Support: MetaMask, WalletConnect, Coinbase Wallet, etc.
- Persistent connection (localStorage)

### Role-Based Access
- **Public**: Can view events, buy tickets
- **Organization Owner**: Full access to their org dashboard
- **Event Creator**: Manage specific events (usually same as org owner)
- **Ticket Holder**: Access to their tickets

### Authorization Checks
```typescript
// Pseudo-code for auth checks
useEffect(() => {
  if (!isConnected) redirect('/');
  
  const orgOwner = await getOrgOwner(orgAddress);
  if (address !== orgOwner) {
    toast.error('You do not own this organization');
    redirect('/dashboard');
  }
}, [isConnected, address, orgAddress]);
```

---

## 🛠️ Technical Implementation Strategy

### State Management
- **Wagmi Hooks**: For contract reads/writes
- **React Query**: For caching blockchain data
- **Zustand** (optional): For global UI state (modals, toasts)
- **Context API**: For theme, wallet connection

### Data Fetching Patterns

**Real-time Contract Data**:
```typescript
// Example pattern
const { data: events, isLoading, refetch } = useReadContract({
  address: proxyAddress,
  abi: implementationAbi,
  functionName: 'getAllEvents',
  watch: true, // Auto-refetch on block changes
});
```

**Optimistic Updates**:
```typescript
// Example for adding worker
const { writeContract, data: hash } = useWriteContract();
const { isSuccess } = useWaitForTransactionReceipt({ hash });

useEffect(() => {
  if (isSuccess) {
    queryClient.invalidateQueries(['workers', eventId]);
    toast.success('Worker added!');
  }
}, [isSuccess]);
```

### Form Validation
- **React Hook Form** for form state
- **Zod** for schema validation
- Client-side validation before TX submission

### IPFS Integration
- **Pinata** or **NFT.Storage** for metadata/images
- Upload before submitting contract TX
- Store IPFS hash in contract

### Error Handling
- Graceful wallet errors (user rejected, insufficient gas)
- Contract revert errors (custom error messages)
- Network errors (RPC failures)
- User-friendly toast notifications

### Loading States
- **Skeleton loaders** for initial data fetch
- **Spinners** for TX pending
- **Progress indicators** for multi-step processes

---

## 🎯 Key Features by Priority

### MVP (Phase 1) - Core Functionality
- ✅ Landing page with hero + features
- ✅ Wallet connection (RainbowKit)
- ✅ Create organization (Factory interaction)
- ✅ Create event (full form)
- ✅ Buy ticket (ERC721 mint)
- ✅ Event details page
- ✅ My tickets page
- ✅ Basic dashboard

### Phase 2 - Advanced Features
- ✅ Worker management (add, edit, remove)
- ✅ Process payments (workers + sponsors)
- ✅ Sponsorships (contribute, view)
- ✅ Event analytics
- ✅ Search & filters

### Phase 3 - Polish & Optimization
- ✅ Animation & transitions (Framer Motion)
- ✅ Dark mode toggle (optional, since black/white)
- ✅ Mobile responsive
- ✅ PWA support
- ✅ Performance optimization (lazy loading, code splitting)

### Phase 4 - Future Enhancements
- 🔮 QR code scanning for ticket verification
- 🔮 Email notifications (via backend)
- 🔮 Calendar integration
- 🔮 Social sharing
- 🔮 Multi-language support
- 🔮 Advanced analytics (charts, exports)

---

## 📱 Responsive Design Breakpoints

```css
/* Mobile-first approach */
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

**Layout Strategy**:
- **Mobile**: Single column, hamburger menu, stacked cards
- **Tablet**: Two columns for dashboard, side drawer
- **Desktop**: Full sidebar, multi-column layouts, modals

---

## 🧪 Testing Strategy (Future)

### Unit Tests
- Utility functions
- Form validation
- Custom hooks

### Integration Tests
- Contract interactions (with test network)
- Multi-step flows (create event → buy ticket)

### E2E Tests
- Full user journeys (Playwright/Cypress)
- Test with real wallet (testnet)

---

## 🚀 Deployment Strategy

### Development
- Local: Vite dev server (`npm run dev`)
- Hot reload, fast refresh

### Staging
- Deploy to Vercel/Netlify (preview branches)
- Connect to Lisk Sepolia testnet
- Test with real wallets

### Production
- Deploy to Vercel (main branch auto-deploy)
- Connect to Lisk Mainnet (when ready)
- CDN for assets
- Environment variables for contract addresses

---

## 📋 Environment Variables

```bash
# .env.local
VITE_CHAIN_ID=4202
VITE_RPC_URL=https://rpc.sepolia-api.lisk.com
VITE_FACTORY_ADDRESS=0xf7bcfef07193a056db8fb2189cccb53b09112c2f
VITE_IMPLEMENTATION_ADDRESS=0xa2f377C60D86a6700c364771D03F8B15c02138aa
VITE_TICKET_ADDRESS=0x594d9530a7d21bb239d769ae2f630727155a984d
VITE_PAYROLL_ADDRESS=0x4cce2c335dc4e9d9be746f2dff9aee619d618c60
VITE_SPONSOR_ADDRESS=0x152070f6aca4efae25f973447c29ca37acb7ea28
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
VITE_PINATA_API_KEY=your_pinata_key
VITE_PINATA_SECRET=your_pinata_secret
```

---

## 🎨 Component Design Patterns

### Button Component
```typescript
// Variants: primary, secondary, ghost, danger
// Sizes: sm, md, lg
// States: default, loading, disabled
<Button 
  variant="primary" 
  size="lg" 
  loading={isPending}
  onClick={handleSubmit}
>
  Create Event
</Button>
```

### Card Component
```typescript
// Elevated, bordered, or ghost styles
<Card className="hover:scale-102 transition-transform">
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

### Modal Component
```typescript
// Overlay with blur backdrop
// Escape to close
// Click outside to close
<Modal isOpen={isOpen} onClose={onClose}>
  <Modal.Title>Add Worker</Modal.Title>
  <Modal.Content>
    {/* Form here */}
  </Modal.Content>
  <Modal.Actions>
    <Button onClick={onClose}>Cancel</Button>
    <Button onClick={onSubmit}>Confirm</Button>
  </Modal.Actions>
</Modal>
```

---

## 🎭 Animation Guidelines

### Page Transitions
- Fade in on mount (0.3s ease-out)
- Slide up for modals (0.2s ease-out)

### Micro-interactions
- Button hover: scale(1.05) + brightness
- Card hover: shadow-xl + translate-y
- Input focus: border color shift

### Loading States
- Skeleton pulse animation
- Spinner rotation
- Progress bar linear animation

### Success/Error States
- Success: Green checkmark scale + fade in
- Error: Red X shake animation
- Toast: Slide in from top-right

---

## 🔗 Routing Structure

```typescript
const routes = [
  { path: '/', element: <Landing /> },
  { path: '/events', element: <EventsList /> },
  { path: '/events/:eventId', element: <EventDetails /> },
  { path: '/tickets', element: <MyTickets /> },
  { path: '/create-organization', element: <CreateOrganization /> },
  { 
    path: '/dashboard', 
    element: <DashboardLayout />,
    children: [
      { path: '', element: <DashboardOverview /> },
      { path: 'events', element: <EventsManager /> },
      { path: 'events/create', element: <CreateEvent /> },
      { path: 'events/:eventId', element: <EventAnalytics /> },
      { path: 'workers', element: <WorkerManagement /> },
      { path: 'sponsorships', element: <Sponsorships /> },
      { path: 'settings', element: <Settings /> },
    ]
  },
  { path: '*', element: <NotFound /> },
];
```

---

## 📊 Performance Optimization

### Code Splitting
- Lazy load routes
- Lazy load heavy components (charts, modals)

### Asset Optimization
- Optimize images (WebP, lazy loading)
- SVG icons (inline for critical, lazy for others)

### Bundle Size
- Tree-shaking (Vite default)
- Analyze bundle (rollup-plugin-visualizer)
- External CDN for large libraries (optional)

### Caching Strategy
- React Query: 5min stale time for contract data
- LocalStorage: Wallet connection, org address
- Service Worker: Cache static assets (PWA)

---

## ✅ Pre-Launch Checklist

- [ ] All routes implemented
- [ ] All contract interactions working
- [ ] Forms validated & error-handled
- [ ] Responsive on all breakpoints
- [ ] Wallet connection stable
- [ ] Transaction flows tested (testnet)
- [ ] Loading states polished
- [ ] Error messages user-friendly
- [ ] Accessibility (keyboard nav, ARIA labels)
- [ ] Performance (Lighthouse score >90)
- [ ] SEO (meta tags, OG images)
- [ ] Analytics integrated (optional)
- [ ] Legal pages (Privacy, Terms)

---

## 🎉 Success Metrics

### Technical
- Page load time < 2s
- Time to interactive < 3s
- Zero critical errors in console

### User Experience
- Wallet connection success rate > 95%
- Transaction completion rate > 90%
- Average session duration > 5min

### Business
- Organizations created (track)
- Events created (track)
- Tickets sold (track on-chain)
- Sponsorships received (track on-chain)

---

This roadmap provides a complete blueprint for building a production-ready event management platform. The focus is on clean architecture, excellent UX, and seamless Web3 integration. 

**Next Steps**: Scaffold the project with Vite, install dependencies, and start implementing components in order of priority.
