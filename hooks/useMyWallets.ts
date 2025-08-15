import * as React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'

export interface MyWalletMeta { id: string; name: string; lastAccessed: number; role: 'authority' | 'recent' }

// Heuristic hook: merges locally stored recent wallets; marks all as 'recent' unless authority matches naming pattern (placeholder)
export function useMyWallets() {
  const wallet = useWallet()
  const [wallets, setWallets] = React.useState<MyWalletMeta[]>([])
  React.useEffect(()=>{
    try {
      const raw = localStorage.getItem('hydra_recent_wallets')
      if(raw){
        const parsed: any[] = JSON.parse(raw)
        const mapped: MyWalletMeta[] = parsed.map(w => ({ ...w, role: (wallet.publicKey && w.id === wallet.publicKey.toBase58()) ? 'authority' : 'recent' }))
        setWallets(mapped.sort((a,b)=> b.lastAccessed - a.lastAccessed))
      }
    } catch {}
  },[wallet.publicKey])
  // Future: fetch authoritative list via backend by wallet.publicKey
  return { wallets, isAuthorityList:false }
}
