import * as React from "react"
import { TopNav } from "./TopNav"
import { ContextBar } from './ContextBar'
import { cn } from "@/lib/utils"
import { SiteFooter } from "./SiteFooter"

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
  <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_rgba(60,60,70,0.15),_transparent_70%)] bg-gray-950 text-gray-100 overflow-x-hidden font-body flex flex-col">
  <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 bg-[var(--color-accent)] text-gray-900 px-4 py-2 rounded-md shadow-lg transition">Skip to main content</a>
  <TopNav />
  <ContextBar />
  <main id="main" className={cn("flex-1 w-full pb-12 flex flex-col pt-16", className)}>
        <div className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-8">
          {children}
        </div>
        <SiteFooter />
      </main>
    </div>
  )
}