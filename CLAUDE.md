# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Hydra UI is a Next.js application for managing multi-party revenue sharing wallets on Solana. It provides a web interface for the Metaplex Hydra protocol, enabling automatic fund distribution among multiple recipients.

## Development Commands
```bash
# Start development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Run linting
yarn lint

# Run a single test (no test framework currently configured)
# Tests would need to be set up if required
```

## Architecture

### Core Technologies
- Next.js 12.1.6 with TypeScript
- Solana Web3.js and Wallet Adapter for blockchain integration
- @metaplex-foundation/mpl-hydra for Hydra protocol
- Tailwind CSS + shadcn/ui components for modern UI
- Emotion for CSS-in-JS styling

### Provider Architecture
The app uses a nested provider pattern for global state:
1. `EnvironmentProvider` - Manages Solana network connections (mainnet/devnet/testnet)
2. `ThemeProvider` - Dark/light mode theming
3. `WalletProvider` - Solana wallet connection management

### Custom Hooks Pattern
Data fetching and state management use custom hooks:
- `useDataHook` - Generic data fetching with loading/error states
- `useFanoutData` - Hydra wallet data management
- `useFanoutMembershipVouchers` - Member voucher management
- `useFanoutMints` - Token mint management

### Page Structure
- `/` - Dashboard home page
- `/create` - Create new Hydra wallet
- `/[walletId]` - Individual wallet management

### Component Organization
- `components/layout/` - Layout components (DashboardLayout, ModernHeader, Sidebar)
- `components/ui/` - Reusable UI components from shadcn/ui
- `common/` - Solana-specific components and utilities

## Key Development Patterns

### Solana Integration
- All Solana interactions go through the wallet adapter pattern
- Support for mainnet, devnet, and testnet via EnvironmentProvider
- Payment mints configuration in `config/payment-mints.json` for SPL token support

### TypeScript Configuration
- Strict mode enabled with comprehensive type checking
- Use explicit types for Solana-specific data structures
- Avoid `any` types; leverage the type definitions from @metaplex-foundation/mpl-hydra

### UI Component Patterns
- Use shadcn/ui components from `components/ui/` for consistency
- Follow the existing pattern of importing from component index files
- Maintain dark/light theme support through ThemeProvider

### State Management
- Use custom hooks for data fetching (pattern established in `hooks/`)
- Leverage React Query patterns in useDataHook for caching and refetching
- Keep component state local unless needed globally

## Important Considerations

### Environment Variables
- `MAINNET_PRIMARY` - Mainnet RPC endpoint
- `DEVNET_PRIMARY` - Devnet RPC endpoint
- Network selection handled by EnvironmentProvider

### Webpack Configuration
The project includes custom webpack configuration for crypto and stream polyfills required by Solana libraries. Don't modify `next.config.js` webpack settings unless necessary for Solana compatibility.

### Package Management
Currently using Yarn as the primary package manager. Avoid mixing package managers.

### Recent UI Redesign
The project recently underwent a major UI transformation to a modern dashboard layout. When adding new features:
- Follow the established dashboard layout pattern
- Use the modern component library (shadcn/ui)
- Maintain consistency with the new design system
- we are always running a dev server, u dont need to run or build, its with pm2, you can list, view logs with --nostream, don't build or restart without human permission
- never run BUILD we are running pm2 u fart
- we are running pm2 and i told u this 100x