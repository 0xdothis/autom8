import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

import { wagmiConfig } from '@/lib/wagmi';
import { rainbowKitTheme } from '@/lib/rainbowkit';
import { ToastProvider } from '@/components/ui';
import { DashboardLayout, RootLayout } from '@/components/layout';

// Pages
import Landing from '@/pages/Landing';
import EventsList from '@/pages/EventsList';
import EventDetails from '@/pages/EventDetails';
import MyTickets from '@/pages/MyTickets';
import CreateOrganization from '@/pages/CreateOrganization';
import Dashboard from '@/pages/Dashboard';
import CreateEvent from '@/pages/CreateEvent';
import WorkerManagement from '@/pages/WorkerManagement';
import Sponsorships from '@/pages/Sponsorships';
import NotFound from '@/pages/NotFound';
import ComponentShowcase from '@/pages/ComponentShowcase';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rainbowKitTheme}>
          <ToastProvider>
            <Router>
              <Routes>
                {/* Root Layout for non-dashboard pages */}
                <Route element={<RootLayout />}>
                  <Route path="/" element={<Landing />} />
                  <Route path="/events" element={<EventsList />} />
                  <Route path="/events/:proxyAddress/:eventId" element={<EventDetails />} />
                  <Route path="/tickets" element={<MyTickets />} />
                  <Route path="/create-organization" element={<CreateOrganization />} />
                  <Route path="/showcase" element={<ComponentShowcase />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                {/* Dashboard Routes with Sidebar Layout */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="events/create" element={<CreateEvent />} />
                  <Route path="workers" element={<WorkerManagement />} />
                  <Route path="sponsorships" element={<Sponsorships />} />
                </Route>
              </Routes>
            </Router>
          </ToastProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
