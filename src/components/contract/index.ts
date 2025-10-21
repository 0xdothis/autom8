/**
 * Contract Components Index
 * Centralized exports for all contract-synchronized components
 */

// Main Container
export { default as ContractManagement } from './ContractManagement';

// Core Functionality Components
export { default as OrganizationRegistration } from './OrganizationRegistration';
export { default as EventDashboard } from './EventDashboard';
export { default as ContractEventCreation } from './ContractEventCreation';
export { default as WorkerManagement } from './WorkerManagement';
export { default as SponsorshipManagement } from './SponsorshipManagement';
export { default as PaymentProcessing } from './PaymentProcessing';
export { default as Analytics } from './Analytics';

// Re-export types for convenience
export type { LibStorage } from '@/types/contracts';