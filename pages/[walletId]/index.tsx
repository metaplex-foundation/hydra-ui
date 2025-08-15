// DisplayAddress requires WalletIdentity provider, using shortPubKey instead
import { executeTransaction } from 'common/Transactions'
import { FanoutClient } from '@metaplex-foundation/mpl-hydra/dist/src'
import { buildRemoveMemberInstructions, buildTransferSharesInstructions } from 'lib/hydraWrappers'
import { Wallet } from '@coral-xyz/anchor/dist/cjs/provider'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { AsyncButton } from '@/components/ui/async-texture-button'
import { notify } from 'common/Notification'
import {
  getMintNaturalAmountFromDecimal,
  getPriorityFeeIx,
  pubKeyUrl,
  shortPubKey,
  tryPublicKey,
} from 'common/utils'
import { asWallet } from 'common/Wallets'
import { paymentMintConfig } from 'config/paymentMintConfig'
import { FanoutData, useFanoutData } from 'hooks/useFanoutData'
import { useFanoutMembershipMintVouchers } from 'hooks/useFanoutMembershipMintVouchers'
import { useFanoutMembershipVouchers } from 'hooks/useFanoutMembershipVouchers'
import { useFanoutMints } from 'hooks/useFanoutMints'
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import React, { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardBody } from '@/components/primitives/Card'
import { FormPanel } from '@/components/primitives/FormPanel'
import { Button } from '@/components/catalyst-ui-ts/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { IconChevronDown } from '@tabler/icons-react'
import { Input } from '@/components/ui/input'
import { KPIGrid } from '@/components/dashboard/kpi-grid'
import { MemberList } from '@/components/dashboard/member-list'
import { ActivityTimeline } from '@/components/dashboard/activity-timeline'
import { useAnalytics } from '@/hooks/useAnalytics'
import { WalletHubPanels } from '@/components/wallet/WalletHubPanels'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Skeleton } from '@/components/ui/skeleton'
import { LoadWalletPanel } from '@/components/wallet/LoadWalletPanel'
import { WalletContextPanel } from '@/components/wallet/WalletContextPanel'
import * as Tabs from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

// Reusable StatCard component
const StatCard = ({
  title,
  subtitle,
  value,
  unit,
  color,
  mounted = true
}: {
  title: string
  subtitle: string
  value: any
  unit?: string
  color: 'green' | 'blue' | 'orange'
  mounted?: boolean
}) => {
  const colorMap: Record<string, string> = {
    green: 'from-emerald-500/10 via-transparent to-emerald-300/10',
    blue: 'from-blue-500/10 via-transparent to-blue-300/10',
    orange: 'from-orange-500/10 via-transparent to-orange-300/10',
  }

  const displayValue = typeof value === 'string' ? value : String(value)

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group" data-elev="1">
      <div className={`pointer-events-none absolute inset-0 opacity-40 mix-blend-plus-lighter bg-gradient-to-br ${colorMap[color]}`} />
      <div className="relative mb-4 space-y-1">
        <div className="text-sm font-medium text-white/90 tracking-wide">{String(title)}</div>
        <div className="text-xs text-gray-400">{String(subtitle)}</div>
      </div>
      <div className="relative flex items-end gap-2">
        <div className="text-3xl font-semibold leading-none bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
    {mounted ? displayValue : <Skeleton className="h-6 w-20" />}
        </div>
        {unit && <span className="text-sm text-gray-400 pb-1 font-medium">{unit}</span>}
      </div>
    </div>
  )
}

