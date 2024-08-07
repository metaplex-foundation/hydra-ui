import './styles.css'
import 'common/styles.css'
import type { AppProps } from 'next/app'
import { WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'

import {
  EnvironmentProvider,
  getInitialProps,
} from 'providers/EnvironmentProvider'
import { useMemo } from 'react'
import { ToastContainer } from 'common/Notification'
import Head from 'next/head'

require('@solana/wallet-adapter-react-ui/styles.css')

const App = ({
  Component,
  pageProps,
  cluster,
}: AppProps & { cluster: string }) => {
  return (
    <>
    <Head>
        <title>Hydra UI</title>
    </Head>
    <EnvironmentProvider defaultCluster={cluster}>
      <WalletProvider
        wallets={[]}
      >
{/*         <WalletIdentityProvider>
 */}          <WalletModalProvider>
            <>
              <ToastContainer />
              <Component {...pageProps} />
            </>
          </WalletModalProvider>
{/*         </WalletIdentityProvider>
 */}      </WalletProvider>
    </EnvironmentProvider>
    </>
  )
}

App.getInitialProps = getInitialProps

export default App
