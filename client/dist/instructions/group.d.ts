/// <reference types="@solana/web3.js" />
import { type Provider } from '@coral-xyz/anchor';
export type CreateGroupArgs = {
    name: string;
    symbol: string;
    uri: string;
    maxSize: number;
    royalties: boolean;
    group: string;
};
export declare const getMigrateCollectionIx: (provider: Provider, args: CreateGroupArgs) => Promise<import("@solana/web3.js").TransactionInstruction>;
