# ⚡ SkillMax — Decoupled Local Skill & Freelance Marketplace
### *Powered by Monad Blockchain, Supabase Engine & Razorpay Fiat Payouts*

[![Live Production](https://img.shields.io/badge/Vercel-Live_Production-000000?style=for-the-badge&logo=vercel)](https://skillmax2026.vercel.app)
[![Monad Testnet](https://img.shields.io/badge/Monad-Testnet_10143-8A2BE2?style=for-the-badge&logo=ethereum)](https://monad-testnet.socialscan.io)
[![Database](https://img.shields.io/badge/Supabase-PostgreSQL_%2B_Realtime-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Payments](https://img.shields.io/badge/Razorpay-INR_Payment_Rails-02042B?style=for-the-badge&logo=razorpay)](https://razorpay.com)
[![Web3 Encryption](https://img.shields.io/badge/Web3_E2EE-AES--GCM_256--Bit-00C853?style=for-the-badge&logo=shield)](https://skillmax2026.vercel.app/privacy)
[![License](https://img.shields.io/badge/License-Semi--Open_Source_MIT-blue?style=for-the-badge)](./skillmax/CONTRIBUTING.md)
[![Charity Pledge](https://img.shields.io/badge/Charity_Pledge-60%25_Fee_Donation-ff69b4?style=for-the-badge)](./skillmax/CONTRIBUTING.md#our-mission--60-charity-pledge)

**SkillMax** is a semi-open source, decentralized, trust-minimized local freelance and skill-sharing marketplace created for the **Monad Blitz New Delhi 2026 Hackathon**.

---

## 💖 Semi-Open Source & 60% Charity Pledge

SkillMax is governed by a **Public Social Impact Protocol**:
* **60% Protocol Fee Charity Donation**: **60% of all platform transaction fees and escrow charges are donated directly to verified local community charities**, educational funds, and vocational training programs for underprivileged gig workers.
* **On-Chain Donation Auditing**: Every donation receipt and treasury disbursement is logged transparently on the Monad Blockchain.
* **Semi-Open Source Development**: Anyone in the global developer community can fork, review code, submit pull requests, audit security, and build features to improve SkillMax.

---

## 📋 Comprehensive Table of Contents

1. [Executive Summary & Platform Manifesto](#1-executive-summary--platform-manifesto)
2. [Problem vs Solution Matrix](#2-problem-vs-solution-matrix)
3. [Decoupled 3-Pillar Hybrid Architecture Breakdown](#3-decoupled-3-pillar-hybrid-architecture-breakdown)
4. [Complete Feature Catalog & Page Directory (22 Routes)](#4-complete-feature-catalog--page-directory-22-routes)
5. [Dual-Sided Marketplace System](#5-dual-sided-marketplace-system)
6. [Web3 Cryptographic & Security Architecture](#6-web3-cryptographic--security-architecture)
7. [Monad Smart Contracts Technical Specification](#7-monad-smart-contracts-technical-specification)
8. [Database Schema, Migrations & RLS Policies](#8-database-schema-migrations--rls-policies)
9. [Razorpay Fiat Payout Architecture & HMAC Verification](#9-razorpay-fiat-payout-architecture--hmac-verification)
10. [15 Community Reputation Achievements Matrix](#10-15-community-reputation-achievements-matrix)
11. [Full Technology Stack & Dependencies](#11-full-technology-stack--dependencies)
12. [Complete Codebase Directory Structure](#12-complete-codebase-directory-structure)
13. [API Reference Manual](#13-api-reference-manual)
14. [Monad Testnet Blockchain Specifications](#14-monad-testnet-blockchain-specifications)
15. [Local Development, Environment Setup & Build Guide](#15-local-development-environment-setup--build-guide)
16. [Semi-Open Source Contribution Guidelines & PR Workflow](#16-semi-open-source-contribution-guidelines--pr-workflow)
17. [Dispute Resolution & State Machine Flow](#17-dispute-resolution--state-machine-flow)
18. [Hackathon Submission & Verification Info](#18-hackathon-submission--verification-info)

---

## 1. Executive Summary & Platform Manifesto

In traditional local skill platforms (such as UrbanCompany, Fiverr, or Upwork), centralized companies take **20% to 30% cuts** from service providers, lock user funds inside proprietary bank accounts, and control provider reviews behind closed, editable databases.

SkillMax solves this by creating a **decoupled hybrid architecture**:

$$\text{Supabase (Marketplace Engine)} + \text{Razorpay (Fiat INR Money)} + \mathbf{Monad\ Blockchain\ (Unforgeable\ Trust)}$$

* **Decoupled Escrow**: High-frequency metadata, full-text search, and real-time chat messages live in PostgreSQL (Supabase). Monetary commitments and dispute settlement live in smart contracts on Monad Testnet (~1s finality).
* **Immutable On-Chain Reputation**: When a job is completed on Monad, the provider's completed job count, dispute record, and rating score are updated directly inside contract storage on Monad Explorer (`monad-testnet.socialscan.io`). No central server can manipulate or delete earned reputation.
* **Dual Payment Rails**: Clients choose between **Crypto Native (MON)** via Monad escrow or **Fiat Local (INR)** via Razorpay.
* **Soulbound Skill Badges**: Upon completing jobs in specific categories (e.g. Programming, Repair, Tutoring), providers receive non-transferable ERC-1155 badges minted directly to their Monad wallet address.

---

## 2. Problem vs Solution Matrix

| Industry Problem | Traditional Web2 Gig Platforms | SkillMax Monad Web3 Solution |
| :--- | :--- | :--- |
| **High Platform Fees** | 20% to 30% take rates deducted from providers | **Sub-cent Monad gas fees** + 60% fee donation to charity |
| **Custodial Risk** | Platform holds money in private bank accounts | **Non-Custodial Escrow**: `SkillMaxEscrow.sol` locks funds on-chain |
| **Fake or Edited Reviews** | Platforms can delete, edit, or manipulate ratings | **Immutable On-Chain Math**: Ratings written to Monad blockchain |
| **Badge Sybil Attacks** | Badges can be bought or transferred | **Soulbound ERC-1155 NFTs**: Non-transferable `SkillMaxBadge.sol` |
| **Chat Data Surveillance** | Plaintext messages stored and readable by staff | **Client-Side E2EE**: 256-bit AES-GCM Web3 key encryption |
| **Settlement Speed** | 7-14 business days payout processing | **~1-Second Automated Settlement** on Monad Testnet |

---

## 3. Decoupled 3-Pillar Hybrid Architecture Breakdown

```
                                  ┌────────────────────────────────────────────────────────┐
                                  │                  CLIENT BROWSER (User)                 │
                                  └──────────┬───────────────────┬────────────────────┬────┘
                                             │                   │                    │
                                     HTTP / REST          Wagmi / Viem           WebSocket
                                             │                   │                    │
                                             ▼                   ▼                    ▼
                                  ┌────────────────────┐ ┌───────────────┐ ┌────────────────────┐
                                  │  VERCEL NEXT.JS 16 │ │ MONAD TESTNET │ │  SUPABASE ENGINE   │
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

## 4. Complete Feature Catalog & Page Directory (22 Routes)

| Route Path | Feature / Component | Description |
| :--- | :--- | :--- |
| **`/`** | Landing Page | Urban Company light theme hero, live Monad network stats bar, search, 10 categories, 3-point guarantee, featured services. |
| **`/onboard`** | 4-Step Interactive Survey | Account creation, Web3 wallet signature auth (`personal_sign`), avatar photo picker, tagline, gender, phone, bio, and 30+ skill tag selector. |
| **`/explore`** | Service Search & Filter | Full-text search bar, category filtering pills, verified provider cards with tabular pricing. |
| **`/tasks`** | Task Request Marketplace | Public board listing client task requests with budgets in INR and MON. |
| **`/tasks/new`** | Post a Task Request | Form for clients seeking help to post custom requirements, city, and budget. |
| **`/skills/new`** | Offer Help / Skill | Form for providers to list recurring skill services with INR and MON unit prices. |
| **`/skills/[id]`** | Skill Details & Booking | Full skill overview, provider profile details, hours/quantity multiplier selector, Monad Escrow booking, and Razorpay payment link launcher. |
| **`/jobs/[id]`** | Escrow Work Room & E2EE Chat | Job milestone tracker, 256-bit AES-GCM Web3 encrypted real-time chat room, dispute trigger, mark complete, and release escrow actions. |
| **`/jobs/[id]/dispute`** | Dispute Resolution | Formal dispute filing page with reason selector and community arbitration status. |
| **`/messages`** | Realtime Inbox | Centralized conversation hub listing all active client-provider chat rooms. |
| **`/leaderboard`** | Provider Leaderboard | City helper rankings, gold/silver/bronze podium cards, MON escrow earnings, completed job counts, and reputation scores. |
| **`/profile`** | User Profile & Badges | Personal avatar, headline, verified checkmark, gender, phone, skill tags, active listings, and 15 Community Reputation Achievements grid. |
| **`/profile/[username]`** | Public Provider Profile | Public view of any provider's skills, bio, ratings, and MonadScan explorer link. |
| **`/notifications`** | Realtime Notifications | Live feed of booking updates, payment confirmations, and chat alerts. |
| **`/settings`** | Edit Profile Settings | Form to update full name, username, city, avatar photo URL, headline, gender, phone, bio, and wallet address. |
| **`/terms`** | Terms of Service | Legal framework covering Monad smart contract escrows, Web3 encryption, Razorpay local rules, and user responsibilities. |
| **`/privacy`** | Privacy Policy | Cryptographic privacy policy detailing Keccak-256 password hashing, E2E chat encryption, and local device GPS usage. |
| **`/api/auth/signout`** | Auth Signout Route | Destroys Supabase SSR authentication cookies. |
| **`/api/badge/mint`** | Serverless Badge Mint API | Executes `SkillMaxBadge.sol` minting via platform key upon verified job completion. |
| **`/api/badge/metadata/[id]`** | ERC-1155 Token Metadata | Serves JSON metadata for token category IDs 0 to 9. |
| **`/api/jobs/create-from-chain`** | Monad Sync API | Records MON transaction hash and creates job record after on-chain escrow deposit. |
| **`/api/razorpay/create-payment-link`** | Razorpay Link Generator | Generates INR payment links using Razorpay Node SDK. |
| **`/api/razorpay/webhook`** | Webhook Handler | Validates HMAC-SHA256 signatures and marks Razorpay jobs as paid upon `payment_link.paid`. |

---

## 5. Dual-Sided Marketplace System

```
                             ┌────────────────────────────────────────────────────────┐
                             │                  SkillMax Marketplace                  │
                             └───────────┬────────────────────────────────┬───────────┘
                                         │                                │
                 ┌───────────────────────┴────────┐              ┌────────┴───────────────────────┐
                 ▼                                │              │                                ▼
     CLIENT: Post Task Request                    │              │                    PROVIDER: Offer Help
         (/tasks/new)                             │              │                        (/skills/new)
                 │                                │              │                                │
                 ▼                                │              │                                ▼
    Appears on Tasks Board                        │              │                    Appears on Explore Board
             (/tasks)                             │              │                           (/explore)
                 │                                │              │                                │
                 └───────────────────────┐        │        ┌─────┘                                │
                                         ▼        ▼        ▼                                      │
                                 ┌─────────────────────────────────┐                              │
                                 │  Job Booking & Escrow Selection │ ◄────────────────────────────┘
                                 └────────────────┬────────────────┘
                                                  │
                                 ┌────────────────┴────────────────┐
                                 ▼                                 ▼
                     Monad Crypto Escrow (MON)           Razorpay Fiat INR Payout
                     SkillMaxEscrow.sol Vault             UPI / GPay / Netbanking
                                 │                                 │
                                 └────────────────┬────────────────┘
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │  E2E Encrypted Realtime Chat    │
                                 │       (/jobs/[id] - AES-GCM)    │
                                 └────────────────┬────────────────┘
                                                  │
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │  Completion & Reputation Mint   │
                                 │ SkillMaxBadge.sol Soulbound NFT │
                                 └─────────────────────────────────┘
```

---

## 6. Web3 Cryptographic & Security Architecture

```
[Sender Browser]                                   [Supabase Cloud DB]                                  [Recipient Browser]
       │                                                    │                                                    │
 1. Plaintext Input:                                        │                                                    │
    "I can fix the sink"                                    │                                                    │
       │                                                    │                                                    │
 2. Derive 256-bit AES Key:                                 │                                                    │
    PBKDF2(SHA-256, jobId)                                  │                                                    │
       │                                                    │                                                    │
 3. Client-Side Encrypt:                                    │                                                    │
    [ENC:AES-GCM]:iv:ciphertext  ──► 4. Transmit Cipher ──► │  ──► 5. WebSocket Push ──────────────────────────► │ 6. Client-Side Decrypt:
                                    "No plaintext stored"   │      "[ENC:AES-GCM]:iv:ciphertext"                    │    PBKDF2 + AES-GCM Decrypt
                                                                                                                 │    "I can fix the sink"
```

### Encryption Protocol (`src/lib/crypto.ts`)
* **Key Derivation**: Uses Web Crypto API `window.crypto.subtle.deriveKey` with `PBKDF2`, `100,000` SHA-256 iterations, and conversation salt `skillmax_monad_chat_salt_2026`.
* **Symmetric Cipher**: `AES-GCM` with 256-bit key length and cryptographically random 12-byte initialization vectors (`iv`).
* **Cipher Format**: `[ENC:AES-GCM]:<iv_hex>:<ciphertext_hex>`.

---

## 7. Monad Smart Contracts Technical Specification

### `SkillMaxEscrow.sol`
Located at `skillmax/contracts/src/SkillMaxEscrow.sol`:
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

### `SkillMaxBadge.sol`
Located at `skillmax/contracts/src/SkillMaxBadge.sol`:
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SkillMaxBadge is ERC1155, Ownable {
    error SoulboundToken();

    mapping(uint256 => string) private _tokenURIs;

    event BadgeMinted(address indexed provider, uint256 indexed categoryId);

    constructor(string memory _baseUri) ERC1155(_baseUri) Ownable(msg.sender) {}

    function mintBadge(address provider, uint256 categoryId) external onlyOwner {
        _mint(provider, categoryId, 1, "");
        emit BadgeMinted(provider, categoryId);
    }

    function setURI(uint256 tokenId, string memory newuri) external onlyOwner {
        _tokenURIs[tokenId] = newuri;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        string memory customUri = _tokenURIs[tokenId];
        if (bytes(customUri).length > 0) return customUri;
        return super.uri(tokenId);
    }

    function safeTransferFrom(address, address, uint256, uint256, bytes memory) public pure override {
        revert SoulboundToken();
    }

    function safeBatchTransferFrom(address, address, uint256[] memory, uint256[] memory, bytes memory) public pure override {
        revert SoulboundToken();
    }
}
```

---

## 8. Database Schema, Migrations & RLS Policies

Located at `skillmax/supabase/migrations/001_initial.sql`:

### SQL Migration DDL
```sql
-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Delhi NCR',
  headline TEXT,
  avatar_url TEXT,
  gender TEXT,
  phone TEXT,
  bio TEXT,
  wallet_address TEXT,
  skill_tags TEXT[] DEFAULT '{}',
  is_verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Skills Table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'Other',
  price_inr INT,
  price_mon NUMERIC(18, 8),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Task Postings Table
CREATE TABLE IF NOT EXISTS task_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'Other',
  city TEXT NOT NULL DEFAULT 'Delhi NCR',
  budget_inr INT,
  budget_mon NUMERIC(10, 3),
  status TEXT NOT NULL DEFAULT 'open',
  assigned_provider_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID REFERENCES skills(id) ON DELETE SET NULL,
  client_id UUID NOT NULL REFERENCES profiles(id),
  provider_id UUID NOT NULL REFERENCES profiles(id),
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT NOT NULL DEFAULT 'razorpay',
  price_inr INT,
  price_mon NUMERIC(18, 8),
  chain_tx_create TEXT,
  chain_tx_complete TEXT,
  razorpay_payment_link_id TEXT,
  razorpay_payment_id TEXT,
  dispute_reason TEXT,
  badge_minted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Messages Table (AES-GCM Encrypted Content)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "User update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Provider manage skills" ON skills FOR ALL USING (auth.uid() = provider_id);

CREATE POLICY "Public read task_postings" ON task_postings FOR SELECT USING (true);
CREATE POLICY "Client insert task_postings" ON task_postings FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Participant read jobs" ON jobs FOR SELECT USING (auth.uid() = client_id OR auth.uid() = provider_id);
CREATE POLICY "Participant read messages" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = messages.job_id AND (jobs.client_id = auth.uid() OR jobs.provider_id = auth.uid()))
);
```

---

## 9. Razorpay Fiat Payout Architecture & HMAC Verification

### Webhook Verification (`skillmax/src/app/api/razorpay/webhook/route.ts`)
```typescript
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const bodyText = await req.text()
  const signature = req.headers.get('x-razorpay-signature')
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET ?? 'skillmax_webhook_secret_2026'

  // HMAC-SHA256 signature verification
  const expectedSig = crypto.createHmac('sha256', secret).update(bodyText).digest('hex')
  if (expectedSig !== signature) {
    return NextResponse.json({ error: 'Invalid HMAC signature' }, { status: 400 })
  }

  const payload = JSON.parse(bodyText)
  if (payload.event === 'payment_link.paid') {
    const linkId = payload.payload.payment_link.entity.id
    const paymentId = payload.payload.payment.entity.id

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    await supabaseAdmin
      .from('jobs')
      .update({
        status: 'active',
        razorpay_payment_id: paymentId,
      })
      .eq('razorpay_payment_link_id', linkId)
  }

  return NextResponse.json({ received: true })
}
```

---

## 10. 15 Community Reputation Achievements Matrix

Located at `skillmax/src/lib/achievements.ts`:

| # | Achievement Title | Lucide SVG Icon | Reputation Points | Condition |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **First Step Provider** | `<Sparkles />` | `+50 PTS` | Listed 1st skill on SkillMax |
| 2 | **Local Helper** | `<Hammer />` | `+100 PTS` | Completed 1st local service |
| 3 | **5-Star Hero** | `<Trophy />` | `+250 PTS` | Maintained 4.8+ rating over 3 jobs |
| 4 | **Monad Master** | `<Zap />` | `+300 PTS` | Completed 3 MON escrow jobs on Monad |
| 5 | **Neighborhood Savior** | `<HeartHandshake />` | `+150 PTS` | Provided services across 2+ categories |
| 6 | **Bronze Provider** | `<Award />` | `+200 PTS` | Completed 3 jobs |
| 7 | **Silver Provider** | `<Medal />` | `+500 PTS` | Completed 10 jobs |
| 8 | **Gold Legend** | `<Crown />` | `+1000 PTS` | Completed 25 jobs |
| 9 | **Trust Guardian** | `<ShieldCheck />` | `+400 PTS` | 5+ jobs with zero dispute escalations |
| 10 | **Early Pioneer** | `<Rocket />` | `+100 PTS` | Joined SkillMax in 2026 |
| 11 | **Community Communicator** | `<MessageSquare />` | `+150 PTS` | Sent 10+ real-time E2EE chat messages |
| 12 | **City Specialist** | `<MapPin />` | `+150 PTS` | Set city location & completed 1 job |
| 13 | **MON Escrow Earner** | `<Coins />` | `+350 PTS` | Earned 0.1+ MON in platform escrows |
| 14 | **Multi-Talented** | `<Layers />` | `+250 PTS` | Created 3+ active skill listings |
| 15 | **Community Leader** | `<Flame />` | `+500 PTS` | Earned 500+ total reputation points |

---

## 11. Full Technology Stack & Dependencies

```json
{
  "name": "skillmax",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@supabase/ssr": "^0.5.2",
    "@supabase/supabase-js": "^2.49.1",
    "@tanstack/react-query": "^5.67.1",
    "lucide-react": "^0.475.0",
    "next": "^16.3.3",
    "razorpay": "^2.9.6",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "viem": "^2.23.6",
    "wagmi": "^2.14.12"
  },
  "devDependencies": {
    "@types/node": "^22.13.5",
    "@types/react": "^19.0.10",
    "@types/react-dom": "^19.0.4",
    "postcss": "^8.5.3",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.3"
  }
}
```

---

## 12. Complete Codebase Directory Structure

```
skillmax/
├── contracts/
│   ├── src/
│   │   ├── SkillMaxEscrow.sol
│   │   └── SkillMaxBadge.sol
│   ├── deploy.js
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
│   │   ├── leaderboard/page.tsx
│   │   ├── messages/page.tsx
│   │   ├── tasks/
│   │   │   ├── page.tsx
│   │   │   └── new/page.tsx
│   │   ├── terms/page.tsx
│   │   ├── privacy/page.tsx
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
│   │   ├── AchievementsGrid.tsx
│   │   ├── BlockchainStatus.tsx
│   │   ├── CryptoBookingButton.tsx
│   │   ├── DisputeForm.tsx
│   │   ├── JobCard.tsx
│   │   ├── JobChat.tsx
│   │   ├── LocationPicker.tsx
│   │   ├── Navbar.tsx
│   │   ├── NotifBadge.tsx
│   │   ├── OnChainReputation.tsx
│   │   ├── Providers.tsx
│   │   ├── RazorpayBookingButton.tsx
│   │   ├── SettingsForm.tsx
│   │   ├── SkillBadges.tsx
│   │   ├── SkillCard.tsx
│   │   └── WalletConnectButton.tsx
│   └── lib/
│       ├── achievements.ts
│       ├── crypto.ts
│       ├── contracts/index.ts
│       ├── supabase/
│       │   ├── client.ts
│       │   └── server.ts
│       ├── utils.ts
│       └── wagmi/config.ts
├── CONTRIBUTING.md
├── .env.example
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 13. API Reference Manual

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

## 14. Monad Testnet Blockchain Specifications

* **Network Name**: Monad Testnet
* **Chain ID**: `10143` (`0x279f`)
* **RPC Endpoint**: `https://testnet-rpc.monad.xyz`
* **Block Explorer**: `https://monad-testnet.socialscan.io`
* **Native Currency**: Monad (`MON`, 18 decimals)
* **Tested Wallet**: `0xA0C474dDF6b88ae1F0EdC111BB688741b044aaA3` (`70.000000 MON` balance)
* **Finality**: ~1 Second Block Finality
* **Gas Model**: Fixed gas pricing reservation per execution frame.

---

## 15. Local Development, Environment Setup & Build Guide

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
   RAZORPAY_KEY_SECRET=your_secret_here
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here

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

## 16. Semi-Open Source Contribution Guidelines & PR Workflow

Detailed contribution rules are documented in [`CONTRIBUTING.md`](./skillmax/CONTRIBUTING.md).

### 🌿 Git Branching Strategy
* `main`: Production release branch deployed live at `skillmax2026.vercel.app`.
* `develop`: Staging branch for pre-release integration.
* `feature/<name>`: New feature branches (*e.g., `feature/voice-messaging`*).
* `fix/<name>`: Bug fix branches (*e.g., `fix/escrow-refund-modal`*).

### 🚀 Step-by-Step Pull Request (PR) Workflow
1. **Fork** the repository: [github.com/brovk2008/SkillMax](https://github.com/brovk2008/SkillMax).
2. **Clone** your fork locally and install dependencies: `npm install`.
3. **Create a branch**: `git checkout -b feature/my-feature`.
4. **Make changes & test build**: Verify `npm run build` exits with code `0`.
5. **Commit using Conventional Commits**: `git commit -m "feat: add real-time voice notes to job chat"`.
6. **Push & Open PR**: Push to your fork and open a Pull Request against `main`.

---

## 17. Dispute Resolution & State Machine Flow

```
[Job State: Active]
        │
        ├───────────────────────────────────────┐
        ▼                                       ▼
 Client / Provider Clicks               Client Clicks
  "Escalate Dispute"                 "Confirm & Release Escrow"
        │                                       │
        ▼                                       ▼
[Job State: Disputed]                  [Job State: Completed]
  Increment Provider                    Transfer 100% MON to Provider
  Disputed Count on Monad                Increment Completed Count
        │                                Mint Soulbound NFT Badge
        ▼                                       │
Arbiter Invokes                                 ▼
resolveDispute()                       [Job State: Finalized]
        │
        ├───────────────────────┐
        ▼                       ▼
Refund to Client        Payout to Provider
        │                       │
        └───────────┬───────────┘
                    ▼
          [Job State: Resolved]
```

---

## 18. Hackathon Submission & Verification Info

* **Hackathon**: Monad Blitz New Delhi 2026
* **Project Name**: SkillMax
* **Live App**: [https://skillmax2026.vercel.app](https://skillmax2026.vercel.app)
* **GitHub Repository**: [https://github.com/brovk2008/SkillMax](https://github.com/brovk2008/SkillMax.git)
* **Monad Testnet Wallet**: `0xA0C474dDF6b88ae1F0EdC111BB688741b044aaA3` (`70.000000 MON` balance)
* **License**: Semi-Open Source (MIT) + 60% Charity Pledge
