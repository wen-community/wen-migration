import { type TransactionInstruction } from '@solana/web3.js';
import { type MetaplexNftData } from './constants';
import { type AnchorProvider } from '@coral-xyz/anchor';
export declare const getMigrateNftsIx: (provider: AnchorProvider, nfts: MetaplexNftData[], wnsNfts: string[], group: string) => Promise<TransactionInstruction[]>;
