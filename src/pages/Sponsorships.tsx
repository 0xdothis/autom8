import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import { useFactory, useEvents, useSponsors } from '../hooks';
import { formatAddress } from '../lib/utils';

export default function Sponsorships() {
  const { address, isConnected } = useAccount();
  const { success, error, info } = useToast();
  const { userOrganizations } = useFactory();
  
  const [selectedOrg, setSelectedOrg] = useState<`0x${string}` | undefined>(undefined);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
  const [sponsorAmount, setSponsorAmount] = useState('');

  const { events } = useEvents(selectedOrg);
  const {
    sponsors,
    totalSponsorship,
    sponsorCount,
    isSponsor: userIsSponsor,
    isLoadingSponsors,
    sponsorEvent,
    isSponsoring,
    distributeReturns,
  } = useSponsors(selectedOrg);

  // Auto-select first organization
  useEffect(() => {
    if (userOrganizations.length > 0 && !selectedOrg) {
      setSelectedOrg(userOrganizations[0]);
    }
  }, [userOrganizations, selectedOrg]);

  // Auto-select first event
  useEffect(() => {
    if (events.length > 0 && !selectedEvent) {
      setSelectedEvent(events[0].id.toString());
    }
  }, [events, selectedEvent]);

  const handleSponsor = async () => {
    if (!sponsorAmount || !selectedEvent) {
      error('Please enter an amount');
      return;
    }

    try {
      info('Processing sponsorship...');
      await sponsorEvent(parseEther(sponsorAmount));
      success('Sponsorship successful!');
      setIsSponsorModalOpen(false);
      setSponsorAmount('');
    } catch (err) {
      console.error('Failed to process sponsorship:', err);
      error('Failed to process sponsorship');
    }
  };

  const handleDistributeReturns = async (eventId: string) => {
    if (!globalThis.confirm('Are you sure you want to distribute returns to sponsors?')) {
      return;
    }

    try {
      info('Distributing returns...');
      await distributeReturns(BigInt(eventId));
      success('Returns distributed successfully!');
    } catch (err) {
      console.error('Failed to distribute returns:', err);
      error('Failed to distribute returns');
    }
  };

  const calculateExpectedReturn = (amount: string) => {
    if (!amount || !selectedEvent) return '0';
    
    const event = events.find((e) => e.id.toString() === selectedEvent);
    if (!event) return '0';

    // Expected return calculation: (sponsorship / total expenses) * total revenue
    // This is simplified - actual calculation happens on-chain
    const sponsorshipAmount = Number.parseFloat(amount);
    const totalRevenue = Number(formatEther(BigInt(event.ticketPrice) * BigInt(event.ticketsSold)));
    const estimatedReturn = (sponsorshipAmount / 100) * totalRevenue; // Simplified 1% return per USDT
    
    return estimatedReturn.toFixed(4);
  };

  if (!isConnected) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Wallet Not Connected</h2>
            <p className="text-gray-600">Please connect your wallet to manage sponsorships.</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (userOrganizations.length === 0) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">No Organization Found</h2>
            <p className="text-gray-600 mb-6">
              You need to create an organization before managing sponsorships.
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">Sponsorships</h1>
          <p className="text-gray-600">Manage event sponsorships and returns</p>
        </div>
        <Button onClick={() => setIsSponsorModalOpen(true)}>Sponsor Event</Button>
      </div>

      {/* Organization Selector */}
      {userOrganizations.length > 1 && (
        <Card>
          <CardBody>
            <label htmlFor="org-selector-sponsor" className="block text-sm font-medium mb-2">
              Select Organization
            </label>
            <select
              id="org-selector-sponsor"
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value as `0x${string}`)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              {userOrganizations.map((org) => (
                <option key={org} value={org}>
                  {formatAddress(org)}
                </option>
              ))}
            </select>
          </CardBody>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardBody>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Sponsors</h3>
            <p className="text-3xl font-bold">{sponsorCount?.toString() || '0'}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Sponsorship</h3>
            <p className="text-3xl font-bold">{formatEther(totalSponsorship ?? BigInt(0))} USDT</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Your Status</h3>
            <p className="text-3xl font-bold">
              {userIsSponsor ? (
                <Badge variant="success">SPONSOR</Badge>
              ) : (
                <Badge variant="default">NOT SPONSOR</Badge>
              )}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Active Events</h3>
            <p className="text-3xl font-bold">{events.length}</p>
          </CardBody>
        </Card>
      </div>

      {/* Event Selector */}
      {events.length > 0 && (
        <Card>
          <CardBody>
            <label htmlFor="event-selector" className="block text-sm font-medium mb-2">
              Select Event
            </label>
            <select
              id="event-selector"
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              {events.map((event) => (
                <option key={event.id.toString()} value={event.id.toString()}>
                  {event.name} (#{event.id.toString()})
                </option>
              ))}
            </select>
          </CardBody>
        </Card>
      )}

      {/* Sponsors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sponsors List</CardTitle>
        </CardHeader>
        <CardBody>
          {isLoadingSponsors ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center gap-4">
                  <div className="h-12 bg-gray-200 rounded flex-1"></div>
                </div>
              ))}
            </div>
          ) : sponsors.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">No Sponsors Yet</h3>
              <p className="text-gray-600 mb-6">
                Be the first to sponsor this event and earn returns from ticket sales.
              </p>
              <Button onClick={() => setIsSponsorModalOpen(true)}>Become a Sponsor</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Address</th>
                    <th className="text-right py-3 px-4 font-semibold">Contribution</th>
                    <th className="text-right py-3 px-4 font-semibold">Returns Received</th>
                    <th className="text-center py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sponsors.map((sponsor) => (
                    <tr key={sponsor.sponsorAddress} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {formatAddress(sponsor.sponsorAddress as `0x${string}`)}
                        </code>
                        {sponsor.sponsorAddress.toLowerCase() === address?.toLowerCase() && (
                          <Badge variant="info" className="ml-2">YOU</Badge>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right font-semibold">
                        {formatEther(sponsor.contribution)} USDT
                      </td>
                      <td className="py-4 px-4 text-right text-green-600 font-semibold">
                        {formatEther(sponsor.returnsReceived || BigInt(0))} USDT
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge variant={sponsor.returnsReceived > BigInt(0) ? 'success' : 'warning'}>
                          {sponsor.returnsReceived > BigInt(0) ? 'RETURNED' : 'PENDING'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Distribution Info */}
      {sponsors.length > 0 && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Distribute Returns</h3>
                <p className="text-sm text-gray-600">
                  After the event ends, distribute returns to all sponsors based on ticket sales revenue.
                </p>
              </div>
              <Button
                onClick={() => selectedEvent && handleDistributeReturns(selectedEvent)}
                loading={isSponsoring}
                disabled={isSponsoring || !selectedEvent}
              >
                Distribute Returns
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* How It Works */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>How Sponsorships Work</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex gap-3">
              <div className="text-2xl">1️⃣</div>
              <div>
                <h4 className="font-semibold mb-1">Sponsor an Event</h4>
                <p>
                  Contribute funds to help cover event expenses and support the organizers.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">2️⃣</div>
              <div>
                <h4 className="font-semibold mb-1">Event Takes Place</h4>
                <p>
                  Tickets are sold and revenue is collected on-chain through smart contracts.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">3️⃣</div>
              <div>
                <h4 className="font-semibold mb-1">Receive Returns</h4>
                <p>
                  After the event, sponsors receive returns proportional to their contribution and
                  the event's success.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <h4 className="font-semibold mb-1">Transparent & Automated</h4>
                <p>
                  All calculations are done automatically by smart contracts, ensuring fairness and
                  transparency.
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Sponsor Modal */}
      <Modal
        isOpen={isSponsorModalOpen}
        onClose={() => {
          setIsSponsorModalOpen(false);
          setSponsorAmount('');
        }}
        title="Sponsor Event"
      >
        <div className="space-y-4">
          {selectedEvent && events.length > 0 && (
            <Card>
              <CardBody>
                <p className="text-sm text-gray-600 mb-2">Sponsoring:</p>
                <p className="font-semibold">
                  {events.find((e) => e.id.toString() === selectedEvent)?.name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Event #{selectedEvent}
                </p>
              </CardBody>
            </Card>
          )}

          <Input
            label="Sponsorship Amount (ETH)"
            type="number"
            step="0.01"
            placeholder="1.0"
            value={sponsorAmount}
            onChange={(e) => setSponsorAmount(e.target.value)}
            helperText="Amount to contribute as a sponsor"
          />

          {sponsorAmount && (
            <Card className="bg-blue-50 border-2 border-blue-200">
              <CardBody>
                <h4 className="font-semibold mb-2">Estimated Returns</h4>
                <p className="text-2xl font-bold text-blue-600">
                  ~{calculateExpectedReturn(sponsorAmount)} USDT
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  *Estimated based on current ticket sales. Actual returns may vary.
                </p>
              </CardBody>
            </Card>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setIsSponsorModalOpen(false);
                setSponsorAmount('');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSponsor}
              loading={isSponsoring}
              disabled={isSponsoring || !sponsorAmount}
              className="flex-1"
            >
              Sponsor Event
            </Button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> Sponsorship contributions are locked until the event ends and
              returns are distributed.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
