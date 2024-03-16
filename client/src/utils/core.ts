import {
	AnchorProvider, type Idl, Program, type Provider,
	utils,
} from '@coral-xyz/anchor';
import {Connection, PublicKey} from '@solana/web3.js';
import {wnsProgramId, tokenProgramId} from './constants';
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
	wnsProgramId,
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

export const getAtaAddress = (mint: string, owner: string): PublicKey => getProgramAddress(
	[new PublicKey(owner).toBuffer(), tokenProgramId.toBuffer(), new PublicKey(mint).toBuffer()],
	ASSOCIATED_TOKEN_PROGRAM_ID,
);

export const getMigrationAuthorityPda = (group: string) => {
	const [migrationAuthority] = PublicKey.findProgramAddressSync([new PublicKey(group).toBuffer()], wnsProgramId);

	return migrationAuthority;
};

export const getWhitelistMintPda = (mint: string, group: string) => {
	const migrationAuthority = getMigrationAuthorityPda(group);
	const [migrationMint] = PublicKey.findProgramAddressSync([new PublicKey(mint).toBuffer(), migrationAuthority.toBuffer()], wnsProgramId);

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
