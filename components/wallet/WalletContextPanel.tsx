import * as React from 'react'
import { shortPubKey, pubKeyUrl } from 'common/utils'
import { paymentMintConfig } from 'config/paymentMintConfig'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardBody } from '@/components/primitives/Card'

interface WalletContextPanelProps {
  fanoutData: any
  environment: { label: string }
  mintId: string | undefined
  fanoutMints: any
  selectedFanoutMint: any
  onSelectMint: (mint: string) => void
  className?: string
}

export const WalletContextPanel: React.FC<WalletContextPanelProps> = ({
  fanoutData,
  environment,
  mintId,
  fanoutMints,
  selectedFanoutMint,
  onSelectMint,
  className
}) => {
  return (
    <Card elev={1} surface="subtle" className={cn('space-y-8', className)} id="token-selection">
      <CardHeader heading="Token & Addresses" subtitle="Select an asset and view key on-chain addresses for the treasury." />
      <section aria-labelledby="token-select-label" className="space-y-3">
        <label id="token-select-label" className="text-[13px] font-medium text-gray-300 block">Token Selection</label>
        <select
          value={mintId || 'default'}
          onChange={(e) => onSelectMint(e.target.value)}
          className="w-full h-12 input-glass rounded-lg px-4 font-medium"
          data-focus-ring="true"
        >
          <option value="default">SOL</option>
          {fanoutMints?.data?.map((fanoutMint: any) => (
            <option key={fanoutMint.id.toString()} value={fanoutMint.data.mint.toString()}>
              {paymentMintConfig[fanoutMint.data.mint.toString()]?.name || shortPubKey(fanoutMint.data.mint.toString())}
            </option>
          ))}
        </select>
      </section>
      <section aria-labelledby="addresses-heading" className="space-y-4" id="addresses">
        <h4 id="addresses-heading" className="text-sm font-semibold tracking-wide text-gray-200">Addresses</h4>
        <dl className="space-y-3 text-sm">
          <div className="flex flex-wrap items-center gap-1">
            <dt className="text-gray-400">Fanout:</dt>
            <dd>
              {fanoutData?.data?.fanoutId && (
                <a
                  href={pubKeyUrl(fanoutData.data.fanoutId, environment.label)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-mono"
                >
                  {shortPubKey(fanoutData.data.fanoutId.toString())}
                </a>
              )}
            </dd>
          </div>
          {selectedFanoutMint ? (
            <div className="flex flex-wrap items-center gap-1">
              <dt className="text-gray-400">{selectedFanoutMint.config.symbol} Token Account:</dt>
              <dd>
                <a
                  href={pubKeyUrl(selectedFanoutMint.data.tokenAccount, environment.label)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-mono"
                >
                  {shortPubKey(selectedFanoutMint.data.tokenAccount)}
                </a>
              </dd>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-1">
              <dt className="text-gray-400">Native SOL:</dt>
              <dd>
                {fanoutData?.data?.nativeAccount && (
                  <a
                    href={pubKeyUrl(fanoutData.data.nativeAccount, environment.label)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-mono"
                  >
                    {shortPubKey(fanoutData.data.nativeAccount.toString())}
                  </a>
                )}
              </dd>
            </div>
          )}
        </dl>
      </section>
    </Card>
  )
}

export default WalletContextPanel
