import Link from 'next/link'
import { ShieldCheck, Lock, Scale, Zap } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 space-y-8 bg-white text-slate-800">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 md:p-8 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full w-fit">
          <Scale className="h-3.5 w-3.5 text-emerald-600" />
          SkillMax Legal Framework
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Terms of Service</h1>
        <p className="text-xs text-slate-500">Effective Date: January 1, 2026 · Monad Web3 Protocol Governance</p>
      </div>

      <div className="prose prose-slate max-w-none text-xs leading-relaxed space-y-6">
        <section className="space-y-2 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lock className="h-4 w-4 text-emerald-600" />
            1. Non-Custodial Monad Blockchain Escrow Protocol
          </h2>
          <p>
            SkillMax operates on top of the Monad Blockchain (Chain ID 10143). When booking a service or creating a job request with MON tokens, funds are transferred directly into smart contract vaults (<code className="font-mono text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">SkillMaxEscrow.sol</code>). SkillMax does not hold, manage, or custody user cryptocurrency funds. Fund releases are programmatically executed upon job completion confirmation or dispute resolution.
          </p>
        </section>

        <section className="space-y-2 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            2. Web3 Cryptographic Security & Identity Protection
          </h2>
          <p>
            Account credentials, session tokens, and communication messages are protected using client-side 256-bit AES-GCM encryption and Web3 wallet cryptographic signature verification. User passwords are never stored in plaintext. Chat communications between clients and service providers are encrypted on the client device before transmission over WebSockets.
          </p>
        </section>

        <section className="space-y-2 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-600" />
            3. Local Fiat Payouts via Razorpay
          </h2>
          <p>
            For local currency (INR) transactions, payments are processed securely through Razorpay APIs under compliant payment gateway protocols. Payments made via UPI, Google Pay, Netbanking, or Cards are governed by Razorpay's regulatory compliance frameworks.
          </p>
        </section>

        <section className="space-y-2 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">4. Service Provider & Client Responsibilities</h2>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Service providers agree to deliver services as described in their active listings in a professional manner.</li>
            <li>Clients agree to provide accurate task requirements and inspect work prior to releasing escrow payments.</li>
            <li>Users must comply with local safety, legal, and community regulations in their respective cities.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">5. On-Chain Soulbound Badges & Ratings</h2>
          <p>
            Provider ratings and Soulbound ERC-1155 NFT Badges (<code className="font-mono text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">SkillMaxBadge.sol</code>) are permanently recorded on the Monad Blockchain. Once minted, on-chain reputation statistics are non-transferable and immutable.
          </p>
        </section>
      </div>

      <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-xs">
        <Link href="/privacy" className="font-semibold text-emerald-600 hover:underline">
          View Privacy Policy →
        </Link>
        <Link href="/" className="font-semibold text-slate-600 hover:text-slate-900">
          Back to SkillMax Home
        </Link>
      </div>
    </div>
  )
}
