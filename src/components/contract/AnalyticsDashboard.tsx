/**
 * Analytics Dashboard Component
 * Modern charts and insights for event performance
 * Glassmorphic design with data visualization
 */

'use client';

import { useState, useEffect } from 'react';
import { useEvents, useWorkers, useSponsorship } from '@/hooks/useContracts';

interface AnalyticsDashboardProps {
  proxyAddress: string;
}

export default function AnalyticsDashboard({ proxyAddress }: AnalyticsDashboardProps) {
  const { events, loadEvents, loading: eventsLoading } = useEvents(proxyAddress);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Calculate analytics
  const totalRevenue = events.reduce((sum, e) => sum + Number.parseFloat(e.formattedRevenue || '0'), 0);
  const totalTicketsSold = events.reduce((sum, e) => sum + (e.ticketsSold || 0), 0);
  const avgTicketPrice = totalTicketsSold > 0 ? totalRevenue / totalTicketsSold : 0;
  const activeEvents = events.filter(e => !e.hasEnded).length;
  const completedEvents = events.filter(e => e.hasEnded).length;

  // Revenue by event (top 5)
  const topEvents = [...events]
    .sort((a, b) => Number.parseFloat(b.formattedRevenue || '0') - Number.parseFloat(a.formattedRevenue || '0'))
    .slice(0, 5);

  const maxRevenue = Math.max(...topEvents.map(e => Number.parseFloat(e.formattedRevenue || '0')), 1);

  // Category distribution
  const categoryData = events.reduce((acc, event) => {
    const category = event.category || 'Other';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryColors: Record<string, string> = {
    'Technology': '#3B82F6',
    'Business': '#10B981',
    'Arts': '#F59E0B',
    'Music': '#EF4444',
    'Sports': '#8B5CF6',
    'Education': '#06B6D4',
    'Other': '#6B7280',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analytics & Insights</h2>
          <p className="text-foreground/60 mt-1">Performance metrics and trends</p>
        </div>
        
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeframe === period
                  ? 'bg-foreground text-background'
                  : 'glass text-foreground hover:bg-foreground/10'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground mb-1">{totalRevenue.toFixed(3)} USDT</p>
          <p className="text-sm text-foreground/60">Total Revenue</p>
          <p className="text-xs text-success mt-2">↑ All time</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-foreground/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground mb-1">{totalTicketsSold}</p>
          <p className="text-sm text-foreground/60">Tickets Sold</p>
          <p className="text-xs text-foreground/40 mt-2">All events</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-foreground/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground mb-1">{events.length}</p>
          <p className="text-sm text-foreground/60">Total Events</p>
          <p className="text-xs text-foreground/40 mt-2">{activeEvents} active</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-foreground/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground mb-1">{avgTicketPrice.toFixed(4)} USDT</p>
          <p className="text-sm text-foreground/60">Avg Ticket Price</p>
          <p className="text-xs text-foreground/40 mt-2">Per ticket</p>
        </div>
      </div>

      {/* Revenue by Event */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-foreground mb-6">Top Events by Revenue</h3>
        
        {eventsLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-foreground/60">Loading analytics...</p>
          </div>
        ) : topEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-foreground/60">No events data available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {topEvents.map((event, index) => {
              const revenue = Number.parseFloat(event.formattedRevenue || '0');
              const percentage = (revenue / maxRevenue) * 100;
              
              return (
                <div key={event.id} className="slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-foreground/40">#{index + 1}</span>
                      <div>
                        <p className="font-semibold text-foreground">{event.name}</p>
                        <p className="text-xs text-foreground/60">
                          {new Date(Number(event.startTime) * 1000).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{event.formattedRevenue} USDT</p>
                      <p className="text-xs text-foreground/60">{event.ticketsSold} tickets</p>
                    </div>
                  </div>
                  <div className="w-full bg-foreground/10 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-success to-success/60 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Distribution & Event Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-foreground mb-6">Events by Category</h3>
          <div className="space-y-4">
            {Object.entries(categoryData).map(([category, count], index) => {
              const total = Object.values(categoryData).reduce((sum, c) => sum + c, 0);
              const percentage = (count / total) * 100;
              const color = categoryColors[category] || categoryColors.Other;
              
              return (
                <div key={category} className="slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-foreground">{category}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-foreground">{count}</span>
                      <span className="text-sm text-foreground/60 ml-2">({percentage.toFixed(0)}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-foreground/10 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Event Status */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-foreground mb-6">Event Status</h3>
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="relative w-48 h-48 mx-auto">
                <svg className="transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-foreground/10"
                  />
                  {/* Active events */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="12"
                    strokeDasharray={`${(activeEvents / events.length) * 251.2} 251.2`}
                    strokeLinecap="round"
                  />
                  {/* Completed events */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#6B7280"
                    strokeWidth="12"
                    strokeDasharray={`${(completedEvents / events.length) * 251.2} 251.2`}
                    strokeDashoffset={`-${(activeEvents / events.length) * 251.2}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">{events.length}</p>
                    <p className="text-sm text-foreground/60">Events</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between glass p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-success" />
                    <span className="text-foreground">Active</span>
                  </div>
                  <span className="font-semibold text-foreground">{activeEvents}</span>
                </div>
                <div className="flex items-center justify-between glass p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-foreground/40" />
                    <span className="text-foreground">Completed</span>
                  </div>
                  <span className="font-semibold text-foreground">{completedEvents}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-foreground mb-6">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {events.length > 0 ? ((activeEvents / events.length) * 100).toFixed(0) : 0}%
                </p>
                <p className="text-sm text-foreground/60">Event Activity</p>
              </div>
            </div>
            <p className="text-xs text-foreground/60">
              Percentage of events currently active
            </p>
          </div>

          <div className="glass p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-foreground/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {events.length > 0 ? (totalTicketsSold / events.length).toFixed(0) : 0}
                </p>
                <p className="text-sm text-foreground/60">Avg Attendance</p>
              </div>
            </div>
            <p className="text-xs text-foreground/60">
              Average tickets sold per event
            </p>
          </div>

          <div className="glass p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-foreground/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {events.length > 0 ? (totalRevenue / events.length).toFixed(3) : 0}
                </p>
                <p className="text-sm text-foreground/60">Avg Revenue</p>
              </div>
            </div>
            <p className="text-xs text-foreground/60">
              USDT earned per event on average
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
