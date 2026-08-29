import Link from 'next/link'
import { Lock, Shield, Key, EyeOff } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 space-y-8 bg-white text-slate-800">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 md:p-8 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-fuchsia-800 bg-fuchsia-100/80 px-2.5 py-0.5 rounded-full w-fit">
          <Shield className="h-3.5 w-3.5 text-fuchsia-600" />
          Data & Cryptographic Privacy Standard
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Privacy Policy</h1>
        <p className="text-xs text-slate-500">How SkillMax Protects User Data via Web3 Encryption & Zero-Knowledge Architecture</p>
      </div>

      <div className="prose prose-slate max-w-none text-xs leading-relaxed space-y-6">
        <section className="space-y-2 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Key className="h-4 w-4 text-fuchsia-600" />
            1. Web3 Password & Auth Hashing
          </h2>
          <p>
            Your account authentication credentials are secured using Web3 cryptographic hashing (Keccak-256 / PBKDF2 with SHA-256). Passwords are never stored in plain text or transmitted in unencrypted form. You can also sign in directly using Web3 wallet signatures (MetaMask, Coinbase, WalletConnect) without relying on traditional passwords.
          </p>
        </section>

        <section className="space-y-2 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <EyeOff className="h-4 w-4 text-fuchsia-600" />
            2. End-to-End Chat Encryption (E2EE)
          </h2>
          <p>
            All messages exchanged in SkillMax job rooms are encrypted client-side using 256-bit AES-GCM encryption before being transmitted over Supabase WebSockets. No staff, server administrator, or third party can read your chat conversations.
          </p>
        </section>

        <section className="space-y-2 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lock className="h-4 w-4 text-fuchsia-600" />
            3. On-Chain Data Visibility
          </h2>
          <p>
            Transactions processed on the Monad Blockchain (escrow deposits, milestone completions, and badge minting) are publicly recorded on the Monad Testnet ledger (<code className="font-mono text-fuchsia-700 bg-fuchsia-50 px-1 py-0.5 rounded">monad-testnet.socialscan.io</code>). Personal contact information such as phone numbers are kept private and accessible only to authorized counterparties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Device Geolocation Access</h2>
          <p>
            SkillMax uses optional browser GPS geolocation (<code className="font-mono text-fuchsia-700 bg-fuchsia-50 px-1 py-0.5 rounded">navigator.geolocation</code>) strictly to filter nearby local services and providers. Coordinates are processed locally on your device and are never sold or shared with external tracking networks.
          </p>
        </section>
      </div>

      <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-xs">
        <Link href="/terms" className="font-semibold text-fuchsia-600 hover:underline">
          ← View Terms of Service
        </Link>
        <Link href="/" className="font-semibold text-slate-600 hover:text-slate-900">
          Back to SkillMax Home
        </Link>
      </div>
    </div>
  )
}
