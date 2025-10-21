import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Card, CardHeader, CardTitle, CardBody, Button, Badge, Skeleton } from '@/components/ui';
import { useFactory, useEvents } from '@/hooks';
import { formatAddress } from '@/lib/utils';

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { userOrganizations, isLoadingOrgs } = useFactory();
  const [selectedOrg, setSelectedOrg] = useState<`0x${string}` | undefined>();

  // Auto-select first organization
  useEffect(() => {
    if (userOrganizations.length > 0 && !selectedOrg) {
      setSelectedOrg(userOrganizations[0]);
    }
  }, [userOrganizations, selectedOrg]);

  // Fetch events for selected organization
  const { events, eventCount, isLoadingEvents } = useEvents(selectedOrg);

  // Calculate stats
  const activeEvents = events.filter((event: any) => {
    const now = Math.floor(Date.now() / 1000);
    return event.startTime <= now && event.endTime > now;
  }).length;

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-600 mb-6">Please connect your wallet to view your dashboard</p>
      </div>
    );
  }

  if (isLoadingOrgs) {
    return (
      <>
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rectangular" height={120} />
          ))}
        </div>
      </>
    );
  }

  if (userOrganizations.length === 0) {
    return (
      <>
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">No Organizations Yet</h2>
              <p className="text-gray-600 mb-6">
                Create your first organization to start managing events
              </p>
              <Link to="/create-organization">
                <Button variant="primary" size="lg">
                  Create Organization
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <Link to="/dashboard/events/create">
          <Button variant="primary">Create Event</Button>
        </Link>
      </div>

      {/* Organization Selector */}
      {userOrganizations.length > 1 && (
        <Card className="mb-6">
          <CardBody>
            <div className="flex items-center space-x-4">
              <label htmlFor="org-select" className="text-sm font-medium text-gray-700">
                Organization:
              </label>
              <select
                id="org-select"
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value as `0x${string}`)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                {userOrganizations.map((org) => (
                  <option key={org} value={org}>
                    {formatAddress(org)}
                  </option>
                ))}
              </select>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardBody>
            <p className="text-sm text-gray-600 mb-1">Total Events</p>
            {isLoadingEvents ? (
              <Skeleton variant="text" width={80} />
            ) : (
              <p className="text-3xl font-bold">{eventCount}</p>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-sm text-gray-600 mb-1">Active Events</p>
            {isLoadingEvents ? (
              <Skeleton variant="text" width={80} />
            ) : (
              <p className="text-3xl font-bold">{activeEvents}</p>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-sm text-gray-600 mb-1">Organizations</p>
            <p className="text-3xl font-bold">{userOrganizations.length}</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-sm text-gray-600 mb-1">Your Address</p>
            <p className="text-sm font-mono font-bold mt-2">{address ? formatAddress(address) : '--'}</p>
          </CardBody>
        </Card>
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Events</CardTitle>
            <Link to="/dashboard/events/create">
              <Button variant="secondary" size="sm">
                Create New
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardBody>
          {isLoadingEvents ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rectangular" height={80} />
              ))}
            </div>
          ) : (
            <>
              {events.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No events yet</p>
                  <Link to="/dashboard/events/create">
                    <Button variant="primary">Create Your First Event</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {events.slice(0, 5).map((event: any, index: number) => {
                    const now = Math.floor(Date.now() / 1000);
                    const eventStatus = (() => {
                      if (event.startTime > now) return 'upcoming';
                      if (event.endTime < now) return 'ended';
                      return 'active';
                    })();
                    const getBadgeVariant = () => {
                      if (eventStatus === 'active') return 'success';
                      if (eventStatus === 'upcoming') return 'info';
                      return 'default';
                    };

                    return (
                      <div
                        key={`event-${event.id || index}`}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{event.name || `Event #${index + 1}`}</h3>
                          <p className="text-sm text-gray-600">
                            Tickets: {event.ticketsSold?.toString() || '0'} / {event.maxTickets?.toString() || '0'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant={getBadgeVariant()}>
                            {eventStatus}
                          </Badge>
                          <Link to={`/events/${selectedOrg}/${event.id}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card hover>
          <CardBody>
            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Create Event</h3>
              <p className="text-sm text-gray-600 mb-4">
                Set up a new event with tickets
              </p>
              <Link to="/dashboard/events/create">
                <Button variant="secondary" size="sm" fullWidth>
                  Get Started
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody>
            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Manage Workers</h3>
              <p className="text-sm text-gray-600 mb-4">
                Add team members and set salaries
              </p>
              <Link to="/dashboard/workers">
                <Button variant="secondary" size="sm" fullWidth>
                  Manage
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody>
            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">View Sponsors</h3>
              <p className="text-sm text-gray-600 mb-4">
                Track sponsorships and returns
              </p>
              <Link to="/dashboard/sponsorships">
                <Button variant="secondary" size="sm" fullWidth>
                  View All
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
