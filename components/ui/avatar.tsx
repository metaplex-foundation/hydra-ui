import * as React from 'react'
import Image, { ImageProps } from 'next/image'

export const Avatar: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...rest }) => (
  <div className={`relative inline-flex overflow-hidden bg-white/10 text-white items-center justify-center ${className}`} {...rest}>{children}</div>
)
export const AvatarImage: React.FC<ImageProps> = ({ className = '', alt, ...rest }) => (
  <Image className={`h-full w-full object-cover ${className}`} alt={alt} {...rest} />
)
export const AvatarFallback: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className = '', children, ...rest }) => (
  <span className={`flex h-full w-full items-center justify-center text-xs font-medium ${className}`} {...rest}>{children}</span>
)
