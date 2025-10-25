/**
 * Organization Setup Component
 * Modern, glassmorphic design matching the Evenntz theme
 * Creates organization proxy contract on Lisk Network
 */

'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useOrganization } from '@/hooks/useContracts';

interface OrganizationSetupProps {
  onComplete: () => void;
}

export default function OrganizationSetup({ onComplete }: OrganizationSetupProps) {
  const { address } = useAccount();
  const { createOrganization, loading, error } = useOrganization(address);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    email: '',
  });
  
  const [step, setStep] = useState<'info' | 'confirm' | 'processing' | 'success'>('info');
  const [txHash, setTxHash] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('confirm');
  };

  const handleConfirm = async () => {
    if (!formData.name.trim()) return;

    setStep('processing');
    
    try {
      const hash = await createOrganization(formData.name);
      setTxHash(hash);
      setStep('success');
      
      setTimeout(() => {
        onComplete();
      }, 3000);
    } catch (err) {
      console.error('Organization creation failed:', err);
      setStep('info');
    }
  };

  // Success State
  if (step === 'success') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8 sm:p-12 text-center fade-in">
          <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Organization Created! 🎉
          </h2>
          
          <p className="text-foreground/70 mb-6">
            Your organization proxy has been successfully created on Lisk Network.
          </p>
          
          <div className="glass p-4 rounded-lg mb-6">
            <p className="text-sm text-foreground/60 mb-2">Transaction Hash</p>
            <p className="text-xs font-mono text-foreground break-all">
              {txHash}
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-foreground/60">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span>Redirecting to dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  // Processing State
  if (step === 'processing') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8 sm:p-12 text-center">
          <div className="w-20 h-20 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto mb-6"></div>
          
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Creating Your Organization
          </h2>
          
          <p className="text-foreground/70 mb-6">
            Please confirm the transaction in your wallet...
          </p>
          
          <div className="space-y-3 text-sm text-foreground/60">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-foreground rounded-full animate-pulse"></div>
              <span>Deploying proxy contract on Lisk</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-foreground/50 rounded-full"></div>
              <span>Initializing organization data</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-foreground/50 rounded-full"></div>
              <span>Setting up permissions</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Confirmation State
  if (step === 'confirm') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8 sm:p-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Confirm Organization Details
          </h2>
          
          <div className="space-y-4 mb-8">
            <div className="glass p-4 rounded-lg">
              <p className="text-sm text-foreground/60 mb-1">Organization Name</p>
              <p className="text-lg font-semibold text-foreground">{formData.name}</p>
            </div>
            
            {formData.description && (
              <div className="glass p-4 rounded-lg">
                <p className="text-sm text-foreground/60 mb-1">Description</p>
                <p className="text-foreground">{formData.description}</p>
              </div>
            )}
            
            {formData.website && (
              <div className="glass p-4 rounded-lg">
                <p className="text-sm text-foreground/60 mb-1">Website</p>
                <p className="text-foreground">{formData.website}</p>
              </div>
            )}
            
            {formData.email && (
              <div className="glass p-4 rounded-lg">
                <p className="text-sm text-foreground/60 mb-1">Contact Email</p>
                <p className="text-foreground">{formData.email}</p>
              </div>
            )}
          </div>
          
          <div className="glass-enhanced p-4 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-foreground/60 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-foreground/70">
                <p className="font-medium mb-1">What happens next?</p>
                <ul className="space-y-1 text-foreground/60">
                  <li>• A proxy contract will be deployed to Lisk Network</li>
                  <li>• You'll be set as the organization owner</li>
                  <li>• You can create and manage events</li>
                  <li>• This requires a blockchain transaction</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setStep('info')}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              ← Back to Edit
            </button>
            <button
              onClick={handleConfirm}
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Create Organization →'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Info Collection State
  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card p-8 sm:p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 glass rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Create Your Organization
          </h1>
          
          <p className="text-foreground/70 max-w-md mx-auto">
            Set up your organization to start creating and managing events on the blockchain.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organization Name */}
          <div>
            <label htmlFor="org-name" className="block text-sm font-medium text-foreground mb-2">
              Organization Name <span className="text-destructive">*</span>
            </label>
            <input
              id="org-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="Enter your organization name"
              required
              maxLength={50}
            />
            <p className="text-xs text-foreground/50 mt-1">
              This will be displayed on all your events
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="org-description" className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              id="org-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input min-h-[100px] resize-none"
              placeholder="Tell us about your organization..."
              maxLength={500}
            />
            <p className="text-xs text-foreground/50 mt-1">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Website */}
          <div>
            <label htmlFor="org-website" className="block text-sm font-medium text-foreground mb-2">
              Website (Optional)
            </label>
            <input
              id="org-website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="input"
              placeholder="https://yourwebsite.com"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="org-email" className="block text-sm font-medium text-foreground mb-2">
              Contact Email (Optional)
            </label>
            <input
              id="org-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input"
              placeholder="contact@yourorg.com"
            />
          </div>

          {/* Info Box */}
          <div className="glass-enhanced p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-foreground/60 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div className="text-sm text-foreground/70">
                <p className="font-medium mb-1">Blockchain Security</p>
                <p className="text-foreground/60">
                  Your organization will be created as a proxy contract on Lisk Network. 
                  Only you will have permission to manage it.
                </p>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-destructive">{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading || !formData.name.trim()}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin"></div>
                Creating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Continue
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
