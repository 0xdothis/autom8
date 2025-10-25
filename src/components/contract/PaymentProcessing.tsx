/**
 * Payment Processing Component
 * Modern UI for worker payment distribution and transaction tracking
 * Glassmorphic design with transaction status cards
 */

'use client';

import { useState, useEffect } from 'react';
import { usePayments, useWorkers } from '@/hooks/useContracts';

interface PaymentProcessingProps {
  proxyAddress: string;
  eventId?: string;
}

export default function PaymentProcessing({ proxyAddress, eventId }: Readonly<PaymentProcessingProps>) {
  const { processPayments, loading: paymentLoading } = usePayments(proxyAddress);
  const { workers, loadWorkers, loading: workersLoading } = useWorkers(proxyAddress, eventId);
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadWorkers();
  }, [loadWorkers]);

  const unpaidWorkers = workers.filter(w => !w.paid);
  const paidWorkers = workers.filter(w => w.paid);

  const totalPending = unpaidWorkers.reduce((sum, worker) => 
    sum + Number.parseFloat(worker.formattedSalary || '0'), 0
  );

  const totalPaid = paidWorkers.reduce((sum, worker) => 
    sum + Number.parseFloat(worker.formattedSalary || '0'), 0
  );

  const handleToggleWorker = (workerAddress: string) => {
    setSelectedWorkers(prev => 
      prev.includes(workerAddress)
        ? prev.filter(addr => addr !== workerAddress)
        : [...prev, workerAddress]
    );
  };

  const handleSelectAll = () => {
    if (selectedWorkers.length === unpaidWorkers.length) {
      setSelectedWorkers([]);
    } else {
      setSelectedWorkers(unpaidWorkers.map(w => w.employee));
    }
  };

  const handlePayAll = async () => {
    setProcessing(true);
    setErrors({});
    try {
      await processPayments();
      setSuccessMessage('All payments processed successfully!');
      await loadWorkers();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setErrors({ batch: error.message || 'Payment failed' });
    } finally {
      setProcessing(false);
    }
  };

  const loading = paymentLoading || workersLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Payment Processing</h2>
          <p className="text-foreground/60 mt-1">
            {eventId ? 'Event worker payments' : 'Organization payments'}
          </p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="glass-card p-4 border-l-4 border-success bg-success/5 slide-in">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-success font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 glass rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{unpaidWorkers.length}</p>
              <p className="text-sm text-foreground/60">Pending Payments</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 glass rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalPending.toFixed(3)}</p>
              <p className="text-sm text-foreground/60">ETH Pending</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 glass rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalPaid.toFixed(3)}</p>
              <p className="text-sm text-foreground/60">ETH Paid</p>
            </div>
          </div>
        </div>
      </div>

      {/* Batch Actions */}
      {unpaidWorkers.length > 0 && (
        <div className="glass-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedWorkers.length === unpaidWorkers.length && unpaidWorkers.length > 0}
                onChange={handleSelectAll}
                className="w-5 h-5 rounded border-foreground/20 bg-background/50"
              />
              <span className="text-foreground">
                {selectedWorkers.length > 0 
                  ? `${selectedWorkers.length} selected`
                  : 'Select all'
                }
              </span>
            </div>

            {selectedWorkers.length > 0 && (
              <button
                onClick={handlePayAll}
                disabled={processing}
                className="btn-primary"
              >
                {processing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-background/20 border-t-background rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <>
                    Pay All Workers
                  </>
                )}
              </button>
            )}
          </div>

          {errors.batch && (
            <div className="glass p-3 border-l-4 border-error bg-error/5 mb-4">
              <p className="text-error text-sm">{errors.batch}</p>
            </div>
          )}
        </div>
      )}

      {/* Pending Payments */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-foreground mb-6">Pending Payments</h3>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-foreground/60">Loading payments...</p>
          </div>
        ) : unpaidWorkers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 glass rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">All Caught Up!</h3>
            <p className="text-foreground/60">No pending payments at this time</p>
          </div>
        ) : (
          <div className="space-y-3">
            {unpaidWorkers.map((worker, index) => (
              <div 
                key={worker.employee}
                className="glass p-4 rounded-lg slide-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedWorkers.includes(worker.employee)}
                      onChange={() => handleToggleWorker(worker.employee)}
                      className="w-5 h-5 rounded border-foreground/20 bg-background/50"
                      disabled={processing}
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-foreground">
                          {worker.employee.slice(0, 6)}...{worker.employee.slice(-4)}
                        </p>
                        <span className="px-2 py-0.5 rounded-full glass text-xs">
                          {worker.description}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/60 font-mono">{worker.employee}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">{worker.formattedSalary} USDT</p>
                    </div>
                  </div>
                </div>

                {errors[worker.employee] && (
                  <div className="mt-3 glass p-2 border-l-4 border-error bg-error/5">
                    <p className="text-error text-xs">{errors[worker.employee]}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment History */}
      {paidWorkers.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-foreground mb-6">Payment History</h3>
          <div className="space-y-3">
            {paidWorkers.map((worker, index) => (
              <div 
                key={worker.employee}
                className="glass p-4 rounded-lg slide-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-foreground">
                          {worker.employee.slice(0, 6)}...{worker.employee.slice(-4)}
                        </p>
                        <span className="px-2 py-0.5 rounded-full glass text-xs">
                          {worker.description}
                        </span>
                      </div>
                      <p className="text-xs text-foreground/60">
                        Paid
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{worker.formattedSalary} USDT</p>
                    <p className="text-xs text-success">Completed</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
