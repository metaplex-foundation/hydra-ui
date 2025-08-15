import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

import { useRouter } from 'next/router'
import { ENVIRONMENTS, useEnvironmentCtx } from 'providers/EnvironmentProvider'
import styled from '@emotion/styled'
import { Cluster } from '@solana/web3.js'
import Tooltip from './Tooltip'

export const StyledWalletButton = styled(WalletMultiButton)`
  color: rgb(55, 65, 81, 1);
  &:hover {
    background: none !important;
  }
  .wallet-adapter-button {
    padding: 0px;
  }
`

export const Header = () => {
  const router = useRouter()
  const ctx = useEnvironmentCtx()
  const wallet = useWallet()

  function updateQueryParameter() {
    const url = new URL(window.location.href)

    const currentCluster = ctx.environment.label

    let newCluster: Cluster;
    if (currentCluster === null) {
      newCluster = 'devnet' // Parameter does not exist, so set it to 'devnet'
    } else if (currentCluster === 'devnet') {
      newCluster = 'mainnet-beta'
    } else if (currentCluster === 'mainnet-beta') {
      newCluster = 'devnet'
    } else {
      newCluster = currentCluster
    }
    const newEnv = ENVIRONMENTS.find((env) => env.label === newCluster)
    if (!newEnv) return
    ctx.setEnvironment(newEnv)
    url.searchParams.set('cluster', newCluster)
    window.history.replaceState(null, '', url.toString())
  }

  return (
    <div className={`flex flex-row h-20 justify-between pl-5 text-white`}>
      <div className="flex items-center gap-3">
        <div
          className="font-heading text-xl font-semibold tracking-wide hover:cursor-pointer text-white"
          onClick={() =>
            router.push(
              `/${
                ctx.environment.label !== 'mainnet-beta'
                  ? `?cluster=${ctx.environment.label}`
                  : ''
              }`
            )
          }
        >
          Hydra UI
        </div>
        <Tooltip content="Switch Network">
          <div
            className="cursor-pointer rounded-md bg-[#9945ff] p-1 text-[10px] italic text-white"
            onClick={updateQueryParameter}
          >
            {ctx.environment.label}
          </div>
        </Tooltip>
      </div>

      <div className="relative my-auto flex items-center pr-8 align-middle">
  <div className="relative my-auto flex items-center align-middle font-heading text-sm font-medium tracking-wide text-white/80">
          <div
            onClick={() =>
              router.push(
                `/create${
                  ctx.environment.label !== 'mainnet-beta'
                    ? `?cluster=${ctx.environment.label}`
                    : ''
                }`
              )
            }
          >
            <p className="my-auto mr-10 hover:cursor-pointer">Create</p>
          </div>
        </div>
        <StyledWalletButton
          style={{
            fontSize: '14px',
            zIndex: 10,
            height: '38px',
            border: 'none',
            background: 'none',
            backgroundColor: 'none',
          }}
        />
      </div>
    </div>
  )
}
