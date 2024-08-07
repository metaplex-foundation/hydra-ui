## Overview

This is an open UI for Hydra, a protocol on Solana for facilitating collective account pooling, fan out wallet and dao treasury. It can be thought of as a group-owned wallet that can accept funds. Unlike a multi-signature wallet, this is meant to collect and distribute funds, not execute group transactions. More information on the protocol can be found in the [Metaplex Developer Hub](https://developers.metaplex.com/hydra).

| Package   | Description          | Version                       |
| :-------- | :------------------- | :---------------------------- |
| `Devnet`  | Devnet ui for Hydra  | https://hydra.metaplex.com?cluster=devnet |
| `Mainnet` | Mainnet ui for Hydra | https://hydra.metaplex.com    |

![preview of claim page](https://github.com/user-attachments/assets/76d17dd5-b46b-4132-9eaf-4d25b133b959)


## Getting Started

```bash
git clone https://github.com/cardinal-labs/hydra-ui.git
cd hydra-ui
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## Deployments

All commits to main branch will be automatically deployed to production and dev URLs. Open PRs to main will deploy ephemeral preview deployments.

## Contributing

Feel free to open a PR against main. Forks are encouraged as well
