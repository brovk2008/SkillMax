# SkillMax — Local Skill Marketplace Powered by Monad, Supabase & Razorpay

[![Live Demo](https://img.shields.io/badge/Vercel-Live_Production-000000?style=for-the-badge&logo=vercel)](https://skillmax2026.vercel.app)
[![Blockchain](https://img.shields.io/badge/Monad-Testnet_10143-8A2BE2?style=for-the-badge&logo=ethereum)](https://testnet.monadscan.com)
[![Database](https://img.shields.io/badge/Supabase-PostgreSQL_%2B_Realtime-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Payments](https://img.shields.io/badge/Razorpay-INR_Payment_Rails-02042B?style=for-the-badge&logo=razorpay)](https://razorpay.com)

**SkillMax** is a decentralized, trust-minimized local freelance and skill-sharing marketplace built for **Monad Blitz New Delhi 2026**. 

SkillMax operates on a strict architecture thesis:
* **Supabase** runs the marketplace (User profiles, skill listings, Realtime WebSocket chat, RLS security policies, and notification feeds).
* **Monad Testnet** runs the trust (Non-custodial native MON escrows, on-chain dispute resolution, immutable 100-precision rating math, and soulbound ERC-1155 skill badges).
* **Razorpay** runs the money (Local INR fiat payments via automated Payment Links and HMAC-SHA256 verified webhooks).

---

## 📋 Table of Contents

1. [Executive Summary & Core Philosophy](#1-executive-summary--core-philosophy)
2. [Full Technology Stack](#2-full-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [Smart Contracts Architecture & Security](#4-smart-contracts-architecture--security)
5. [Database Schema & Realtime Architecture](#5-database-schema--realtime-architecture)
6. [Frontend & App Router Directory Structure](#6-frontend--app-router-directory-structure)
7. [Comprehensive Codebase Tour](#7-comprehensive-codebase-tour)
   - [Smart Contracts](#smart-contracts)
   - [Database Migration & SQL](#database-migration--sql)
   - [Core Components](#core-components)
   - [App Router Pages](#app-router-pages)
   - [API Routes](#api-routes)
   - [Libraries & Configuration](#libraries--configuration)
8. [Monad Blockchain Specifications](#8-monad-blockchain-specifications)
9. [Razorpay Integration Specifications](#9-razorpay-integration-specifications)
10. [Vercel Deployment Specifications](#10-vercel-deployment-specifications)
11. [Local Development & Setup Guide](#11-local-development--setup-guide)
12. [API Reference Manual](#12-api-reference-manual)
13. [Hackathon Verification & Submission Info](#13-hackathon-verification--submission-info)

---

## 1. Executive Summary & Core Philosophy

In traditional local skill marketplaces (like UrbanCompany or Fiverr), central platforms take 20-30% cut, lock users into proprietary review silos, and control dispute resolution with opaque rules. Existing Web3 gig platforms fail by trying to put large binary image assets and micro-chat messages on-chain, leading to exorbitant transaction overhead and poor latency.

SkillMax solves this by creating a **decoupled hybrid architecture**:
1. **Decoupled Escrow**: High-frequency metadata, full-text search, and real-time chat messages live in PostgreSQL (Supabase). Monetary commitments live in smart contracts on Monad Testnet.
2. **Immutable On-Chain Reputation**: When a job is completed on Monad, the provider's completed job count and rating are updated directly inside contract storage. No central server can manipulate or delete a provider's earned reputation.
3. **Dual Payment Rails**: Clients can choose between **Crypto Native (MON)** via Monad escrow or **Fiat Local (INR)** via Razorpay.
4. **Soulbound Skill Badges**: When a provider completes jobs in specific categories (e.g. Programming, Music, Tutoring), they receive non-transferable ERC-1155 badges minted directly to their wallet on Monad.

---

## 2. Full Technology Stack

| Layer | Technology | Purpose / Configuration |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 / 16 (App Router) | Server Components, Turbopack, Dynamic API Routes |
| **Language** | TypeScript (ES2022) | Strict type safety across client, server, & contract ABIs |
| **Styling** | Tailwind CSS + Vanilla CSS | Clean, modern design system without AI slop or gradients |
| **Icons & Fonts** | Inter (Google Fonts) | Optimized typography & SVG micro-icons |
| **Blockchain Chain** | Monad Testnet | Chain ID: `10143`, Native Token: `MON` |
| **Smart Contracts** | Solidity `0.8.24` + Foundry | `SkillMaxEscrow.sol` and `SkillMaxBadge.sol` |
| **Web3 Client** | Wagmi v2 + Viem | EIP-1193 MetaMask/Injected connector with Monad config |
| **Database** | Supabase PostgreSQL | Relational database with Foreign Keys & Indexes |
| **Auth** | Supabase Auth (SSR) | Email OTP / Magic Links with cookie sessions (`@supabase/ssr`) |
| **Realtime Engine** | Supabase Realtime | WebSocket channels for live job chat & unread badges |
| **Security** | Row Level Security (RLS) | Granular table-level authorization policies |
| **Fiat Payments** | Razorpay Node SDK | Payment Links API v1 + HMAC-SHA256 Webhook Verification |
| **Hosting & Infra** | Vercel | Production deployment with Turbopack & edge routing |

---

## 3. System Architecture

```
                                  ┌────────────────────────────────────────────────────────┐
                                  │                  CLIENT BROWSER (User)                 │
                                  └──────────┬───────────────────┬────────────────────┬────┘
                                             │                   │                    │
                                     HTTP / REST          Wagmi / Viem           WebSocket
                                             │                   │                    │
                                             ▼                   ▼                    ▼
                                  ┌────────────────────┐ ┌───────────────┐ ┌────────────────────┐
                                  │  VERCEL NEXT.JS 14 │ │ MONAD TESTNET │ │  SUPABASE ENGINE   │
                                  │    APP ROUTER      │ │ (Chain 10143) │ │ (PostgreSQL + RLS) │
                                  └──────────┬─────────┘ └───────┬───────┘ └──────────┬─────────┘
                                             │                   │                    │
                                  ┌──────────┴──────────┐        │           ┌────────┴──────────┐
                                  │  RAZORPAY GATEWAY   │        │           │ SUPABASE REALTIME │
                                  │ (Payment Links API) │        │           │ (Messages/Notifs) │
                                  └─────────────────────┘        │           └───────────────────┘
                                                                 │
                                                   ┌─────────────┴─────────────┐
                                                   │  SKILLMAX SMART CONTRACTS │
                                                   │ ├─ SkillMaxEscrow.sol     │
                                                   │ └─ SkillMaxBadge.sol      │
                                                   └───────────────────────────┘
```

---

## 4. Smart Contracts Architecture & Security

### `SkillMaxEscrow.sol`
Located at [`contracts/src/SkillMaxEscrow.sol`](file:///c:/Users/techp/Downloads/more%20projects/monad%20hackathon/skillmax/contracts/src/SkillMaxEscrow.sol).

* **State Storage**:
  - `arbiter`: Immutable address of platform arbiter empowered to resolve disputed funds.
  - `jobs`: Mapping `uint256 => Job` containing provider, client, escrowed amount, status enum (`Active`, `Completed`, `Disputed`, `Resolved`), and rating flag.
  - `reputations`: Mapping `address => Reputation` containing `completedJobs` (uint64), `disputedJobs` (uint64), `ratingCount` (uint64), and `totalRating100` (uint256).

* **Key Functions**:
  - `createJob(address provider) payable returns (uint256 jobId)`: Locks native MON into escrow.
  - `markComplete(uint256 jobId)`: Called by client to transfer escrowed MON directly to the provider and increment provider's `completedJobs` count. Uses reentrancy-safe state mutation before external `.call{value: amount}("")`.
  - `raiseDispute(uint256 jobId)`: Called by client or provider to freeze escrowed funds and increment `disputedJobs`.
  - `resolveDispute(uint256 jobId, address winner)`: Called by `arbiter` to award escrowed MON to either client or provider.
  - `rateProvider(uint256 jobId, uint8 rating)`: Called by client post-completion. Updates `totalRating100` (`rating * 100`) for fixed-point integer precision.
  - `getReputation(address provider)`: Returns calculated `avgRating100` (`totalRating100 / ratingCount`).

### `SkillMaxBadge.sol`
Located at [`contracts/src/SkillMaxBadge.sol`](file:///c:/Users/techp/Downloads/more%20projects/monad%20hackathon/skillmax/contracts/src/SkillMaxBadge.sol).

* **Soulbound Standard**: Inherits from OpenZeppelin `ERC1155` and `Ownable`.
* **Category Mapping**: Token IDs `0-9` map to 10 skill categories (Programming, Design, Tutoring, Music, Fitness, Languages, Photography, Repair, Cooking, Other).
* **Transfer Blocking**: Overrides `safeTransferFrom` and `safeBatchTransferFrom` to unconditionally revert with `SoulboundToken()`, ensuring badges cannot be sold, transferred, or traded.
* **Platform Minting**: Only callable by `onlyOwner` (the platform server-side wallet) via the `/api/badge/mint` API route upon job completion.

---

## 5. Database Schema & Realtime Architecture

Located at [`supabase/migrations/001_initial.sql`](file:///c:/Users/techp/Downloads/more%20projects/monad%20hackathon/skillmax/supabase/migrations/001_initial.sql).

### Table Schemas
1. **`profiles`**:
   - `id` (uuid, primary key, references `auth.users`)
   - `email` (text), `username` (text, unique), `full_name` (text), `city` (text), `bio` (text), `avatar_url` (text), `wallet_address` (text), `is_verified` (boolean).
2. **`skills`**:
   - `id` (uuid, primary key)
   - `provider_id` (uuid, references `profiles.id`)
   - `title` (text), `description` (text), `category` (text), `price_inr` (integer), `price_mon` (numeric 18,8), `is_active` (boolean).
3. **`jobs`**:
   - `id` (uuid, primary key)
   - `skill_id` (uuid, references `skills.id`), `client_id` (uuid), `provider_id` (uuid)
   - `status` (text: `pending`, `active`, `client_done`, `provider_done`, `completed`, `disputed`, `resolved`, `cancelled`)
   - `payment_method` (`crypto` or `razorpay`)
   - `price_inr` (integer), `price_mon` (numeric 18,8)
   - `chain_tx_create`, `chain_tx_complete`, `chain_tx_dispute` (text)
   - `razorpay_payment_link_id`, `razorpay_payment_id` (text)
   - `dispute_reason` (text), `badge_minted` (boolean).
4. **`messages`**:
   - `id` (uuid, primary key), `job_id` (uuid, references `jobs.id`), `sender_id` (uuid), `content` (text, max 2000 chars), `created_at` (timestamptz).
5. **`notifications`**:
   - `id` (uuid, primary key), `user_id` (uuid), `job_id` (uuid), `message` (text), `is_read` (boolean).
6. **`reviews`**:
   - `id` (uuid, primary key), `job_id` (uuid, unique), `reviewer_id` (uuid), `reviewee_id` (uuid), `rating` (smallint 1-5), `comment` (text).

### Row Level Security (RLS)
- `profiles`: Public read (`select true`), Insert/Update allowed only where `auth.uid() = id`.
- `skills`: Public read (`select true`), Insert/Update/Delete allowed only where `auth.uid() = provider_id`.
- `jobs`: Select/Update allowed only where `auth.uid() = client_id OR auth.uid() = provider_id`.
- `messages`: Select/Insert allowed only if user is `client_id` or `provider_id` on the parent job.

---

## 6. Frontend & App Router Directory Structure

```
skillmax/
├── contracts/
│   ├── src/
│   │   ├── SkillMaxEscrow.sol
│   │   └── SkillMaxBadge.sol
│   ├── script/
│   │   └── Deploy.s.sol
│   ├── test/
│   │   └── SkillMaxEscrow.t.sol
│   └── foundry.toml
├── supabase/
│   └── migrations/
│       └── 001_initial.sql
├── public/
│   └── logo.png
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── explore/page.tsx
│   │   ├── onboard/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── profile/
│   │   │   ├── page.tsx
│   │   │   └── [username]/page.tsx
│   │   ├── skills/
│   │   │   ├── [id]/page.tsx
│   │   │   └── new/page.tsx
│   │   ├── jobs/
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── dispute/page.tsx
│   │   ├── notifications/page.tsx
│   │   ├── settings/page.tsx
│   │   └── api/
│   │       ├── auth/signout/route.ts
│   │       ├── badge/
│   │       │   ├── metadata/[id]/route.ts
│   │       │   └── mint/route.ts
│   │       ├── jobs/
│   │       │   ├── create-from-chain/route.ts
│   │       │   └── [id]/
│   │       │       ├── dispute/route.ts
│   │       │       ├── mark-complete/route.ts
│   │       │       └── mark-done/route.ts
│   │       └── razorpay/
│   │           ├── create-payment-link/route.ts
│   │           └── webhook/route.ts
│   ├── components/
│   │   ├── BlockchainStatus.tsx
│   │   ├── CryptoBookingButton.tsx
│   │   ├── DisputeForm.tsx
│   │   ├── JobCard.tsx
│   │   ├── JobChat.tsx
│   │   ├── Navbar.tsx
│   │   ├── NotifBadge.tsx
│   │   ├── OnChainReputation.tsx
│   │   ├── Providers.tsx
│   │   ├── RazorpayBookingButton.tsx
│   │   ├── SettingsForm.tsx
│   │   ├── SkillBadges.tsx
│   │   ├── SkillCard.tsx
│   │   ├── SkillForm.tsx
│   │   └── WalletConnectButton.tsx
│   └── lib/
│       ├── contracts/index.ts
│       ├── supabase/
│       │   ├── client.ts
│       │   └── server.ts
│       ├── utils.ts
│       └── wagmi/config.ts
├── .env.example
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 7. Comprehensive Codebase Tour

### Smart Contracts

#### [`SkillMaxEscrow.sol`](file:///c:/Users/techp/Downloads/more%20projects/monad%20hackathon/skillmax/contracts/src/SkillMaxEscrow.sol)
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SkillMaxEscrow {
    enum Status { Active, Completed, Disputed, Resolved }

    struct Job {
        address provider;
        address client;
        uint256 amount;
        Status  status;
        bool    rated;
    }

    struct Reputation {
        uint64  completedJobs;
        uint64  disputedJobs;
        uint64  ratingCount;
        uint256 totalRating100;
    }

    address public immutable arbiter;
    uint256 public jobCounter;

    mapping(uint256 => Job)        public jobs;
    mapping(address => Reputation) public reputations;

    event JobCreated(uint256 indexed jobId, address indexed provider, address indexed client, uint256 amount);
    event JobCompleted(uint256 indexed jobId, uint256 amountReleased);
    event DisputeRaised(uint256 indexed jobId, address raisedBy);
    event DisputeResolved(uint256 indexed jobId, address winner);
    event ProviderRated(uint256 indexed jobId, address provider, uint8 rating);

    error NotAuthorized();
    error JobNotFound();
    error ZeroAmount();
    error WrongStatus();
    error AlreadyRated();
    error InvalidRating();
    error TransferFailed();

    constructor(address _arbiter) {
        arbiter = _arbiter;
    }

    function createJob(address provider) external payable returns (uint256 jobId) {
        if (msg.value == 0) revert ZeroAmount();

        jobId = ++jobCounter;
        jobs[jobId] = Job({
            provider: provider,
            client: msg.sender,
            amount: msg.value,
            status: Status.Active,
            rated: false
        });

        emit JobCreated(jobId, provider, msg.sender, msg.value);
    }

    function markComplete(uint256 jobId) external {
        Job storage job = jobs[jobId];
        if (job.client == address(0)) revert JobNotFound();
        if (job.client != msg.sender) revert NotAuthorized();
        if (job.status != Status.Active) revert WrongStatus();

        job.status = Status.Completed;
        reputations[job.provider].completedJobs++;

        uint256 amount = job.amount;
        job.amount = 0;

        (bool ok,) = job.provider.call{value: amount}("");
        if (!ok) revert TransferFailed();

        emit JobCompleted(jobId, amount);
    }

    function raiseDispute(uint256 jobId) external {
        Job storage job = jobs[jobId];
        if (job.client == address(0)) revert JobNotFound();
        if (job.client != msg.sender && job.provider != msg.sender) revert NotAuthorized();
        if (job.status != Status.Active) revert WrongStatus();

        job.status = Status.Disputed;
        reputations[job.provider].disputedJobs++;

        emit DisputeRaised(jobId, msg.sender);
    }

    function resolveDispute(uint256 jobId, address winner) external {
        if (msg.sender != arbiter) revert NotAuthorized();
        Job storage job = jobs[jobId];
        if (job.client == address(0)) revert JobNotFound();
        if (job.status != Status.Disputed) revert WrongStatus();

        require(winner == job.client || winner == job.provider, "Invalid winner");

        job.status = Status.Resolved;
        uint256 amount = job.amount;
        job.amount = 0;

        (bool ok,) = winner.call{value: amount}("");
        if (!ok) revert TransferFailed();

        emit DisputeResolved(jobId, winner);
    }

    function rateProvider(uint256 jobId, uint8 rating) external {
        if (rating < 1 || rating > 5) revert InvalidRating();
        Job storage job = jobs[jobId];
        if (job.client != msg.sender) revert NotAuthorized();
        if (job.status != Status.Completed) revert WrongStatus();
        if (job.rated) revert AlreadyRated();

        job.rated = true;
        Reputation storage rep = reputations[job.provider];
        rep.ratingCount++;
        rep.totalRating100 += uint256(rating) * 100;

        emit ProviderRated(jobId, job.provider, rating);
    }

    function getJob(uint256 jobId) external view returns (
        address provider, address client, uint256 amount, uint8 status, bool rated
    ) {
        Job storage job = jobs[jobId];
        return (job.provider, job.client, job.amount, uint8(job.status), job.rated);
    }

    function getReputation(address provider) external view returns (
        uint64 completedJobs, uint64 disputedJobs, uint64 ratingCount, uint256 avgRating100
    ) {
        Reputation storage rep = reputations[provider];
        completedJobs = rep.completedJobs;
        disputedJobs  = rep.disputedJobs;
        ratingCount   = rep.ratingCount;
        avgRating100  = rep.ratingCount > 0 ? rep.totalRating100 / rep.ratingCount : 0;
    }
}
```

---

### Core Components

#### [`CryptoBookingButton.tsx`](file:///c:/Users/techp/Downloads/more%20projects/monad%20hackathon/skillmax/src/components/CryptoBookingButton.tsx)
Handles non-custodial MON escrow booking directly on Monad Testnet:
```tsx
'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { useRouter } from 'next/navigation'
import { ESCROW_ADDRESS, ESCROW_ABI } from '@/lib/contracts'
import { monadTestnet } from '@/lib/wagmi/config'

interface Props {
  skillId: string
  priceMon: number
  providerAddress: string
  providerUserId: string
}

export function CryptoBookingButton({ skillId, priceMon, providerAddress, providerUserId }: Props) {
  const { address, chain } = useAccount()
  const [status, setStatus] = useState<'idle' | 'approving' | 'done'>('idle')
  const router = useRouter()

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const isWrongChain = chain?.id !== monadTestnet.id

  async function handleBook() {
    if (!address) return alert('Connect your wallet first')
    if (isWrongChain) return alert('Switch to Monad Testnet')
    setStatus('approving')
    try {
      writeContract({
        address: ESCROW_ADDRESS,
        abi: ESCROW_ABI,
        functionName: 'createJob',
        args: [providerAddress as `0x${string}`],
        value: parseEther(priceMon.toString()),
        chainId: monadTestnet.id,
      })
    } catch {
      setStatus('idle')
    }
  }

  async function createDbJob() {
    const res = await fetch('/api/jobs/create-from-chain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        skillId, providerUserId, txHash: hash, priceMon,
      }),
    })
    const { jobId } = await res.json()
    if (jobId) {
      setStatus('done')
      router.push(`/jobs/${jobId}`)
    }
  }

  if (isSuccess && status === 'approving' && hash) {
    createDbJob()
  }

  return (
    <button
      onClick={handleBook}
      disabled={isPending || isConfirming || status === 'done'}
      className="w-full rounded-md bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
    >
      {isPending ? 'Confirm in wallet...' : isConfirming ? 'Confirming on Monad...' : `Book · ${priceMon} MON`}
    </button>
  )
}
```

#### [`JobChat.tsx`](file:///c:/Users/techp/Downloads/more%20projects/monad%20hackathon/skillmax/src/components/JobChat.tsx)
Real-time messaging between client and provider backed by Supabase WebSockets:
```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'

export default function JobChat({ jobId, currentUserId, initialMessages, disabled }: any) {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createBrowserClient()

  useEffect(() => {
    const channel = supabase
      .channel(`job-chat-${jobId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `job_id=eq.${jobId}` },
        async (payload) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', payload.new.sender_id)
            .single()
          setMessages((prev: any) => [
            ...prev,
            { ...payload.new, profiles: profile ?? { full_name: 'Unknown' } },
          ])
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [jobId])

  async function sendMessage() {
    const content = input.trim()
    if (!content || sending || disabled) return
    setSending(true)
    setInput('')
    await supabase.from('messages').insert({ job_id: jobId, sender_id: currentUserId, content })
    setSending(false)
  }

  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-white" style={{ height: '400px' }}>
      <div className="border-b border-gray-200 px-4 py-3 font-medium text-sm">Job Chat</div>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg: any) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender_id === currentUserId ? 'items-end' : 'items-start'}`}>
            <p className="text-xs text-gray-500 mb-1">{msg.profiles?.full_name}</p>
            <div className={`max-w-xs rounded-lg px-3 py-2 text-sm ${msg.sender_id === currentUserId ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-gray-200 px-4 py-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={disabled ? 'Chat closed' : 'Type a message...'}
          disabled={disabled}
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
        />
        <button onClick={sendMessage} disabled={sending || !input.trim() || disabled} className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white">
          Send
        </button>
      </div>
    </div>
  )
}
```

---

### API Routes

#### [`src/app/api/razorpay/create-payment-link/route.ts`](file:///c:/Users/techp/Downloads/more%20projects/monad%20hackathon/skillmax/src/app/api/razorpay/create-payment-link/route.ts)
```typescript
import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { createServerClient } from '@/lib/supabase/server'

function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID ?? 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET ?? 'placeholder_secret',
  })
}

export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { skillId, providerUserId, priceInr } = await req.json()
  const razorpay = getRazorpay()
  const { data: skill } = await supabase.from('skills').select('title').eq('id', skillId).single()

  const paymentLink = await razorpay.paymentLink.create({
    amount: priceInr * 100,
    currency: 'INR',
    description: skill?.title ?? 'SkillMax Booking',
    notify: { sms: false, email: true },
    callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/razorpay/webhook`,
    callback_method: 'get',
    notes: { skillId, clientId: user.id, providerUserId },
  } as any)

  const { data: job } = await supabase
    .from('jobs')
    .insert({
      client_id: user.id,
      provider_id: providerUserId,
      skill_id: skillId,
      payment_method: 'razorpay',
      price_inr: priceInr,
      status: 'pending',
      razorpay_payment_link_id: paymentLink.id,
    })
    .select('id')
    .single()

  return NextResponse.json({ paymentLink: paymentLink.short_url, jobId: job?.id })
}
```

---

## 8. Monad Blockchain Specifications

* **Network**: Monad Testnet
* **Chain ID**: `10143` (`0x279f`)
* **RPC URL**: `https://testnet-rpc.monad.xyz`
* **Block Explorer**: `https://testnet.monadscan.com`
* **Native Currency**: Monad (`MON`, 18 decimals)
* **Gas Model**: Fixed gas pricing model on Monad Testnet charging `gas_limit` execution reservation.
* **Precompiles**: Supports EIP-7702, EIP-2935, P256VERIFY.

---

## 9. Razorpay Integration Specifications

* **API Version**: `v1/payment_links`
* **Webhook Event**: `payment_link.paid`
* **Signature Verification**: HMAC-SHA256 digest comparison against `x-razorpay-signature` header:
  ```typescript
  const expectedSig = crypto.createHmac('sha256', secret).update(body).digest('hex')
  if (expectedSig !== signature) throw new Error('Invalid signature')
  ```
* **Browser Redirect**: Supports GET parameter callback (`razorpay_payment_link_id` and `razorpay_payment_link_status=paid`).

---

## 10. Vercel Deployment Specifications

* **Project Name**: `skillmax2026`
* **Production Domain**: `https://skillmax2026.vercel.app`
* **Root Directory**: `skillmax`
* **Node.js Target**: `24.x` / ES2022
* **Build Engine**: Next.js Turbopack compiler with static page collection workers.

---

## 11. Local Development & Setup Guide

### Prerequisites
- Node.js 18+ & npm
- Git
- Supabase Account
- Monad Testnet Wallet with test MON

### Step-by-Step Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/brovk2008/SkillMax.git
   cd SkillMax/skillmax
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create `.env.local` inside `skillmax/`:
   ```ini
   NEXT_PUBLIC_SUPABASE_URL=https://yyrzlotxhrtpwlvuocda.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   RAZORPAY_KEY_ID=rzp_test_xxxx
   RAZORPAY_KEY_SECRET=xxxx
   RAZORPAY_WEBHOOK_SECRET=xxxx

   NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=0x...
   NEXT_PUBLIC_BADGE_CONTRACT_ADDRESS=0x...
   NEXT_PUBLIC_MONAD_RPC_URL=https://testnet-rpc.monad.xyz
   NEXT_PUBLIC_MONAD_CHAIN_ID=10143
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run Local Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

5. **Build Production Bundle**:
   ```bash
   npm run build
   ```

---

## 12. API Reference Manual

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/razorpay/create-payment-link` | Generates a Razorpay payment link for INR bookings | Yes (User Cookie) |
| `POST` | `/api/razorpay/webhook` | Handles `payment_link.paid` webhook events from Razorpay | HMAC Signature |
| `GET` | `/api/razorpay/webhook` | Handles GET browser redirects from Razorpay | Public |
| `POST` | `/api/jobs/create-from-chain` | Syncs MON transaction hash to database after on-chain booking | Yes (User Cookie) |
| `POST` | `/api/jobs/[id]/mark-complete` | Releases escrow payment to provider and triggers badge mint | Client Only |
| `POST` | `/api/jobs/[id]/mark-done` | Signals provider completion status | Provider Only |
| `POST` | `/api/jobs/[id]/dispute` | Escalates job to platform arbiter and logs dispute reason | Participant Only |
| `POST` | `/api/badge/mint` | Mints ERC-1155 soulbound badge on Monad via platform key | Admin / Internal |
| `GET` | `/api/badge/metadata/[id]` | Serves ERC-1155 token metadata JSON for category IDs 0-9 | Public |
| `POST` | `/api/auth/signout` | Destroys Supabase SSR authentication cookies | Yes |

---

## 13. Hackathon Verification & Submission Info

* **Hackathon**: Monad Blitz New Delhi 2026
* **Project Name**: SkillMax
* **Live App**: [https://skillmax2026.vercel.app](https://skillmax2026.vercel.app)
* **GitHub Repository**: [https://github.com/brovk2008/SkillMax](https://github.com/brovk2008/SkillMax.git)
* **Monad Testnet Wallet**: `0xA0C474dDF6b88ae1F0EdC111BB688741b044aaA3`
* **License**: MIT
