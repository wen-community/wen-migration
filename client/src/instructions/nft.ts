
import {
	getExtraMetasAccountPda,
	getManagerAccountPda,
	getMemberAccountPda,
	getMetaplexAtaAddress,
	getMetaplexMasterEdition,
	getMetaplexMetadata,
	getMetaplexTokenRecord,
	getMigrationAuthorityPda,
	getMigrationProgram,
	getUserMigrationTrackerPda,
	getWhitelistMintPda,
	getWnsAtaAddress,
} from '../utils';
import {
	Keypair, PublicKey, SYSVAR_INSTRUCTIONS_PUBKEY, SYSVAR_RENT_PUBKEY, SystemProgram,
	type TransactionInstruction,
} from '@solana/web3.js';
import {type Provider} from '@coral-xyz/anchor';
import {mplTokenProgramId, token22ProgramId, tokenTradProgramId, wnsProgramId} from '../utils';
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
	wnsNft: string;
	rewardMint: string;
};

export const getMigrateMintIx = async (provider: Provider, args: MigrateMintArgs): Promise<TransactionInstruction> => {
	const {owner, group, metaplexCollection, metaplexMint, wnsNft, rewardMint} = args;

	const migrationProgram = getMigrationProgram(provider);
	const migrationAuthorityPda = getMigrationAuthorityPda(group);
	const migrationMintPda = getWhitelistMintPda(metaplexMint, group);
	const manager = getManagerAccountPda();

	const mintAta = getMetaplexAtaAddress(args.metaplexMint, owner);
	const wnsNftMint = new PublicKey(wnsNft);
	const ix = await migrationProgram.methods
		.migrateMint()
		.accountsStrict({
			userMigrationTracker: getUserMigrationTrackerPda(owner),
			migrationAuthorityPda,
			wnsGroup: group,
			wnsManager: manager,
			rent: SYSVAR_RENT_PUBKEY,
			associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			tokenProgram: tokenTradProgramId,
			systemProgram: SystemProgram.programId,
			wnsProgram: wnsProgramId,
			metaplexNftMint: metaplexMint,
			migrationMintPda,
			nftOwner: owner,
			metaplexCollectionMetadata: getMetaplexMetadata(metaplexCollection),
			metaplexNftToken: mintAta,
			metaplexNftMetadata: getMetaplexMetadata(metaplexMint),
			metaplexNftEdition: getMetaplexMasterEdition(metaplexMint),
			metaplexNftMasterEdition: getMetaplexMasterEdition(metaplexMint),
			metaplexNftTokenRecord: getMetaplexTokenRecord(metaplexMint, mintAta.toString()),
			wnsNftMint,
			wnsNftToken: getWnsAtaAddress(wnsNft, owner),
			wnsNftMemberAccount: getMemberAccountPda(wnsNft),
			extraMetasAccount: getExtraMetasAccountPda(wnsNft),
			metaplexProgram: mplTokenProgramId,
			instructionsProgram: SYSVAR_INSTRUCTIONS_PUBKEY,
			tokenProgram2022: token22ProgramId,
			rewardMint,
			rewardUserTa: getMetaplexAtaAddress(rewardMint, owner),
			rewardProgramTa: getMetaplexAtaAddress(rewardMint, migrationAuthorityPda.toString())
		})
		.instruction();
	return ix;
};
