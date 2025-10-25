/**
 * Contract-Accurate Event Creation Component
 * This component creates events that match exactly with the smart contract structure
 */

'use client';

import { useState } from 'react';
import { useOrganization, useEvents } from '@/hooks/useContracts';
import { LibStorage, CreateEventParams, ValidationRules } from '@/types/contracts';
import { uploadImageToIPFS } from '@/lib/ipfs';

interface EventFormData {
  name: string;
  description: string;
  ticketPrice: string;
  maxTickets: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  eventType: LibStorage.EventType;
  amountNeededForExpenses: string;
  bannerImage: File | null;
  location: string;
  venue: string;
}

export default function ContractEventCreation() {
  const { organization } = useOrganization();
  const { createEvent, loading } = useEvents(organization?.proxyAddress);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    description: '',
    ticketPrice: '0',
    maxTickets: '100',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    eventType: LibStorage.EventType.Free,
    amountNeededForExpenses: '0',
    bannerImage: null,
    location: '',
    venue: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, bannerImage: file }));
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      // Basic Info Validation
      if (!formData.name.trim()) {
        newErrors.name = 'Event name is required';
      } else if (formData.name.length < ValidationRules.eventName.minLength) {
        newErrors.name = `Minimum ${ValidationRules.eventName.minLength} characters required`;
      }

      if (!formData.description.trim()) {
        newErrors.description = 'Event description is required';
      }

      if (!formData.location.trim()) {
        newErrors.location = 'Location is required';
      }

      if (!formData.venue.trim()) {
        newErrors.venue = 'Venue is required';
      }
    }

    if (step === 2) {
      // Date/Time Validation
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      const now = new Date();

      if (!formData.startDate || !formData.startTime) {
        newErrors.startDate = 'Start date and time are required';
      } else if (startDateTime <= now) {
        newErrors.startDate = 'Start time must be in the future';
      }

      if (!formData.endDate || !formData.endTime) {
        newErrors.endDate = 'End date and time are required';
      } else if (endDateTime <= startDateTime) {
        newErrors.endDate = 'End time must be after start time';
      }
    }

    if (step === 3) {
      // Ticketing Validation
      if (formData.eventType === LibStorage.EventType.Paid) {
        const price = Number.parseFloat(formData.ticketPrice);
        if (Number.isNaN(price) || price <= 0) {
          newErrors.ticketPrice = 'Valid ticket price required for paid events';
        }
      }

      const maxTickets = Number.parseInt(formData.maxTickets);
      if (Number.isNaN(maxTickets) || maxTickets < ValidationRules.maxTickets.min) {
        newErrors.maxTickets = `Minimum ${ValidationRules.maxTickets.min} tickets required`;
      }
    }

    if (step === 4) {
      // Budget Validation
      const expenses = Number.parseFloat(formData.amountNeededForExpenses);
      if (Number.isNaN(expenses) || expenses < 0) {
        newErrors.amountNeededForExpenses = 'Valid expense amount required';
      }

      if (!formData.bannerImage && !previewUrl) {
        newErrors.bannerImage = 'Event banner image is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(4) || !organization?.proxyAddress) return;

    try {
      // Upload banner to IPFS
      let ticketUri = '';
      if (formData.bannerImage) {
        const { url } = await uploadImageToIPFS(formData.bannerImage);
        ticketUri = url;
      }

      // Prepare contract parameters
      const params: CreateEventParams = {
        name: formData.name,
        ticketPrice: formData.eventType === LibStorage.EventType.Paid ? formData.ticketPrice : '0',
        maxTickets: Number.parseInt(formData.maxTickets),
        startTime: new Date(`${formData.startDate}T${formData.startTime}`),
        endTime: new Date(`${formData.endDate}T${formData.endTime}`),
        ticketUri,
        eventType: formData.eventType,
        amountNeededForExpenses: formData.amountNeededForExpenses,
        description: formData.description,
        location: formData.location,
        imageUrl: ticketUri,
      };

      await createEvent(params);
      
      // Success - redirect to event dashboard
      // This would typically be handled by router
      
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to create event' });
    }
  };

  if (!organization) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-8 card text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Organization Required</h2>
        <p className="text-foreground/70">
          You need to register an organization before creating events.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-8">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step <= currentStep
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-foreground/20 text-foreground/50'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-foreground/70">
          <span>Basic Info</span>
          <span>Schedule</span>
          <span>Ticketing</span>
          <span>Budget & Review</span>
        </div>
      </div>

      <div className="card p-8">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Basic Event Information</h2>
            
            <div>
                            <label htmlFor="event-name" className="block text-sm font-medium text-foreground mb-2">Event Name</label>
              <input
                id="event-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input w-full"
                placeholder="Enter event name"
              />
              {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Describe your event"
              />
              {errors.description && <p className="text-destructive text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="City, Country"
                />
                {errors.location && <p className="text-destructive text-sm mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Venue</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                  className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Venue name and address"
                />
                {errors.venue && <p className="text-destructive text-sm mt-1">{errors.venue}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Schedule */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Event Schedule</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">Start Time</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Start Time</label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">End Time</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">End Time</label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                      className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {(errors.startDate || errors.endDate) && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-sm">{errors.startDate || errors.endDate}</p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Ticketing */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Ticketing Setup</h2>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-4">Event Type</label>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="eventType"
                    value={LibStorage.EventType.Free}
                    checked={formData.eventType === LibStorage.EventType.Free}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventType: LibStorage.EventType.Free, ticketPrice: '0' }))}
                    className="text-primary"
                  />
                  <span>Free Event</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="eventType"
                    value={LibStorage.EventType.Paid}
                    checked={formData.eventType === LibStorage.EventType.Paid}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventType: LibStorage.EventType.Paid }))}
                    className="text-primary"
                  />
                  <span>Paid Event</span>
                </label>
              </div>
            </div>

            {formData.eventType === LibStorage.EventType.Paid && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Ticket Price (ETH)</label>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  value={formData.ticketPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, ticketPrice: e.target.value }))}
                  className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="0.05"
                />
                {errors.ticketPrice && <p className="text-destructive text-sm mt-1">{errors.ticketPrice}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Maximum Tickets</label>
              <input
                type="number"
                min="1"
                value={formData.maxTickets}
                onChange={(e) => setFormData(prev => ({ ...prev, maxTickets: e.target.value }))}
                className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="100"
              />
              {errors.maxTickets && <p className="text-destructive text-sm mt-1">{errors.maxTickets}</p>}
            </div>
          </div>
        )}

        {/* Step 4: Budget & Review */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Budget Planning & Review</h2>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Expected Expenses (ETH)</label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={formData.amountNeededForExpenses}
                onChange={(e) => setFormData(prev => ({ ...prev, amountNeededForExpenses: e.target.value }))}
                className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="1.0"
              />
              <p className="text-sm text-foreground/60 mt-1">
                This will be used for worker salaries and can be funded through ticket sales and sponsorships.
              </p>
              {errors.amountNeededForExpenses && <p className="text-destructive text-sm mt-1">{errors.amountNeededForExpenses}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Event Banner</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {previewUrl && (
                <div className="mt-4">
                  <img src={previewUrl} alt="Banner preview" className="w-full h-40 object-cover rounded-lg" />
                </div>
              )}
              {errors.bannerImage && <p className="text-destructive text-sm mt-1">{errors.bannerImage}</p>}
            </div>

            {/* Review Summary */}
            <div className="border border-foreground/20 rounded-lg p-6 bg-muted/30">
              <h3 className="font-medium text-foreground mb-4">Event Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Name:</strong> {formData.name}
                </div>
                <div>
                  <strong>Type:</strong> {formData.eventType === LibStorage.EventType.Free ? 'Free' : 'Paid'}
                </div>
                <div>
                  <strong>Price:</strong> {formData.eventType === LibStorage.EventType.Paid ? `${formData.ticketPrice} USDT` : 'Free'}
                </div>
                <div>
                  <strong>Max Tickets:</strong> {formData.maxTickets}
                </div>
                <div>
                  <strong>Start:</strong> {formData.startDate} {formData.startTime}
                </div>
                <div>
                  <strong>End:</strong> {formData.endDate} {formData.endTime}
                </div>
                <div>
                  <strong>Location:</strong> {formData.location}
                </div>
                <div>
                  <strong>Budget:</strong> {formData.amountNeededForExpenses} USDT
                </div>
              </div>
            </div>

            {errors.submit && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-sm">{errors.submit}</p>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="btn-secondary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn-primary px-6 py-2"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Event...' : 'Create Event'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}