/**
 * Organization Registration Component
 * This is the entry point for new organizations to create their proxy contract
 */

'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useOrganization } from '@/hooks/useContracts';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function OrganizationRegistration() {
  const { address, isConnected } = useAccount();
  const { createOrganization, loading, error } = useOrganization();
  const [orgName, setOrgName] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!orgName.trim()) {
      setFormError('Organization name is required');
      return;
    }

    if (orgName.length < 3) {
      setFormError('Organization name must be at least 3 characters');
      return;
    }

    try {
      await createOrganization(orgName.trim());
      // Success - user will be redirected or see success state
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create organization');
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-md mx-auto mt-12 p-8 card">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Connect Your Wallet</h2>
          <p className="text-foreground/70 mb-6">
            Connect your wallet to create an organization and start managing events.
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-8 card">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Create Organization</h2>
        <p className="text-foreground/70">
          Register your organization to start creating and managing events on the blockchain.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="orgName" className="block text-sm font-medium text-foreground mb-2">
            Organization Name
          </label>
          <input
            id="orgName"
            type="text"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="Enter your organization name"
            required
            disabled={loading}
          />
        </div>

        {(formError || error) && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-sm">{formError || error}</p>
          </div>
        )}

        <div className="bg-muted/30 p-4 rounded-lg">
          <h3 className="font-medium text-foreground mb-2">What happens next?</h3>
          <ul className="text-sm text-foreground/70 space-y-1">
            <li>• A smart contract proxy will be created for your organization</li>
            <li>• You'll be able to create and manage events</li>
            <li>• Set up worker payrolls and accept sponsorships</li>
            <li>• Track analytics and process payments automatically</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading || !orgName.trim()}
          className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mr-2 inline-block"></div>
              Creating Organization...
            </>
          ) : (
            'Create Organization'
          )}
        </button>

        <div className="text-center">
          <p className="text-xs text-foreground/60">
            Connected as: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>
      </form>
    </div>
  );
}