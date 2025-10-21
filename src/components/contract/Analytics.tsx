/**
 * Analytics Component
 * Provides comprehensive analytics and insights for events and organization performance
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useEvents, useWorkers, useSponsorship } from '@/hooks/useContracts';
import { LibStorage } from '@/types/contracts';

interface AnalyticsProps {
  proxyAddress: string;
  organizationName: string;
}

interface EventAnalytics {
  totalEvents: number;
  totalRevenue: number;
  totalExpenses: number;
  totalSponsorship: number;
  totalProfit: number;
  averageTicketPrice: number;
  averageAttendance: number;
  totalAttendees: number;
  successfulEvents: number;
  profitableEvents: number;
}

interface PeriodFilter {
  label: string;
  value: string;
  days: number;
}

export default function Analytics({ proxyAddress, organizationName }: AnalyticsProps) {
  const { events, loadEvents } = useEvents(proxyAddress);
  const { workers, loadWorkers } = useWorkers(proxyAddress);
  
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedEventType, setSelectedEventType] = useState('all');

  const periodFilters: PeriodFilter[] = [
    { label: 'All Time', value: 'all', days: 0 },
    { label: 'Last 7 Days', value: '7d', days: 7 },
    { label: 'Last 30 Days', value: '30d', days: 30 },
    { label: 'Last 90 Days', value: '90d', days: 90 },
    { label: 'Last Year', value: '1y', days: 365 },
  ];

  useEffect(() => {
    loadEvents();
    loadWorkers();
  }, [loadEvents, loadWorkers]);

  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Filter by time period
    if (selectedPeriod !== 'all') {
      const period = periodFilters.find(p => p.value === selectedPeriod);
      if (period) {
        const cutoffDate = Date.now() - (period.days * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(event => 
          Number(event.startTime) * 1000 >= cutoffDate
        );
      }
    }

    return filtered;
  }, [events, selectedPeriod]);

  const analytics: EventAnalytics = useMemo(() => {
    const totalEvents = filteredEvents.length;
    const totalRevenue = filteredEvents.reduce((sum, event) => sum + parseFloat(event.formattedRevenue), 0);
    const totalExpenses = filteredEvents.reduce((sum, event) => sum + parseFloat(event.formattedExpenses), 0);
    const totalSponsorship = filteredEvents.reduce((sum, event) => sum + parseFloat(event.totalSponsorship || '0'), 0);
    
    const totalIncome = totalRevenue + totalSponsorship;
    const platformFees = totalIncome * 0.05;
    const totalProfit = totalIncome - platformFees - totalExpenses;

    const averageTicketPrice = totalEvents > 0 ? 
      filteredEvents.reduce((sum, event) => sum + parseFloat(event.formattedTicketPrice), 0) / totalEvents : 0;

    const totalAttendees = filteredEvents.reduce((sum, event) => sum + Number(event.attendeeCount || 0), 0);
    const averageAttendance = totalEvents > 0 ? totalAttendees / totalEvents : 0;

    const completedEvents = filteredEvents.filter(event => Number(event.endTime) * 1000 < Date.now());
    const successfulEvents = completedEvents.filter(event => Number(event.attendeeCount || 0) > 0).length;
    const profitableEvents = completedEvents.filter(event => {
      const revenue = parseFloat(event.formattedRevenue);
      const expenses = parseFloat(event.formattedExpenses);
      const sponsorship = parseFloat(event.totalSponsorship || '0');
      const income = revenue + sponsorship;
      const profit = income - (income * 0.05) - expenses;
      return profit > 0;
    }).length;

    return {
      totalEvents,
      totalRevenue,
      totalExpenses,
      totalSponsorship,
      totalProfit,
      averageTicketPrice,
      averageAttendance,
      totalAttendees,
      successfulEvents,
      profitableEvents,
    };
  }, [filteredEvents]);

  const getEventsByMonth = () => {
    const monthlyData: { [key: string]: number } = {};
    
    filteredEvents.forEach(event => {
      const date = new Date(Number(event.startTime) * 1000);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12); // Last 12 months
  };

  const getRevenueByMonth = () => {
    const monthlyRevenue: { [key: string]: number } = {};
    
    filteredEvents.forEach(event => {
      const date = new Date(Number(event.startTime) * 1000);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const revenue = parseFloat(event.formattedRevenue) + parseFloat(event.totalSponsorship || '0');
      monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + revenue;
    });

    return Object.entries(monthlyRevenue)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12);
  };

  const getTopPerformingEvents = () => {
    return filteredEvents
      .map(event => ({
        ...event,
        totalIncome: parseFloat(event.formattedRevenue) + parseFloat(event.totalSponsorship || '0'),
        profit: (parseFloat(event.formattedRevenue) + parseFloat(event.totalSponsorship || '0')) * 0.95 - parseFloat(event.formattedExpenses)
      }))
      .sort((a, b) => b.totalIncome - a.totalIncome)
      .slice(0, 5);
  };

  const getWorkerStats = () => {
    const totalWorkers = workers.length;
    const activeWorkers = workers.filter(worker => worker.assignedEventIds.length > 0).length;
    const totalSalariesPaid = workers.reduce((sum, worker) => {
      if (worker.isPaid) {
        return sum + parseFloat(worker.formattedSalary);
      }
      return sum;
    }, 0);

    return { totalWorkers, activeWorkers, totalSalariesPaid };
  };

  const monthlyEvents = getEventsByMonth();
  const monthlyRevenue = getRevenueByMonth();
  const topEvents = getTopPerformingEvents();
  const workerStats = getWorkerStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
          <p className="text-foreground/70">Organization: {organizationName}</p>
        </div>
        
        {/* Period Filter */}
        <div className="flex items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input px-3 py-2"
          >
            {periodFilters.map(period => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Total Revenue</p>
              <p className="text-2xl font-bold text-success">{analytics.totalRevenue.toFixed(4)} ETH</p>
              <p className="text-xs text-foreground/50">Including sponsorship</p>
            </div>
            <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Net Profit</p>
              <p className={`text-2xl font-bold ${analytics.totalProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                {analytics.totalProfit.toFixed(4)} ETH
              </p>
              <p className="text-xs text-foreground/50">After all expenses</p>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Total Events</p>
              <p className="text-2xl font-bold text-foreground">{analytics.totalEvents}</p>
              <p className="text-xs text-foreground/50">{analytics.successfulEvents} successful</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Total Attendees</p>
              <p className="text-2xl font-bold text-foreground">{analytics.totalAttendees}</p>
              <p className="text-xs text-foreground/50">Avg: {analytics.averageAttendance.toFixed(1)} per event</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Performance */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Event Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-foreground/70">Success Rate</span>
              <span className="font-medium text-foreground">
                {analytics.totalEvents > 0 ? ((analytics.successfulEvents / analytics.totalEvents) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="w-full bg-foreground/10 rounded-full h-2">
              <div 
                className="bg-success h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${analytics.totalEvents > 0 ? (analytics.successfulEvents / analytics.totalEvents) * 100 : 0}%` 
                }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-foreground/70">Profitability Rate</span>
              <span className="font-medium text-foreground">
                {analytics.totalEvents > 0 ? ((analytics.profitableEvents / analytics.totalEvents) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="w-full bg-foreground/10 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${analytics.totalEvents > 0 ? (analytics.profitableEvents / analytics.totalEvents) * 100 : 0}%` 
                }}
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-sm text-foreground/60">Avg Ticket Price</p>
                <p className="font-semibold text-foreground">{analytics.averageTicketPrice.toFixed(4)} ETH</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-sm text-foreground/60">Total Sponsorship</p>
                <p className="font-semibold text-primary">{analytics.totalSponsorship.toFixed(4)} ETH</p>
              </div>
            </div>
          </div>
        </div>

        {/* Worker Statistics */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Workforce Analytics</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">{workerStats.totalWorkers}</p>
                <p className="text-sm text-foreground/60">Total Workers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{workerStats.activeWorkers}</p>
                <p className="text-sm text-foreground/60">Active Workers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{(workerStats.totalSalariesPaid).toFixed(2)}</p>
                <p className="text-sm text-foreground/60">ETH Paid</p>
              </div>
            </div>

            <div className="pt-4 border-t border-foreground/20">
              <p className="text-sm text-foreground/60 mb-2">Worker Utilization</p>
              <div className="w-full bg-foreground/10 rounded-full h-2">
                <div 
                  className="bg-success h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${workerStats.totalWorkers > 0 ? (workerStats.activeWorkers / workerStats.totalWorkers) * 100 : 0}%` 
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-foreground/50 mt-1">
                <span>{workerStats.activeWorkers} active</span>
                <span>{workerStats.totalWorkers} total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Events */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Top Performing Events</h3>
        {topEvents.length === 0 ? (
          <p className="text-foreground/60 text-center py-8">No events data available for the selected period.</p>
        ) : (
          <div className="space-y-3">
            {topEvents.map((event, index) => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">#{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{event.name}</h4>
                    <p className="text-sm text-foreground/60">
                      {new Date(Number(event.startTime) * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-success">{event.totalIncome.toFixed(4)} ETH</p>
                  <p className="text-sm text-foreground/60">
                    Profit: {event.profit >= 0 ? '+' : ''}{event.profit.toFixed(4)} ETH
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Event Count</h3>
          {monthlyEvents.length === 0 ? (
            <p className="text-foreground/60 text-center py-8">No monthly data available.</p>
          ) : (
            <div className="space-y-3">
              {monthlyEvents.map(([month, count]) => (
                <div key={month} className="flex items-center justify-between">
                  <span className="text-foreground/70">{month}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-foreground/10 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.max(20, (count / Math.max(...monthlyEvents.map(([, c]) => c))) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <span className="font-medium text-foreground w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Revenue</h3>
          {monthlyRevenue.length === 0 ? (
            <p className="text-foreground/60 text-center py-8">No revenue data available.</p>
          ) : (
            <div className="space-y-3">
              {monthlyRevenue.map(([month, revenue]) => (
                <div key={month} className="flex items-center justify-between">
                  <span className="text-foreground/70">{month}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-foreground/10 rounded-full h-2">
                      <div 
                        className="bg-success h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.max(20, (revenue / Math.max(...monthlyRevenue.map(([, r]) => r))) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <span className="font-medium text-foreground w-16 text-right">{revenue.toFixed(2)} ETH</span>
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