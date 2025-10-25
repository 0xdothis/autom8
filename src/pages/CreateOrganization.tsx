import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Button, Input, Card, CardHeader, CardTitle, CardBody, useToast } from '@/components/ui';
import { useFactory } from '@/hooks';
import { getBlockExplorerUrl } from '@/lib/utils';
import { Footer } from '@/components/layout';

export default function CreateOrganization() {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const { success, error: showError, info } = useToast();
  const [orgName, setOrgName] = useState('');
  const [nameError, setNameError] = useState('');

  const {
    createOrganization,
    isCreating,
    isConfirming,
    isConfirmed,
    createError,
    transactionHash,
    userOrganizations,
  } = useFactory();

  // Validate organization name
  const validateName = (name: string): boolean => {
    if (!name.trim()) {
      setNameError('Organization name is required');
      return false;
    }
    if (name.trim().length < 3) {
      setNameError('Name must be at least 3 characters');
      return false;
    }
    if (name.trim().length > 50) {
      setNameError('Name must be less than 50 characters');
      return false;
    }
    setNameError('');
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      showError('Please connect your wallet first');
      return;
    }

    if (!validateName(orgName)) {
      return;
    }

    try {
      info('Waiting for wallet confirmation...');
      await createOrganization(orgName.trim());
    } catch (err) {
      console.error('Failed to create organization:', err);
      showError('Failed to create organization. Please try again.');
    }
  };

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirming) {
      info('Transaction submitted. Waiting for confirmation...');
    }
  }, [isConfirming, info]);

  // Handle successful creation
  useEffect(() => {
    if (isConfirmed && transactionHash) {
      success('Organization created successfully!');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
  }, [isConfirmed, transactionHash, success, navigate]);

  // Handle errors
  useEffect(() => {
    if (createError) {
      const errorMessage = createError.message || 'Transaction failed';
      showError(errorMessage);
    }
  }, [createError, showError]);

  return (
    <>
    <div className="container-custom py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Create Organization</h1>
          <p className="text-gray-600">
            Deploy your organization proxy contract to start creating events
          </p>
        </div>

        {/* Wallet Connection Check */}
        {!isConnected && (
          <Card className="mb-6">
            <CardBody>
              <div className="text-center py-4">
                <p className="text-gray-600 mb-4">
                  Please connect your wallet to create an organization
                </p>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Existing Organizations Info */}
        {isConnected && userOrganizations.length > 0 && (
          <Card className="mb-6">
            <CardBody>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    You have {userOrganizations.length} organization{userOrganizations.length === 1 ? '' : 's'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    You can create multiple organizations to manage different event portfolios
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Create Organization Form */}
        <Card>
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                id="org-name"
                label="Organization Name"
                placeholder="e.g., Tech Events Inc, Music Festival Co."
                value={orgName}
                onChange={(e) => {
                  setOrgName(e.target.value);
                  if (nameError) validateName(e.target.value);
                } }
                error={nameError}
                helperText="Choose a unique name for your organization"
                required
                disabled={isCreating || isConfirming} />

              {/* Transaction Status */}
              {(isCreating || isConfirming || isConfirmed) && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="space-y-2">
                    {isCreating && (
                      <p className="text-sm text-gray-700">
                        ⏳ Waiting for wallet confirmation...
                      </p>
                    )}
                    {isConfirming && transactionHash && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-700">
                          ⏳ Transaction confirming...
                        </p>
                        <a
                          href={getBlockExplorerUrl(transactionHash, 'tx')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          View on Explorer →
                        </a>
                      </div>
                    )}
                    {isConfirmed && (
                      <p className="text-sm text-green-700 font-medium">
                        ✅ Organization created! Redirecting...
                      </p>
                    )}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isCreating || isConfirming}
                disabled={!isConnected || isConfirmed}
              >
                {(() => {
                  if (isCreating) return 'Waiting for Confirmation...';
                  if (isConfirming) return 'Deploying...';
                  if (isConfirmed) return 'Organization Created!';
                  return 'Deploy Organization';
                })()}
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* Info Section */}
        <div className="mt-6 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-sm mb-2">What happens next?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-black mr-2">1.</span>
                <span>A proxy contract will be deployed to the blockchain</span>
              </li>
              <li className="flex items-start">
                <span className="text-black mr-2">2.</span>
                <span>You'll be the owner and can manage all aspects</span>
              </li>
              <li className="flex items-start">
                <span className="text-black mr-2">3.</span>
                <span>You can create events, add workers, and accept sponsorships</span>
              </li>
              <li className="flex items-start">
                <span className="text-black mr-2">4.</span>
                <span>You'll be redirected to your dashboard to get started</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
