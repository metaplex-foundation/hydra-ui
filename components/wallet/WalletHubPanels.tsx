import * as React from 'react'
import { CreateWalletPanel } from '@/components/wallet/CreateWalletPanel'
import { LoadWalletPanel } from '@/components/wallet/LoadWalletPanel'
import { cn } from '@/lib/utils'

interface WalletHubPanelsProps { className?: string }

export const WalletHubPanels: React.FC<WalletHubPanelsProps> = ({ className }) => {
  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-start', className)}>
      <div className="lg:col-span-7 xl:col-span-6 order-2 lg:order-1 flex"><LoadWalletPanel autoFocus /></div>
      <div className="lg:col-span-5 xl:col-span-4 order-1 lg:order-2 flex"><CreateWalletPanel /></div>
    </div>
  )
}

export default WalletHubPanels
