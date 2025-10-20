/**
 * Contract Management Container
 * Main container for all contract-synchronized functionality
 */

'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useOrganization } from '@/hooks/useContracts';

// Contract Components
import OrganizationRegistration from './OrganizationRegistration';
import EventDashboard from './EventDashboard';
import ContractEventCreation from './ContractEventCreation';
import WorkerManagement from './WorkerManagement';
import SponsorshipManagement from './SponsorshipManagement';
import PaymentProcessing from './PaymentProcessing';
import Analytics from './Analytics';

type ActiveView = 
  | 'dashboard' 
  | 'events' 
  | 'create-event' 
  | 'workers' 
  | 'sponsorship' 
  | 'payments' 
  | 'analytics';

export default function ContractManagement() {
  const { address } = useAccount();
  const { organizationProxy, organizationName, loading, loadOrganization } = useOrganization(address);
  
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    if (address) {
      loadOrganization();
    }
  }, [address, loadOrganization]);

  // Show registration if no organization proxy exists
  useEffect(() => {
    if (!loading && address && !organizationProxy) {
      setShowRegistration(true);
    } else {
      setShowRegistration(false);
    }
  }, [loading, address, organizationProxy]);

  if (!address) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Connect Your Wallet</h2>
          <p className="text-foreground/70 mb-6">
            Please connect your wallet to access the contract management features.
          </p>
          <button className="btn-primary px-6 py-3">
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading organization data...</p>
        </div>
      </div>
    );
  }

  if (showRegistration) {
    return (
      <div className="container mx-auto px-4 py-8">
        <OrganizationRegistration 
          onRegistrationComplete={() => {
            setShowRegistration(false);
            loadOrganization();
          }}
        />
      </div>
    );
  }

  const navigationItems = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'events', label: 'Events', icon: '🎭' },
    { key: 'create-event', label: 'Create Event', icon: '➕' },
    { key: 'workers', label: 'Workers', icon: '👥' },
    { key: 'sponsorship', label: 'Sponsorship', icon: '💰' },
    { key: 'payments', label: 'Payments', icon: '💳' },
    { key: 'analytics', label: 'Analytics', icon: '📈' },
  ];

  const renderActiveView = () => {
    if (!organizationProxy) return null;

    const commonProps = {
      proxyAddress: organizationProxy,
      organizationName: organizationName || 'Unknown Organization'
    };

    switch (activeView) {
      case 'dashboard':
        return <EventDashboard {...commonProps} />;
      case 'events':
        return <EventDashboard {...commonProps} />;
      case 'create-event':
        return <ContractEventCreation {...commonProps} />;
      case 'workers':
        return <WorkerManagement {...commonProps} />;
      case 'sponsorship':
        return <SponsorshipManagement {...commonProps} />;
      case 'payments':
        return <PaymentProcessing {...commonProps} />;
      case 'analytics':
        return <Analytics {...commonProps} />;
      default:
        return <EventDashboard {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-foreground/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-foreground">Evenntz Contract Manager</h1>
              {organizationName && (
                <div className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                  {organizationName}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-foreground/70">
                Proxy: {organizationProxy?.slice(0, 6)}...{organizationProxy?.slice(-4)}
              </div>
              <div className="text-sm text-foreground/70">
                Owner: {address?.slice(0, 6)}...{address?.slice(-4)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="card p-4">
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveView(item.key as ActiveView)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeView === item.key
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground/70 hover:bg-muted/50 hover:text-foreground'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Quick Stats */}
            <div className="card p-4 mt-4">
              <h3 className="font-semibold text-foreground mb-3">Quick Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground/60">Network:</span>
                  <span className="font-medium text-foreground">Ethereum</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Status:</span>
                  <span className="text-success font-medium">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Version:</span>
                  <span className="font-medium text-foreground">v1.0</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="card p-4 mt-4">
              <h3 className="font-semibold text-foreground mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setActiveView('create-event')}
                  className="w-full btn-primary text-sm py-2"
                >
                  New Event
                </button>
                <button 
                  onClick={() => setActiveView('workers')}
                  className="w-full btn-secondary text-sm py-2"
                >
                  Manage Workers
                </button>
                <button 
                  onClick={() => setActiveView('payments')}
                  className="w-full btn-secondary text-sm py-2"
                >
                  Process Payments
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderActiveView()}
          </div>
        </div>
      </div>
    </div>
  );
}