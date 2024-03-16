import {ASSOCIATED_TOKEN_PROGRAM_ID} from '@solana/spl-token';
import {tokenProgramId, wnsProgramId} from '../utils/constants';
import {
	getAtaAddress,
	getGroupAccountPda,
	getManagerAccountPda,
	getMigrationAuthorityPda,
	getMigrationProgram,
} from '../utils/core';
import {Keypair, SYSVAR_RENT_PUBKEY, SystemProgram} from '@solana/web3.js';
import {type Provider} from '@coral-xyz/anchor';

export type CreateGroupArgs = {
	name: string;
	symbol: string;
	uri: string;
	maxSize: number;
	royalties: boolean;
};

export const getMigrateCollectionIx = async (provider: Provider, args: CreateGroupArgs) => {
	const migrationProgram = getMigrationProgram(provider);
	const groupMint = new Keypair();
	const group = getGroupAccountPda(groupMint.publicKey.toString());
	const migrationAuthorityPda = getMigrationAuthorityPda(group.toString());
	const ix = await migrationProgram.methods
		.migrateCollection({
			name: args.name,
			symbol: args.symbol,
			uri: args.uri,
			maxSize: args.maxSize,
		}, args.royalties)
		.accountsStrict({
			systemProgram: SystemProgram.programId,
			rent: SYSVAR_RENT_PUBKEY,
			associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			tokenProgram: tokenProgramId,
			collectionAuthority: migrationAuthorityPda,
			wnsGroup: group,
			wnsGroupMint: groupMint.publicKey,
			wnsGroupMintTokenAccount: getAtaAddress(groupMint.publicKey.toString(), tokenProgramId.toString()),
			wnsManager: getManagerAccountPda(),
			wnsProgram: wnsProgramId,
			migrationAuthorityPda,
		})
		.instruction();

	return ix;
};
