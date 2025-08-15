import { FanoutClient } from '@metaplex-foundation/mpl-hydra/dist/src'
import { PublicKey } from '@solana/web3.js'

export interface RemoveMemberArgs { fanout: PublicKey; membershipAccount: PublicKey }
export interface TransferSharesArgs { fanout: PublicKey; fromMember: PublicKey; toMember: PublicKey; fromMembershipAccount: PublicKey; toMembershipAccount: PublicKey; shares: number }

export async function buildRemoveMemberInstructions(client: FanoutClient, args: RemoveMemberArgs) {
  return client.removeMemberInstructions(args as any)
}

export async function buildTransferSharesInstructions(client: FanoutClient, args: TransferSharesArgs) {
  return client.transferSharesInstructions(args as any)
}
