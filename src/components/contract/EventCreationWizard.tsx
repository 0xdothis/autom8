/**
 * Event Creation Wizard
 * Multi-step form for creating events through organization proxy
 * Glassmorphic design matching platform aesthetic
 */

'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useEvents } from '@/hooks/useContracts';
import { formatEther, parseEther } from 'viem';

interface EventCreationWizardProps {
  proxyAddress: string;
  onComplete?: () => void;
  onCancel?: () => void;
}

type Step = 1 | 2 | 3 | 4 | 5 | 6;

interface EventFormData {
  // Basic Info
  name: string;
  description: string;
  location: string;
  category: string;
  imageUrl: string;
  
  // Date & Time
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  
  // Pricing
  ticketPrice: string;
  maxTickets: string;
  currency: 'ETH' | 'USDT';
  
  // Workers
  workers: Array<{ address: string; role: string; payment: string }>;
  
  // Sponsorship
  enableSponsorship: boolean;
  sponsorshipTiers: Array<{ name: string; amount: string; benefits: string }>;
}

const initialFormData: EventFormData = {
  name: '',
  description: '',
  location: '',
  category: '',
  imageUrl: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  ticketPrice: '0',
  maxTickets: '100',
  currency: 'ETH',
  workers: [],
  enableSponsorship: false,
  sponsorshipTiers: [],
};

