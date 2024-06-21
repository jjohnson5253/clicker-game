
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { WagmiProvider } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Your WalletConnect Cloud project ID
const projectId = '28e1f93e3de23e6e460f8af669ebb993'

// 2. Create wagmiConfig
const metadata = {
  name: 'game',
  description: 'Clicker Game',
  url: 'https://clicker-game-gules.vercel.app/', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet]
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  auth: {
    email: false
  },
  enableCoinbase: true,
})

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: false, 
  featuredWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // metamask
  ],
  themeVariables: {
    '--w3m-z-index': '2000',
    '--w3m-accent': '#00ADE0',
  }
})

// eslint-disable-next-line
export function Web3ModalProvider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
    