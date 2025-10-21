'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useOrganization } from '@/hooks/useContracts';
import OrganizationSetup from '@/components/contract/OrganizationSetup';
import DashboardOverview from '@/components/contract/DashboardOverview';

export default function ContractDashboard() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const { organizationProxy, organizationName, loading } = useOrganization(address);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    if (!isConnected && !loading) {
      router.push('/?connect=true');
    }
  }, [isConnected, loading, router]);

  useEffect(() => {
    if (!loading && isConnected && !organizationProxy) {
      setShowSetup(true);
    } else {
      setShowSetup(false);
    }
  }, [loading, isConnected, organizationProxy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto"></div>
          <p className="text-foreground/60">Loading your organization...</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center mobile-px py-12">
        <div className="glass-card p-8 sm:p-12 text-center max-w-lg w-full">
          <div className="w-20 h-20 glass rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Connect Your Wallet</h2>
          <p className="text-foreground/70 mb-6">
            Connect your wallet to access the event management dashboard and start creating events.
          </p>
          <Link href="/" className="btn-primary inline-flex">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (showSetup) {
    return (
      <div className="min-h-screen py-12 mobile-px">
        <OrganizationSetup 
          onComplete={() => {
            setShowSetup(false);
            window.location.reload();
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DashboardOverview 
        proxyAddress={organizationProxy!}
        organizationName={organizationName || 'My Organization'}
      />
    </div>
  );
}
