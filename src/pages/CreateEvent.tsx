import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';
import { useFactory, useEvents } from '../hooks';

type EventType = 'FREE' | 'PAID';

interface EventFormData {
  name: string;
  description: string;
  location: string;
  ticketPrice: string;
  maxTickets: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  eventType: EventType;
  expenses: string;
  tags: string;
  category: string;
}

const STEPS = [
  { id: 1, title: 'Basic Info', description: 'Event details' },
  { id: 2, title: 'Date & Time', description: 'When it happens' },
  { id: 3, title: 'Ticketing', description: 'Ticket configuration' },
  { id: 4, title: 'Budget', description: 'Financial planning' },
  { id: 5, title: 'Review', description: 'Confirm details' },
];

export default function CreateEvent() {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const { info, success, error } = useToast();
  const { userOrganizations, isLoadingOrgs } = useFactory();
  const [selectedOrg, setSelectedOrg] = useState<`0x${string}` | ''>('');
  const [currentStep, setCurrentStep] = useState(1);

  const { createEvent, isCreating, isConfirming, isConfirmed, transactionHash, createError } = useEvents(
    selectedOrg as `0x${string}`
  );

  console.log(selectedOrg);

  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    description: '',
    location: '',
    ticketPrice: '0',
    maxTickets: '100',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    category: '',
    tags: "",
    eventType: 'PAID',
    expenses: '0',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({});

  // Auto-select first organization
  useEffect(() => {
    if (userOrganizations.length > 0 && !selectedOrg) {
      setSelectedOrg(userOrganizations[0]);
    }
  }, [userOrganizations, selectedOrg]);

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && transactionHash) {
      success('Event created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
  }, [isConfirmed, transactionHash, navigate, success]);

  // Handle transaction errors
  useEffect(() => {
    if (createError) {
      error(`Failed to create event: ${createError.message}`);
    }
  }, [createError, error]);

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof EventFormData, string>> = {};

    switch (step) {
      case 1: // Basic Info
        if (!formData.name.trim() || formData.name.length < 3) {
          newErrors.name = 'Event name must be at least 3 characters';
        }
        if (!formData.description.trim() || formData.description.length < 10) {
          newErrors.description = 'Description must be at least 10 characters';
        }
        if (!formData.location.trim()) {
          newErrors.location = 'Location is required';
        }
        if(formData.tags.length === 0) {
          newErrors.tags = "Supply at least on tag"
        }
        if(!formData.category.trim()) {
          newErrors.category = "Input a category"
        }
        break;

      case 2: // Date & Time
        if (!formData.startDate) {
          newErrors.startDate = 'Start date is required';
        }
        if (!formData.startTime) {
          newErrors.startTime = 'Start time is required';
        }
        if (!formData.endDate) {
          newErrors.endDate = 'End date is required';
        }
        if (!formData.endTime) {
          newErrors.endTime = 'End time is required';
        }
        if (formData.startDate && formData.endDate) {
          const start = new Date(`${formData.startDate}T${formData.startTime || '00:00'}`);
          const end = new Date(`${formData.endDate}T${formData.endTime || '00:00'}`);
          if (start >= end) {
            newErrors.endDate = 'End date must be after start date';
          }
        }
        break;

      case 3: { // Ticketing
        const maxTickets = Number.parseInt(formData.maxTickets);
        if (Number.isNaN(maxTickets) || maxTickets < 1) {
          newErrors.maxTickets = 'Must have at least 1 ticket';
        }
        if (formData.eventType === 'PAID') {
          const price = Number.parseFloat(formData.ticketPrice);
          if (Number.isNaN(price) || price <= 0) {
            newErrors.ticketPrice = 'Price must be greater than 0';
          }
        }
        break;
      }

      case 4: { // Budget
        const expenses = Number.parseFloat(formData.expenses);
        if (Number.isNaN(expenses) || expenses < 0) {
          newErrors.expenses = 'Expenses cannot be negative';
        }
        break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleInputChange = (field: keyof EventFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(5) || !selectedOrg) return;

    try {
      // Convert dates to timestamps
      const startTimestamp = Math.floor(
        new Date(`${formData.startDate}T${formData.startTime}`).getTime() / 1000
      );
      const endTimestamp = Math.floor(
        new Date(`${formData.endDate}T${formData.endTime}`).getTime() / 1000
      );

      //convert tags to array
      let tagsArray = formData.tags.split(",");
      const removeWhiteSpace = tagsArray.map(tag => tag.trim());
      tagsArray = removeWhiteSpace;

      // Create ticket URI (IPFS metadata)
      const ticketMetadata = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        image: `https://via.placeholder.com/400x300?text=${encodeURIComponent(formData.name)}`,
      };
      const ticketUri = `data:application/json;base64,${btoa(JSON.stringify(ticketMetadata))}`;

      info('Waiting for wallet confirmation...');

      await createEvent({
        name: formData.name,
        ticketPrice: BigInt(Math.floor(Number.parseFloat(formData.ticketPrice) * 1e18)), // Convert to wei
        maxTickets: BigInt(formData.maxTickets),
        startTime: BigInt(startTimestamp),
        endTime: BigInt(endTimestamp),
        _location: formData.location,
        _tags: tagsArray,
        _category: formData.category,
        ticketUri,
        eventType: formData.eventType === 'PAID' ? 0 : 1, // 0 = PAID, 1 = FREE
        amountNeeded: BigInt(Math.floor(Number.parseFloat(formData.expenses) * 1e18)),
      });
    } catch (err) {
      console.error('Create event error:', err);
      error('Failed to create event. Please try again.');
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Wallet Not Connected</h2>
              <p className="text-gray-600 mb-6">
                Please connect your wallet to create an event.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (isLoadingOrgs) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (userOrganizations.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">No Organization Found</h2>
              <p className="text-gray-600 mb-6">
                You need to create an organization before creating events.
              </p>
              <Button onClick={() => navigate('/create-organization')}>
                Create Organization
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="org-select" className="block text-sm font-medium mb-2">
                Organization <span className="text-red-500">*</span>
              </label>
              <select
                id="org-select"
                value={selectedOrg}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedOrg(e.target.value as `0x${string}`)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                {userOrganizations.map((org) => (
                  <option key={org} value={org}>
                    {org.slice(0, 6)}...{org.slice(-4)}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Event Name"
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={errors.name}
              placeholder="Summer Music Festival 2025"
            />

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent min-h-[120px] ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe your event..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            <Input
              label="Location"
              required
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              error={errors.location}
              placeholder="Central Park, New York"
            />

                        <Input
              label="Category"
              required
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              error={errors.category}
              placeholder="Tech"
            />

                        <Input
              label="Tags"
              required
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              error={errors.tags}
              placeholder="Input a tags seperate by comma e.g web3, tech"
            />


          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                error={errors.startDate}
              />
              <Input
                label="Start Time"
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                error={errors.startTime}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="End Date"
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                error={errors.endDate}
              />
              <Input
                label="End Time"
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                error={errors.endTime}
              />
            </div>

            <Card className="border-2">
              <CardBody>
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> All times are in your local timezone. The event will be
                  stored on the blockchain using UTC timestamps.
                </p>
              </CardBody>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <div className="block text-sm font-medium mb-3">
                Event Type <span className="text-red-500">*</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleInputChange('eventType', 'PAID')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    formData.eventType === 'PAID'
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-semibold mb-1">Paid Event</div>
                  <div className="text-sm opacity-80">Charge for tickets</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleInputChange('eventType', 'FREE');
                    handleInputChange('ticketPrice', '0');
                  }}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    formData.eventType === 'FREE'
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-semibold mb-1">Free Event</div>
                  <div className="text-sm opacity-80">No charge</div>
                </button>
              </div>
            </div>

            {formData.eventType === 'PAID' && (
              <Input
                label="Ticket Price (ETH)"
                type="number"
                required
                value={formData.ticketPrice}
                onChange={(e) => handleInputChange('ticketPrice', e.target.value)}
                error={errors.ticketPrice}
                placeholder="0.05"
                step="0.001"
              />
            )}

            <Input
              label="Maximum Tickets"
              type="number"
              required
              value={formData.maxTickets}
              onChange={(e) => handleInputChange('maxTickets', e.target.value)}
              error={errors.maxTickets}
              placeholder="100"
            />

            <Card className="border-2">
              <CardBody>
                <div className="text-sm space-y-2">
                  <p className="font-semibold">Revenue Calculation:</p>
                  <p className="text-gray-600">
                    Max Revenue:{' '}
                    {(Number.parseFloat(formData.ticketPrice || '0') * Number.parseInt(formData.maxTickets || '0')).toFixed(4)}{' '}
                    ETH
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Input
              label="Expected Expenses (ETH)"
              type="number"
              required
              value={formData.expenses}
              onChange={(e) => handleInputChange('expenses', e.target.value)}
              error={errors.expenses}
              placeholder="1.5"
              step="0.01"
              helperText="Total expected costs (venue, staff, equipment, etc.)"
            />

            <Card className="border-2">
              <CardBody>
                <div className="space-y-3">
                  <h4 className="font-semibold">Financial Overview</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Expected Revenue</p>
                      <p className="font-semibold">
                        {(Number.parseFloat(formData.ticketPrice || '0') * Number.parseInt(formData.maxTickets || '0')).toFixed(4)}{' '}
                        ETH
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Expected Expenses</p>
                      <p className="font-semibold">{Number.parseFloat(formData.expenses || '0').toFixed(4)} ETH</p>
                    </div>
                    <div className="col-span-2 pt-3 border-t">
                      <p className="text-gray-600">Projected Profit/Loss</p>
                      <p className={`font-semibold text-lg ${(() => {
                        const revenue = Number.parseFloat(formData.ticketPrice || '0') * Number.parseInt(formData.maxTickets || '0');
                        const expenses = Number.parseFloat(formData.expenses || '0');
                        return (revenue - expenses) >= 0 ? 'text-green-600' : 'text-red-600';
                      })()}`}>
                        {(() => {
                          const revenue = Number.parseFloat(formData.ticketPrice || '0') * Number.parseInt(formData.maxTickets || '0');
                          const expenses = Number.parseFloat(formData.expenses || '0');
                          return (revenue - expenses).toFixed(4);
                        })()}{' '}
                        ETH
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="border-2">
              <CardBody>
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> These expenses will be used to calculate worker payouts and
                  sponsor returns when the event ends.
                </p>
              </CardBody>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Summary</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{formData.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <Badge variant={formData.eventType === 'PAID' ? 'success' : 'info'}>
                          {formData.eventType}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Schedule</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Starts:</span>
                        <span className="font-medium">
                          {formData.startDate} at {formData.startTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ends:</span>
                        <span className="font-medium">
                          {formData.endDate} at {formData.endTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Ticketing</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-medium">{formData.ticketPrice} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Max Tickets:</span>
                        <span className="font-medium">{formData.maxTickets}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Max Revenue:</span>
                        <span className="font-medium">
                          {(Number.parseFloat(formData.ticketPrice || '0') * Number.parseInt(formData.maxTickets || '0')).toFixed(4)}{' '}
                          ETH
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Budget</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expenses:</span>
                        <span className="font-medium">{formData.expenses} ETH</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {isCreating || isConfirming ? (
              <Card className="border-2">
                <CardBody>
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="font-semibold">
                      {isCreating ? 'Waiting for confirmation...' : 'Creating event...'}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Please confirm the transaction in your wallet
                    </p>
                  </div>
                </CardBody>
              </Card>
            ) : null}

            {transactionHash && (
              <Card className="border-2">
                <CardBody>
                  <p className="text-sm">
                    <strong>Transaction Hash:</strong>{' '}
                    <a
                      href={`https://sepolia-blockscout.lisk.com/tx/${transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
                    </a>
                  </p>
                </CardBody>
              </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Create Event</h1>
        <p className="text-gray-600">Set up your event in 5 simple steps</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${(() => {
                    if (currentStep > step.id) return 'bg-green-500 text-white';
                    if (currentStep === step.id) return 'bg-black text-white';
                    return 'bg-gray-200 text-gray-500';
                  })()}`}
                >
                  {currentStep > step.id ? '✓' : step.id}
                </div>
                <div className="mt-2 text-center">
                  <p className={`text-sm font-medium ${currentStep === step.id ? 'text-black' : 'text-gray-500'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400">{step.description}</p>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <Card>
        <CardBody>
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="secondary"
              onClick={handlePrevious}
              disabled={currentStep === 1 || isCreating || isConfirming}
            >
              Previous
            </Button>

            {currentStep < 5 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isCreating || isConfirming || isConfirmed}
                loading={isCreating || isConfirming}
              >
                {(() => {
                  if (isCreating) return 'Confirming...';
                  if (isConfirming) return 'Creating...';
                  if (isConfirmed) return 'Created!';
                  return 'Create Event';
                })()}
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
