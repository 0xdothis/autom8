import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CONSTANTS } from "./constants";

/**
 * Merge Tailwind classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format Ethereum address to short form
 * @example formatAddress('0x1234567890abcdef') => '0x1234...cdef'
 */
export function formatAddress(
  address: string | undefined,
  length = CONSTANTS.ADDRESS_DISPLAY_LENGTH,
): string {
  if (!address) return "";
  const prefixLength = Math.floor(length / 2);
  const suffixLength = Math.ceil(length / 2) - 2; // -2 for '0x'
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}

/**
 * Format transaction hash
 */
export function formatHash(hash: string | undefined): string {
  if (!hash) return "";
  return `${hash.slice(0, CONSTANTS.HASH_DISPLAY_LENGTH)}...`;
}

/**
 * Format number with commas
 * @example formatNumber(1234567) => '1,234,567'
 */
export function formatNumber(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Format currency (ETH/USDT)
 */
export function formatCurrency(
  value: string | number,
  decimals = 4,
  currency = "USDT",
): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return `${num.toFixed(decimals)} ${currency}`;
}

/**
 * Format date to readable string
 */
export function formatDate(timestamp: number | string): string {
  const date =
    typeof timestamp === "string"
      ? new Date(timestamp)
      : new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format date and time
 */
export function formatDateTime(timestamp: number | string): string {
  const date =
    typeof timestamp === "string"
      ? new Date(timestamp)
      : new Date(timestamp * 1000);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format time remaining
 * @example formatTimeRemaining(3661) => '1h 1m'
 */
export function formatTimeRemaining(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400)
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  return `${Math.floor(seconds / 86400)}d ${Math.floor((seconds % 86400) / 3600)}h`;
}

/**
 * Get event status based on timestamps
 */
export function getEventStatus(
  startTime: number,
  endTime: number,
  isPaid: boolean,
): string {
  const now = Date.now() / 1000;

  if (now < startTime) return "upcoming";
  if (now >= startTime && now <= endTime) return "active";
  if (now > endTime && !isPaid) return "ended";
  if (isPaid) return "completed";

  return "draft";
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Get block explorer URL for address/tx
 */
export function getBlockExplorerUrl(
  value: string,
  type: "address" | "tx",
): string {
  const baseUrl = import.meta.env.VITE_BLOCK_EXPLORER;
  return type === "address"
    ? `${baseUrl}/address/${value}`
    : `${baseUrl}/tx/${value}`;
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Parse bigint to readable number
 */
export function parseBigInt(value: bigint, decimals = 18): number {
  return Number(value) / Math.pow(10, decimals);
}

/**
 * Convert number to bigint with decimals
 */
export function toBigInt(value: number, decimals = 18): bigint {
  return BigInt(Math.floor(value * Math.pow(10, decimals)));
}
