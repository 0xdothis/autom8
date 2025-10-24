/**
 * Dashboard Overview Component
 * Modern glassmorphic design for event management
 * Interacts with organization proxy contract
 */

'use client';

import { useState, useEffect } from 'react';
import { useEvents, useWorkers, usePayments } from '@/hooks/useContracts';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface DashboardOverviewProps {
  proxyAddress: string;
  organizationName: string;
}

type View = 'overview' | 'events' | 'create' | 'workers' | 'sponsorship' | 'payments' | 'analytics';

export default function DashboardOverview({ proxyAddress, organizationName }: DashboardOverviewProps) {
  const pathname = usePathname();
  const [activeView, setActiveView] = useState<View>('overview');
  const { events, loadEvents, loading: eventsLoading } = useEvents(proxyAddress);
  const { workers, loadWorkers } = useWorkers(proxyAddress);
  const { } = usePayments(proxyAddress);

  useEffect(() => {
    loadEvents();
    loadWorkers();
  }, [loadEvents, loadWorkers]);

  // Calculate stats
  const totalEvents = events.length;
  const activeEvents = events.filter(e => !e.hasEnded).length;
  const totalRevenue = events.reduce((sum, e) => sum + Number.parseFloat(e.formattedRevenue || '0'), 0);
  const totalWorkers = workers.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass-card border-b border-foreground/10">
        <div className="container mx-auto mobile-px py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{organizationName}</h1>
              <p className="text-sm text-foreground/60 mt-1">
                Proxy: {proxyAddress.slice(0, 6)}...{proxyAddress.slice(-4)}
              </p>
            </div>
            
            <Link href="/contract-dashboard/create" className="btn-primary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Event
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="container mx-auto mobile-px py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Events */}
          <div className="glass-card p-6 slide-in">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 glass rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">{totalEvents}</p>
            <p className="text-sm text-foreground/60">Total Events</p>
          </div>

          {/* Active Events */}
          <div className="glass-card p-6 slide-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 glass rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">{activeEvents}</p>
            <p className="text-sm text-foreground/60">Active Events</p>
          </div>

          {/* Total Revenue */}
          <div className="glass-card p-6 slide-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 glass rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">{totalRevenue.toFixed(2)}</p>
            <p className="text-sm text-foreground/60">ETH Revenue</p>
          </div>

          {/* Team Members */}
          <div className="glass-card p-6 slide-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 glass rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">{totalWorkers}</p>
            <p className="text-sm text-foreground/60">Team Members</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/contract-dashboard/create" className="glass p-4 rounded-lg hover:scale-105 transition-transform group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-foreground/5 rounded-lg flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
                  <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-foreground">Create Event</p>
                  <p className="text-xs text-foreground/60">New event</p>
                </div>
              </div>
            </Link>

            <Link href="/contract-dashboard/workers" className="glass p-4 rounded-lg hover:scale-105 transition-transform group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-foreground/5 rounded-lg flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
                  <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-foreground">Manage Team</p>
                  <p className="text-xs text-foreground/60">Add workers</p>
                </div>
              </div>
            </Link>

            <Link href="/contract-dashboard/payments" className="glass p-4 rounded-lg hover:scale-105 transition-transform group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-foreground/5 rounded-lg flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
                  <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-foreground">Process Payments</p>
                  <p className="text-xs text-foreground/60">Pay workers</p>
                </div>
              </div>
            </Link>

            <Link href="/contract-dashboard/analytics" className="glass p-4 rounded-lg hover:scale-105 transition-transform group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-foreground/5 rounded-lg flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
                  <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-foreground">View Analytics</p>
                  <p className="text-xs text-foreground/60">Performance</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Events */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Recent Events</h2>
            <Link href="/contract-dashboard/events" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
              View All →
            </Link>
          </div>

          {eventsLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-foreground/60">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 glass rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Events Yet</h3>
              <p className="text-foreground/60 mb-4">Create your first event to get started</p>
              <Link href="/contract-dashboard/create" className="btn-primary inline-flex">
                Create Event
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {events.slice(0, 5).map((event, index) => (
                <div key={event.id} className="glass p-4 rounded-lg slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{event.name}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-foreground/60">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(Number(event.startTime) * 1000).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          {event.formattedRevenue} ETH
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${event.hasEnded ? 'bg-foreground/10' : 'bg-success/20 text-success'}`}>
                          {event.hasEnded ? 'Ended' : 'Active'}
                        </span>
                      </div>
                    </div>
                    <Link 
                      href={`/contract-dashboard/events/${event.id}`}
                      className="btn-secondary text-sm px-4 py-2 whitespace-nowrap ml-4"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
