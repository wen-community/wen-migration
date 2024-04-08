import {
	AnchorProvider, type Idl, Program, type Provider,
	utils,
} from '@coral-xyz/anchor';
import {Connection, PublicKey} from '@solana/web3.js';
import {wnsProgramId, mplTokenProgramId, migrationProgramId, token22ProgramId, tokenTradProgramId} from './constants';
import {ASSOCIATED_TOKEN_PROGRAM_ID} from '@solana/spl-token';
import {type WenMigration, migrationIdl} from '../program';

export const getProvider = () => {
	const connection = new Connection(process.env.RPC_URL ?? 'https://api.devnet.solana.com');
	const anchorProvider = AnchorProvider.local();
	const provider = new AnchorProvider(connection, anchorProvider.wallet, {...AnchorProvider.defaultOptions(), commitment: 'processed'});
	return provider;
};

export const getMigrationProgram = (provider: Provider) => new Program(
	migrationIdl as Idl,
	migrationProgramId,
	provider,
) as unknown as Program<WenMigration>;

export const getProgramAddress = (seeds: Uint8Array[], programId: PublicKey) => {
	const [key] = PublicKey.findProgramAddressSync(seeds, programId);
	return key;
};

export const getGroupAccountPda = (mint: string) => {
	const [groupAccount] = PublicKey.findProgramAddressSync([utils.bytes.utf8.encode('group'), new PublicKey(mint).toBuffer()], wnsProgramId);

	return groupAccount;
};

export const getMetaplexAtaAddress = (mint: string, owner: string): PublicKey => getProgramAddress(
	[new PublicKey(owner).toBuffer(), tokenTradProgramId.toBuffer(), new PublicKey(mint).toBuffer()],
	ASSOCIATED_TOKEN_PROGRAM_ID,
);

export const getWnsAtaAddress = (mint: string, owner: string): PublicKey => getProgramAddress(
	[new PublicKey(owner).toBuffer(), token22ProgramId.toBuffer(), new PublicKey(mint).toBuffer()],
	ASSOCIATED_TOKEN_PROGRAM_ID,
);

export const getMigrationAuthorityPda = (group: string) => {
	const [migrationAuthority] = PublicKey.findProgramAddressSync([new PublicKey(group).toBuffer()], migrationProgramId);

	return migrationAuthority;
};

export const getWhitelistMintPda = (mint: string, group: string) => {
	const migrationAuthority = getMigrationAuthorityPda(group);
	const [migrationMint] = PublicKey.findProgramAddressSync([new PublicKey(mint).toBuffer(), migrationAuthority.toBuffer()], migrationProgramId);

	return migrationMint;
};

export const getManagerAccountPda = () => {
	const [managerAccount] = PublicKey.findProgramAddressSync([utils.bytes.utf8.encode('manager')], wnsProgramId);

	return managerAccount;
};

export const getMemberAccountPda = (mint: string) => {
	const [groupAccount] = PublicKey.findProgramAddressSync([utils.bytes.utf8.encode('member'), new PublicKey(mint).toBuffer()], wnsProgramId);

	return groupAccount;
};

export const getExtraMetasAccountPda = (mint: string) => {
	const [extraMetasAccount] = PublicKey.findProgramAddressSync([utils.bytes.utf8.encode('extra-account-metas'), new PublicKey(mint).toBuffer()], wnsProgramId);

	return extraMetasAccount;
};

export const getMetaplexTokenRecord = (mint: string, ata: string) => {
	const [tokenRecord] = PublicKey.findProgramAddressSync(
		[
			Buffer.from(utils.bytes.utf8.encode('metadata')),
			mplTokenProgramId.toBytes(),
			new PublicKey(mint).toBytes(),
			Buffer.from(utils.bytes.utf8.encode('token_record')),
			new PublicKey(ata).toBytes(),
		],
		mplTokenProgramId,
	);

	return tokenRecord;
};

export const getMetaplexMasterEdition = (mint: string) => {
	const [nftMasterEdition] = PublicKey.findProgramAddressSync(
		[
			Buffer.from(utils.bytes.utf8.encode('metadata')),
			mplTokenProgramId.toBytes(),
			new PublicKey(mint).toBytes(),
			Buffer.from(utils.bytes.utf8.encode('edition')),
		],
		mplTokenProgramId,
	);

	return nftMasterEdition;
};

export const getMetaplexMetadata = (mint: string) => {
	const [nftMetadata] = PublicKey.findProgramAddressSync(
		[Buffer.from(utils.bytes.utf8.encode('metadata')),
			mplTokenProgramId.toBytes(),
			new PublicKey(mint).toBytes()],
		mplTokenProgramId,
	);

	return nftMetadata;
};
