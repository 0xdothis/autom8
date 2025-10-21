/**
 * Known Proxy Addresses for Public Event Discovery
 * 
 * This file maintains a list of known organization proxy addresses
 * so that the Events page can display events from all organizations
 * on the platform, not just the connected user's organization.
 * 
 * How to update:
 * 1. When someone creates a new organization, add their proxy address here
 * 2. Or use a backend service to index ProxyCreated events from the Factory
 * 3. Or implement event listening to automatically discover new proxies
 */

export const KNOWN_PROXY_ADDRESSES: `0x${string}`[] = [
  // Add your deployed proxy addresses here
  // Example: '0xed58e7f03ec0ee2d71e664277a90db163b5c05bf',
  
  // Your main organization proxy (from contracts/addresses.ts)
  '0xed58e7f03ec0ee2d71e664277a90db163b5c05bf',
  
  // Add more proxy addresses as organizations are created
  // '0x...', 
  // '0x...',
];

/**
 * Get all known proxy addresses for event discovery
 * This allows the platform to show events from all organizations
 */
export function getKnownProxies(): `0x${string}`[] {
  return KNOWN_PROXY_ADDRESSES.filter(addr => addr !== '0x');
}
