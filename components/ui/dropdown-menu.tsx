import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'

export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
export const DropdownMenuContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>>(({ className = '', ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content ref={ref} className={`glass-panel border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-xl p-1.5 ${className}`} {...props} />
  </DropdownMenuPrimitive.Portal>
))
export const DropdownMenuItem = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>>(({ className = '', ...props }, ref) => (
  <DropdownMenuPrimitive.Item ref={ref} className={`flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none hover:bg-white/10 focus:bg-white/10 ${className}`} {...props} />
))
export const DropdownMenuLabel = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>>(({ className = '', ...props }, ref) => (
  <DropdownMenuPrimitive.Label ref={ref} className={`px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-color-muted)] ${className}`} {...props} />
))
export const DropdownMenuGroup = DropdownMenuPrimitive.Group
export const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>>(({ className = '', ...props }, ref) => (
  <DropdownMenuPrimitive.Separator ref={ref} className={`my-1 h-px w-full bg-white/10 ${className}`} {...props} />
))

DropdownMenuContent.displayName = 'DropdownMenuContent'
DropdownMenuItem.displayName = 'DropdownMenuItem'
DropdownMenuLabel.displayName = 'DropdownMenuLabel'
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator'
