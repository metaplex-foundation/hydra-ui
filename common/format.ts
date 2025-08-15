// Centralized helpers to safely render on-chain numeric values (BN, bigint, etc.)
// Prevents React "Objects are not valid as a React child" errors when a BN is passed directly.
// (No React import to keep this a pure TS utility; any component wrapper can live elsewhere.)

import BN from 'bn.js'

// Helper function to check if a value is a BN instance
export function isBN(value: any): value is BN {
  return value instanceof BN
}

export interface FormatOptions {
  divisor?: number // e.g. 1e9 for lamports->SOL
  decimals?: number // fixed decimals to display after applying divisor
  fallback?: string
}

// Enhanced amount formatter with currency symbol support and consistent formatting
export function formatAmount(
  value: number | string | null | undefined,
  opts: { 
    maxSig?: number; 
    minSig?: number; 
    minThreshold?: number; 
    showLessThan?: boolean;
    currency?: string;
    compact?: boolean;
  } = {}
): string {
  const { 
    maxSig = 4, 
    minSig = 2, 
    minThreshold = 0.0001, 
    showLessThan = true,
    currency,
    compact = false 
  } = opts
  
  if (value === null || value === undefined || value === '') return '--'
  const num = typeof value === 'string' ? Number(value) : value
  if (isNaN(num)) return '--'
  if (num === 0) return currency ? `0 ${currency}` : '0'
  if (num > 0 && num < minThreshold && showLessThan) {
    return currency ? `<${minThreshold} ${currency}` : `<${minThreshold}`
  }

  let str: string

  // Compact notation for large numbers
  if (compact && num >= 1000000) {
    const suffixes = ['', 'K', 'M', 'B', 'T']
    let tier = Math.log10(Math.abs(num)) / 3 | 0
    if (tier === 0) {
      str = num.toFixed(minSig)
    } else {
      const suffix = suffixes[tier]
      const scale = Math.pow(10, tier * 3)
      const scaled = num / scale
      str = scaled.toFixed(scaled < 10 ? 2 : scaled < 100 ? 1 : 0) + suffix
    }
  } else {
    // Standard formatting with improved decimal handling
    str = num.toLocaleString('en-US', {
      minimumFractionDigits: num >= 1 ? Math.min(minSig, 2) : minSig,
      maximumFractionDigits: maxSig,
    })
  }

  return currency ? `${str} ${currency}` : str
}

// Percent formatter with configurable precision (defaults align with high-level UI needs)
export function formatPercent(value: number | null | undefined, opts: { digits?: number } = {}) {
  if (value === null || value === undefined || isNaN(value)) return '--'
  const { digits = value < 1 ? 2 : 1 } = opts
  return `${value.toFixed(digits)}%`
}

export function formatValue(value: any, opts: FormatOptions = {}): string {
  const { divisor, decimals, fallback = '--' } = opts
  if (value === null || value === undefined) return fallback
  try {
    if (isBN(value)) {
      let s = value.toString(10)
      if (divisor) {
        const num = Number(s) / divisor
        return decimals != null ? num.toFixed(decimals) : String(num)
      }
      return s
    }
    if (typeof value === 'bigint') return value.toString()
    if (typeof value === 'number') {
      if (divisor) {
        const num = value / divisor
        return decimals != null ? num.toFixed(decimals) : String(num)
      }
      return String(value)
    }
    if (typeof value === 'string') return value
    if (typeof value === 'object') {
      if (typeof (value as any).toString === 'function' && (value as any).toString !== Object.prototype.toString) {
        return (value as any).toString()
      }
      return JSON.stringify(value)
    }
    return String(value)
  } catch (e) {
    return fallback
  }
}

// Lightweight non-JSX helper for frameworks/components that want a standardized string
export function getFormattedNode(value: any, opts: FormatOptions = {}) {
  return formatValue(value, opts)
}
