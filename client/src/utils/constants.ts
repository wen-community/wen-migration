import {PublicKey} from '@solana/web3.js';

export const tokenTradProgramId = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
export const token22ProgramId = new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');
export const distributionProgramId = new PublicKey('diste3nXmK7ddDTs1zb6uday6j4etCa9RChD8fJ1xay');
export const wnsProgramId = new PublicKey('wns1gDLt8fgLcGhWi5MqAqgXpwEP1JftKE9eZnXS1HM');
export const migrationProgramId = new PublicKey('Mgr8nJhQpzhC4mEnaqYvktGJRVEJPjXLhfGccLYTgFe');
export const mplTokenProgramId = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

export const computePerMigration = 200_000;

export type MetaplexNftData = {
	mint: string;
	metaplexCollection: string;
};
