import {type AnchorProvider} from '@coral-xyz/anchor';
import {getMigrationProgram, getWhitelistMintPda} from './core';

export const fetchWhitelistForMint = async (provider: AnchorProvider, mint: string, wnsGroup: string) => {
	const migrationProgram = getMigrationProgram(provider);
	const whitelistAddress = getWhitelistMintPda(mint, wnsGroup);
	try {
		const whitelistAccount = await migrationProgram.account.migrationMintPda.fetch(whitelistAddress);

		return whitelistAccount;
	} catch (e) {
		return undefined;
	}
};