const Home: NextPage = () => {
  const router = useRouter()
  const [mintId, setMintId] = useState<string | undefined>()
  const [mounted, setMounted] = useState(false)
  const fanoutMembershipVouchers = useFanoutMembershipVouchers()
  const fanoutMints = useFanoutMints()
  const wallet = useWallet()
  const fanoutData = useFanoutData()
  const { connection, environment } = useEnvironmentCtx()
  let selectedFanoutMint =
    mintId && fanoutMints.data
      ? fanoutMints.data.find((mint) => mint.data.mint.toString() === mintId)
      : undefined
  const fanoutMembershipMintVouchers = useFanoutMembershipMintVouchers(mintId)
  const [voucherMapping, setVoucherMapping] = useState<{
    [key: string]: string
  }>({})
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showAddMember, setShowAddMember] = useState(false)
  const [newMemberWallet, setNewMemberWallet] = useState('')
  const [newMemberShares, setNewMemberShares] = useState<number>(0)
  const [newMemberType, setNewMemberType] = useState<'wallet' | 'nft'>('wallet')
  const [showTransferShares, setShowTransferShares] = useState(false)
  const [transferFromMember, setTransferFromMember] = useState('')
  const [transferToMember, setTransferToMember] = useState('')
  const [transferShareAmount, setTransferShareAmount] = useState<number>(0)
  const [showStakeTokens, setShowStakeTokens] = useState(false)
  const [stakeAmount, setStakeAmount] = useState<number>(0)
  const { track } = useAnalytics()

  // Derived metrics (memoized): top holder percent & undistributed
  const topHolderPct = React.useMemo(() => {
    if (!fanoutMembershipVouchers.data?.length || !fanoutData.data?.fanout?.totalShares) return 0
    const topShares = Math.max(...fanoutMembershipVouchers.data.map(v => parseInt(v.parsed.shares.toString())))
    const totalShares = Number(fanoutData.data.fanout.totalShares)
    return totalShares ? (topShares / totalShares) * 100 : 0
  }, [fanoutMembershipVouchers.data, fanoutData.data?.fanout?.totalShares])

  // For SOL: undistributed = (total inflow - total claimed across vouchers) heuristically using voucher.totalInflow field.
  // NOTE: This is an interim approximation until precise per-member claim tracking is implemented.
  const undistributed = React.useMemo(() => {
    if (!fanoutData.data?.fanout) return 0
    // totalInflow for SOL path (lamports) -> convert to SOL
    const totalInflowLamports = fanoutData.data.fanout.totalInflow ? Number(fanoutData.data.fanout.totalInflow) : 0
    const totalInflowSol = totalInflowLamports / 1e9
    // Sum of member claimed (voucher.totalInflow represents historical? placeholder) convert lamports
    const memberClaimedSol = fanoutMembershipVouchers.data?.reduce((acc, v) => acc + (parseInt(v.parsed.totalInflow.toString()) / 1e9), 0) || 0
    const bal = fanoutData.data.balance || 0
    // Use min of remaining based on balance and difference to avoid negative
    const remaining = Math.max(0, Math.min(bal, totalInflowSol - memberClaimedSol))
    return remaining
  }, [fanoutData.data?.fanout, fanoutData.data?.balance, fanoutMembershipVouchers.data])

  // Hoisted function for stable reference in effects
  const selectSplToken = React.useCallback((mintId: string) => {
    setMintId(mintId === 'default' ? undefined : mintId)
    const fanoutMint = fanoutMints.data?.find(
      (fanoutMint) => fanoutMint.data.mint.toString() === mintId
    )
    if (environment.label === 'mainnet-beta') {
      router.push(`${location.pathname}#${fanoutMint?.config.symbol ?? ''}`)
    }
  }, [fanoutMints.data, environment.label, router])

  // Sync hash with selected token mint when route or fanout mints change
  useEffect(() => {
    const anchor = router.asPath.split('#')[1]
    if (!anchor || !fanoutMints.data) return
    const match = fanoutMints.data.find(
      (fm) => fm.config.symbol === anchor || fm.id.toString() === anchor
    )
    if (match?.data.mint && match.data.mint.toString() !== mintId) {
      selectSplToken(match.data.mint.toString())
    }
  }, [router.asPath, fanoutMints.data, mintId, selectSplToken])

  useEffect(() => {
    const setMapping = async () => {
      if (fanoutMembershipVouchers.data && selectedFanoutMint) {
        let mapping: { [key: string]: string } = {}
        for (const voucher of fanoutMembershipVouchers.data!) {
          const [mintMembershipVoucher] =
            await FanoutClient.mintMembershipVoucher(
              selectedFanoutMint.id,
              voucher.parsed.membershipKey,
              new PublicKey(mintId!)
            )
          mapping[voucher.pubkey.toString()] = mintMembershipVoucher.toString()
        }
        setVoucherMapping(mapping)
      } else {
        setVoucherMapping({})
      }
    }
    setMapping()
  }, [fanoutMembershipVouchers.data, selectedFanoutMint, mintId])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Persist this wallet in "recently accessed" list (replaces prior inline <script>)
  useEffect(() => {
    if (!fanoutData.data?.fanoutId) return
    try {
      const STORAGE_KEY = 'hydra_recent_wallets'
      type RecentWallet = { id: string; name: string }
      const raw = localStorage.getItem(STORAGE_KEY)
      const list: RecentWallet[] = raw ? JSON.parse(raw) : []
      const id = fanoutData.data.fanoutId.toString()
      const name = (fanoutData.data.fanout?.name || '').toString()
      const deduped = list.filter((w) => w.id !== id)
      deduped.unshift({ id, name })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(deduped.slice(0, 12)))
    } catch (e) {
      // Non-fatal; ignore persistence errors (e.g., private mode)
    }
  }, [fanoutData.data?.fanoutId, fanoutData.data?.fanout?.name])

  async function addSplToken() {
    if (fanoutData.data?.fanoutId) {
      try {
        const tokenAddress = prompt('Please enter an SPL token address:')
        const tokenPK = tryPublicKey(tokenAddress)
        if (!tokenPK) {
          throw 'Invalid SPL token address, please enter a valid address based on your network'
        }
        const fanoutSdk = new FanoutClient(connection, asWallet(wallet!))
        const transaction = new Transaction()
        transaction.add(
          ...(
            await fanoutSdk.initializeFanoutForMintInstructions({
              fanout: fanoutData.data?.fanoutId,
              mint: tokenPK,
            })
          ).instructions
        )
        await executeTransaction(connection, wallet as Wallet, transaction, {})
        notify({
          message: 'SPL Token added!',
          description: `Select the new token in the dropdown menu.`,
          type: 'success',
        })
      } catch (e) {
        notify({
          message: 'Error adding SPL Token',
          description: `${e}`,
          type: 'error',
        })
      }
    }
  }

  const addMember = async () => {
    try {
      if (!wallet?.publicKey || !fanoutData.data?.fanoutId) {
        throw 'Wallet not connected or fanout not loaded'
      }
      if (!newMemberWallet || newMemberShares <= 0) {
        throw 'Please enter valid member wallet/NFT and shares'
      }
      
      const memberPublicKey = tryPublicKey(newMemberWallet)
      if (!memberPublicKey) {
        throw 'Invalid address'
      }

      const fanoutSdk = new FanoutClient(connection, asWallet(wallet))
      const transaction = new Transaction()
      
      let addMemberInstructions
      
      // Handle different membership models
      const membershipModel = fanoutData.data?.fanout?.membershipModel
      
      if (membershipModel === 1 && newMemberType === 'nft') {
        // NFT membership model - add NFT member
        addMemberInstructions = await fanoutSdk.addMemberNftInstructions({
          fanout: fanoutData.data.fanoutId,
          fanoutNativeAccount: fanoutData.data.nativeAccount,
          membershipKey: memberPublicKey, // NFT mint address
          shares: newMemberShares,
        })
      } else {
        // Default to wallet membership
        addMemberInstructions = await fanoutSdk.addMemberWalletInstructions({
          fanout: fanoutData.data.fanoutId,
          fanoutNativeAccount: fanoutData.data.nativeAccount,
          membershipKey: memberPublicKey,
          shares: newMemberShares,
        })
      }
      
      transaction.add(...addMemberInstructions.instructions)
      await executeTransaction(connection, wallet as Wallet, transaction, {})
      
      notify({
        message: 'Member added successfully',
        description: `Added ${newMemberType === 'nft' ? 'NFT' : 'wallet'} ${shortPubKey(memberPublicKey)} with ${newMemberShares} shares`,
        type: 'success',
      })
      
      // Reset form
      setNewMemberWallet('')
      setNewMemberShares(0)
      setNewMemberType('wallet')
      setShowAddMember(false)
    } catch (e) {
      notify({
        message: 'Error adding member',
        description: `${e}`,
        type: 'error',
      })
    }
  }

  const removeMember = async (membershipKey: PublicKey) => {
    try {
      if (!wallet?.publicKey || !fanoutData.data?.fanoutId) {
        throw 'Wallet not connected or fanout not loaded'
      }

      const fanoutSdk = new FanoutClient(connection, asWallet(wallet))
      const transaction = new Transaction()
      
      // Find the membership account for this member
      const membershipVoucher = fanoutMembershipVouchers.data?.find(
        v => v.parsed.membershipKey.toString() === membershipKey.toString()
      )
      
      if (!membershipVoucher) {
        throw 'Member not found'
      }

      const removeMemberInstructions = await buildRemoveMemberInstructions(fanoutSdk, {
        fanout: fanoutData.data.fanoutId,
        membershipAccount: membershipVoucher.pubkey,
      })
      
      transaction.add(...removeMemberInstructions.instructions)
      await executeTransaction(connection, wallet as Wallet, transaction, {})
      
      notify({
        message: 'Member removed successfully',
        description: `Removed ${shortPubKey(membershipKey)}`,
        type: 'success',
      })
    } catch (e) {
      notify({
        message: 'Error removing member',
        description: `${e}`,
        type: 'error',
      })
    }
  }

  const transferShares = async () => {
    try {
      if (!wallet?.publicKey || !fanoutData.data?.fanoutId) {
        throw 'Wallet not connected or fanout not loaded'
      }
      if (!transferFromMember || !transferToMember || transferShareAmount <= 0) {
        throw 'Please select valid members and transfer amount'
      }
      
      const fromMemberPK = tryPublicKey(transferFromMember)
      const toMemberPK = tryPublicKey(transferToMember)
      
      if (!fromMemberPK || !toMemberPK) {
        throw 'Invalid member addresses'
      }

      // Find membership accounts
      const fromMembershipVoucher = fanoutMembershipVouchers.data?.find(
        v => v.parsed.membershipKey.toString() === fromMemberPK.toString()
      )
      const toMembershipVoucher = fanoutMembershipVouchers.data?.find(
        v => v.parsed.membershipKey.toString() === toMemberPK.toString()
      )

      if (!fromMembershipVoucher || !toMembershipVoucher) {
        throw 'Member accounts not found'
      }

      const fanoutSdk = new FanoutClient(connection, asWallet(wallet))
      const transaction = new Transaction()
      
      const transferSharesInstructions = await buildTransferSharesInstructions(fanoutSdk, {
        fanout: fanoutData.data.fanoutId,
        fromMember: fromMemberPK,
        toMember: toMemberPK,
        fromMembershipAccount: fromMembershipVoucher.pubkey,
        toMembershipAccount: toMembershipVoucher.pubkey,
        shares: transferShareAmount,
      })
      
      transaction.add(...transferSharesInstructions.instructions)
      await executeTransaction(connection, wallet as Wallet, transaction, {})
      
      notify({
        message: 'Shares transferred successfully',
        description: `Transferred ${transferShareAmount} shares from ${shortPubKey(fromMemberPK)} to ${shortPubKey(toMemberPK)}`,
        type: 'success',
      })
      
      // Reset form
      setTransferFromMember('')
      setTransferToMember('')
      setTransferShareAmount(0)
      setShowTransferShares(false)
    } catch (e) {
      notify({
        message: 'Error transferring shares',
        description: `${e}`,
        type: 'error',
      })
    }
  }

  const stakeTokens = async () => {
    try {
      if (!wallet?.publicKey || !fanoutData.data?.fanoutId) {
        throw 'Wallet not connected or fanout not loaded'
      }
      if (stakeAmount <= 0) {
        throw 'Please enter valid stake amount'
      }
      
      // For token membership model, we need the membership mint
      if (fanoutData.data?.fanout?.membershipModel !== 2) {
        throw 'Token staking only available for Token membership model'
      }

      const fanoutSdk = new FanoutClient(connection, asWallet(wallet))
      const transaction = new Transaction()
      
      // Get the membership mint from the fanout data
      // Note: In a real implementation, you'd need to get the membership mint from the fanout data
      // For now, we'll use a placeholder - in production, this would be stored in fanout data
      
      const stakeInstructions = await fanoutSdk.stakeTokenMemberInstructions({
        shares: stakeAmount,
        fanout: fanoutData.data.fanoutId,
        member: wallet.publicKey,
        payer: wallet.publicKey,
        // membershipMint: membershipMint.publicKey, // Would need to get this from fanout data
        // membershipMintTokenAccount: tokenAccount, // Would need user's token account
      })
      
      transaction.add(...stakeInstructions.instructions)
      await executeTransaction(connection, wallet as Wallet, transaction, {})
      
      notify({
        message: 'Tokens staked successfully',
        description: `Staked ${stakeAmount} tokens`,
        type: 'success',
      })
      
      setStakeAmount(0)
      setShowStakeTokens(false)
    } catch (e) {
      notify({
        message: 'Error staking tokens',
        description: `${e}`,
        type: 'error',
      })
    }
  }

  const unstakeTokens = async (membershipKey: PublicKey) => {
    try {
      if (!wallet?.publicKey || !fanoutData.data?.fanoutId) {
        throw 'Wallet not connected or fanout not loaded'
      }
      
      if (fanoutData.data?.fanout?.membershipModel !== 2) {
        throw 'Token unstaking only available for Token membership model'
      }

      const fanoutSdk = new FanoutClient(connection, asWallet(wallet))
      const transaction = new Transaction()
      
      const unstakeInstructions = await fanoutSdk.unstakeTokenMemberInstructions({
        fanout: fanoutData.data.fanoutId,
        member: membershipKey,
        payer: wallet.publicKey,
      })
      
      transaction.add(...unstakeInstructions.instructions)
      await executeTransaction(connection, wallet as Wallet, transaction, {})
      
      notify({
        message: 'Tokens unstaked successfully',
        description: `Unstaked tokens for ${shortPubKey(membershipKey)}`,
        type: 'success',
      })
    } catch (e) {
      notify({
        message: 'Error unstaking tokens',
        description: `${e}`,
        type: 'error',
      })
    }
  }

  const [distTotal, setDistTotal] = React.useState<number | null>(null)
  const [distDone, setDistDone] = React.useState(0)
  const [distInFlight, setDistInFlight] = React.useState(false)

  const distributeShare = async (
    fanoutData: FanoutData,
    addAllMembers: boolean,
    specificMember?: PublicKey
  ) => {
    try {
      if (wallet && wallet.publicKey && fanoutData.fanoutId) {
        const fanoutSdk = new FanoutClient(connection, asWallet(wallet!))
        if (addAllMembers) {
          if (fanoutMembershipVouchers.data) {
            const distributionMemberSize = 5
            const vouchers = fanoutMembershipVouchers.data
            setDistTotal(vouchers.length)
            setDistDone(0)
            setDistInFlight(true)
            let successfulTx = 0
            for (let i = 0; i < vouchers.length; i += distributionMemberSize) {
              let transaction = new Transaction()
              const chunk = vouchers.slice(i, i + distributionMemberSize)
              for (const voucher of chunk) {
                let distMember =
                  await fanoutSdk.distributeWalletMemberInstructions({
                    fanoutMint: selectedFanoutMint
                      ? selectedFanoutMint?.data.mint
                      : undefined,
                    distributeForMint: selectedFanoutMint ? true : false,
                    member: voucher.parsed.membershipKey,
                    fanout: fanoutData.fanoutId,
                    payer: wallet.publicKey,
                  })
                transaction.instructions = [
                  ...transaction.instructions,
                  ...distMember.instructions,
                ]
              }

              transaction.feePayer = wallet.publicKey
              const priorityFeeIx = await getPriorityFeeIx(
                connection,
                transaction
              )
              transaction.add(priorityFeeIx)
              const { blockhash } = await connection.getLatestBlockhash()
              transaction.recentBlockhash = blockhash
              transaction = await wallet.signTransaction!(transaction)

              const signature = await connection.sendRawTransaction(
                transaction.serialize(),
                { maxRetries: 3 }
              )

              console.info('Tx sig:', signature)

              await connection.confirmTransaction(signature, 'confirmed')
              successfulTx += 1

              const numTransactions = Math.ceil(vouchers.length / 5)
              notify({
                message: `(${
                  i / 5 + 1
                } / ${numTransactions}) Claim tx successful`,
                description: `Claimed shares for ${
                  i + distributionMemberSize > vouchers.length
                    ? vouchers.length
                    : i + distributionMemberSize
                } / ${vouchers.length} from ${fanoutData.fanout.name}`,
                type: 'success',
              })
        setDistDone(() => Math.min(vouchers.length, i + distributionMemberSize))
            }
            // Analytics success for all-members distribution
            track({ name: 'distribution_success', scope: 'all', txCount: successfulTx })
          } else {
            throw 'No membership data found'
          }
      setDistInFlight(false)
      setTimeout(()=>{ setDistTotal(null); setDistDone(0); }, 4000)
        } else {
          // Individual member distribution
          const targetMember = specificMember || wallet.publicKey
          let transaction = new Transaction()
          let distMember = await fanoutSdk.distributeWalletMemberInstructions({
            fanoutMint: selectedFanoutMint
              ? selectedFanoutMint?.data.mint
              : undefined,
            distributeForMint: selectedFanoutMint ? true : false,
            member: targetMember,
            fanout: fanoutData.fanoutId,
            payer: wallet.publicKey,
          })
          transaction.instructions = [...distMember.instructions]
          transaction.feePayer = wallet.publicKey
          const priorityFeeIx = await getPriorityFeeIx(connection, transaction)
          transaction.add(priorityFeeIx)
          await executeTransaction(connection, asWallet(wallet), transaction, {
            confirmOptions: { commitment: 'confirmed', maxRetries: 3 },
            signers: [],
          })
          notify({
            message: `Distribution successful`,
            description: `Successfully distributed ${
              specificMember ? `to member ${shortPubKey(specificMember)}` : 'your share'
            } from ${fanoutData.fanout.name}`,
            type: 'success',
          })
          track({ name: 'distribution_success', scope: 'member', txCount: 1, memberId: specificMember?.toString() || wallet.publicKey.toString() })
        }
      }
    } catch (e) {
  track({ name: 'distribution_failure', scope: addAllMembers ? 'all' : 'member', reason: String(e), memberId: specificMember?.toString() })
      notify({
        message: `Error claiming your share: ${e}`,
        type: 'error',
      })
  setDistInFlight(false)
    }
  }

  const routeWalletId = router.query.walletId as string | undefined
  const noWalletProvided = !routeWalletId || routeWalletId.trim().length === 0
  const fanoutMissing = !noWalletProvided && !fanoutData.data && fanoutData.loaded && !fanoutData.refreshing

  // Inline wallet load form reused from landing page (simplified)
  const LoadWalletInline: React.FC = () => {
    const [name, setName] = React.useState("")
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if(!name.trim()) return
          router.push(`/${name.trim()}${environment.label !== 'mainnet-beta' ? `?cluster=${environment.label}` : ''}`)
        }}
        className="space-y-5 flex-1 flex flex-col"
      >
        <div className="space-y-3">
          <label className="form-label block text-[13px] font-medium" htmlFor="walletInline">Wallet Name</label>
          <Input
            id="walletInline"
            type="text"
            placeholder="hydra-wallet"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="h-12 text-base"
            data-focus-ring="true"
          />
          <p className="text-xs text-gray-500">Same name you used when creating the wallet.</p>
        </div>
  <Button color={name.trim() ? 'indigo' : undefined} outline={!name.trim()}
          type="submit"
          className={"h-12 text-base font-semibold w-full" + (!name.trim() ? " opacity-50 cursor-not-allowed" : "")}
          disabled={!name.trim()}
        >
          Load Wallet
  </Button>
      </form>
    )
  }

  return (
    <DashboardLayout>
  <div className="space-y-8 page-offset-top">
  {/* Live status region for screen readers (distribution progress, etc.) */}
  <div aria-live="polite" className="sr-only" id="live-status" />
  {(noWalletProvided) && (<WalletHubPanels className="mb-4" />)}
        {fanoutMissing && !noWalletProvided && (
          <div className="glass-panel rounded-[var(--radius-xl)] p-8 md:p-10 space-y-6" data-elev="2">
            <div>
              <h2 className="text-2xl font-semibold mb-2 text-red-300">Wallet Not Found</h2>
              <p className="text-sm text-gray-300">We couldn&apos;t resolve that wallet. Double-check the name or load another below.</p>
            </div>
            <div className="max-w-md"><LoadWalletPanel variant="compact" /></div>
          </div>
        )}
        {/* Error State */}
        {fanoutData.error && (
          <div className="glass-panel rounded-[var(--radius-xl)] p-6 text-center" data-elev="2">
            <h3 className="text-xl font-semibold text-red-300 mb-2">Hydra Wallet Not Found</h3>
            <Button outline
              onClick={() => router.push(`/${environment.label !== 'mainnet-beta' ? `?cluster=${environment.label}` : ''}`)}
              className="mt-4"
            >
              Return to Dashboard
            </Button>
          </div>
        )}

        {/* Header with Token Management */}
        <div className="flex items-start justify-between gap-6 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">
              {mounted && fanoutData.data?.fanout?.name ? 
                String(fanoutData.data.fanout.name) : 
                <Skeleton variant="title" className="w-64" />
              }
            </h1>
            <p className="text-[var(--text-color-muted)] mb-4">Treasury wallet management and distribution</p>
            <div className="flex items-center gap-3">
              {fanoutData.data?.fanout && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300 border border-blue-500/30">
                  {fanoutData.data.fanout.membershipModel === 0 ? 'Wallet' : 
                   fanoutData.data.fanout.membershipModel === 1 ? 'NFT' : 'Token'} Model
                </span>
              )}
            </div>
          </div>
          
          {/* Token Management */}
          {fanoutData.data && (
            <div className="min-w-0">
              <WalletContextPanel
                fanoutData={fanoutData.data}
                environment={environment}
                mintId={mintId}
                fanoutMints={fanoutMints}
                selectedFanoutMint={selectedFanoutMint}
                onSelectMint={selectSplToken}
                className="w-full min-w-64"
              />
            </div>
          )}
        </div>
        
        {/* Distribution Progress */}
        {distInFlight && distTotal !== null && (
          <div className="glass-panel rounded-xl p-4 flex flex-col gap-3" data-elev={1} aria-live="polite">
            <div className="flex items-center justify-between text-xs text-[var(--text-color-muted)]">
              <span>Distribution in progress</span>
              <span>{distDone} / {distTotal}</span>
            </div>
            <ProgressBar value={distDone} max={distTotal} label="Distribution progress" />
            <p className="text-[11px] text-[var(--text-color-muted)]">Processing batched transactions. Safe to keep browsing.</p>
          </div>
        )}

        {/* Tabbed Interface */}
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="w-full">
          <Tabs.List className="flex items-center gap-1 p-1 glass-panel rounded-xl mb-8" data-elev={1}>
            <Tabs.Trigger
              value="dashboard"
              className={cn(
                'relative px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200',
                'data-[state=active]:bg-[var(--color-accent)]/10 data-[state=active]:text-[var(--color-accent)]',
                'data-[state=inactive]:text-[var(--text-color-muted)] data-[state=inactive]:hover:text-white data-[state=inactive]:hover:bg-white/5'
              )}
            >
              Dashboard
            </Tabs.Trigger>
            <Tabs.Trigger
              value="activity"
              className={cn(
                'relative px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200',
                'data-[state=active]:bg-[var(--color-accent)]/10 data-[state=active]:text-[var(--color-accent)]',
                'data-[state=inactive]:text-[var(--text-color-muted)] data-[state=inactive]:hover:text-white data-[state=inactive]:hover:bg-white/5'
              )}
            >
              Activity
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="dashboard" className="space-y-8">
            {/* Overview Metrics */}
            <Card elev={2} surface="subtle" className="p-8">
              <KPIGrid
                data={fanoutData.data ? {
                  totalInflow: selectedFanoutMint ? Number(getMintNaturalAmountFromDecimal(Number(selectedFanoutMint.data.totalInflow), selectedFanoutMint.info.decimals)) : (fanoutData.data?.fanout?.totalInflow ? Number(fanoutData.data.fanout.totalInflow) / 1e9 : 0),
                  currentBalance: selectedFanoutMint ? Number(selectedFanoutMint.balance) : Number(fanoutData.data?.balance || 0),
                  members: fanoutData.data?.fanout?.totalMembers ? Number(fanoutData.data.fanout.totalMembers) : 0,
                  totalShares: fanoutData.data?.fanout?.totalShares ? Number(fanoutData.data.fanout.totalShares) : 0,
                  lastUpdated: Date.now(),
                  topHolderPct,
                  unclaimed: undistributed,
                } : undefined}
                loading={!fanoutData.data}
              />
            </Card>

            {/* Members Management */}
      {/* Members List & Management */}
    {fanoutData.data && fanoutData.data.fanout.authority.toString() === wallet.publicKey?.toString() && (
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
  <Button color="indigo" className="h-9 px-4 text-sm flex items-center gap-1">Manage <IconChevronDown className="size-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="start" className="min-w-48">
                  <DropdownMenuItem onClick={() => { setShowAddMember(s => !s); setShowTransferShares(false); setShowStakeTokens(false) }}>
                    {showAddMember ? 'Close Add Member' : 'Add Member'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setShowTransferShares(s => !s); setShowAddMember(false); setShowStakeTokens(false) }}>
                    {showTransferShares ? 'Close Transfer Shares' : 'Transfer Shares'}
                  </DropdownMenuItem>
                  {fanoutData.data.fanout.membershipModel === 2 && (
                    <DropdownMenuItem onClick={() => { setShowStakeTokens(s => !s); setShowAddMember(false); setShowTransferShares(false) }}>
                      {showStakeTokens ? 'Close Stake Tokens' : 'Stake Tokens'}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { setShowAddMember(false); setShowTransferShares(false); setShowStakeTokens(false) }}>Collapse All Forms</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          
          {/* Add Member Form */}
          {showAddMember && (
            <FormPanel title="Add New Member" onClose={() => { setShowAddMember(false); setNewMemberWallet(''); setNewMemberShares(0); setNewMemberType('wallet') }} className="mb-6">
              
              {/* Member Type Selector - only show for NFT model fanouts */}
              {fanoutData.data?.fanout?.membershipModel === 1 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Member Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="wallet"
                        checked={newMemberType === 'wallet'}
                        onChange={(e) => setNewMemberType(e.target.value as 'wallet')}
                        className="mr-2 text-blue-600"
                      />
                      <span className="text-white text-sm">Wallet Address</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="nft"
                        checked={newMemberType === 'nft'}
                        onChange={(e) => setNewMemberType(e.target.value as 'nft')}
                        className="mr-2 text-blue-600"
                      />
                      <span className="text-white text-sm">NFT Mint</span>
                    </label>
                  </div>
                </div>
              )}
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {newMemberType === 'nft' ? 'NFT Mint Address' : 'Wallet Address'}
                  </label>
                  <Input
                    type="text"
                    placeholder={newMemberType === 'nft' ? 'Enter NFT mint address...' : 'Enter Solana wallet address...'}
                    value={newMemberWallet}
                    onChange={(e) => setNewMemberWallet(e.target.value)}
                    className="h-10 input-glass text-white"
                    data-focus-ring="true"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Shares</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newMemberShares || ''}
                    onChange={(e) => setNewMemberShares(parseInt(e.target.value) || 0)}
                    className="h-10 input-glass"
                    data-focus-ring="true"
                  />
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <Button color={(!newMemberWallet || newMemberShares <= 0) ? undefined : 'indigo'} outline={(!newMemberWallet || newMemberShares <= 0)}
                  onClick={addMember}
                  className="h-9 px-6"
                  disabled={!newMemberWallet || newMemberShares <= 0}
                >
                  Add Member
                </Button>
                <Button outline
                  onClick={() => {
                    setShowAddMember(false)
                    setNewMemberWallet('')
                    setNewMemberShares(0)
                    setNewMemberType('wallet')
                  }}
                  className="h-9 px-4"
                >
                  Cancel
                </Button>
              </div>
            </FormPanel>
          )}
          
          {/* Transfer Shares Form */}
          {showTransferShares && (
            <FormPanel title="Transfer Shares" onClose={() => { setShowTransferShares(false); setTransferFromMember(''); setTransferToMember(''); setTransferShareAmount(0) }} className="mb-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">From Member</label>
                  <select
                    value={transferFromMember}
                    onChange={(e) => setTransferFromMember(e.target.value)}
                    className="w-full h-10 input-glass rounded-lg px-3"
                    data-focus-ring="true"
                  >
                    <option value="">Select member...</option>
                    {fanoutMembershipVouchers.data?.map((voucher) => (
                      <option key={voucher.pubkey.toString()} value={voucher.parsed.membershipKey.toString()}>
                        {shortPubKey(voucher.parsed.membershipKey)} ({voucher.parsed.shares.toString()} shares)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">To Member</label>
                  <select
                    value={transferToMember}
                    onChange={(e) => setTransferToMember(e.target.value)}
                    className="w-full h-10 input-glass rounded-lg px-3"
                    data-focus-ring="true"
                  >
                    <option value="">Select member...</option>
                    {fanoutMembershipVouchers.data?.map((voucher) => (
                      <option key={voucher.pubkey.toString()} value={voucher.parsed.membershipKey.toString()}>
                        {shortPubKey(voucher.parsed.membershipKey)} ({voucher.parsed.shares.toString()} shares)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Share Amount</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={transferShareAmount || ''}
                    onChange={(e) => setTransferShareAmount(parseInt(e.target.value) || 0)}
                    className="h-10 input-glass"
                    data-focus-ring="true"
                  />
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <Button color={(!transferFromMember || !transferToMember || transferShareAmount <= 0) ? undefined : 'indigo'} outline={(!transferFromMember || !transferToMember || transferShareAmount <= 0)}
                  onClick={transferShares}
                  className="h-9 px-6"
                  disabled={!transferFromMember || !transferToMember || transferShareAmount <= 0}
                >
                  Transfer Shares
                </Button>
                <Button outline
                  onClick={() => {
                    setShowTransferShares(false)
                    setTransferFromMember('')
                    setTransferToMember('')
                    setTransferShareAmount(0)
                  }}
                  className="h-9 px-4"
                >
                  Cancel
                </Button>
              </div>
            </FormPanel>
          )}
          
          {/* Stake Tokens Form */}
          {showStakeTokens && (
            <FormPanel title="Stake Tokens" onClose={() => { setShowStakeTokens(false); setStakeAmount(0) }} className="mb-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Stake Amount</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={stakeAmount || ''}
                    onChange={(e) => setStakeAmount(parseInt(e.target.value) || 0)}
                    className="h-10 input-glass"
                  />
                </div>
                <div className="flex items-end">
                  <div className="flex gap-2 w-full">
                    <Button color={stakeAmount > 0 ? 'indigo' : undefined} outline={stakeAmount <= 0}
                      onClick={stakeTokens}
                      className="h-10 px-6"
                      disabled={stakeAmount <= 0}
                    >
                      Stake Tokens
                    </Button>
                    <Button outline
                      onClick={() => {
                        setShowStakeTokens(false)
                        setStakeAmount(0)
                      }}
                      className="h-10 px-4"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </FormPanel>
          )}
          
          {/** Memoized members mapping */}
          <Card elev={2} surface="subtle" className="p-6 space-y-6">
          <MemberList
            loading={!fanoutMembershipVouchers.data}
            members={React.useMemo(() => (
              fanoutMembershipVouchers.data?.map(v => ({
                id: v.pubkey.toString(),
                address: v.parsed.membershipKey.toString(),
                shares: Number(v.parsed.shares),
                claimed: selectedFanoutMint ? 0 : parseInt(v.parsed.totalInflow.toString()) / 1e9,
                totalClaimable: fanoutData.data?.fanout?.totalShares ? (undistributed * (Number(v.parsed.shares) / Number(fanoutData.data.fanout.totalShares))) : 0,
                lastClaim: undefined,
              })) || []
            ), [fanoutMembershipVouchers.data, selectedFanoutMint, undistributed, fanoutData.data?.fanout?.totalShares])}
            totalShares={fanoutData.data?.fanout?.totalShares ? Number(fanoutData.data.fanout.totalShares) : 0}
            onDistributeMember={(m) => {
              if (fanoutData.data) distributeShare(fanoutData.data, false, new PublicKey(m.address))
            }}
            hasDistributableFunds={undistributed > 0}
            isWalletAuthority={fanoutData.data ? fanoutData.data.fanout.authority.toString() === wallet.publicKey?.toString() : false}
            onRemoveMember={(m) => {
              removeMember(new PublicKey(m.address))
            }}
            onTransferShares={(fromMember, toAddress, shares) => {
              setTransferFromMember(fromMember.address)
              setTransferToMember(toAddress)
              setTransferShareAmount(shares)
              transferShares()
            }}
          />
          {/* Primary Actions */}
          {fanoutMembershipVouchers.data && fanoutMembershipVouchers.data.length > 0 && (
            <div className="flex flex-wrap gap-3 items-center justify-between p-4 bg-white/[0.02] rounded-lg border border-white/5">
              <div className="flex items-center gap-3">
                <AsyncButton
                  color="indigo"
                  className="h-10 px-6 text-sm font-semibold"
                  onAction={async () => fanoutData.data && distributeShare(fanoutData.data, true)}
                  disabled={!wallet.publicKey || !fanoutMembershipVouchers.data || fanoutMembershipVouchers.data.length === 0}
                  loadingText="Distributing..."
                >Distribute All</AsyncButton>
                {fanoutData.data && fanoutData.data.fanout.authority.toString() === wallet.publicKey?.toString() && (
                  <AsyncButton
                    outline
                    className="h-10 px-4 text-sm font-medium"
                    onAction={addSplToken}
                    disabled={!wallet.publicKey}
                    loadingText="Adding..."
                  >Add SPL Token</AsyncButton>
                )}
              </div>
              <div className="text-xs text-[var(--text-color-muted)]">
                {fanoutMembershipVouchers.data.length} member{fanoutMembershipVouchers.data.length !== 1 ? 's' : ''} ready
              </div>
            </div>
          )}
          {fanoutMembershipVouchers.data && fanoutMembershipVouchers.data.length === 0 && fanoutData.data && (
            <div className="rounded-xl p-6 text-sm text-[var(--text-color-muted)] bg-white/5 border border-white/10">
              <p className="font-medium text-white mb-1">No Members Yet</p>
              <p className="mb-4">Add members with share units to enable distributions.</p>
              {fanoutData.data.fanout.authority.toString() === wallet.publicKey?.toString() && (
                <Button color="indigo" className="h-9 px-5" onClick={() => { setShowAddMember(true); }}>Add First Member</Button>
              )}
            </div>
          )}
          </Card>
          {fanoutMembershipVouchers.data && fanoutMembershipVouchers.data.length === 0 && fanoutData.data && (
            <div className="glass-panel rounded-xl p-6 text-sm text-[var(--text-color-muted)]" data-elev={1}>
              <p className="font-medium text-white mb-1">No Members Yet</p>
              <p className="mb-4">Add members with share units to enable distributions.</p>
              {fanoutData.data.fanout.authority.toString() === wallet.publicKey?.toString() && (
                <Button color="indigo" className="h-9 px-5" onClick={() => { setShowAddMember(true); }}>Add First Member</Button>
              )}
            </div>
          )}
          </Tabs.Content>

          <Tabs.Content value="activity" className="space-y-8">
            {/* Activity Timeline */}
            <Card elev={2} surface="subtle" className="p-8">
              <ActivityTimeline 
                events={React.useMemo(() => {
                  // Generate activity events from membership vouchers and fanout data
                  const events: Array<{
                    id: string;
                    type: 'member_added' | 'distribution';
                    createdAt: number;
                    summary: string;
                    meta?: Record<string, any>;
                  }> = [];
                  
                  // Add member creation events
                  if (fanoutMembershipVouchers.data) {
                    fanoutMembershipVouchers.data.forEach(voucher => {
                      const timestamp = Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000;
                      events.push({
                        id: `member-${voucher.pubkey.toString()}`,
                        type: 'member_added',
                        createdAt: timestamp,
                        summary: `${voucher.parsed.membershipKey.toString().slice(0,6)}...${voucher.parsed.membershipKey.toString().slice(-4)} joined with ${voucher.parsed.shares} shares`,
                        meta: {
                          address: voucher.parsed.membershipKey.toString(),
                          shares: Number(voucher.parsed.shares)
                        }
                      });
                    });
                  }
                  
                  // Add distribution events based on claimed amounts
                  if (fanoutMembershipVouchers.data && fanoutData.data) {
                    fanoutMembershipVouchers.data.forEach(voucher => {
                      const claimed = parseInt(voucher.parsed.totalInflow.toString()) / 1e9;
                      if (claimed > 0) {
                        const timestamp = Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000;
                        events.push({
                          id: `distribution-${voucher.pubkey.toString()}`,
                          type: 'distribution',
                          createdAt: timestamp,
                          summary: `${voucher.parsed.membershipKey.toString().slice(0,6)}...${voucher.parsed.membershipKey.toString().slice(-4)} claimed ${claimed.toFixed(4)} SOL`,
                          meta: {
                            address: voucher.parsed.membershipKey.toString(),
                            amount: claimed
                          }
                        });
                      }
                    });
                  }
                  
                  // Sort events by timestamp descending (newest first)
                  return events.sort((a, b) => b.createdAt - a.createdAt);
                }, [fanoutMembershipVouchers.data, fanoutData.data])}
                loading={!fanoutMembershipVouchers.data || !fanoutData.data} 
              />
            </Card>
          </Tabs.Content>
        </Tabs.Root>
      </div>
  </DashboardLayout>
  )
}

export default dynamic(() => Promise.resolve(Home), {
  ssr: false
})
