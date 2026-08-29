export const ESCROW_ADDRESS = (process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS || '0x5Cf4619d4739DB27ddB46921FFe32f2B677505F9') as `0x${string}`
export const BADGE_ADDRESS = (process.env.NEXT_PUBLIC_BADGE_CONTRACT_ADDRESS || '0x5Cf4619d4739DB27ddB46921FFe32f2B677505F9') as `0x${string}`

export const ESCROW_ABI = [
  {
    "type": "constructor",
    "inputs": [{ "name": "_arbiter", "type": "address" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createJob",
    "inputs": [{ "name": "provider", "type": "address" }],
    "outputs": [{ "name": "jobId", "type": "uint256" }],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "markComplete",
    "inputs": [{ "name": "jobId", "type": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "raiseDispute",
    "inputs": [{ "name": "jobId", "type": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "resolveDispute",
    "inputs": [
      { "name": "jobId", "type": "uint256" },
      { "name": "winner", "type": "address" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "rateProvider",
    "inputs": [
      { "name": "jobId", "type": "uint256" },
      { "name": "rating", "type": "uint8" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getJob",
    "inputs": [{ "name": "jobId", "type": "uint256" }],
    "outputs": [
      { "name": "provider", "type": "address" },
      { "name": "client", "type": "address" },
      { "name": "amount", "type": "uint256" },
      { "name": "status", "type": "uint8" },
      { "name": "rated", "type": "bool" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getReputation",
    "inputs": [{ "name": "provider", "type": "address" }],
    "outputs": [
      { "name": "completedJobs", "type": "uint64" },
      { "name": "disputedJobs", "type": "uint64" },
      { "name": "ratingCount", "type": "uint64" },
      { "name": "avgRating100", "type": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "JobCreated",
    "inputs": [
      { "name": "jobId", "type": "uint256", "indexed": true },
      { "name": "provider", "type": "address", "indexed": true },
      { "name": "client", "type": "address", "indexed": true },
      { "name": "amount", "type": "uint256", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "JobCompleted",
    "inputs": [
      { "name": "jobId", "type": "uint256", "indexed": true },
      { "name": "amountReleased", "type": "uint256", "indexed": false }
    ]
  },
  {
    "type": "error", "name": "NotAuthorized", "inputs": []
  },
  {
    "type": "error", "name": "JobNotFound", "inputs": []
  },
  {
    "type": "error", "name": "ZeroAmount", "inputs": []
  },
  {
    "type": "error", "name": "AlreadyRated", "inputs": []
  },
  {
    "type": "error", "name": "InvalidRating", "inputs": []
  },
  {
    "type": "error", "name": "TransferFailed", "inputs": []
  }
] as const

export const BADGE_ABI = [
  {
    "type": "function",
    "name": "mintBadge",
    "inputs": [
      { "name": "recipient", "type": "address" },
      { "name": "categoryId", "type": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getBadges",
    "inputs": [{ "name": "provider", "type": "address" }],
    "outputs": [{ "name": "counts", "type": "uint256[10]" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "badgeCount",
    "inputs": [
      { "name": "", "type": "address" },
      { "name": "", "type": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  }
] as const

export const CATEGORY_NAMES = [
  'Programming', 'Design', 'Tutoring', 'Music', 'Fitness',
  'Languages', 'Photography', 'Repair', 'Cooking', 'Other'
] as const

export const CATEGORIES = [
  'All', ...CATEGORY_NAMES
] as const

export const CATEGORY_TO_ID: Record<string, number> = {
  Programming: 0, Design: 1, Tutoring: 2, Music: 3, Fitness: 4,
  Languages: 5, Photography: 6, Repair: 7, Cooking: 8, Other: 9,
}

