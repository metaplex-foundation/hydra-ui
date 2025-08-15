import { Fanout, FanoutClient, MembershipModel } from '@metaplex-foundation/mpl-hydra/dist/src'
import { Wallet } from '@saberhq/solana-contrib'
import { useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import { notify } from 'common/Notification'
import { executeTransaction } from 'common/Transactions'
import { getPriorityFeeIx, tryPublicKey } from 'common/utils'
import { asWallet } from 'common/Wallets'
import type { NextPage } from 'next'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useState } from 'react'
import { useAnalytics } from '@/hooks'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Section } from '@/components/primitives/Section'
import { CreateWalletStepper, StepMember } from '@/components/wallet/CreateWalletStepper'

const Home: NextPage = () => {
  const { connection } = useEnvironmentCtx()
  const wallet = useWallet()
  const { track } = useAnalytics()
  const [successName, setSuccessName] = useState<string | null>(null)

  const handleComplete = async (data: { name: string; totalShares: number; members: StepMember[] }) => {
    try {
      if (!wallet.publicKey) throw 'Please connect your wallet'
      track({ name: 'wallet_create_initiated' })

      const { name, totalShares, members } = data
      if (!name || name.includes(' ')) throw 'Invalid wallet name'
      if (!totalShares || totalShares <= 0) throw 'Total shares must be positive'
      if (!members.length) throw 'At least one member required'
      if (members.length > 9) throw 'Too many members (max 9)'
      const shareSum = members.reduce((s,m)=> s + (m.shares||0), 0)
      if (shareSum !== totalShares) throw 'Allocated shares must sum to total'
      for (const m of members) {
        if (!m.memberKey) throw 'Missing member key'
        const k = tryPublicKey(m.memberKey)
        if (!k) throw 'Invalid member public key'
        if (!m.shares || m.shares <= 0) throw 'Invalid member shares'
      }

      const fanoutId = (await FanoutClient.fanoutKey(name))[0]
      const [nativeAccountId] = await FanoutClient.nativeAccount(fanoutId)
      const fanoutSdk = new FanoutClient(connection, asWallet(wallet!))
      try {
        const existing = await fanoutSdk.fetch<Fanout>(fanoutId, Fanout)
        if (existing) throw `Wallet '${name}' already exists`
      } catch (_) { /* ignore fetch error if not found */ }

      const transaction = new Transaction()
      transaction.add(...(await fanoutSdk.initializeFanoutInstructions({
        totalShares,
        name,
        membershipModel: MembershipModel.Wallet,
      })).instructions)
      for (const m of members) {
        transaction.add(...(await fanoutSdk.addMemberWalletInstructions({
          fanout: fanoutId,
          fanoutNativeAccount: nativeAccountId,
          membershipKey: tryPublicKey(m.memberKey!)!,
          shares: m.shares!,
        })).instructions)
      }
      transaction.feePayer = wallet.publicKey!
      const priorityFeeIx = await getPriorityFeeIx(connection, transaction)
      transaction.add(priorityFeeIx)
      await executeTransaction(connection, wallet as Wallet, transaction, {})
      setSuccessName(name)
      track({ name: 'wallet_create_success', id: name })
    } catch (e) {
      notify({ message: 'Error creating hydra wallet', description: `${e}` , type: 'error'})
    }
  }

  return (
    <DashboardLayout>
      <div className="page-offset-top" />
      <Section
        heading="Create Hydra Wallet"
        description="Set up a new treasury wallet with member shares and distribution rules."
        spacing="lg"
        className="text-center"
      />
      {successName && (
        <div className="mb-10 rounded-xl border border-green-500/30 bg-green-900/20 backdrop-blur p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-4 shadow-lg shadow-green-900/20">
          <div className="text-green-300 text-xl font-semibold flex items-center gap-2"><span>✅</span>Wallet Created Successfully</div>
          <div className="text-green-200/90 text-sm md:text-base leading-relaxed">Access it at{' '}<a href={`/${successName}${window.location.search ?? ''}`} className="font-semibold underline hover:no-underline text-green-300 hover:text-green-200 transition-colors">/{successName}</a></div>
        </div>
      )}
      <CreateWalletStepper onComplete={handleComplete} />
    </DashboardLayout>
  )
}

export default Home
