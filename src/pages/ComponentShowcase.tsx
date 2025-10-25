import { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge,
  Skeleton,
  SkeletonCard,
  SkeletonTable,
  useToast,
} from '@/components/ui';

/**
 * Component Showcase Page
 * This page demonstrates all UI components for development and testing
 * Remove this file in production or add to .gitignore
 */
const ComponentShowcase = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const { success, error, warning, info } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.length > 0 && value.length < 3) {
      setInputError('Must be at least 3 characters');
    } else {
      setInputError('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">UI Component Showcase</h1>
          <p className="text-gray-600">
            All reusable components with variants and states
          </p>
        </div>

        {/* Buttons */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {/* Variants */}
              <div>
                <h4 className="font-medium mb-3">Variants</h4>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h4 className="font-medium mb-3">Sizes</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              {/* States */}
              <div>
                <h4 className="font-medium mb-3">States</h4>
                <div className="flex flex-wrap gap-3">
                  <Button loading>Loading</Button>
                  <Button disabled>Disabled</Button>
                  <Button fullWidth>Full Width</Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Cards */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Cards</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card hover>
                <CardHeader border>
                  <CardTitle as="h4">Event Card</CardTitle>
                </CardHeader>
                <CardBody>
                  <p className="text-gray-700">
                    This is a card with hover effect, header, and footer.
                  </p>
                </CardBody>
                <CardFooter border>
                  <Button variant="ghost" size="sm">Cancel</Button>
                  <Button size="sm">View Details</Button>
                </CardFooter>
              </Card>

              <Card padding="lg">
                <CardTitle as="h4">Statistics Card</CardTitle>
                <p className="text-3xl font-bold mt-2">1,234</p>
                <p className="text-sm text-gray-600 mt-1">Total Events</p>
              </Card>
            </div>
          </CardBody>
        </Card>

        {/* Inputs */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4 max-w-md">
              <Input
                label="Event Name"
                placeholder="Enter event name"
                required
              />
              
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                helperText="We'll never share your email"
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />

              <Input
                label="Validated Input"
                value={inputValue}
                onChange={handleInputChange}
                error={inputError}
                placeholder="Type at least 3 characters"
              />

              <Input
                label="Disabled Input"
                disabled
                value="Cannot edit"
              />
            </div>
          </CardBody>
        </Card>

        {/* Badges */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Badges</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-3">Variants</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="info">Info</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Sizes</h4>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge size="sm">Small</Badge>
                  <Badge size="md">Medium</Badge>
                  <Badge size="lg">Large</Badge>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">With Dot (Status)</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="success" dot>Active</Badge>
                  <Badge variant="error" dot>Ended</Badge>
                  <Badge variant="warning" dot>Pending</Badge>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Modal */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Modal</CardTitle>
          </CardHeader>
          <CardBody>
            <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
            
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Example Modal"
              size="md"
            >
              <ModalHeader>Modal Content</ModalHeader>
              <ModalBody>
                <p className="text-gray-700">
                  This is a modal with title, body, and footer. It has a backdrop blur,
                  closes on escape key, and can be closed by clicking outside.
                </p>
                <Input
                  label="Example Input"
                  placeholder="You can add any content here"
                  className="mt-4"
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsModalOpen(false)}>
                  Confirm
                </Button>
              </ModalFooter>
            </Modal>
          </CardBody>
        </Card>

        {/* Toast Notifications */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Toast Notifications</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                onClick={() => success('Operation completed successfully!')}
              >
                Success Toast
              </Button>
              <Button
                variant="danger"
                onClick={() => error('An error occurred. Please try again.')}
              >
                Error Toast
              </Button>
              <Button
                variant="secondary"
                onClick={() => warning('Please review your input before submitting.')}
              >
                Warning Toast
              </Button>
              <Button
                variant="ghost"
                onClick={() => info('New feature available! Check it out.')}
              >
                Info Toast
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Skeletons */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Loading Skeletons</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Text Skeleton</h4>
                <Skeleton variant="text" count={3} />
              </div>

              <div>
                <h4 className="font-medium mb-3">Card Skeleton</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Table Skeleton</h4>
                <SkeletonTable rows={5} />
              </div>

              <div>
                <h4 className="font-medium mb-3">Custom Skeletons</h4>
                <div className="flex items-center gap-4">
                  <Skeleton variant="circular" width="4rem" height="4rem" />
                  <div className="flex-1">
                    <Skeleton variant="text" width="60%" height="1.5rem" />
                    <Skeleton variant="text" width="40%" className="mt-2" />
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Component Usage Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Example</CardTitle>
          </CardHeader>
          <CardBody>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`// Import components
import { Button, Card, Input, useToast } from '@/components/ui';

// Use in your component
const MyComponent = () => {
  const { success } = useToast();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Card</CardTitle>
      </CardHeader>
      <CardBody>
        <Input label="Name" placeholder="Enter name" />
      </CardBody>
      <CardFooter>
        <Button onClick={() => success('Saved!')}>
          Save
        </Button>
      </CardFooter>
    </Card>
  );
};`}</code>
            </pre>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ComponentShowcase;
