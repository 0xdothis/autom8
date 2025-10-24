/**
 * Sponsorship Management Component
 * Enables the full sponsorship functionality as per the smart contract
 */

'use client';

import { useState, useEffect } from 'react';
import { useSponsorship } from '@/hooks/useContracts';
import { LibStorage } from '@/types/contracts';

interface SponsorshipManagementProps {
  proxyAddress: string;
  eventId: string;
  eventName: string;
  eventInfo: LibStorage.EventStruct;
  isOwner: boolean;
}

export default function SponsorshipManagement({ 
  proxyAddress, 
  eventId, 
  eventName, 
  eventInfo, 
  isOwner 
}: Readonly<SponsorshipManagementProps>) {
  const { sponsors, totalSponsorship, loading, sponsorEvent, loadSponsorship } = useSponsorship(proxyAddress, eventId);
  
  const [sponsorAmount, setSponsorAmount] = useState('');
  const [showSponsorForm, setShowSponsorForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSponsorship();
  }, [loadSponsorship]);

  const handleSponsor = async () => {
    setError('');
    
    if (!sponsorAmount || Number.parseFloat(sponsorAmount) <= 0) {
      setError('Please enter a valid sponsorship amount');
      return;
    }

    // Check if event still needs sponsorship
    const currentSponsorship = Number.parseFloat(totalSponsorship);
    const needed = Number.parseFloat(eventInfo.amountNeededForExpenses.toString()) / 1e18; // Convert from wei
    
    if (currentSponsorship >= needed) {
      setError('This event has already received sufficient sponsorship');
      return;
    }

    try {
      await sponsorEvent(sponsorAmount);
      setSponsorAmount('');
      setShowSponsorForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sponsor event');
    }
  };

  const formatAmount = (amount: bigint): string => {
    return (Number(amount) / 1e18).toFixed(4);
  };

  const formatPercentage = (percentage: bigint): string => {
    return (Number(percentage) / 100).toFixed(2);
  };

  const amountNeeded = Number.parseFloat(formatAmount(eventInfo.amountNeededForExpenses));
  const currentSponsorship = Number.parseFloat(totalSponsorship);
  const remaining = Math.max(0, amountNeeded - currentSponsorship);
  const progressPercentage = amountNeeded > 0 ? (currentSponsorship / amountNeeded) * 100 : 0;
  const isFunded = currentSponsorship >= amountNeeded;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Event Sponsorship</h2>
          <p className="text-foreground/70">Event: {eventName}</p>
        </div>
        {!isOwner && !isFunded && (
          <button
            onClick={() => setShowSponsorForm(true)}
            className="btn-primary px-4 py-2"
          >
            Sponsor Event
          </button>
        )}
      </div>

      {/* Sponsorship Progress */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Funding Progress</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{totalSponsorship} ETH</p>
            <p className="text-sm text-foreground/70">Total Raised</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{amountNeeded.toFixed(4)} ETH</p>
            <p className="text-sm text-foreground/70">Target Amount</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-warning">{remaining.toFixed(4)} ETH</p>
            <p className="text-sm text-foreground/70">Remaining</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-success">{sponsors.length}</p>
            <p className="text-sm text-foreground/70">Sponsors</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-foreground/10 rounded-full h-4 mb-4">
          <div
            className={`h-4 rounded-full transition-all duration-500 ${
              isFunded ? 'bg-success' : 'bg-primary'
            }`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-sm text-foreground/70">
          <span>0 ETH</span>
          <span className={isFunded ? 'text-success font-medium' : ''}>
            {progressPercentage.toFixed(1)}% funded
          </span>
          <span>{amountNeeded.toFixed(4)} ETH</span>
        </div>

        {isFunded && (
          <div className="mt-4 p-4 bg-success/10 border border-success/20 rounded-lg">
            <p className="text-success text-center font-medium">
              🎉 Funding target reached! This event is fully sponsored.
            </p>
          </div>
        )}
      </div>

      {/* Sponsors List */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Sponsors</h3>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-foreground/70">Loading sponsors...</p>
          </div>
        ) : sponsors.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-foreground/70 mb-4">No sponsors yet</p>
            {!isOwner && (
              <button
                onClick={() => setShowSponsorForm(true)}
                className="btn-primary"
              >
                Be the First Sponsor
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {sponsors.map((sponsor, index) => (
              <div key={sponsor.sponsor} className="border border-foreground/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold">
                      #{Number(sponsor.position) + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {sponsor.sponsor.slice(0, 6)}...{sponsor.sponsor.slice(-4)}
                      </p>
                      <p className="text-sm text-foreground/60">
                        Sponsor #{Number(sponsor.position) + 1}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      {sponsor.formattedAmount} ETH
                    </p>
                    <p className="text-sm text-foreground/60">
                      {formatPercentage(sponsor.percentageContribution)}% contribution
                    </p>
                  </div>
                </div>

                {/* Expected Returns (if event is revenue-generating) */}
                {eventInfo.eventType === LibStorage.EventType.Paid && (
                  <div className="mt-3 pt-3 border-t border-foreground/10">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/70">Expected revenue share:</span>
                      <span className="text-foreground">
                        {formatPercentage(sponsor.percentageContribution)}% of net profits
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sponsorship Benefits */}
      {!isOwner && (
        <div className="card p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">Sponsorship Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">As a Sponsor, you get:</h4>
              <ul className="text-sm text-foreground/70 space-y-1">
                <li>• Brand visibility at the event</li>
                <li>• Percentage-based revenue sharing (paid events)</li>
                <li>• Supporting community events</li>
                <li>• Transparent blockchain tracking</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">How it works:</h4>
              <ul className="text-sm text-foreground/70 space-y-1">
                <li>• Your contribution is recorded on-chain</li>
                <li>• Percentage calculated automatically</li>
                <li>• Revenue distributed after event ends</li>
                <li>• Funds only released when event completes</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Sponsor Form Modal */}
      {showSponsorForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-foreground mb-4">Sponsor Event</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Sponsorship Amount (ETH)
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  value={sponsorAmount}
                  onChange={(e) => setSponsorAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-foreground/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="0.1"
                />
                <p className="text-xs text-foreground/60 mt-1">
                  Minimum: 0.001 ETH • Remaining needed: {remaining.toFixed(4)} ETH
                </p>
              </div>

              {sponsorAmount && (
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">Your Contribution</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-medium">{sponsorAmount} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Percentage of target:</span>
                      <span className="font-medium">
                        {((Number.parseFloat(sponsorAmount) / amountNeeded) * 100).toFixed(2)}%
                      </span>
                    </div>
                    {eventInfo.eventType === LibStorage.EventType.Paid && (
                      <div className="flex justify-between">
                        <span>Revenue share:</span>
                        <span className="font-medium text-success">
                          {((Number.parseFloat(sponsorAmount) / amountNeeded) * 100).toFixed(2)}% of profits
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded">
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowSponsorForm(false);
                  setSponsorAmount('');
                  setError('');
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSponsor}
                disabled={loading || !sponsorAmount}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {loading ? 'Sponsoring...' : 'Sponsor Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}