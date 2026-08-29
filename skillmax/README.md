# SkillMax — Local Skill Marketplace Powered by Monad, Supabase & Razorpay

[![Live Production](https://img.shields.io/badge/Vercel-Live_Production-000000?style=for-the-badge&logo=vercel)](https://skillmax2026.vercel.app)
[![Monad Testnet](https://img.shields.io/badge/Monad-Testnet_10143-8A2BE2?style=for-the-badge&logo=ethereum)](https://monad-testnet.socialscan.io)
[![Database](https://img.shields.io/badge/Supabase-PostgreSQL_%2B_Realtime-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Payments](https://img.shields.io/badge/Razorpay-INR_Payment_Rails-02042B?style=for-the-badge&logo=razorpay)](https://razorpay.com)
[![Web3 Encryption](https://img.shields.io/badge/Web3_E2EE-AES--GCM_256--Bit-00C853?style=for-the-badge&logo=shield)](https://skillmax2026.vercel.app/privacy)

**SkillMax** is a decentralized, trust-minimized local freelance and skill-sharing marketplace built for **Monad Blitz New Delhi 2026**.

SkillMax operates on a strict 3-pillar architectural thesis:
* **Supabase** runs the marketplace (User profiles, 4-step survey onboarding, skill listings, task request postings, Realtime WebSocket chat, RLS security policies, and notification feeds).
* **Monad Testnet** runs the trust engine (Non-custodial native MON escrows, on-chain dispute resolution, immutable 100-precision rating math, Web3 wallet signature auth, and soulbound ERC-1155 skill badges).
* **Razorpay** runs the local fiat money (Local INR payments via automated Payment Links and HMAC-SHA256 verified webhooks).

---

## 📋 Table of Contents

1. [Executive Summary & Architecture Philosophy](#1-executive-summary--architecture-philosophy)
2. [Complete Features & Capabilities](#2-complete-features--capabilities)
3. [Dual-Sided Marketplace Workflow](#3-dual-sided-marketplace-workflow)
4. [Web3 Cryptographic & Security Architecture](#4-web3-cryptographic--security-architecture)
5. [Full Technology Stack](#5-full-technology-stack)
6. [Smart Contracts Specifications](#6-smart-contracts-specifications)
7. [Database Schema & Realtime Specifications](#7-database-schema--realtime-specifications)
8. [Directory Structure](#8-directory-structure)
9. [Monad Blockchain Specifications](#9-monad-blockchain-specifications)
10. [Razorpay Payout Specifications](#10-razorpay-payout-specifications)
11. [Local Development & Setup Guide](#11-local-development--setup-guide)
12. [API Reference Manual](#12-api-reference-manual)
13. [Hackathon Submission & Verification Info](#13-hackathon-submission--verification-info)

---

## 1. Executive Summary & Architecture Philosophy

In traditional local skill platforms (like UrbanCompany or Fiverr), central companies take 20-30% cuts, arbitrarily lock accounts, and control dispute resolution behind closed doors. Existing Web3 gig platforms fail by attempting to store heavy image assets and high-frequency chat messages directly on-chain, creating extreme transaction fees and slow UX.

SkillMax solves this with a **decoupled hybrid architecture**:
1. **Decoupled Escrow**: High-frequency metadata, full-text search, and real-time chat messages live in PostgreSQL (Supabase). Monetary commitments and dispute settlement live in smart contracts on Monad Testnet (~1s finality).
2. **Immutable On-Chain Reputation**: When a job is completed on Monad, the provider's completed job count, dispute record, and rating score are updated directly inside contract storage on Monad Explorer (`monad-testnet.socialscan.io`). No central server can manipulate or delete earned reputation.
3. **Dual Payment Rails**: Clients choose between **Crypto Native (MON)** via Monad escrow or **Fiat Local (INR)** via Razorpay.
4. **Soulbound Skill Badges**: Upon completing jobs in specific categories (e.g. Programming, Repair, Tutoring), providers receive non-transferable ERC-1155 badges minted directly to their Monad wallet address.

---

## 2. Complete Features & Capabilities

### 📋 4-Step Interactive Profile Onboarding Survey (`/onboard`)
* **Step 1: Auth**: Email/password sign-up OR instant **Web3 Wallet Signature Sign-In** (`personal_sign` / Keccak-256).
* **Step 2: Profile Persona**: Avatar photo selector (presets + custom URL), professional tagline/headline, gender selection, phone/WhatsApp number, bio, and Monad wallet address.
* **Step 3: Multi-Skill Search Catalog**: Search box filtering 30+ popular local skill tags (*Python, Plumbing, Figma, Tutoring, Electrician, Yoga, Cooking*) with custom skill tag adder.
* **Step 4: Offer Initial Service**: Optional initial service listing form.
* **Flexibility**: Prominent **"Skip for later"** button on every survey step.

### 📌 Dual-Sided Marketplace: Post Tasks & Offer Help
* **Client Task Postings (`/tasks/new`)**: Clients post open task requests detailing requirements, location, and custom budget in INR or MON.
* **Open Tasks Board (`/tasks`)**: Local providers browse open help requests, filter by category/keyword, and click **"Accept Task"** to launch instant escrow chat.
* **Provider Skill Listings (`/skills/new`)**: Providers list recurring skill services with unit pricing in INR and MON.
* **Skill Discovery (`/explore`)**: Category grids (10 categories), Urban Company 3-point guarantee banner, and search filters.

### 🔒 Web3 End-to-End Chat Encryption (`crypto.ts` & `JobChat.tsx`)
* **Client-Side E2EE**: All messages are encrypted in the browser using **256-bit AES-GCM** with **PBKDF2 SHA-256** key derivation before transmission over Supabase WebSockets.
* **Zero Plaintext Logs**: Ciphertext (`[ENC:AES-GCM]:iv:ciphertext`) is stored in the database. Neither admins nor server logs can read private conversations.
* **Live Security Badge**: Header displays `🔒 Encrypted Job Chat · AES-GCM 256-Bit E2EE`.

### 💬 Real-Time Messages Inbox (`/messages`)
* Centralized hub listing all active client-provider conversation rooms with avatar previews, category tags, latest message snippets, and quick chat links.

### 🏆 Community Leaderboard & 15 Reputation Achievements
* **Provider Leaderboard (`/leaderboard`)**: Gold, silver, and bronze podium cards for top city helpers, completed job metrics, MON escrow earnings, and reputation rankings.
* **15 Milestone Achievements (`AchievementsGrid.tsx`)**: Reputation system with Lucide SVG icons (*First Step Provider, 5-Star Hero, Monad Master, Neighborhood Savior, Gold Legend, Trust Guardian*, etc.).
* **Profile Integration (`/profile`)**: Live level titles (*Level 3 Senior Helper*), progress bars, verified badges, and skill tags.

### 📍 Browser GPS Location Tracking (`LocationPicker.tsx`)
* Uses `navigator.geolocation` for real-time device location updates (*"📍 Near Me (GPS Active)"*).

### ⏳ Quantity & Hours Multiplier Selector (`CryptoBookingButton.tsx`)
* Clients select quantity/hours (*e.g. 2 hours × 0.05 MON = 0.100 MON*), automatically recalculating exact Monad escrow deposits.

### ⚖️ Legal Framework & Governance (`/terms` & `/privacy`)
* Comprehensive Terms of Service and Privacy Policy covering Monad non-custodial escrows, Web3 encryption, Razorpay compliance, and site-wide footer integration.

---

## 3. Dual-Sided Marketplace Workflow

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

## 4. Web3 Cryptographic & Security Architecture

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

## 5. Full Technology Stack

| Layer | Technology | Purpose / Configuration |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Server Components, Turbopack, Dynamic API Routes |
| **Language** | TypeScript (ES2022) | Strict type safety across client, server, & contract ABIs |
| **Styling** | Vanilla CSS + Tailwind CSS | Urban Company inspired 100% light theme (Emerald/Slate) |
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

## 6. Smart Contracts Specifications

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

## 7. Database Schema & Realtime Specifications

Located at `supabase/migrations/001_initial.sql` & DB queries:

1. **`profiles`**: `id`, `email`, `username`, `full_name`, `city`, `headline`, `avatar_url`, `gender`, `phone`, `bio`, `wallet_address`, `skill_tags[]`, `is_verified`.
2. **`skills`**: `id`, `provider_id`, `title`, `description`, `category`, `price_inr`, `price_mon`, `is_active`.
3. **`task_postings`**: `id`, `client_id`, `title`, `description`, `category`, `city`, `budget_inr`, `budget_mon`, `status`, `assigned_provider_id`.
4. **`jobs`**: `id`, `skill_id`, `client_id`, `provider_id`, `status`, `payment_method`, `price_inr`, `price_mon`, `chain_tx_create`, `chain_tx_complete`, `razorpay_payment_link_id`.
5. **`messages`**: `id`, `job_id`, `sender_id`, `content` (256-bit AES-GCM ciphertext), `created_at`.
6. **`notifications`**: `id`, `user_id`, `job_id`, `message`, `is_read`.

---

## 8. Directory Structure

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
├── .env.example
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 9. Monad Blockchain Specifications

* **Network**: Monad Testnet
* **Chain ID**: `10143` (`0x279f`)
* **RPC URL**: `https://testnet-rpc.monad.xyz`
* **Block Explorer**: `https://monad-testnet.socialscan.io`
* **Native Token**: Monad (`MON`, 18 decimals)
* **Tested Monad Wallet Balance**: `70.000000 MON`

---

## 10. Razorpay Payout Specifications

* **API Version**: `v1/payment_links`
* **Webhook Event**: `payment_link.paid`
* **Credentials**: Key ID `rzp_live_TNjguD8s86pvzS`
* **Signature Verification**: HMAC-SHA256 digest comparison against `x-razorpay-signature` header:
  ```typescript
  const expectedSig = crypto.createHmac('sha256', secret).update(body).digest('hex')
  if (expectedSig !== signature) throw new Error('Invalid signature')
  ```

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
* **License**: MIT
