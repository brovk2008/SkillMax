# ⚡ SkillMax — Decentralized Local Skill Marketplace
### *Powered by Monad Blockchain, Supabase & Razorpay*

[![Live Production](https://img.shields.io/badge/Vercel-Live_Production-000000?style=for-the-badge&logo=vercel)](https://skillmax2026.vercel.app)
[![Monad Testnet](https://img.shields.io/badge/Monad-Testnet_10143-8A2BE2?style=for-the-badge&logo=ethereum)](https://monad-testnet.socialscan.io)
[![Database](https://img.shields.io/badge/Supabase-PostgreSQL_%2B_Realtime-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Payments](https://img.shields.io/badge/Razorpay-INR_Payment_Rails-02042B?style=for-the-badge&logo=razorpay)](https://razorpay.com)
[![Web3 Encryption](https://img.shields.io/badge/Web3_E2EE-AES--GCM_256--Bit-00C853?style=for-the-badge&logo=shield)](https://skillmax2026.vercel.app/privacy)
[![License](https://img.shields.io/badge/License-Semi--Open_Source_MIT-blue?style=for-the-badge)](./CONTRIBUTING.md)
[![Charity Pledge](https://img.shields.io/badge/Charity_Pledge-60%25_Fee_Donation-ff69b4?style=for-the-badge)](./CONTRIBUTING.md#our-mission--60-charity-pledge)

**SkillMax** is a semi-open source, decentralized, trust-minimized local freelance and skill-sharing marketplace created for **Monad Blitz New Delhi 2026**.

---

## 💖 Semi-Open Source & 60% Charity Pledge

SkillMax is governed by a **Semi-Open Source Public Social Impact Protocol**:
* **60% Protocol Fee Charity Donation**: **60% of all platform transaction fees and escrow charges are donated directly to verified local community charities**, educational funds, and vocational training programs for underprivileged gig workers.
* **On-Chain Donation Auditing**: Every donation receipt and treasury disbursement is logged transparently on the Monad Blockchain.
* **Semi-Open Source Development**: Anyone in the global developer community can fork, review code, submit pull requests, audit security, and build features to improve SkillMax.

---

## 📋 Table of Contents

1. [What SkillMax Does & How It Works](#1-what-skillmax-does--how-it-works)
2. [How SkillMax Handles Key Operations](#2-how-skillmax-handles-key-operations)
3. [How Users & Providers Use SkillMax](#3-how-users--providers-use-skillmax)
4. [Dual-Sided Marketplace System](#4-dual-sided-marketplace-system)
5. [Web3 Cryptographic & Security Architecture](#5-web3-cryptographic--security-architecture)
6. [Full Technology Stack](#6-full-technology-stack)
7. [Monad Smart Contracts Architecture](#7-monad-smart-contracts-architecture)
8. [Database Schema & Realtime Architecture](#8-database-schema--realtime-architecture)
9. [Directory Structure](#9-directory-structure)
10. [Professional Semi-Open Source Contribution & PR Workflow](#10-professional-semi-open-source-contribution--pr-workflow)
11. [Local Development & Setup Guide](#11-local-development--setup-guide)
12. [API Reference Manual](#12-api-reference-manual)
13. [Hackathon Submission & Verification Info](#13-hackathon-submission--verification-info)

---

## 1. What SkillMax Does & How It Works

### The Core Problem
Traditional gig platforms (UrbanCompany, Fiverr, Upwork) act as centralized middlemen:
* They extract **20% to 30% transaction cuts** from hard-working local providers.
* They hold user funds in centralized bank accounts subject to arbitrary freezes.
* They control provider reviews behind closed databases, where ratings can be edited, deleted, or shadowbanned.

### The SkillMax Hybrid Architecture
SkillMax decouples marketplace operations into 3 specialized layers:

$$\text{Supabase (Marketplace Engine)} + \text{Razorpay (Fiat INR Money)} + \mathbf{Monad\ Blockchain\ (Unforgeable\ Trust)}$$

1. **Supabase (Marketplace Engine)**: High-speed full-text search, user profile metadata, task request postings, WebSocket real-time channels, and Row-Level Security (RLS).
2. **Monad Testnet (Trust Engine)**: Non-custodial MON escrow vaults (`SkillMaxEscrow.sol`), 1-second automated payout settlement, on-chain 100-precision rating math, Web3 wallet signature authentication, and soulbound ERC-1155 reputation badges (`SkillMaxBadge.sol`).
3. **Razorpay (Fiat Money)**: Seamless local INR payments via automated Payment Links and HMAC-SHA256 verified webhooks for users without crypto wallets.

---

## 2. How SkillMax Handles Key Operations

### A. Non-Custodial Monad Crypto Escrow
* When a client books a service or accepts a task request with `MON` tokens, the exact payment amount (*e.g., 0.100 MON*) is locked in `SkillMaxEscrow.sol`.
* **Zero Platform Custody**: Neither SkillMax admins nor third parties can touch or divert locked escrow funds.
* **1-Second Automated Release**: When the client clicks **"Confirm & Release Escrow"**, Monad's sub-second block time executes `completeJob()` and transfers 100% of escrowed MON directly to the provider's wallet in **~1 second**.

### B. Web3 End-to-End Chat Encryption (E2EE)
* All chat communications inside job rooms (`/jobs/[id]`) are encrypted client-side in the browser using **256-bit AES-GCM** with **PBKDF2 SHA-256** key derivation (`src/lib/crypto.ts`).
* **Zero Plaintext Saved**: Only encrypted cipherstrings (`[ENC:AES-GCM]:iv:ciphertext`) travel over Supabase WebSockets or get saved in PostgreSQL.

### C. Soulbound On-Chain Reputation Badges
* When a provider completes jobs in specific categories (e.g. Programming, Repair, Tutoring), `SkillMaxBadge.sol` automatically mints a non-transferable ERC-1155 NFT badge to their wallet on Monad.
* **Unforgeable Proof of Work**: Badges cannot be sold, transferred, or bought. Anyone can verify a provider's credentials on **Monad Explorer** (`monad-testnet.socialscan.io`).

### D. Dual Payment Payout System
* **Crypto Track**: Lock MON in smart contract escrow with sub-cent gas fees.
* **Fiat Track**: Generate Razorpay Payment Links for UPI, Google Pay, PhonePe, Paytm, Cards, or Netbanking.

---

## 3. How Users & Providers Use SkillMax

### 👤 For Clients (Need Help / Hiring)
1. **Option A — Browse Skills**: Visit [`/explore`](https://skillmax2026.vercel.app/explore) to search local services (*Electrician, Tutoring, Web Design, Plumbing*).
2. **Option B — Post a Task**: Visit [`/tasks/new`](https://skillmax2026.vercel.app/tasks/new) to post a custom task request with requirements, city location, and custom budget (INR/MON).
3. **Select Quantity/Hours**: Use the quantity multiplier (`+` / `-`) on skill detail pages.
4. **Choose Payment Rail**:
   * **Monad Escrow**: Click `Pay MON (Monad Escrow)` to lock funds on-chain.
   * **Razorpay Fiat**: Click `Pay with Razorpay` to scan a UPI QR code or pay via card.
5. **Real-Time E2E Encrypted Chat**: Communicate securely with the provider in [`/jobs/[id]`](https://skillmax2026.vercel.app/jobs/1).
6. **Confirm & Rate**: Review completed work, click **"Release Escrow"**, and leave a 1-5 star rating recorded permanently on Monad.

### 🛠️ For Providers (Available to Work / Earning)
1. **Interactive Onboarding**: Complete the 4-step survey on [`/onboard`](https://skillmax2026.vercel.app/onboard) (select avatar photo, headline, gender, phone, bio, and 30+ skill tags).
2. **Offer Help / List Service**: Create skill listings on [`/skills/new`](https://skillmax2026.vercel.app/skills/new) with custom unit prices in INR and MON.
3. **Browse Open Tasks**: Visit [`/tasks`](https://skillmax2026.vercel.app/tasks) to view tasks posted by local neighbors and click **"Accept Task"** to begin work.
4. **Climb Leaderboard & Earn Badges**: Earn reputation points (`PTS`), climb the city provider leaderboard ([`/leaderboard`](https://skillmax2026.vercel.app/leaderboard)), and collect Soulbound NFT badges.

---

## 4. Dual-Sided Marketplace System

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

## 5. Web3 Cryptographic & Security Architecture

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

---

## 6. Full Technology Stack

| Layer | Technology | Purpose / Configuration |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Server Components, Turbopack, Dynamic API Routes |
| **Language** | TypeScript (ES2022) | Strict type safety across client, server, & contract ABIs |
| **Styling** | Vanilla CSS + Tailwind CSS | Urban Company inspired 100% light theme (Emerald/Slate) |
| **UI Skills** | `baseline-ui` & `improve-ui` | `text-balance`, `text-pretty`, `tabular-nums`, `size-*` |
| **Icons & SVG** | Lucide React | 100% emoji-free SVG icon system |
| **Blockchain** | Monad Testnet | Chain ID: `10143`, Native Token: `MON` |
| **Smart Contracts** | Solidity `0.8.24` + Foundry | `SkillMaxEscrow.sol` and `SkillMaxBadge.sol` |
| **Web3 Client** | Wagmi v2 + Viem | Web3 wallet signature auth & Monad RPC integration |
| **Encryption** | Web Crypto API (AES-GCM 256) | Client-side E2EE for real-time messages (`crypto.ts`) |
| **Database** | Supabase PostgreSQL | Relational database with RLS policies & migration scripts |
| **Auth** | Supabase Auth (SSR) + Web3 Sign | Email/Password & Web3 wallet signature authentication |
| **Realtime Engine** | Supabase Realtime | WebSocket channels for live job chat & unread badges |
| **Fiat Payments** | Razorpay Node SDK | Payment Links API v1 + HMAC-SHA256 Webhook Verification |
| **Hosting & Infra** | Vercel | Production deployment with Turbopack & edge routing |

---

## 7. Monad Smart Contracts Architecture

### `SkillMaxEscrow.sol`
* **Address**: Monad Testnet Deployed
* **State Storage**:
  - `arbiter`: Platform arbiter empowered to resolve disputed funds.
  - `jobs`: Mapping `uint256 => Job` containing provider, client, escrowed amount, status enum (`Active`, `Completed`, `Disputed`, `Resolved`), and rating flag.
  - `reputations`: Mapping `address => Reputation` containing `completedJobs` (uint64), `disputedJobs` (uint64), `ratingCount` (uint64), and `totalRating100` (uint256).
* **Key Functions**:
  - `createJob(address provider) payable returns (uint256 jobId)`: Locks native MON into escrow.
  - `markComplete(uint256 jobId)`: Client transfers escrowed MON directly to provider and increments `completedJobs`. Reentrancy-safe state mutation before `.call{value: amount}("")`.
  - `raiseDispute(uint256 jobId)`: Freezes escrowed funds and increments `disputedJobs`.
  - `resolveDispute(uint256 jobId, address winner)`: Arbiter awards escrowed MON to either client or provider.
  - `rateProvider(uint256 jobId, uint8 rating)`: Updates `totalRating100` for fixed-point integer precision.

### `SkillMaxBadge.sol`
* **Soulbound Standard**: Inherits from OpenZeppelin `ERC1155` and `Ownable`.
* **Category Mapping**: Token IDs `0-9` map to 10 skill categories (Programming, Design, Tutoring, Music, Fitness, Languages, Photography, Repair, Cooking, Other).
* **Transfer Blocking**: Overrides `safeTransferFrom` and `safeBatchTransferFrom` to unconditionally revert with `SoulboundToken()`, ensuring badges cannot be sold, transferred, or traded.
* **Platform Minting**: Only callable by `onlyOwner` server-side wallet via `/api/badge/mint` upon job completion.

---

## 8. Database Schema & Realtime Specifications

Located at `supabase/migrations/001_initial.sql` & DB queries:

1. **`profiles`**: `id`, `email`, `username`, `full_name`, `city`, `headline`, `avatar_url`, `gender`, `phone`, `bio`, `wallet_address`, `skill_tags[]`, `is_verified`.
2. **`skills`**: `id`, `provider_id`, `title`, `description`, `category`, `price_inr`, `price_mon`, `is_active`.
3. **`task_postings`**: `id`, `client_id`, `title`, `description`, `category`, `city`, `budget_inr`, `budget_mon`, `status`, `assigned_provider_id`.
4. **`jobs`**: `id`, `skill_id`, `client_id`, `provider_id`, `status`, `payment_method`, `price_inr`, `price_mon`, `chain_tx_create`, `chain_tx_complete`, `razorpay_payment_link_id`.
5. **`messages`**: `id`, `job_id`, `sender_id`, `content` (256-bit AES-GCM ciphertext), `created_at`.
6. **`notifications`**: `id`, `user_id`, `job_id`, `message`, `is_read`.

---

## 9. Directory Structure

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

## 10. Professional Semi-Open Source Contribution & PR Workflow

Detailed contribution rules are documented in [`CONTRIBUTING.md`](./CONTRIBUTING.md).

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

   RAZORPAY_KEY_ID=rzp_live_TNjguD8s86pvzS
   RAZORPAY_KEY_SECRET=your_secret
   RAZORPAY_WEBHOOK_SECRET=skillmax_webhook_secret_2026

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

## 13. Hackathon Submission & Verification Info

* **Hackathon**: Monad Blitz New Delhi 2026
* **Project Name**: SkillMax
* **Live App**: [https://skillmax2026.vercel.app](https://skillmax2026.vercel.app)
* **GitHub Repository**: [https://github.com/brovk2008/SkillMax](https://github.com/brovk2008/SkillMax.git)
* **Monad Testnet Wallet**: `0xA0C474dDF6b88ae1F0EdC111BB688741b044aaA3` (`70.000000 MON` balance)
* **License**: Semi-Open Source (MIT) + 60% Charity Pledge
