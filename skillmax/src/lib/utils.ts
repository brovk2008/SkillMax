export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function monadScanTx(hash: string): string {
  return `https://testnet.monadscan.com/tx/${hash}`
}

export function monadScanAddress(address: string): string {
  return `https://testnet.monadscan.com/address/${address}`
}

export const STATUS_CLASSES: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  active: 'bg-blue-50 text-blue-700',
  client_done: 'bg-amber-50 text-amber-700',
  provider_done: 'bg-amber-50 text-amber-700',
  completed: 'bg-blue-50 text-blue-700',
  disputed: 'bg-red-50 text-red-700',
  resolved: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-gray-100 text-gray-500',
}

export const CATEGORY_TO_ID: Record<string, number> = {
  Programming: 0, Design: 1, Tutoring: 2, Music: 3, Fitness: 4,
  Languages: 5, Photography: 6, Repair: 7, Cooking: 8, Other: 9,
}
