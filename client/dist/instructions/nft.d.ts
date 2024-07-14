import { type TransactionInstruction } from '@solana/web3.js';
import { type Provider } from '@coral-xyz/anchor';
export type WhitelsitMintArgs = {
    metaplexMint: string;
    group: string;
    authority: string;
};
export declare const getWhitelistMintIx: (provider: Provider, args: WhitelsitMintArgs) => Promise<TransactionInstruction>;
export type MigrateMintArgs = {
    metaplexMint: string;
    group: string;
    owner: string;
    metaplexCollection: string;
    wnsNft: string;
    rewardMint: string;
};
export declare const getMigrateMintIx: (provider: Provider, args: MigrateMintArgs) => Promise<TransactionInstruction>;
