import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import { useFactory, useWorkers, useEvents } from '../hooks';
import { formatAddress } from '../lib/utils';

interface WorkerData {
  workerAddress: string;
  description: string;
  salary: bigint;
  totalPaid: bigint;
  isPaid: boolean;
}

export default function WorkerManagement() {
  const { isConnected } = useAccount();
  const { success, error, info } = useToast();
  const { userOrganizations } = useFactory();
  
  const [selectedOrg, setSelectedOrg] = useState<`0x${string}` | ''>('');
  const [selectedEventId, setSelectedEventId] = useState<string>('1');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<WorkerData | null>(null);

  // Form states
  const [workerAddress, setWorkerAddress] = useState('');
  const [workerDescription, setWorkerDescription] = useState('');
  const [workerSalary, setWorkerSalary] = useState('');
  const [newSalary, setNewSalary] = useState('');

  const {
    workers,
    workerCount,
    isLoadingWorkers,
    addWorker,
    updateWorkerSalary,
    removeWorker,
    payWorkers,
    isProcessing,
    isConfirming,
  } = useWorkers(selectedOrg || undefined);

  // Fetch events for selected organization
  const { events, isLoadingEvents } = useEvents(selectedOrg || undefined);

  // Auto-select first organization
  useEffect(() => {
    if (userOrganizations.length > 0 && !selectedOrg) {
      setSelectedOrg(userOrganizations[0]);
    }
  }, [userOrganizations, selectedOrg]);

  // Auto-select first event when events load
  useEffect(() => {
    if (events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0].id.toString());
    }
  }, [events, selectedEventId]);

  const handleAddWorker = async () => {
    if (!workerAddress || !workerDescription || !workerSalary) {
      error('Please fill in all fields');
      return;
    }

    try {
      info('Adding worker...');
      await addWorker(
        workerAddress as `0x${string}`,
        workerDescription,
        parseEther(workerSalary)
      );
      success('Worker added successfully!');
      setIsAddModalOpen(false);
      setWorkerAddress('');
      setWorkerDescription('');
      setWorkerSalary('');
    } catch (err) {
      console.error('Failed to add worker:', err);
      error('Failed to add worker');
    }
  };

  const handleUpdateSalary = async () => {
    if (!selectedWorker || !newSalary) {
      error('Please enter a valid salary');
      return;
    }

    try {
      info('Updating salary...');
      await updateWorkerSalary(
        selectedWorker.workerAddress as `0x${string}`,
        parseEther(newSalary)
      );
      success('Salary updated successfully!');
      setIsEditModalOpen(false);
      setSelectedWorker(null);
      setNewSalary('');
    } catch (err) {
      console.error('Failed to update salary:', err);
      error('Failed to update salary');
    }
  };

  const handleRemoveWorker = async (address: string) => {
    if (!globalThis.confirm('Are you sure you want to remove this worker?')) {
      return;
    }

    try {
      info('Removing worker...');
      await removeWorker(address as `0x${string}`);
      success('Worker removed successfully!');
    } catch (err) {
      console.error('Failed to remove worker:', err);
      error('Failed to remove worker');
    }
  };

  const handlePayWorkers = async () => {
    if (!selectedEventId) {
      error('Please select an event');
      return;
    }

    if (!globalThis.confirm('Are you sure you want to process payments for all workers?')) {
      return;
    }

    try {
      info('Processing payments...');
      await payWorkers(BigInt(selectedEventId));
      success('Workers paid successfully!');
    } catch (err) {
      console.error('Failed to pay workers:', err);
      error('Failed to pay workers');
    }
  };

  const totalSalaries = workers.reduce((acc, worker) => acc + worker.salary, BigInt(0));
  const totalPaid = workers.reduce((acc, worker) => acc + worker.totalPaid, BigInt(0));
  const unpaidWorkers = workers.filter((w) => !w.isPaid).length;

  if (!isConnected) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Wallet Not Connected</h2>
            <p className="text-gray-600">Please connect your wallet to manage workers.</p>
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
              You need to create an organization before managing workers.
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
          <h1 className="text-4xl font-bold mb-2">Worker Management</h1>
          <p className="text-gray-600">Manage workers and process payroll</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>Add Worker</Button>
      </div>

      {/* Organization Selector */}
      {userOrganizations.length > 1 && (
        <Card>
          <CardBody>
            <label htmlFor="org-selector" className="block text-sm font-medium mb-2">
              Select Organization
            </label>
            <select
              id="org-selector"
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

      {/* Event Selector for Payments */}
      {events.length > 0 && (
        <Card>
          <CardBody>
            <label htmlFor="event-selector" className="block text-sm font-medium mb-2">
              Select Event for Payment
            </label>
            <select
              id="event-selector"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              disabled={isLoadingEvents}
            >
              {events.map((event: any) => (
                <option key={event.id} value={event.id.toString()}>
                  {event.name || `Event #${event.id}`} (ID: {event.id.toString()})
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-2">
              Workers will be paid from this event's budget
            </p>
          </CardBody>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardBody>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Workers</h3>
            <p className="text-3xl font-bold">{workerCount?.toString() || '0'}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Unpaid Workers</h3>
            <p className="text-3xl font-bold text-orange-600">{unpaidWorkers}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Salaries</h3>
            <p className="text-3xl font-bold">{formatEther(totalSalaries)} USDT</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Paid</h3>
            <p className="text-3xl font-bold text-green-600">{formatEther(totalPaid)} USDT</p>
          </CardBody>
        </Card>
      </div>

      {/* Pay All Workers Button */}
      {unpaidWorkers > 0 && (
        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Pending Payments</h3>
                <p className="text-sm text-gray-600">
                  {unpaidWorkers} worker{unpaidWorkers > 1 ? 's' : ''} waiting for payment
                </p>
              </div>
              <Button
                onClick={handlePayWorkers}
                loading={isProcessing || isConfirming}
                disabled={isProcessing || isConfirming}
              >
                Pay All Workers
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Workers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Workers List</CardTitle>
        </CardHeader>
        <CardBody>
          {isLoadingWorkers ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center gap-4">
                  <div className="h-12 bg-gray-200 rounded flex-1"></div>
                </div>
              ))}
            </div>
          ) : workers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👷</div>
              <h3 className="text-xl font-semibold mb-2">No Workers Yet</h3>
              <p className="text-gray-600 mb-6">
                Add workers to manage your event team and process payroll.
              </p>
              <Button onClick={() => setIsAddModalOpen(true)}>Add First Worker</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Address</th>
                    <th className="text-left py-3 px-4 font-semibold">Description</th>
                    <th className="text-right py-3 px-4 font-semibold">Salary</th>
                    <th className="text-right py-3 px-4 font-semibold">Total Paid</th>
                    <th className="text-center py-3 px-4 font-semibold">Status</th>
                    <th className="text-right py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((worker) => (
                    <tr key={worker.workerAddress} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {formatAddress(worker.workerAddress as `0x${string}`)}
                        </code>
                      </td>
                      <td className="py-4 px-4">{worker.description}</td>
                      <td className="py-4 px-4 text-right font-semibold">
                        {formatEther(worker.salary)} USDT
                      </td>
                      <td className="py-4 px-4 text-right text-green-600 font-semibold">
                        {formatEther(worker.totalPaid)} USDT
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge variant={worker.isPaid ? 'success' : 'warning'}>
                          {worker.isPaid ? 'PAID' : 'PENDING'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setSelectedWorker(worker);
                              setNewSalary(formatEther(worker.salary));
                              setIsEditModalOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleRemoveWorker(worker.workerAddress)}
                            loading={isProcessing}
                          >
                            Remove
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Add Worker Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setWorkerAddress('');
          setWorkerDescription('');
          setWorkerSalary('');
        }}
        title="Add New Worker"
      >
        <div className="space-y-4">
          <Input
            label="Worker Address"
            placeholder="0x..."
            value={workerAddress}
            onChange={(e) => setWorkerAddress(e.target.value)}
            helperText="Ethereum address of the worker"
          />
          <Input
            label="Description"
            placeholder="e.g., Event Coordinator, Security Guard"
            value={workerDescription}
            onChange={(e) => setWorkerDescription(e.target.value)}
            helperText="Worker role or description"
          />
          <Input
            label="Salary (ETH)"
            type="number"
            step="0.01"
            placeholder="0.5"
            value={workerSalary}
            onChange={(e) => setWorkerSalary(e.target.value)}
            helperText="Payment amount in USDT"
          />

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setIsAddModalOpen(false);
                setWorkerAddress('');
                setWorkerDescription('');
                setWorkerSalary('');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddWorker}
              loading={isProcessing || isConfirming}
              disabled={isProcessing || isConfirming || !workerAddress || !workerDescription || !workerSalary}
              className="flex-1"
            >
              Add Worker
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Worker Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedWorker(null);
          setNewSalary('');
        }}
        title="Update Worker Salary"
      >
        <div className="space-y-4">
          {selectedWorker && (
            <Card>
              <CardBody>
                <p className="text-sm text-gray-600 mb-2">Worker:</p>
                <p className="font-semibold mb-1">{selectedWorker.description}</p>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {formatAddress(selectedWorker.workerAddress as `0x${string}`)}
                </code>
                <p className="text-sm text-gray-600 mt-3">
                  Current Salary: <span className="font-semibold">{formatEther(selectedWorker.salary)} USDT</span>
                </p>
              </CardBody>
            </Card>
          )}

          <Input
            label="New Salary (ETH)"
            type="number"
            step="0.01"
            placeholder="0.5"
            value={newSalary}
            onChange={(e) => setNewSalary(e.target.value)}
          />

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedWorker(null);
                setNewSalary('');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateSalary}
              loading={isProcessing || isConfirming}
              disabled={isProcessing || isConfirming || !newSalary}
              className="flex-1"
            >
              Update Salary
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
