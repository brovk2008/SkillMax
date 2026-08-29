# Contributing to SkillMax 🤝

Welcome to **SkillMax**! We are thrilled you want to contribute to the world's first decentralized, trust-minimized local skill marketplace built on **Monad Blockchain**, **Supabase**, and **Razorpay**.

SkillMax operates as a **Semi-Open Source Protocol**:
* **Public Codebase**: Open for community contributions, feature additions, security audits, and UX improvements.
* **Social Impact**: **60% of all protocol revenues and fees are donated to verified local community charities** and vocational skill development funds in India and globally.

---

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Our Mission & 60% Charity Pledge](#our-mission--60-charity-pledge)
3. [Branching Strategy](#branching-strategy)
4. [Pull Request (PR) Workflow](#pull-request-pr-workflow)
5. [Commit Message Standards](#commit-message-standards)
6. [Code Style & UI Standards](#code-style--ui-standards)
7. [Reporting Bugs & Requesting Features](#reporting-bugs--requesting-features)
8. [Security Disclosures](#security-disclosures)

---

## 🤝 Code of Conduct

SkillMax is committed to fostering an inclusive, welcoming, and harassment-free community for all contributors regardless of background, identity, or skill level. Please be respectful, collaborative, and constructive in all pull requests, code reviews, and issue discussions.

---

## 💖 Our Mission & 60% Charity Pledge

SkillMax is not just a commercial application — it is a community-driven protocol designed to empower local gig workers and give back to society:
* **60% Protocol Fee Donation**: 60% of all platform transaction fees collected by the escrow protocol are donated to verified local charities, educational initiatives, and vocational training funds.
* **On-Chain Transparency**: Donation proofs and wallet transaction receipts are logged on the Monad Blockchain for 100% public verifiability.

---

## 🌿 Branching Strategy

We follow a structured Git branching model to ensure production stability on Vercel:

| Branch Name | Purpose | Protection Rule |
| :--- | :--- | :--- |
| `main` | Production release branch deployed live at `skillmax2026.vercel.app` | Requires passing build checks & review |
| `develop` | Staging integration branch for testing upcoming releases | Tested before merging into `main` |
| `feature/<name>` | New feature branches (*e.g. `feature/voice-search`*) | Created off `develop` or `main` |
| `fix/<name>` | Bug fix branches (*e.g. `fix/escrow-receipt-modal`*) | Created off `main` or `develop` |

---

## 🚀 Pull Request (PR) Workflow

To contribute code to SkillMax:

1. **Fork the Repository**:
   Click the **Fork** button on top of [github.com/brovk2008/SkillMax](https://github.com/brovk2008/SkillMax).

2. **Clone Your Fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/SkillMax.git
   cd SkillMax/skillmax
   ```

3. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/amazing-new-feature
   ```

4. **Install Dependencies & Set Up Environment**:
   ```bash
   npm install
   ```
   Copy `.env.example` to `.env.local` and add your local development credentials.

5. **Make Your Changes & Verify Build**:
   Before committing, verify that TypeScript compilation and production build pass with **0 errors**:
   ```bash
   npm run build
   ```

6. **Commit Your Changes**:
   Follow our [Commit Message Standards](#commit-message-standards):
   ```bash
   git commit -m "feat: add real-time voice messaging support for task requests"
   ```

7. **Push to Your Fork & Open a Pull Request**:
   ```bash
   git push origin feature/amazing-new-feature
   ```
   Open a Pull Request against the `main` branch of `brovk2008/SkillMax`.

---

## 📝 Commit Message Standards

We enforce **Conventional Commits**:

* `feat:` A new user-facing feature (*e.g., `feat: implement 256-bit AES-GCM chat encryption`*)
* `fix:` A bug fix (*e.g., `fix: handle null wallet address in reputation score`*)
* `docs:` Documentation changes (*e.g., `docs: update API endpoints in README`*)
* `style:` UI/CSS polish, typography adjustments, formatting (*e.g., `style: apply baseline-ui text-balance`*)
* `refactor:` Code restructuring without functional changes (*e.g., `refactor: extract CryptoBookingButton`*)
* `test:` Adding or updating unit/integration tests (*e.g., `test: add Foundry escrow tests`*)

---

## 🎨 Code Style & UI Standards

When modifying frontend components or adding new pages:

1. **Strict 100% Light Theme**: Do NOT use dark backgrounds (`bg-gray-900`, `bg-black`, dark gradients). Use clean Slate/Neutral backgrounds (`bg-white`, `bg-slate-50`).
2. **Color Palette**: Primary accent MUST be Emerald Green (`bg-emerald-600`, `text-emerald-700`). Do NOT use purple or blue buttons/headers.
3. **Icons & SVG**: Use `lucide-react` SVG icons. Do NOT use raw emojis or unicode characters in production components.
4. **Baseline UI Enforcements**:
   - Use `text-balance` on headings and `text-pretty` on body paragraphs.
   - Use `tabular-nums` for prices, MON amounts, ratings, and stats counters.
   - Use `size-*` for square icon containers instead of `w-*` + `h-*`.
5. **Next.js 16 App Router Compliance**:
   - `cookies()` must be awaited (`await cookies()`).
   - Dynamic route params must be awaited (`params: Promise<{ id: string }>`).

---

## 🐛 Reporting Bugs & Requesting Features

### Submitting a Bug Report
Open a GitHub Issue using the **Bug Report** template:
* Describe the expected behavior vs actual behavior.
* Include screenshots, browser console logs, or Monad Explorer transaction hashes.
* Provide exact steps to reproduce.

### Proposing a Feature
Open a GitHub Issue with the tag `enhancement`:
* Detail the user problem the feature solves.
* Explain the technical approach (Supabase tables, Monad smart contract calls, UI layout).

---

## 🔒 Security Disclosures

If you discover a potential security vulnerability in our smart contracts (`SkillMaxEscrow.sol`, `SkillMaxBadge.sol`), Web3 E2E encryption (`crypto.ts`), or API routes, please **do NOT open a public issue**.

Instead, send a private security report to `security@skillmax.eth` or contact the core maintainers directly via GitHub. Vulnerability reports are evaluated promptly and eligible for bug bounty awards.

---

Thank you for helping build a fairer, semi-open source local economy on **Monad Blockchain**! 🚀
