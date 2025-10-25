/**
 * Event Dashboard Component
 * Comprehensive view for managing events through their lifecycle
 */

'use client';

import { useState, useEffect } from 'react';
import { useEvents, useWorkers, useSponsorship } from '@/hooks/useContracts';
import { LibStorage } from '@/types/contracts';

interface EventDashboardProps {
  proxyAddress: string;
  organizationName: string;
}

type EventTab = 'all' | 'upcoming' | 'active' | 'ended' | 'draft';

export default function EventDashboard({ proxyAddress, organizationName }: Readonly<EventDashboardProps>) {
  const { events, loadEvents, loading } = useEvents(proxyAddress);
  const { workers, loadWorkers } = useWorkers(proxyAddress);
  const { sponsors, loadSponsorship } = useSponsorship(proxyAddress);
  
  const [activeTab, setActiveTab] = useState<EventTab>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<LibStorage.EventDisplay | null>(null);

  useEffect(() => {
    loadEvents();
    loadWorkers();
    loadSponsorship();
  }, [loadEvents, loadWorkers, loadSponsorship]);

  const getEventStatus = (event: LibStorage.EventDisplay) => {
    const now = Date.now();
    const startTime = Number(event.startTime) * 1000;
    const endTime = Number(event.endTime) * 1000;

    if (now < startTime) return 'upcoming';
    if (now >= startTime && now <= endTime) return 'active';
    if (now > endTime && !event.isPaid) return 'ended';
    if (event.isPaid) return 'completed';
    return 'draft';
  };

  const getFilteredEvents = () => {
    let filtered = events;

    // Filter by status
    if (activeTab !== 'all') {
      filtered = filtered.filter(event => {
        const status = getEventStatus(event);
        return activeTab === 'ended' ? (status === 'ended' || status === 'completed') : status === activeTab;
      });
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600 bg-blue-100';
      case 'active': return 'text-green-600 bg-green-100';
      case 'ended': return 'text-orange-600 bg-orange-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (timestamp: string | number) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  const formatDuration = (startTime: string | number, endTime: string | number) => {
    const start = Number(startTime) * 1000;
    const end = Number(endTime) * 1000;
    const duration = end - start;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getEventStats = (event: LibStorage.EventDisplay) => {
    const revenue = Number.parseFloat(event.formattedRevenue);
    const expenses = Number.parseFloat(event.formattedExpenses);
    const sponsorship = Number.parseFloat(event.totalSponsorship || '0');
    const profit = (revenue + sponsorship) - expenses - ((revenue + sponsorship) * 0.05);

    return { revenue, expenses, sponsorship, profit };
  };

  const filteredEvents = getFilteredEvents();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Event Dashboard</h2>
          <p className="text-foreground/70">Organization: {organizationName}</p>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input px-3 py-2 w-64"
          />
          <button className="btn-primary px-4 py-2">
            Create Event
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Events', count: events.length, color: 'bg-primary' },
          { label: 'Upcoming', count: events.filter(e => getEventStatus(e) === 'upcoming').length, color: 'bg-blue-500' },
          { label: 'Active', count: events.filter(e => getEventStatus(e) === 'active').length, color: 'bg-green-500' },
          { label: 'Ended', count: events.filter(e => ['ended', 'completed'].includes(getEventStatus(e))).length, color: 'bg-orange-500' },
          { label: 'Total Revenue', count: `${events.reduce((sum, e) => sum + Number.parseFloat(e.formattedRevenue), 0).toFixed(2)} USDT`, color: 'bg-success' },
        ].map((stat, index) => (
          <div key={index} className="card p-4">
            <div className={`w-3 h-3 rounded-full ${stat.color} mb-2`}></div>
            <p className="text-2xl font-bold text-foreground">{stat.count}</p>
            <p className="text-sm text-foreground/60">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted/30 p-1 rounded-lg">
        {[
          { key: 'all', label: 'All Events' },
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'active', label: 'Active' },
          { key: 'ended', label: 'Ended' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as EventTab)}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.key
                ? 'bg-background text-foreground shadow-sm'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            {tab.label}
            <span className="ml-2 text-xs bg-foreground/10 px-2 py-1 rounded">
              {tab.key === 'all' ? events.length : events.filter(e => {
                const status = getEventStatus(e);
                return tab.key === 'ended' ? ['ended', 'completed'].includes(status) : status === tab.key;
              }).length}
            </span>
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {loading ? (
          <div className="card p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground/60">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="card p-8 text-center">
            <h3 className="text-lg font-medium text-foreground mb-2">No Events Found</h3>
            <p className="text-foreground/60">
              {searchTerm ? 'No events match your search criteria.' : 'No events in this category.'}
            </p>
          </div>
        ) : (
          filteredEvents.map((event) => {
            const status = getEventStatus(event);
            const stats = getEventStats(event);
            
            return (
              <div key={event.id} className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground">{event.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-foreground/60 mt-3">
                      <span>📅 {formatDate(Number(event.startTime))} - {formatDate(Number(event.endTime))}</span>
                      <span>⏱️ Duration: {formatDuration(Number(event.startTime), Number(event.endTime))}</span>
                      <span>🎫 Price: {event.formattedPrice} USDT</span>
                      <span>👥 Capacity: {event.maxTickets.toString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                    className="btn-secondary px-4 py-2 ml-4"
                  >
                    {selectedEvent?.id === event.id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-foreground/60">Revenue</p>
                    <p className="font-semibold text-success">{stats.revenue.toFixed(4)} USDT</p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-foreground/60">Sponsorship</p>
                    <p className="font-semibold text-primary">{stats.sponsorship.toFixed(4)} USDT</p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-foreground/60">Expenses</p>
                    <p className="font-semibold text-destructive">{stats.expenses.toFixed(4)} USDT</p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-foreground/60">Profit</p>
                    <p className={`font-semibold ${stats.profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {stats.profit.toFixed(4)} USDT
                    </p>
                  </div>
                </div>

                {/* Detailed View */}
                {selectedEvent?.id === event.id && (
                  <div className="border-t border-foreground/20 pt-6 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Workers Section */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-4">Workers ({workers.length})</h4>
                        {workers.length === 0 ? (
                          <p className="text-foreground/60 text-sm">No workers in this organization.</p>
                        ) : (
                          <div className="space-y-3">
                            {workers.slice(0, 5).map((worker, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                                <div>
                                  <p className="font-medium text-foreground font-mono text-sm">{worker.employee.slice(0, 6)}...{worker.employee.slice(-4)}</p>
                                  <p className="text-sm text-foreground/60">{worker.description}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-foreground">{worker.formattedSalary} USDT</p>
                                  <p className="text-xs text-foreground/60">
                                    {worker.paid ? 'Paid' : 'Pending'}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Sponsorship Section */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-4">Sponsorship Details</h4>
                        {sponsors.length > 0 ? (
                          <div className="space-y-3">
                            <div className="p-3 bg-muted/20 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-foreground/60">Total Sponsors</span>
                                <span className="font-medium text-foreground">{sponsors.length}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-foreground/60">Total Funding</span>
                                <span className="font-medium text-foreground">{event.totalSponsorship || '0'} USDT</span>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm text-foreground/60 mb-2">Recent Sponsors</p>
                              <div className="space-y-2">
                                {sponsors.slice(0, 5).map((sponsor, index) => (
                                  <div key={index} className="flex items-center justify-between text-sm p-2 bg-muted/10 rounded">
                                    <span className="font-mono text-foreground">{sponsor.sponsor.slice(0, 6)}...{sponsor.sponsor.slice(-4)}</span>
                                    <span className="font-medium text-foreground">{sponsor.formattedAmount} USDT ({sponsor.formattedPercentage}%)</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-foreground/60 text-sm">No sponsorship information available.</p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-foreground/20">
                      <button className="btn-secondary px-4 py-2 text-sm">Edit Event</button>
                      <button className="btn-secondary px-4 py-2 text-sm">Manage Workers</button>
                      <button className="btn-secondary px-4 py-2 text-sm">View Analytics</button>
                      {status === 'ended' && !event.isPaid && (
                        <button className="btn-primary px-4 py-2 text-sm">Process Payments</button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}