/**
 * Worker Management Component
 * Modern UI for adding/removing workers and managing roles
 * Glassmorphic design with modal dialogs
 */

'use client';

import { useState, useEffect } from 'react';
import { useWorkers } from '@/hooks/useContracts';
import { isAddress } from 'viem';
import type { CreateWorkerParams } from '@/types/contracts';

interface WorkerManagementProps {
  proxyAddress: string;
  eventId?: string;
}

interface AddWorkerFormData {
  address: string;
  role: string;
  payment: string;
}

export default function WorkerManagement({ proxyAddress, eventId }: Readonly<WorkerManagementProps>) {
  const { workers, loadWorkers, addWorker, loading } = useWorkers(proxyAddress, eventId);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [formData, setFormData] = useState<AddWorkerFormData>({
    address: '',
    role: '',
    payment: '0',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadWorkers();
  }, [loadWorkers]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.address) {
      newErrors.address = 'Wallet address is required';
    } else if (!isAddress(formData.address)) {
      newErrors.address = 'Invalid wallet address';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }

    if (!formData.payment || Number.parseFloat(formData.payment) < 0) {
      newErrors.payment = 'Valid payment amount is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddWorker = async () => {
    if (!validateForm()) return;

    setProcessing(true);
    try {
      const workerParams: CreateWorkerParams = {
        salary: formData.payment,
        description: formData.role,
        employeeAddress: formData.address,
        eventId: eventId || '0',
      };
      
      await addWorker(workerParams);
      
      setShowAddModal(false);
      setFormData({ address: '', role: '', payment: '0' });
      await loadWorkers();
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to add worker' });
    } finally {
      setProcessing(false);
    }
  };

  const handleRemoveWorker = async () => {
    if (!selectedWorker) return;

    setProcessing(true);
    try {
      // Note: removeWorker functionality would need to be implemented in the hook
      // For now, we'll comment this out as it's not in the current hook
      // await removeWorker(eventId, selectedWorker.employee);
      
      setShowRemoveModal(false);
      setSelectedWorker(null);
      await loadWorkers();
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to remove worker' });
    } finally {
      setProcessing(false);
    }
  };

  const totalPayments = workers.reduce((sum, worker) => 
    sum + Number.parseFloat(worker.formattedSalary || '0'), 0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Team Management</h2>
          <p className="text-foreground/60 mt-1">
            {eventId ? 'Event workers and roles' : 'Organization team members'}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Worker
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 glass rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{workers.length}</p>
              <p className="text-sm text-foreground/60">Total Workers</p>
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
              <p className="text-2xl font-bold text-foreground">{totalPayments.toFixed(3)}</p>
              <p className="text-sm text-foreground/60">Total Payments (ETH)</p>
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
              <p className="text-2xl font-bold text-foreground">
                {workers.filter(w => w.paid).length}
              </p>
              <p className="text-sm text-foreground/60">Paid Workers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Workers Table */}
      <div className="glass-card p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-foreground/60">Loading workers...</p>
          </div>
        ) : workers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 glass rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Workers Yet</h3>
            <p className="text-foreground/60 mb-4">Add team members to help manage your events</p>
            <button onClick={() => setShowAddModal(true)} className="btn-primary inline-flex">
              Add First Worker
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-foreground/10">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Worker</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Payment</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {workers.map((worker, index) => (
                  <tr 
                    key={worker.employee} 
                    className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors slide-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-foreground">
                          {worker.employee.slice(0, 6)}...{worker.employee.slice(-4)}
                        </p>
                        <p className="text-xs text-foreground/60 font-mono">{worker.employee}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full glass text-sm">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {worker.description}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-foreground">{worker.formattedSalary} USDT</p>
                    </td>
                    <td className="py-4 px-4">
                      {worker.paid ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-success/20 text-success text-sm">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-foreground/10 text-foreground/60 text-sm">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedWorker(worker);
                          setShowRemoveModal(true);
                        }}
                        className="text-error hover:text-error/80 transition-colors p-2 hover:bg-error/10 rounded-lg"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Worker Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 sm:p-8 max-w-md w-full slide-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Add Worker</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setErrors({});
                }}
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Wallet Address *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, address: e.target.value }));
                    if (errors.address) setErrors(prev => ({ ...prev, address: '' }));
                  }}
                  placeholder="0x..."
                  className={`input w-full ${errors.address ? 'border-error' : ''}`}
                />
                {errors.address && <p className="text-error text-sm mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Role *
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, role: e.target.value }));
                    if (errors.role) setErrors(prev => ({ ...prev, role: '' }));
                  }}
                  placeholder="e.g., Event Coordinator"
                  className={`input w-full ${errors.role ? 'border-error' : ''}`}
                />
                {errors.role && <p className="text-error text-sm mt-1">{errors.role}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Payment Amount (ETH) *
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  value={formData.payment}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, payment: e.target.value }));
                    if (errors.payment) setErrors(prev => ({ ...prev, payment: '' }));
                  }}
                  placeholder="0.1"
                  className={`input w-full ${errors.payment ? 'border-error' : ''}`}
                />
                {errors.payment && <p className="text-error text-sm mt-1">{errors.payment}</p>}
              </div>

              {errors.submit && (
                <div className="glass p-3 border-l-4 border-error bg-error/5">
                  <p className="text-error text-sm">{errors.submit}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setErrors({});
                }}
                className="btn-secondary flex-1"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleAddWorker}
                className="btn-primary flex-1"
                disabled={processing}
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-background/20 border-t-background rounded-full animate-spin" />
                    Adding...
                  </span>
                ) : (
                  'Add Worker'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Worker Modal */}
      {showRemoveModal && selectedWorker && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 sm:p-8 max-w-md w-full slide-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Remove Worker</h3>
              <p className="text-foreground/60 mb-6">
                Are you sure you want to remove this worker? This action cannot be undone.
              </p>
              
              <div className="glass p-4 rounded-lg mb-6 text-left">
                <p className="text-sm text-foreground/60 mb-1">Worker Address</p>
                <p className="font-mono text-sm text-foreground break-all">{selectedWorker.address}</p>
                <p className="text-sm text-foreground/60 mt-3 mb-1">Role</p>
                <p className="text-foreground">{selectedWorker.role}</p>
              </div>

              {errors.submit && (
                <div className="glass p-3 border-l-4 border-error bg-error/5 mb-4">
                  <p className="text-error text-sm">{errors.submit}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRemoveModal(false);
                    setSelectedWorker(null);
                    setErrors({});
                  }}
                  className="btn-secondary flex-1"
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemoveWorker}
                  className="btn-primary bg-error hover:bg-error/80 flex-1"
                  disabled={processing}
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-background/20 border-t-background rounded-full animate-spin" />
                      Removing...
                    </span>
                  ) : (
                    'Remove Worker'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
