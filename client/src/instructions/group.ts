import {ASSOCIATED_TOKEN_PROGRAM_ID} from '@solana/spl-token';
import {token22ProgramId, wnsProgramId} from '../utils/constants';
import {
	getGroupAccountPda,
	getManagerAccountPda,
	getMigrationAuthorityPda,
	getMigrationProgram,
	getWnsAtaAddress,
} from '../utils/core';
import {
	PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram,
} from '@solana/web3.js';
import {BN, type Provider} from '@coral-xyz/anchor';

export type CreateGroupArgs = {
	name: string;
	symbol: string;
	uri: string;
	maxSize: number;
	royalties: boolean;
	group: string;
};

export const getMigrateCollectionIx = async (provider: Provider, args: CreateGroupArgs) => {
	const migrationProgram = getMigrationProgram(provider);
	const groupMint = new PublicKey(args.group);
	const group = getGroupAccountPda(args.group);
	const migrationAuthorityPda = getMigrationAuthorityPda(group.toString());
	const authority = provider.publicKey ?? PublicKey.default;
	const collectionSize = new BN(args.maxSize) as BN;

	const ix = await migrationProgram.methods
		.migrateCollection(
			args.name,
			args.symbol,
			args.uri,
			collectionSize,
			args.royalties)
		.accountsStrict({
			systemProgram: SystemProgram.programId,
			rent: SYSVAR_RENT_PUBKEY,
			associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			tokenProgram: token22ProgramId,
			collectionAuthority: authority,
			wnsGroup: group,
			wnsGroupMint: groupMint,
			wnsGroupMintTokenAccount: getWnsAtaAddress(args.group, authority.toString()),
			wnsManager: getManagerAccountPda(),
			wnsProgram: wnsProgramId,
			migrationAuthorityPda,
		})
		.instruction();

	return ix;
};