export default function EventCreationWizard({ proxyAddress, onComplete, onCancel }: EventCreationWizardProps) {
  const { address } = useAccount();
  const { createEvent, loading } = useEvents(proxyAddress);
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [txHash, setTxHash] = useState<string>('');

  const updateFormData = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step: Step): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Event name is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.location.trim()) newErrors.location = 'Location is required';
      if (!formData.category) newErrors.category = 'Category is required';
    }

    if (step === 2) {
      if (!formData.startDate) newErrors.startDate = 'Start date is required';
      if (!formData.startTime) newErrors.startTime = 'Start time is required';
      if (!formData.endDate) newErrors.endDate = 'End date is required';
      if (!formData.endTime) newErrors.endTime = 'End time is required';
      
      // Validate end is after start
      if (formData.startDate && formData.endDate) {
        const start = new Date(`${formData.startDate}T${formData.startTime || '00:00'}`);
        const end = new Date(`${formData.endDate}T${formData.endTime || '00:00'}`);
        if (end <= start) {
          newErrors.endDate = 'End must be after start';
        }
      }
    }

    if (step === 3) {
      if (!formData.ticketPrice || Number.parseFloat(formData.ticketPrice) < 0) {
        newErrors.ticketPrice = 'Valid ticket price is required';
      }
      if (!formData.maxTickets || Number.parseInt(formData.maxTickets) <= 0) {
        newErrors.maxTickets = 'Valid max tickets is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6) as Step);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as Step);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      const eventData = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        startTime: Math.floor(startDateTime.getTime() / 1000),
        endTime: Math.floor(endDateTime.getTime() / 1000),
        ticketPrice: parseEther(formData.ticketPrice),
        maxTickets: BigInt(formData.maxTickets),
        imageUrl: formData.imageUrl || '',
        category: formData.category,
      };

      const hash = await createEvent(eventData);
      setTxHash(hash);
      setCurrentStep(6);
      
      // Auto-complete after 3 seconds
      setTimeout(() => {
        onComplete?.();
      }, 3000);
    } catch (error: any) {
      console.error('Failed to create event:', error);
      setErrors({ submit: error.message || 'Failed to create event' });
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all
            ${currentStep >= step ? 'bg-foreground text-background' : 'glass text-foreground/40'}
          `}>
            {step}
          </div>
          {step < 5 && (
            <div className={`
              w-12 sm:w-16 h-1 mx-2 transition-all
              ${currentStep > step ? 'bg-foreground' : 'bg-foreground/10'}
            `} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Event Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => updateFormData('name', e.target.value)}
          placeholder="e.g., Tech Conference 2024"
          className={`input w-full ${errors.name ? 'border-error' : ''}`}
        />
        {errors.name && <p className="text-error text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          placeholder="Tell attendees what your event is about..."
          rows={4}
          className={`input w-full ${errors.description ? 'border-error' : ''}`}
        />
        {errors.description && <p className="text-error text-sm mt-1">{errors.description}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Location *</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => updateFormData('location', e.target.value)}
          placeholder="e.g., San Francisco, CA"
          className={`input w-full ${errors.location ? 'border-error' : ''}`}
        />
        {errors.location && <p className="text-error text-sm mt-1">{errors.location}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Category *</label>
        <select
          value={formData.category}
          onChange={(e) => updateFormData('category', e.target.value)}
          className={`input w-full ${errors.category ? 'border-error' : ''}`}
        >
          <option value="">Select a category</option>
          <option value="Technology">Technology</option>
          <option value="Business">Business</option>
          <option value="Arts">Arts & Culture</option>
          <option value="Music">Music</option>
          <option value="Sports">Sports</option>
          <option value="Education">Education</option>
          <option value="Other">Other</option>
        </select>
        {errors.category && <p className="text-error text-sm mt-1">{errors.category}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Event Image URL (Optional)</label>
        <input
          type="url"
          value={formData.imageUrl}
          onChange={(e) => updateFormData('imageUrl', e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="input w-full"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Start Date *</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => updateFormData('startDate', e.target.value)}
            className={`input w-full ${errors.startDate ? 'border-error' : ''}`}
          />
          {errors.startDate && <p className="text-error text-sm mt-1">{errors.startDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Start Time *</label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => updateFormData('startTime', e.target.value)}
            className={`input w-full ${errors.startTime ? 'border-error' : ''}`}
          />
          {errors.startTime && <p className="text-error text-sm mt-1">{errors.startTime}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">End Date *</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => updateFormData('endDate', e.target.value)}
            className={`input w-full ${errors.endDate ? 'border-error' : ''}`}
          />
          {errors.endDate && <p className="text-error text-sm mt-1">{errors.endDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">End Time *</label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => updateFormData('endTime', e.target.value)}
            className={`input w-full ${errors.endTime ? 'border-error' : ''}`}
          />
          {errors.endTime && <p className="text-error text-sm mt-1">{errors.endTime}</p>}
        </div>
      </div>

      <div className="glass p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-foreground/60 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-foreground/80">
            <p className="font-medium mb-1">Timezone Note</p>
            <p>All times are stored in UTC. Make sure to account for your local timezone when setting event times.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Ticket Price *</label>
        <div className="relative">
          <input
            type="number"
            step="0.001"
            min="0"
            value={formData.ticketPrice}
            onChange={(e) => updateFormData('ticketPrice', e.target.value)}
            placeholder="0.05"
            className={`input w-full pr-16 ${errors.ticketPrice ? 'border-error' : ''}`}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/60">
            ETH
          </div>
        </div>
        {errors.ticketPrice && <p className="text-error text-sm mt-1">{errors.ticketPrice}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Maximum Tickets *</label>
        <input
          type="number"
          min="1"
          value={formData.maxTickets}
          onChange={(e) => updateFormData('maxTickets', e.target.value)}
          placeholder="100"
          className={`input w-full ${errors.maxTickets ? 'border-error' : ''}`}
        />
        {errors.maxTickets && <p className="text-error text-sm mt-1">{errors.maxTickets}</p>}
      </div>

      <div className="glass p-6 rounded-lg">
        <h3 className="font-semibold text-foreground mb-4">Revenue Estimate</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-foreground/80">
            <span>Tickets:</span>
            <span>{formData.maxTickets || 0}</span>
          </div>
          <div className="flex justify-between text-foreground/80">
            <span>Price per ticket:</span>
            <span>{formData.ticketPrice || 0} ETH</span>
          </div>
          <div className="border-t border-foreground/10 pt-2 mt-2 flex justify-between font-bold text-foreground text-lg">
            <span>Potential Revenue:</span>
            <span>
              {(Number.parseFloat(formData.ticketPrice || '0') * Number.parseInt(formData.maxTickets || '0')).toFixed(3)} ETH
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="w-16 h-16 glass rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Worker Management (Optional)</h3>
        <p className="text-foreground/60 mb-6">
          You can add workers and manage payments later from the event dashboard
        </p>
        <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-lg text-sm text-foreground/80">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Skip this step to continue
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="glass p-6 rounded-lg">
        <h3 className="text-xl font-bold text-foreground mb-6">Review Your Event</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-foreground/60 mb-1">Event Name</p>
            <p className="font-semibold text-foreground">{formData.name}</p>
          </div>

          <div>
            <p className="text-sm text-foreground/60 mb-1">Description</p>
            <p className="text-foreground">{formData.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-foreground/60 mb-1">Location</p>
              <p className="text-foreground">{formData.location}</p>
            </div>
            <div>
              <p className="text-sm text-foreground/60 mb-1">Category</p>
              <p className="text-foreground">{formData.category}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-foreground/60 mb-1">Start</p>
              <p className="text-foreground">{formData.startDate} {formData.startTime}</p>
            </div>
            <div>
              <p className="text-sm text-foreground/60 mb-1">End</p>
              <p className="text-foreground">{formData.endDate} {formData.endTime}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-foreground/60 mb-1">Ticket Price</p>
              <p className="text-foreground font-semibold">{formData.ticketPrice} ETH</p>
            </div>
            <div>
              <p className="text-sm text-foreground/60 mb-1">Max Tickets</p>
              <p className="text-foreground font-semibold">{formData.maxTickets}</p>
            </div>
          </div>
        </div>
      </div>

      {errors.submit && (
        <div className="glass-card p-4 border-l-4 border-error bg-error/5">
          <p className="text-error text-sm">{errors.submit}</p>
        </div>
      )}
    </div>
  );

  const renderStep6 = () => (
    <div className="text-center py-8">
      <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Event Created Successfully!</h2>
      <p className="text-foreground/60 mb-6">Your event has been created on the blockchain</p>
      
      {txHash && (
        <div className="glass p-4 rounded-lg mb-6 max-w-md mx-auto">
          <p className="text-sm text-foreground/60 mb-2">Transaction Hash</p>
          <p className="text-xs font-mono text-foreground break-all">{txHash}</p>
        </div>
      )}

      <p className="text-sm text-foreground/60">Redirecting to dashboard...</p>
    </div>
  );

  return (
    <div className="glass-card p-6 sm:p-12 max-w-4xl mx-auto">
      {currentStep < 6 && (
        <>
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Create New Event</h1>
            <p className="text-foreground/60">Step {currentStep} of 5</p>
          </div>

          {renderStepIndicator()}
        </>
      )}

      <div className="mb-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
        {currentStep === 6 && renderStep6()}
      </div>

      {currentStep < 6 && (
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={currentStep === 1 ? onCancel : handleBack}
            className="btn-secondary px-6 py-3"
            disabled={loading}
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>

          {currentStep < 5 ? (
            <button onClick={handleNext} className="btn-primary px-6 py-3" disabled={loading}>
              Next
            </button>
          ) : (
            <button onClick={handleSubmit} className="btn-primary px-6 py-3" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-background/20 border-t-background rounded-full animate-spin" />
                  Creating...
                </span>
              ) : (
                'Create Event'
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
