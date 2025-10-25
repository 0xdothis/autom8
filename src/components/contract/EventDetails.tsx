/**
 * Event Details Component
 * Comprehensive event management with tabbed interface
 * Tabs: Overview, Tickets, Workers, Sponsors, Analytics
 */

'use client';

import { useState, useEffect } from 'react';
import { useEvents } from '@/hooks/useContracts';
import WorkerManagement from './WorkerManagement';
import SponsorshipDashboard from './SponsorshipDashboard';
import PaymentProcessing from './PaymentProcessing';
import Link from 'next/link';

interface EventDetailsProps {
  proxyAddress: string;
  eventId: string;
}

type Tab = 'overview' | 'tickets' | 'workers' | 'sponsors' | 'payments';

export default function EventDetails({ proxyAddress, eventId }: EventDetailsProps) {
  const { events, loadEvents, endEvent, loading } = useEvents(proxyAddress);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    const foundEvent = events.find(e => e.id === eventId);
    setEvent(foundEvent);
  }, [events, eventId]);

  if (loading || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto"></div>
          <p className="text-foreground/60">Loading event details...</p>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: JSX.Element }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    },
    {
      id: 'tickets',
      label: 'Tickets',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
    },
    {
      id: 'workers',
      label: 'Workers',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
    },
    {
      id: 'sponsors',
      label: 'Sponsors',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
    },
  ];

  return (
    <div className="min-h-screen py-8 mobile-px">
      {/* Header */}
      <div className="glass-card p-6 mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Link href="/contract-dashboard" className="text-foreground/60 hover:text-foreground text-sm mb-2 inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-foreground mt-2">{event.name}</h1>
            <p className="text-foreground/60 mt-2">{event.description}</p>
          </div>
          
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
            event.hasEnded 
              ? 'bg-foreground/10 text-foreground/60' 
              : 'bg-success/20 text-success'
          }`}>
            {event.hasEnded ? 'Ended' : 'Active'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="glass p-4 rounded-lg">
            <p className="text-sm text-foreground/60 mb-1">Start Date</p>
            <p className="font-semibold text-foreground">
              {new Date(Number(event.startTime) * 1000).toLocaleDateString()}
            </p>
          </div>
          <div className="glass p-4 rounded-lg">
            <p className="text-sm text-foreground/60 mb-1">Location</p>
            <p className="font-semibold text-foreground">{event.location}</p>
          </div>
          <div className="glass p-4 rounded-lg">
            <p className="text-sm text-foreground/60 mb-1">Revenue</p>
            <p className="font-semibold text-foreground">{event.formattedRevenue} ETH</p>
          </div>
          <div className="glass p-4 rounded-lg">
            <p className="text-sm text-foreground/60 mb-1">Tickets Sold</p>
            <p className="font-semibold text-foreground">{event.ticketsSold || 0} / {event.maxTickets}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-card mb-8">
        <div className="flex overflow-x-auto border-b border-foreground/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap
                ${activeTab === tab.id
                  ? 'text-foreground border-b-2 border-foreground'
                  : 'text-foreground/60 hover:text-foreground'
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="fade-in">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Event Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Category</p>
                  <p className="text-foreground">{event.category || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Ticket Price</p>
                  <p className="text-foreground">{event.formattedTicketPrice} ETH</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Start Time</p>
                  <p className="text-foreground">{new Date(Number(event.startTime) * 1000).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60 mb-1">End Time</p>
                  <p className="text-foreground">{new Date(Number(event.endTime) * 1000).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Quick Stats</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-lg text-center">
                  <p className="text-3xl font-bold text-foreground mb-2">{event.formattedRevenue}</p>
                  <p className="text-foreground/60">Total Revenue (ETH)</p>
                </div>
                <div className="glass p-6 rounded-lg text-center">
                  <p className="text-3xl font-bold text-foreground mb-2">{event.ticketsSold || 0}</p>
                  <p className="text-foreground/60">Tickets Sold</p>
                </div>
                <div className="glass p-6 rounded-lg text-center">
                  <p className="text-3xl font-bold text-foreground mb-2">
                    {event.maxTickets ? Math.round((event.ticketsSold / event.maxTickets) * 100) : 0}%
                  </p>
                  <p className="text-foreground/60">Capacity</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Ticket Management</h3>
            <div className="text-center py-12">
              <div className="w-16 h-16 glass rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Ticket System</h4>
              <p className="text-foreground/60 mb-4">
                Detailed ticket management coming soon. View attendees, check-ins, and more.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'workers' && (
          <WorkerManagement proxyAddress={proxyAddress} eventId={eventId} />
        )}

        {activeTab === 'sponsors' && (
          <SponsorshipDashboard proxyAddress={proxyAddress} eventId={eventId} />
        )}

        {activeTab === 'payments' && (
          <PaymentProcessing proxyAddress={proxyAddress} eventId={eventId} />
        )}
      </div>
    </div>
  );
}
