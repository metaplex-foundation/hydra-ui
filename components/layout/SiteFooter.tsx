import * as React from 'react'
import Link from 'next/link'

const MetaplexLogo: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...rest }) => (
  <svg width="112" height="112" viewBox="0 0 112 112" xmlns="http://www.w3.org/2000/svg" className={className} {...rest}>
    <path d="M111.712 89.3819C112.649 90.9852 111.492 92.9998 109.634 92.9998H88.7318C87.8777 92.9998 87.0879 92.5474 86.656 91.8105L46.0955 22.6205C45.1557 21.0173 46.3123 19 48.1712 19H69.1906C70.0457 19 70.8366 19.4537 71.2679 20.1916L111.712 89.3819Z" />
    <path d="M55.5027 70.5526C55.9845 71.3624 55.9481 72.3784 55.4101 73.1519L43.7707 89.8792C42.7676 91.3206 40.6051 91.2377 39.7162 89.7231L0.333968 22.6189C-0.606477 21.0165 0.550995 19 2.41125 19H23.4572C24.3066 19 25.0932 19.4469 25.5271 20.176L55.5027 70.5526Z" />
    <path d="M18.9993 88.7289C19.9512 90.334 18.7947 92.3647 16.9287 92.3647H2.49828C1.16868 92.3647 0.0908203 91.2868 0.0908203 89.9575V65.6304C0.0908203 63.1823 3.31983 62.2966 4.56882 64.4021L18.9993 88.7289Z" />
  </svg>
)

export const SiteFooter: React.FC = () => {
  return (
    <footer className="mt-auto w-full border-t border-[var(--border-subtle)]/60 bg-[rgba(255,255,255,0.02)]/10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-14 flex flex-col items-center gap-8 text-center">
        <MetaplexLogo className="h-10 w-10 text-gray-100 fill-gray-100" aria-label="Metaplex" />
        <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-gray-400">
          <Link href="https://developers.metaplex.com/hydra" className="hover:text-gray-200 transition-colors" target="_blank" rel="noopener noreferrer">Docs</Link>
          <Link href="https://github.com/metaplex-foundation/hydra-ui" className="hover:text-gray-200 transition-colors" target="_blank" rel="noopener noreferrer">GitHub UI</Link>
          <Link href="https://github.com/metaplex-foundation/mpl-hydra" className="hover:text-gray-200 transition-colors" target="_blank" rel="noopener noreferrer">Program Repo</Link>
          <Link href="https://discord.gg/metaplex" className="hover:text-gray-200 transition-colors" target="_blank" rel="noopener noreferrer">Discord</Link>
          <Link href="https://x.com/metaplex" className="hover:text-gray-200 transition-colors" target="_blank" rel="noopener noreferrer">X</Link>
        </nav>
        <p className="text-[11px] tracking-wide text-gray-500">&copy; {new Date().getFullYear()} Metaplex • Hydra UI</p>
      </div>
    </footer>
  )
}

export default SiteFooter
