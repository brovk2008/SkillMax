import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { BADGE_ADDRESS, BADGE_ABI, CATEGORY_TO_ID } from '@/lib/contracts'
import { monadTestnet } from '@/lib/wagmi/config'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder-key'
  )
}

export async function POST(req: NextRequest) {
  const { jobId } = await req.json()
  if (!jobId) return NextResponse.json({ error: 'Missing jobId' }, { status: 400 })

  const supabaseAdmin = getSupabaseAdmin()
  const { data: job } = await supabaseAdmin
    .from('jobs')
    .select('*, skills(category), provider_profile:profiles!provider_id(wallet_address)')
    .eq('id', jobId)
    .single()

  if (!job || job.status !== 'completed') {
    return NextResponse.json({ error: 'Job not eligible' }, { status: 400 })
  }

  const walletAddress = (job.provider_profile as any)?.wallet_address
  const category = (job.skills as any)?.category ?? 'Other'
  const categoryId = CATEGORY_TO_ID[category] ?? 9

  if (!walletAddress) return NextResponse.json({ ok: false, reason: 'No wallet' })

  const privateKey = process.env.PLATFORM_WALLET_PRIVATE_KEY
  if (!privateKey) return NextResponse.json({ ok: false, reason: 'No platform key configured' })

  try {
    const account = privateKeyToAccount(privateKey as `0x${string}`)
    const walletClient = createWalletClient({
      account,
      chain: monadTestnet,
      transport: http('https://testnet-rpc.monad.xyz'),
    })

    const hash = await walletClient.writeContract({
      address: BADGE_ADDRESS,
      abi: BADGE_ABI,
      functionName: 'mintBadge',
      args: [walletAddress as `0x${string}`, BigInt(categoryId)],
    })

    await supabaseAdmin.from('jobs').update({ badge_minted: true }).eq('id', jobId)
    return NextResponse.json({ ok: true, hash })
  } catch (e: any) {
    console.error('Badge mint error', e)
    return NextResponse.json({ ok: false, error: e.message })
  }
}
