import { type Provider } from '@coral-xyz/anchor';
export type CreateGroupArgs = {
    name: string;
    symbol: string;
    uri: string;
    maxSize: number;
    royalties: boolean;
    group: string;
    rewardMint: string;
    rewardAmount: number;
};
export declare const getMigrateCollectionIx: (provider: Provider, args: CreateGroupArgs) => Promise<import("@solana/web3.js").TransactionInstruction>;
export declare const getUpdateCollectionIx: (provider: Provider, groupMint: string, amount: number) => Promise<import("@solana/web3.js").TransactionInstruction>;
