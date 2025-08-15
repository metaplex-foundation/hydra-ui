# Hydra - Multi-Party Revenue Sharing on Solana

**Split payments automatically among multiple wallets with zero coding required.**

Hydra is a "fanout wallet" that lets you create a shared wallet where funds are automatically distributed to multiple recipients based on predetermined shares. Perfect for DAOs, creator royalties, team payments, and any scenario where you need to split money among multiple parties.

## 🚀 Quick Start - Use the Hosted App

**Mainnet:** https://hydra.metaplex.com  
**Devnet (for testing):** https://hydra.metaplex.com?cluster=devnet

No installation required - just connect your Solana wallet and start creating shared wallets!

## 📖 How It Works

1. **Create a Hydra Wallet** - Set up a shared wallet with a name and total shares
2. **Add Members** - Specify wallet addresses and how many shares each gets
3. **Receive Funds** - Send SOL or SPL tokens to your Hydra wallet's payment address
4. **Distribute** - Members claim their proportional share anytime

### Example
- Create wallet with 100 total shares
- Add Alice (60 shares), Bob (25 shares), Carol (15 shares)  
- Send 10 SOL to the wallet
- Alice can claim 6 SOL, Bob gets 2.5 SOL, Carol gets 1.5 SOL

## 🔧 Step-by-Step Guide

### 1. Create Your Hydra Wallet
1. Go to https://hydra.metaplex.com
2. Connect your Solana wallet
3. Click "Create New Hydra"
4. Choose your membership model:
   - **Wallet**: Simple list of addresses and shares (recommended for most users)
   - **NFT**: Membership tied to NFT ownership 
   - **Token**: Membership based on staked tokens

### 2. Configure Your Wallet
- **Name**: Give your wallet a unique name (globally unique across all Hydra wallets)
- **Total Shares**: Set the total number of shares (e.g., 100 for easy percentage calculations)
- **Members**: Add wallet addresses and assign shares to each

### 3. Understanding Your Addresses
After creation, you'll get TWO important addresses:

- **🏛️ Fanout Address** (e.g., `DnUt...wR8c`): This is your wallet's ID/configuration address
- **💰 Payment Address** (e.g., `8Ugc...o6KB`): **This is where you send funds to be distributed**

**⚠️ IMPORTANT: Always send funds to the Payment Address, not the Fanout Address!**

### 4. Adding Funds
Send SOL or SPL tokens directly to your **Payment Address**. The funds will be held in the wallet until members claim their shares.

### 5. Claiming Your Share
Members can visit the Hydra UI anytime and:
1. Connect their wallet
2. Find wallets where they're a member
3. Click "Claim" to receive their proportional share

## 💡 Key Features

- **Automatic Splitting**: Funds are divided proportionally based on shares
- **Multi-Token Support**: Works with SOL and any SPL token
- **Flexible Membership**: Support for wallet addresses, NFTs, or token-based membership
- **Transparent**: All transactions are on-chain and verifiable
- **No Ongoing Fees**: Pay only for transaction costs

## ❓ Frequently Asked Questions

**Q: Which address do I send money to?**  
A: Always send to the **Payment Address** (the longer address starting with numbers/letters), NOT the Fanout Address.

**Q: Can I change members after creating the wallet?**  
A: This depends on your wallet configuration. Some models allow adding members, others are fixed at creation.

**Q: How do members know they have funds to claim?**  
A: Members need to check the Hydra UI or you can notify them. The system doesn't send automatic notifications.

**Q: Are there fees?**  
A: Only standard Solana transaction fees apply. No additional fees from Hydra.

**Q: Can I use this for recurring payments?**  
A: Yes! Just keep sending funds to the same Payment Address and members can claim their shares anytime.

**Q: What happens if I send the wrong token type?**  
A: You need to initialize your wallet for each token type you want to accept. The UI guides you through this process.

## 🛠️ Advanced Features

### Multiple Token Support
Your Hydra wallet can accept different types of tokens (SOL, USDC, etc.), but you need to initialize it for each token type through the UI.

### NFT-Based Membership  
Instead of fixed wallet addresses, you can tie membership to NFT ownership. Anyone holding the specified NFT gets the associated shares.

### Token-Based Membership
Members stake your custom token to participate. Shares are calculated based on the amount staked.

## 🚨 Important Notes

- **Test First**: Use devnet (https://hydra.metaplex.com?cluster=devnet) with test SOL before using real funds
- **Save Your Addresses**: Keep both your Fanout Address and Payment Address safe
- **Distribution is Manual**: Members must actively claim their shares - it's not automatic
- **Irreversible**: Be careful with your configuration as some settings cannot be changed

## 🔗 Useful Links



## For Developers

### Local Development

```bash
git clone https://github.com/metaplex-foundation/hydra-ui.git
cd hydra-ui
yarn install
yarn dev
```

### Typography / Design Language (August 2025 Update)

The application now uses the Google fonts Lexend (headings) and Inter (body) loaded via `next/font` for optimal performance. Implementation details:

- Fonts declared in `_app.tsx` with CSS variables `--font-lexend` & `--font-inter`.
- Tailwind config maps `fontFamily.heading` and extends `fontFamily.sans` to reference those variables.
- Global stylesheet (`pages/styles.css`) applies `var(--font-heading)` to all `h1`–`h6` elements and `var(--font-body)` to body text; utility classes `.font-heading` / `.font-body` are available.
- Remove any legacy font imports – they were cleaned out of `_document.tsx`.

Heading scale (clamp-based for responsiveness):
H1 ~ 2.4–3.25rem, H2 ~ 1.9–2.4rem, H3 ~ 1.55–1.9rem, H4 1.35rem, H5 1.15rem, H6 0.95rem (uppercase / tracking).

Body base size: 15px / 1.55 line-height; use `text-sm`, `text-base`, `md:text-lg` utilities as needed per Tailwind.

For accent hero headings include the existing `hero-title` class for underline flourish.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Deployments
All commits to main branch will be automatically deployed to production and dev URLs. Open PRs to main will deploy ephemeral preview deployments.

### Contributing
Feel free to open a PR against main. Forks are encouraged as well.

### Technical Overview
Hydra is a protocol on Solana for facilitating collective account pooling, fan out wallet and dao treasury. It can be thought of as a group-owned wallet that can accept funds. Unlike a multi-signature wallet, this is meant to collect and distribute funds, not execute group transactions. More information on the protocol can be found in the [Metaplex Developer Hub](https://developers.metaplex.com/hydra).
