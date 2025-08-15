import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariantsOuter = cva("relative inline-flex select-none items-center justify-center font-medium transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none data-[focus-ring=true]:focus-visible:shadow-[var(--focus-ring)] overflow-hidden group interactive-hover", {
  variants: {
    variant: {
  primary: "w-full rounded-[var(--radius-lg)] bg-[var(--color-accent)] text-gray-950 font-semibold tracking-tight shadow-[0_1px_2px_rgba(0,0,0,0.45)] hover:shadow-[0_2px_5px_rgba(0,0,0,0.5)]",
  secondary: "w-full rounded-[var(--radius-lg)] bg-white/6 text-gray-200 hover:bg-white/10",
  outline: "w-full rounded-[var(--radius-lg)] border border-[var(--glass-border)] bg-transparent text-[var(--text-color-muted)] hover:text-white hover:border-[var(--color-accent-ring)] hover:bg-[var(--glass-bg-alt)]",
  destructive: "w-full rounded-[var(--radius-lg)] bg-gradient-to-b from-red-500 to-red-600 text-white shadow-[0_1px_2px_rgba(0,0,0,0.45)] hover:from-red-500/95 hover:to-red-600/95",
      icon: "rounded-full border border-[var(--border-subtle)] bg-white/5 text-gray-200 hover:bg-white/10 active:bg-white/15 w-9 h-9 p-0",
      luminous: "btn-luminous w-full",
  glass: "w-full rounded-[var(--radius-lg)] border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl text-gray-300 hover:text-white hover:bg-[var(--glass-bg-alt)]",
    },
    size: {
      sm: "text-xs h-7 px-3",
      default: "text-sm h-9 px-4",
      lg: "text-base h-11 px-5",
      icon: "h-9 w-9",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
  },
})

// Inner content spacing (kept minimal now that outer handles visuals)
const innerDivVariants = cva("inline-flex items-center justify-center gap-2 w-full h-full", {
  variants: {
    size: {
      sm: "",
      default: "",
      lg: "",
      icon: "",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

export interface UnifiedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "destructive" | "icon" | "luminous" | "glass"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const TextureButton = React.forwardRef<HTMLButtonElement, UnifiedButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "default",
      asChild = false,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(buttonVariantsOuter({ variant, size }), className)}
        ref={ref}
        data-focus-ring="true"
        {...props}
      >
        <div className={cn(innerDivVariants({ size }))}>{children}</div>
      </Comp>
    )
  }
)

TextureButton.displayName = "TextureButton"

export { TextureButton }

// export default TextureButton
