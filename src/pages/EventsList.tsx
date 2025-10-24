import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatEther } from 'viem';
import { useReadContract } from 'wagmi';
import Button from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import { useFactory } from '../hooks';
import { eventImplementationAbi } from '@/lib/contracts';
import { getKnownProxies } from '@/lib/contracts/known-proxies';

interface EventWithOrg {
  id: bigint;
  name: string;
  ticketPrice: bigint;
  maxTickets: bigint;
  ticketsSold: bigint;
  startTime: bigint;
  endTime: bigint;
  eventType: number;
  amountNeeded: bigint;
  proxyAddress: string;
  status: 'upcoming' | 'active' | 'ended';
}

export default function EventsList() {
  const navigate = useNavigate();
  const { userOrganizations } = useFactory();
  
  const [allEvents, setAllEvents] = useState<EventWithOrg[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'active' | 'ended'>('all');
  const [filterType, setFilterType] = useState<'all' | 'free' | 'paid'>('all');
  
  // Get all known proxies for public event discovery
  // This includes both known proxies and the user's organization if they have one
  const knownProxies = getKnownProxies();
  const allProxiesToFetch = [
    ...knownProxies,
    ...(userOrganizations.length > 0 ? userOrganizations : [])
  ];
  // Remove duplicates
  const uniqueProxies = [...new Set(allProxiesToFetch)].filter(addr => !!addr);
  
  // For now, fetch from the first available proxy (either known or user's)
  // In production, you'd want to fetch from ALL proxies and aggregate
  const displayOrgAddress = uniqueProxies[0];
  
  console.log('EventsList Debug:', {
    knownProxies,
    userOrganizations,
    uniqueProxies,
    displayOrgAddress
  });
  
  // Fetch events from the organization
  const { data: eventsData, isLoading: isLoadingEvents } = useReadContract({
    address: displayOrgAddress,
    abi: eventImplementationAbi,
    functionName: 'getAllEvent',
    query: {
      enabled: !!displayOrgAddress,
    },
  });
  
  console.log('Events Data:', { eventsData, isLoadingEvents });

  // Process and add status to events
  useEffect(() => {
    if (eventsData && Array.isArray(eventsData)) {
      const now = Math.floor(Date.now() / 1000);
      
      const processedEvents: EventWithOrg[] = eventsData.map((event: any) => {
        let status: 'upcoming' | 'active' | 'ended' = 'upcoming';
        if (Number(event.startTime) <= now && Number(event.endTime) > now) {
          status = 'active';
        } else if (Number(event.endTime) <= now) {
          status = 'ended';
        }
        
        return {
          id: event.id,
          name: event.name,
          ticketPrice: event.ticketPrice,
          maxTickets: event.maxTickets,
          ticketsSold: event.ticketsSold,
          startTime: event.startTime,
          endTime: event.endTime,
          eventType: event.eventType,
          amountNeeded: event.amountNeeded,
          proxyAddress: displayOrgAddress || '',
          status,
        };
      });
      
      setAllEvents(processedEvents);
      setIsLoading(false);
    } else if (!isLoadingEvents) {
      setIsLoading(false);
    }
  }, [eventsData, displayOrgAddress, isLoadingEvents]);

  const getStatusBadgeVariant = (status: string) => {
    if (status === 'active') return 'success';
    if (status === 'upcoming') return 'info';
    return 'default';
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filteredEvents = allEvents.filter((event) => {
    // Search filter
    if (searchTerm && !event.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Status filter
    if (filterStatus !== 'all' && event.status !== filterStatus) {
      return false;
    }

    // Type filter
    if (filterType === 'free' && event.ticketPrice > 0) return false;
    if (filterType === 'paid' && event.ticketPrice === BigInt(0)) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Explore Events</h1>
          <p className="text-gray-600">Discover and join exciting events on the blockchain</p>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          <div className="lg:col-span-2">
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>
          
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="ended">Ended</option>
            </select>
          </div>

          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as typeof filterType)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardBody>
                  <div className="animate-pulse space-y-4">
                    <div className="h-48 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State - No Organizations or Known Proxies */}
        {!isLoading && uniqueProxies.length === 0 && (
          <Card>
            <CardBody>
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold mb-2">No Events Available Yet</h2>
                <p className="text-gray-600 mb-6">
                  Be the first to create an organization and host events on the platform!
                </p>
                <Button onClick={() => navigate('/create-organization')}>
                  Create Organization
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Empty State - No Events */}
        {!isLoading && uniqueProxies.length > 0 && filteredEvents.length === 0 && (
          <Card>
            <CardBody>
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold mb-2">No Events Found</h2>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                    ? 'Try adjusting your filters to see more events.'
                    : 'Check back later for upcoming events!'}
                </p>
                {userOrganizations.length > 0 && !searchTerm && filterStatus === 'all' && filterType === 'all' && (
                  <Button onClick={() => navigate('/dashboard/events/create')}>
                    Create Event
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Events Grid */}
        {!isLoading && filteredEvents.length > 0 && (
          <>
            <div className="mb-4 text-gray-600">
              Found {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Card key={`${event.proxyAddress}-${event.id.toString()}`} hover>
                  <CardBody>
                    {/* Event Image */}
                    <div className="relative mb-4">
                      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-5xl mb-2">🎉</div>
                          <p className="text-sm text-gray-500 font-medium px-4">
                            {event.name}
                          </p>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Badge variant={getStatusBadgeVariant(event.status)}>
                          {event.status.toUpperCase()}
                        </Badge>
                        <Badge variant={event.ticketPrice === BigInt(0) ? 'info' : 'success'}>
                          {event.ticketPrice === BigInt(0) ? 'FREE' : 'PAID'}
                        </Badge>
                      </div>
                    </div>

                    {/* Event Info */}
                    <div className="space-y-3">
                      <h3 className="font-bold text-xl truncate">{event.name}</h3>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">📅 Start Date</span>
                          <span className="font-medium">{formatDate(event.startTime)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">🎫 Tickets</span>
                          <span className="font-medium">
                            {event.ticketsSold.toString()} / {event.maxTickets.toString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">💰 Price</span>
                          <span className="font-medium">
                            {event.ticketPrice === BigInt(0)
                              ? 'FREE'
                              : `${formatEther(event.ticketPrice)} ETH`}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="pt-2">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Tickets Sold</span>
                          <span>
                            {event.maxTickets > BigInt(0)
                              ? `${((Number(event.ticketsSold) / Number(event.maxTickets)) * 100).toFixed(0)}%`
                              : '0%'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-black h-2 rounded-full transition-all"
                            style={{
                              width: event.maxTickets > BigInt(0)
                                ? `${(Number(event.ticketsSold) / Number(event.maxTickets)) * 100}%`
                                : '0%',
                            }}
                          />
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        onClick={() => navigate(`/events/${event.proxyAddress}/${event.id}`)}
                        variant="secondary"
                        size="sm"
                        className="w-full mt-4"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Demo Info */}
        <Card className="mt-8 border-2 border-blue-100 bg-blue-50">
          <CardBody>
            <div className="flex items-start gap-4">
              <div className="text-3xl">ℹ️</div>
              <div>
                <h3 className="font-semibold mb-2">Demo Mode - Events Discovery</h3>
                <p className="text-sm text-gray-700 mb-3">
                  In production, this page would aggregate events from all organizations on the
                  platform using The Graph or event indexing. Features would include:
                </p>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Browse all public events across the platform</li>
                  <li>Advanced filtering by date, location, category, price range</li>
                  <li>Search functionality across event names and descriptions</li>
                  <li>Sort by popularity, date, price, or tickets available</li>
                  <li>Event categories and tags for better discovery</li>
                  <li>Direct ticket purchase from the listing page</li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
