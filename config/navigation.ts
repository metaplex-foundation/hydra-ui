// Central navigation information architecture for Hydra UI
// Consolidates primary, secondary, and contextual (wallet-scoped) nav items.

export interface NavItem {
  title: string
  url: string
  icon?: any
  external?: boolean
  badge?: string
}

export interface WalletContextNavGroup {
  title: string
  items: NavItem[]
}

// Primary app-level navigation (not wallet specific)
export const primaryNav: NavItem[] = [
  { title: 'Dashboard', url: '/' },
  { title: 'Create Wallet', url: '/create' },
]

// Secondary utility/navigation
export const secondaryNav: NavItem[] = [
  { title: 'Settings', url: '#settings' },
  { title: 'Help', url: '#help' },
]

// Wallet contextual sections (displayed when viewing a wallet)
export const walletSections: WalletContextNavGroup[] = [
  { title: 'Overview', items: [ { title: 'Summary', url: '#overview' } ] },
  { title: 'Members', items: [ { title: 'List', url: '#members' }, { title: 'Manage', url: '#manage' } ] },
  { title: 'Activity', items: [ { title: 'Timeline', url: '#activity' } ] },
]

// Utility to derive anchor IDs for scrolling
export function sectionId(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g,'-')
}
