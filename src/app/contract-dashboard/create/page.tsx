/**
 * Event Creation Page
 * Wrapper for event creation wizard
 */

'use client';

import { useAccount } from 'wagmi';
import { useOrganization } from '@/hooks/useContracts';
import { useRouter } from 'next/navigation';
import EventCreationWizard from '@/components/contract/EventCreationWizard';
import Link from 'next/link';

export default function CreateEventPage() {
  const { address, isConnected } = useAccount();
  const { organizationProxy, organizationName, loading } = useOrganization(address);
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto"></div>
          <p className="text-foreground/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isConnected || !organizationProxy) {
    return (
      <div className="min-h-screen flex items-center justify-center mobile-px py-12">
        <div className="glass-card p-8 sm:p-12 text-center max-w-lg w-full">
          <div className="w-20 h-20 glass rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Access Required</h2>
          <p className="text-foreground/70 mb-6">
            You need to set up your organization first before creating events.
          </p>
          <Link href="/contract-dashboard" className="btn-primary inline-flex">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 mobile-px">
      <EventCreationWizard
        proxyAddress={organizationProxy}
        onComplete={() => router.push('/contract-dashboard')}
        onCancel={() => router.push('/contract-dashboard')}
      />
    </div>
  );
}
