/**
 * Payments Page
 * Route: /contract-dashboard/payments
 */

'use client';

import { useAccount } from 'wagmi';
import { useOrganization } from '@/hooks/useContracts';
import PaymentProcessing from '@/components/contract/PaymentProcessing';
import Link from 'next/link';

export default function PaymentsPage() {
  const { address, isConnected } = useAccount();
  const { organizationProxy, loading } = useOrganization(address);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isConnected || !organizationProxy) {
    return (
      <div className="min-h-screen flex items-center justify-center mobile-px">
        <div className="glass-card p-8 text-center max-w-lg">
          <h2 className="text-2xl font-bold text-foreground mb-4">Access Required</h2>
          <p className="text-foreground/60 mb-6">Please set up your organization first</p>
          <Link href="/contract-dashboard" className="btn-primary inline-flex">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 mobile-px">
      <PaymentProcessing proxyAddress={organizationProxy} />
    </div>
  );
}
