import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';
import { useEvents, useTickets } from '../hooks';
import { formatAddress } from '../lib/utils';

export default function EventDetails() {
  const { eventId, proxyAddress } = useParams<{ eventId: string; proxyAddress: string }>();
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const { info, success, error } = useToast();
  
  const { events, isLoadingEvents } = useEvents(proxyAddress as `0x${string}`);
  const { 
    buyTicket, 
    isBuying, 
    isConfirming: isConfirmingPurchase, 
    isConfirmed: isPurchaseConfirmed,
    transactionHash: purchaseHash,
    buyError
  } = useTickets();

  const [event, setEvent] = useState<any>(null);

  // Find the specific event
  useEffect(() => {
    if (events.length > 0 && eventId) {
      const foundEvent = events.find((e: any) => e.id === BigInt(eventId));
      setEvent(foundEvent || null);
    }
  }, [events, eventId]);

  // Handle purchase confirmation
  useEffect(() => {
    if (isPurchaseConfirmed && purchaseHash) {
      success('Ticket purchased successfully!');
    }
  }, [isPurchaseConfirmed, purchaseHash, success]);

  // Handle purchase errors
  useEffect(() => {
    if (buyError) {
      error(`Failed to purchase ticket: ${buyError.message}`);
    }
  }, [buyError, error]);

  const handleBuyTicket = async () => {
    if (!event || !proxyAddress || !eventId) return;

    try {
      info('Waiting for wallet confirmation...');
      
      await buyTicket(BigInt(eventId));
    } catch (err) {
      console.error('Buy ticket error:', err);
      error('Failed to purchase ticket. Please try again.');
    }
  };

  const getEventStatus = () => {
    if (!event) return 'unknown';
    const now = Math.floor(Date.now() / 1000);
    if (event.startTime > now) return 'upcoming';
    if (event.endTime < now) return 'ended';
    return 'active';
  };

  const getStatusBadgeVariant = (status: string) => {
    if (status === 'active') return 'success';
    if (status === 'upcoming') return 'info';
    return 'default';
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoadingEvents) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-custom py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-custom py-12">
          <Card>
            <CardBody>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
                <p className="text-gray-600 mb-6">
                  The event you're looking for doesn't exist or has been removed.
                </p>
                <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  const status = getEventStatus();
  const ticketsRemaining = Number(event.maxTickets - event.ticketsSold);
  const ticketsPercentageSold = (Number(event.ticketsSold) / Number(event.maxTickets)) * 100;
  const isFreeEvent = event.ticketPrice === BigInt(0);
  const canBuyTicket = status !== 'ended' && ticketsRemaining > 0;
  // Note: We need NFT contract integration to check actual ticket ownership
  const userOwnsTicket = false;

  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-black mb-6 transition-colors"
        >
          <span className="mr-2">←</span> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Header */}
            <Card>
              <CardBody>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{event.name}</h1>
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusBadgeVariant(status)}>
                        {status.toUpperCase()}
                      </Badge>
                      <Badge variant={isFreeEvent ? 'info' : 'success'}>
                        {isFreeEvent ? 'FREE' : 'PAID'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Event Image Placeholder */}
                <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-6">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🎉</div>
                    <p className="text-gray-500 font-medium">{event.name}</p>
                  </div>
                </div>

                {/* Event Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Start Time</h3>
                    <p className="text-lg font-semibold">{formatDate(event.startTime)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">End Time</h3>
                    <p className="text-lg font-semibold">{formatDate(event.endTime)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Ticket Price</h3>
                    <p className="text-lg font-semibold">
                      {isFreeEvent ? 'FREE' : `${formatEther(event.ticketPrice)} ETH`}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Tickets Sold</h3>
                    <p className="text-lg font-semibold">
                      {event.ticketsSold.toString()} / {event.maxTickets.toString()}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Tickets Available</span>
                    <span className="font-semibold">{ticketsRemaining} remaining</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-black h-3 rounded-full transition-all duration-300"
                      style={{ width: `${ticketsPercentageSold}%` }}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Event Information */}
            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    Join us for an amazing event! This event is organized through our decentralized
                    platform, ensuring transparent ticketing and secure transactions.
                  </p>
                  <div className="mt-6 space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Event Details</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Event ID: #{eventId}</li>
                        <li>Organization: {formatAddress(proxyAddress as `0x${string}`)}</li>
                        <li>Total Revenue: {formatEther(BigInt(event.ticketPrice) * BigInt(event.ticketsSold))} ETH</li>
                        <li>Event Type: {event.eventType === 0 ? 'Paid' : 'Free'}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card>
              <CardBody>
                <h3 className="text-xl font-bold mb-4">Get Your Ticket</h3>
                
                {!isConnected ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Connect your wallet to purchase tickets</p>
                  </div>
                ) : userOwnsTicket ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">✓</div>
                    <p className="font-semibold text-green-600 mb-2">You own a ticket!</p>
                    <p className="text-sm text-gray-600 mb-4">
                      You've already purchased a ticket for this event
                    </p>
                    <Button
                      variant="secondary"
                      onClick={() => navigate('/my-tickets')}
                      className="w-full"
                    >
                      View My Tickets
                    </Button>
                  </div>
                ) : !canBuyTicket ? (
                  <div className="text-center py-8">
                    <p className="font-semibold text-gray-600 mb-2">
                      {status === 'ended' ? 'Event Has Ended' : 'Sold Out'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {status === 'ended'
                        ? 'This event has already ended'
                        : 'All tickets have been sold'}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Price per ticket</span>
                        <span className="text-2xl font-bold">
                          {isFreeEvent ? 'FREE' : `${formatEther(event.ticketPrice)} ETH`}
                        </span>
                      </div>
                      {!isFreeEvent && (
                        <p className="text-xs text-gray-500">+ gas fees</p>
                      )}
                    </div>

                    <Button
                      onClick={handleBuyTicket}
                      disabled={isBuying || isConfirmingPurchase || isPurchaseConfirmed}
                      loading={isBuying || isConfirmingPurchase}
                      className="w-full"
                    >
                      {(() => {
                        if (isBuying) return 'Confirming...';
                        if (isConfirmingPurchase) return 'Processing...';
                        if (isPurchaseConfirmed) return 'Purchased!';
                        return 'Buy Ticket';
                      })()}
                    </Button>

                    {purchaseHash && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>Success!</strong> Transaction confirmed
                        </p>
                        <a
                          href={`https://sepolia-blockscout.lisk.com/tx/${purchaseHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline block mt-1"
                        >
                          View on Explorer →
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Event Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Event Statistics</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Tickets</span>
                    <span className="font-semibold">{event.maxTickets.toString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tickets Sold</span>
                    <span className="font-semibold">{event.ticketsSold.toString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining</span>
                    <span className="font-semibold">{ticketsRemaining}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Revenue</span>
                      <span className="font-semibold">
                        {formatEther(BigInt(event.ticketPrice) * BigInt(event.ticketsSold))} ETH
                      </span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Share Card */}
            <Card>
              <CardBody>
                <h4 className="font-semibold mb-3">Share This Event</h4>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1">
                    Twitter
                  </Button>
                  <Button variant="secondary" size="sm" className="flex-1">
                    Copy Link
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
