/**
 * Sponsorship Dashboard Component
 * Modern UI for managing sponsorship tiers and tracking sponsors
 * Glassmorphic design with progress bars and tier cards
 */

'use client';

import { useState, useEffect } from 'react';
import { useSponsorship } from '@/hooks/useContracts';
import { formatEther } from 'viem';
import { isAddress } from 'viem';

interface SponsorshipDashboardProps {
  proxyAddress: string;
  eventId: string;
}

interface TierFormData {
  name: string;
  amount: string;
  maxSponsors: string;
  benefits: string;
}

export default function SponsorshipDashboard({ proxyAddress, eventId }: SponsorshipDashboardProps) {
  const { tiers, sponsors, totalRaised, loadTiers, loadSponsors, createTier, addSponsor, loading } = useSponsorship(proxyAddress, eventId);
  const [showTierModal, setShowTierModal] = useState(false);
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<any>(null);
  const [tierForm, setTierForm] = useState<TierFormData>({
    name: '',
    amount: '0',
    maxSponsors: '10',
    benefits: '',
  });
  const [sponsorAddress, setSponsorAddress] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadTiers();
    loadSponsors();
  }, [loadTiers, loadSponsors]);

  const validateTierForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!tierForm.name.trim()) {
      newErrors.name = 'Tier name is required';
    }

    if (!tierForm.amount || Number.parseFloat(tierForm.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }

    if (!tierForm.maxSponsors || Number.parseInt(tierForm.maxSponsors) <= 0) {
      newErrors.maxSponsors = 'Valid max sponsors is required';
    }

    if (!tierForm.benefits.trim()) {
      newErrors.benefits = 'Benefits description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSponsorForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!sponsorAddress) {
      newErrors.address = 'Sponsor address is required';
    } else if (!isAddress(sponsorAddress)) {
      newErrors.address = 'Invalid wallet address';
    }

    if (!selectedTier) {
      newErrors.tier = 'Please select a tier';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateTier = async () => {
    if (!validateTierForm()) return;

    setProcessing(true);
    try {
      await createTier(
        eventId,
        tierForm.name,
        tierForm.amount,
        Number.parseInt(tierForm.maxSponsors),
        tierForm.benefits
      );
      
      setShowTierModal(false);
      setTierForm({ name: '', amount: '0', maxSponsors: '10', benefits: '' });
      await loadTiers();
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to create tier' });
    } finally {
      setProcessing(false);
    }
  };

  const handleAddSponsor = async () => {
    if (!validateSponsorForm()) return;

    setProcessing(true);
    try {
      await addSponsor(eventId, selectedTier.id, sponsorAddress);
      
      setShowSponsorModal(false);
      setSponsorAddress('');
      setSelectedTier(null);
      await loadSponsors();
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to add sponsor' });
    } finally {
      setProcessing(false);
    }
  };

  const getTierColor = (index: number) => {
    const colors = ['#FFD700', '#C0C0C0', '#CD7F32', '#4169E1'];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Sponsorship Management</h2>
          <p className="text-foreground/60 mt-1">Create tiers and track sponsors</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowSponsorModal(true)} className="btn-secondary">
            Add Sponsor
          </button>
          <button onClick={() => setShowTierModal(true)} className="btn-primary">
            Create Tier
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 glass rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{tiers.length}</p>
              <p className="text-sm text-foreground/60">Sponsorship Tiers</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 glass rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{sponsors.length}</p>
              <p className="text-sm text-foreground/60">Total Sponsors</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 glass rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalRaised.toFixed(3)}</p>
              <p className="text-sm text-foreground/60">ETH Raised</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sponsorship Tiers */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-foreground mb-6">Sponsorship Tiers</h3>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-foreground/60">Loading tiers...</p>
          </div>
        ) : tiers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 glass rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Tiers Yet</h3>
            <p className="text-foreground/60 mb-4">Create sponsorship tiers to start raising funds</p>
            <button onClick={() => setShowTierModal(true)} className="btn-primary inline-flex">
              Create First Tier
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiers.map((tier, index) => {
              const progress = tier.maxSponsors > 0 ? (tier.currentSponsors / tier.maxSponsors) * 100 : 0;
              const tierColor = getTierColor(index);
              
              return (
                <div 
                  key={tier.id} 
                  className="glass p-6 rounded-lg border-2 hover:scale-105 transition-transform slide-in"
                  style={{ 
                    borderColor: `${tierColor}40`,
                    animationDelay: `${index * 0.1}s` 
                  }}
                >
                  {/* Tier Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${tierColor}20` }}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: tierColor }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{tier.name}</h4>
                        <p className="text-sm text-foreground/60">{tier.formattedAmount} USDT</p>
                      </div>
                    </div>
                  </div>

                  {/* Benefits */}
                  <p className="text-sm text-foreground/80 mb-4">{tier.benefits}</p>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-foreground/60">Sponsors</span>
                      <span className="font-semibold text-foreground">
                        {tier.currentSponsors} / {tier.maxSponsors}
                      </span>
                    </div>
                    <div className="w-full bg-foreground/10 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${progress}%`,
                          backgroundColor: tierColor
                        }}
                      />
                    </div>
                  </div>

                  {/* Add Sponsor Button */}
                  <button
                    onClick={() => {
                      setSelectedTier(tier);
                      setShowSponsorModal(true);
                    }}
                    className="w-full btn-secondary text-sm"
                    disabled={tier.currentSponsors >= tier.maxSponsors}
                  >
                    {tier.currentSponsors >= tier.maxSponsors ? 'Tier Full' : 'Add Sponsor'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sponsor List */}
      {sponsors.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-foreground mb-6">Recent Sponsors</h3>
          <div className="space-y-3">
            {sponsors.slice(0, 10).map((sponsor, index) => (
              <div 
                key={`${sponsor.address}-${index}`}
                className="glass p-4 rounded-lg flex items-center justify-between slide-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 glass rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {sponsor.address.slice(0, 6)}...{sponsor.address.slice(-4)}
                    </p>
                    <p className="text-xs text-foreground/60">{sponsor.tierName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{sponsor.formattedAmount} USDT</p>
                  <p className="text-xs text-foreground/60">
                    {new Date(sponsor.timestamp * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Tier Modal */}
      {showTierModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 sm:p-8 max-w-md w-full slide-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Create Sponsorship Tier</h3>
              <button
                onClick={() => {
                  setShowTierModal(false);
                  setErrors({});
                }}
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tier Name *</label>
                <input
                  type="text"
                  value={tierForm.name}
                  onChange={(e) => {
                    setTierForm(prev => ({ ...prev, name: e.target.value }));
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  placeholder="e.g., Gold Sponsor"
                  className={`input w-full ${errors.name ? 'border-error' : ''}`}
                />
                {errors.name && <p className="text-error text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Amount (ETH) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={tierForm.amount}
                  onChange={(e) => {
                    setTierForm(prev => ({ ...prev, amount: e.target.value }));
                    if (errors.amount) setErrors(prev => ({ ...prev, amount: '' }));
                  }}
                  placeholder="1.0"
                  className={`input w-full ${errors.amount ? 'border-error' : ''}`}
                />
                {errors.amount && <p className="text-error text-sm mt-1">{errors.amount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Max Sponsors *</label>
                <input
                  type="number"
                  min="1"
                  value={tierForm.maxSponsors}
                  onChange={(e) => {
                    setTierForm(prev => ({ ...prev, maxSponsors: e.target.value }));
                    if (errors.maxSponsors) setErrors(prev => ({ ...prev, maxSponsors: '' }));
                  }}
                  placeholder="10"
                  className={`input w-full ${errors.maxSponsors ? 'border-error' : ''}`}
                />
                {errors.maxSponsors && <p className="text-error text-sm mt-1">{errors.maxSponsors}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Benefits *</label>
                <textarea
                  value={tierForm.benefits}
                  onChange={(e) => {
                    setTierForm(prev => ({ ...prev, benefits: e.target.value }));
                    if (errors.benefits) setErrors(prev => ({ ...prev, benefits: '' }));
                  }}
                  placeholder="Logo on website, social media mentions, VIP access..."
                  rows={3}
                  className={`input w-full ${errors.benefits ? 'border-error' : ''}`}
                />
                {errors.benefits && <p className="text-error text-sm mt-1">{errors.benefits}</p>}
              </div>

              {errors.submit && (
                <div className="glass p-3 border-l-4 border-error bg-error/5">
                  <p className="text-error text-sm">{errors.submit}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowTierModal(false);
                  setErrors({});
                }}
                className="btn-secondary flex-1"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTier}
                className="btn-primary flex-1"
                disabled={processing}
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-background/20 border-t-background rounded-full animate-spin" />
                    Creating...
                  </span>
                ) : (
                  'Create Tier'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Sponsor Modal */}
      {showSponsorModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 sm:p-8 max-w-md w-full slide-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Add Sponsor</h3>
              <button
                onClick={() => {
                  setShowSponsorModal(false);
                  setErrors({});
                  setSelectedTier(null);
                }}
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {selectedTier && (
                <div className="glass p-4 rounded-lg">
                  <p className="text-sm text-foreground/60 mb-1">Selected Tier</p>
                  <p className="font-semibold text-foreground">{selectedTier.name}</p>
                  <p className="text-sm text-foreground/80 mt-1">{selectedTier.formattedAmount} USDT</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Sponsor Wallet Address *</label>
                <input
                  type="text"
                  value={sponsorAddress}
                  onChange={(e) => {
                    setSponsorAddress(e.target.value);
                    if (errors.address) setErrors(prev => ({ ...prev, address: '' }));
                  }}
                  placeholder="0x..."
                  className={`input w-full ${errors.address ? 'border-error' : ''}`}
                />
                {errors.address && <p className="text-error text-sm mt-1">{errors.address}</p>}
              </div>

              {errors.submit && (
                <div className="glass p-3 border-l-4 border-error bg-error/5">
                  <p className="text-error text-sm">{errors.submit}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowSponsorModal(false);
                  setErrors({});
                  setSelectedTier(null);
                }}
                className="btn-secondary flex-1"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleAddSponsor}
                className="btn-primary flex-1"
                disabled={processing}
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-background/20 border-t-background rounded-full animate-spin" />
                    Adding...
                  </span>
                ) : (
                  'Add Sponsor'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
