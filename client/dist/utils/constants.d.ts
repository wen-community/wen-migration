import { PublicKey } from '@solana/web3.js';
export declare const tokenTradProgramId: PublicKey;
export declare const token22ProgramId: PublicKey;
export declare const distributionProgramId: PublicKey;
export declare const wnsProgramId: PublicKey;
export declare const migrationProgramId: PublicKey;
export declare const mplTokenProgramId: PublicKey;
export declare const computePerMigration = 200000;
export type MetaplexNftData = {
    mint: string;
    metaplexCollection: string;
};
