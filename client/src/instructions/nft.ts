/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
	getAtaAddress,
	getExtraMetasAccountPda,
	getManagerAccountPda,
	getMemberAccountPda,
	getMetaplexMasterEdition,
	getMetaplexMetadata,
	getMetaplexTokenRecord,
	getMigrationAuthorityPda,
	getMigrationProgram,
	getWhitelistMintPda,
} from '../utils/core';
import {
	Keypair, SYSVAR_INSTRUCTIONS_PUBKEY, SYSVAR_RENT_PUBKEY, SystemProgram,
	type TransactionInstruction,
} from '@solana/web3.js';
import {type Provider} from '@coral-xyz/anchor';
import {mplTokenProgramId, tokenProgramId, wnsProgramId} from '../utils';
import {ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID} from '@solana/spl-token';
export type WhitelsitMintArgs = {
	metaplexMint: string;
	group: string;
	authority: string;
};

export const getWhitelistMintIx = async (provider: Provider, args: WhitelsitMintArgs): Promise<TransactionInstruction> => {
	const {authority, group, metaplexMint} = args;
	const migrationProgram = getMigrationProgram(provider);
	const migrationAuthorityPda = getMigrationAuthorityPda(group);
	const migrationMintPda = getWhitelistMintPda(metaplexMint, group);
	const ix: TransactionInstruction = await migrationProgram.methods
		.whitelistMint()
		.accountsStrict({
			collectionAuthority: authority,
			migrationAuthorityPda,
			systemProgram: SystemProgram.programId,
			metaplexNftMint: args.metaplexMint,
			migrationMintPda,
		})
		.instruction();

	return ix;
};

export type MigrateMintArgs = {
	metaplexMint: string;
	group: string;
	owner: string;
	metaplexCollection: string;
};

export const getMigrateMintIx = async (provider: Provider, args: MigrateMintArgs): Promise<TransactionInstruction> => {
	const {owner, group, metaplexCollection, metaplexMint} = args;

	const migrationProgram = getMigrationProgram(provider);
	const migrationAuthorityPda = getMigrationAuthorityPda(group);
	const migrationMintPda = getWhitelistMintPda(metaplexMint, group);
	const manager = getManagerAccountPda();

	const mintAta = getAtaAddress(args.metaplexMint, TOKEN_PROGRAM_ID.toString());

	const wnsNftMint = new Keypair();
	const ix = await migrationProgram.methods
		.migrateMint()
		.accountsStrict({
			migrationAuthorityPda,
			wnsGroup: group,
			wnsManager: manager,
			rent: SYSVAR_RENT_PUBKEY,
			associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			tokenProgram: tokenProgramId,
			systemProgram: SystemProgram.programId,
			wnsProgram: wnsProgramId,
			metaplexNftMint: metaplexMint,
			migrationMintPda,
			nftOwner: owner,
			metaplexCollection,
			metaplexCollectionMetadata: getMetaplexMetadata(metaplexCollection),
			metaplexNftToken: mintAta,
			metaplexNftMetadata: getMetaplexMetadata(metaplexMint),
			metaplexNftMasterEdition: getMetaplexMasterEdition(metaplexMint),
			metaplexNftTokenRecord: getMetaplexTokenRecord(metaplexMint, mintAta.toString()),
			wnsNftMint: wnsNftMint.publicKey,
			wnsNftToken: getAtaAddress(wnsNftMint.publicKey.toString(), tokenProgramId.toString()),
			wnsNftMemberAccount: getMemberAccountPda(wnsNftMint.publicKey.toString()),
			extraMetasAccount: getExtraMetasAccountPda(args.metaplexMint),
			metaplexProgram: mplTokenProgramId,
			sysvarInstructions: SYSVAR_INSTRUCTIONS_PUBKEY,
			tokenProgram2022: tokenProgramId,
		})
		.instruction();
	return ix;
};
