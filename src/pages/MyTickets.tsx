import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import Button from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import { useTickets } from '../hooks';
import { formatAddress } from '../lib/utils';
import {Header} from '../components/layout/Header';

interface TicketWithEvent {
  tokenId: bigint;
  eventId: bigint;
  eventName: string;
  proxyAddress: string;
  startTime: bigint;
  endTime: bigint;
  ticketPrice: bigint;
  status: 'upcoming' | 'active' | 'ended';
}

export default function MyTickets() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { success, error, info } = useToast();
  const {
    transferTicket,
    isBuying: isTransferring,
    isConfirming,
    isConfirmed,
    ticketAddress
  } = useTickets();
  
  const [tickets] = useState<TicketWithEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'active' | 'ended'>('all');
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketWithEvent | null>(null);
  const [transferTo, setTransferTo] = useState('');

  // Fetch tickets for all user organizations
  useEffect(() => {
    const fetchTickets = async () => {
      if (!address || !ticketAddress) {
        setIsLoading(false);
        return;
      }
      
      // TODO: In production, fetch actual tickets from blockchain:
      // 1. Query Transfer events from EventTicket contract
      // 2. Filter for transfers TO the user's address
      // 3. Get event details for each tokenId
      // 4. Build TicketWithEvent array
      
      // For now, using placeholder
      setIsLoading(false);
    };

    fetchTickets();
  }, [address, ticketAddress]);

  // Handle successful transfer
  useEffect(() => {
    if (isConfirmed) {
      success('Ticket transferred successfully!');
      setIsTransferModalOpen(false);
      setTransferTo('');
      setSelectedTicket(null);
      // Refetch tickets
      window.location.reload();
    }
  }, [isConfirmed, success]);

  const handleTransfer = async () => {
    if (!selectedTicket || !address || !transferTo) {
      error('Please enter a valid address');
      return;
    }

    // Validate ethereum address
    if (!/^0x[a-fA-F0-9]{40}$/.test(transferTo)) {
      error('Invalid Ethereum address');
      return;
    }

    try {
      info('Transferring ticket...');
      await transferTicket(address, transferTo as `0x${string}`, selectedTicket.tokenId);
    } catch (err) {
      console.error('Failed to transfer ticket:', err);
      error('Failed to transfer ticket');
    }
  };

  const generateQRCode = (tokenId: bigint) => {
    // In production, use a QR code library
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TICKET-${tokenId}`;
  };

  const getStatusColor = (status: string) => {
    if (status === 'active') return 'success';
    if (status === 'upcoming') return 'info';
    return 'default';
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-custom py-12">
          <Card>
            <CardBody>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Wallet Not Connected</h2>
                <p className="text-gray-600 mb-6">
                  Please connect your wallet to view your tickets.
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header/>
      <div className="container-custom py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            
            <h1 className="text-4xl font-bold mb-2">My Tickets</h1>
            <p className="text-gray-600">Your NFT event tickets collection</p>
          </div>
          
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 border-b">
          {(['all', 'upcoming', 'active', 'ended'] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-6 py-3 font-medium transition-colors relative ${
                filter === filterOption
                  ? 'text-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              {filter === filterOption && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
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

        {/* Empty State */}
        {!isLoading && filteredTickets.length === 0 && (
          <Card>
            <CardBody>
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎫</div>
                <h2 className="text-2xl font-bold mb-2">No Tickets Found</h2>
                <p className="text-gray-600 mb-6">
                  {filter === 'all'
                    ? "You don't have any tickets yet. Browse events to get started!"
                    : `You don't have any ${filter} tickets.`}
                </p>
                <Button onClick={() => navigate('/events')}>Browse Events</Button>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Tickets Grid */}
        {!isLoading && filteredTickets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTickets.map((ticket) => (
              <Card key={ticket.tokenId.toString()} hover>
                <CardBody>
                  {/* QR Code */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-center justify-center">
                    <img
                      src={generateQRCode(ticket.tokenId)}
                      alt="Ticket QR Code"
                      className="w-48 h-48"
                    />
                  </div>

                  {/* Ticket Info */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-lg flex-1">{ticket.eventName}</h3>
                      <Badge variant={getStatusColor(ticket.status)}>
                        {ticket.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Token ID</span>
                        <span className="font-medium">#{ticket.tokenId.toString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Event ID</span>
                        <span className="font-medium">#{ticket.eventId.toString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price Paid</span>
                        <span className="font-medium">
                          {ticket.ticketPrice === BigInt(0)
                            ? 'FREE'
                            : `${formatEther(ticket.ticketPrice)} ETH`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Organization</span>
                        <span className="font-medium">
                          {formatAddress(ticket.proxyAddress as `0x${string}`)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Start Time</span>
                        <span className="font-medium">
                          {new Date(Number(ticket.startTime) * 1000).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          navigate(`/events/${ticket.proxyAddress}/${ticket.eventId}`)
                        }
                        className="flex-1"
                      >
                        View Event
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setIsTransferModalOpen(true);
                        }}
                        className="flex-1"
                      >
                        Transfer
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* Demo Info Card */}
        <Card className="mt-8 border-2 border-blue-100 bg-blue-50">
          <CardBody>
            <div className="flex items-start gap-4">
              <div className="text-3xl">ℹ️</div>
              <div>
                <h3 className="font-semibold mb-2">Demo Mode</h3>
                <p className="text-sm text-gray-700">
                  In production, this page would fetch your actual NFT tickets from the blockchain
                  by listening to ticket mint events and querying the EventTicket contract. Each
                  ticket would include a QR code for event check-in and full transfer capabilities.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Transfer Modal */}
      <Modal
        isOpen={isTransferModalOpen}
        onClose={() => {
          setIsTransferModalOpen(false);
          setTransferTo('');
          setSelectedTicket(null);
        }}
        title="Transfer Ticket"
      >
        <div className="space-y-4">
          {selectedTicket && (
            <Card>
              <CardBody>
                <p className="text-sm text-gray-600 mb-2">Transferring ticket for:</p>
                <p className="font-semibold">{selectedTicket.eventName}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Token ID: #{selectedTicket.tokenId.toString()}
                </p>
              </CardBody>
            </Card>
          )}

          <Input
            label="Recipient Address"
            placeholder="0x..."
            value={transferTo}
            onChange={(e) => setTransferTo(e.target.value)}
            helperText="Enter the Ethereum address of the recipient"
            disabled={isTransferring || isConfirming}
          />

          {(isTransferring || isConfirming) && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                {isTransferring && '⏳ Waiting for wallet confirmation...'}
                {isConfirming && '⏳ Transaction confirming on blockchain...'}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsTransferModalOpen(false);
                setTransferTo('');
                setSelectedTicket(null);
              }}
              className="flex-1"
              disabled={isTransferring || isConfirming}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTransfer}
              disabled={!transferTo || transferTo.length !== 42 || isTransferring || isConfirming}
              loading={isTransferring || isConfirming}
              className="flex-1"
            >
              Transfer Ticket
            </Button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>Warning:</strong> Once transferred, you will no longer own this ticket and
              cannot access the event.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
