# SkillMax — Local Skill Marketplace Powered by Monad, Supabase & Razorpay

[![Live Production](https://img.shields.io/badge/Vercel-Live_Production-000000?style=for-the-badge&logo=vercel)](https://skillmax2026.vercel.app)
[![Monad Testnet](https://img.shields.io/badge/Monad-Testnet_10143-8A2BE2?style=for-the-badge&logo=ethereum)](https://monad-testnet.socialscan.io)
[![Database](https://img.shields.io/badge/Supabase-PostgreSQL_%2B_Realtime-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Payments](https://img.shields.io/badge/Razorpay-INR_Payment_Rails-02042B?style=for-the-badge&logo=razorpay)](https://razorpay.com)
[![Web3 Encryption](https://img.shields.io/badge/Web3_E2EE-AES--GCM_256--Bit-00C853?style=for-the-badge&logo=shield)](https://skillmax2026.vercel.app/privacy)

**SkillMax** is a decentralized, trust-minimized local freelance and skill-sharing marketplace built for **Monad Blitz New Delhi 2026**.

See full documentation and source code in [`skillmax/`](./skillmax/README.md).

---

## 🚀 Quick Links
* **Live Web Application**: [https://skillmax2026.vercel.app](https://skillmax2026.vercel.app)
* **GitHub Repository**: [https://github.com/brovk2008/SkillMax](https://github.com/brovk2008/SkillMax.git)
* **Monad Block Explorer**: [https://monad-testnet.socialscan.io](https://monad-testnet.socialscan.io)
* **Monad Testnet Wallet**: `0xA0C474dDF6b88ae1F0EdC111BB688741b044aaA3` (`70.000000 MON` balance)

---

## 🌟 Key Features Overview

1. **Dual Payment Methods**:
   - **Monad Crypto Escrow**: Lock `MON` tokens in non-custodial smart contracts (`SkillMaxEscrow.sol`) with ~1-second settlement.
   - **Razorpay Fiat INR**: Pay via UPI, Google Pay, PhonePe, Paytm, Cards, or Netbanking.

2. **Web3 E2E Chat Encryption**:
   - All real-time messages are encrypted client-side using **256-bit AES-GCM** with Web3 wallet keys (`crypto.ts`). Zero plaintext stored in the database.

3. **Dual-Sided Local Marketplace**:
   - **Post Task Requests (`/tasks/new`)**: Clients post open tasks with custom budget.
   - **Offer Skill Services (`/skills/new`)**: Providers list recurring skill services.
   - **Task Marketplace Board (`/tasks`)**: Local providers browse and accept open task requests.

4. **Web3 Wallet Signature Authentication**:
   - Web3 wallet signature sign-in (`personal_sign` / Keccak-256) alongside email & password.

5. **Community Provider Leaderboard (`/leaderboard`) & 15 Achievements**:
   - Provider rankings, podium highlights, MON escrow earnings, and 15 reputation achievements powered by Lucide React SVG icons.

6. **Interactive 4-Step Profile Onboarding Survey (`/onboard`)**:
   - Avatar photo selector, tagline, gender, phone, bio, wallet, and 30+ multi-skill tag search catalog with "+ Add custom skill".

7. **Browser GPS Geolocation Access (`LocationPicker.tsx`)**:
   - Device GPS position tracking (`navigator.geolocation`) for local service filtering.

8. **Legal Framework & Terms (`/terms` & `/privacy`)**:
   - Terms of Service and Privacy Policy covering Monad smart contract escrows, Web3 encryption, and Razorpay compliance.
