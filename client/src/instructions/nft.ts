/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
	getAtaAddress,
	getExtraMetasAccountPda,
	getManagerAccountPda,
	getMemberAccountPda,
	getMigrationAuthorityPda,
	getMigrationProgram,
	getWhitelistMintPda,
} from '../utils/core';
import {
	Keypair, PublicKey, SYSVAR_INSTRUCTIONS_PUBKEY, SYSVAR_RENT_PUBKEY, SystemProgram,
} from '@solana/web3.js';
import {AnchorProvider, type Provider} from '@coral-xyz/anchor';
import {tokenProgramId, wnsProgramId} from '../utils';
import {
	Metaplex,
	walletAdapterIdentity,
} from '@metaplex-foundation/js';
import {ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID} from '@solana/spl-token';
export type WhitelsitMintArgs = {
	metaplexMint: string;
	group: string;
	authority: string;
};

export const getWhitelistMintIx = async (provider: Provider, args: WhitelsitMintArgs) => {
	const migrationProgram = getMigrationProgram(provider);
	const migrationAuthorityPda = getMigrationAuthorityPda(args.group);
	const migrationMintPda = getWhitelistMintPda(args.metaplexMint, args.group);
	const ix = await migrationProgram.methods
		.whitelistMint()
		.accountsStrict({
			collectionAuthority: args.authority,
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
	metaplexCollectionMetadata: string;
	metaplexNftToken: string;
};

export const getMigrateMintIx = async (provider: Provider, args: MigrateMintArgs) => {
	const migrationProgram = getMigrationProgram(provider);
	const migrationAuthorityPda = getMigrationAuthorityPda(args.group);
	const migrationMintPda = getWhitelistMintPda(args.metaplexMint, args.group);
	const manager = getManagerAccountPda();
	const metaplex = new Metaplex(provider.connection).use(
		walletAdapterIdentity(AnchorProvider.env().wallet),
	);
	const mintAta = getAtaAddress(args.metaplexMint, TOKEN_PROGRAM_ID.toString());
	const wnsNftMint = new Keypair();
	const ix = await migrationProgram.methods
		.migrateMint()
		.accountsStrict({
			migrationAuthorityPda,
			wnsGroup: args.group,
			wnsManager: manager,
			rent: SYSVAR_RENT_PUBKEY,
			associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			tokenProgram: tokenProgramId,
			systemProgram: SystemProgram.programId,
			wnsProgram: wnsProgramId,
			metaplexNftMint: args.metaplexMint,
			migrationMintPda,
			nftOwner: args.owner,
			metaplexCollection: args.metaplexCollection,
			metaplexCollectionMetadata: args.metaplexCollectionMetadata,
			metaplexNftToken: args.metaplexNftToken,
			metaplexNftMetadata: metaplex.nfts().pdas().metadata({mint: new PublicKey(args.metaplexMint)}),
			metaplexNftMasterEdition: metaplex.nfts().pdas().masterEdition({mint: new PublicKey(args.metaplexMint)}),
			metaplexNftTokenRecord: metaplex.nfts().pdas().tokenRecord({mint: new PublicKey(args.metaplexMint), token: mintAta}),
			wnsNftMint: wnsNftMint.publicKey,
			wnsNftToken: getAtaAddress(wnsNftMint.publicKey.toString(), tokenProgramId.toString()),
			wnsNftMemberAccount: getMemberAccountPda(wnsNftMint.publicKey.toString()),
			extraMetasAccount: getExtraMetasAccountPda(args.metaplexMint),
			metaplexProgram: metaplex.programs().getTokenMetadata().address,
			sysvarInstructions: SYSVAR_INSTRUCTIONS_PUBKEY,
			tokenProgram2022: tokenProgramId,
		})
		.instruction();
	return ix;
};
