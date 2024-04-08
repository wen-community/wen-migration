import {type TransactionInstruction} from '@solana/web3.js';
import {type MetaplexNftData} from './constants';
import {getMigrateMintIx} from '../instructions';
import {type AnchorProvider} from '@coral-xyz/anchor';

/*
    @params
        provider: anchor provider
        nfts
*/
export const getMigrateNftsIx = async (provider: AnchorProvider, nfts: MetaplexNftData[], wnsNfts: string[], group: string) => {
	const owner = provider.wallet.publicKey.toString();
	const ixs: Array<Promise<TransactionInstruction>> = [];
	let i = 0;
	// Batch in fives
	for (const nft of nfts) {
		const {mint, metaplexCollection: collection} = nft;
		const wnsNft = wnsNfts[i];
		const migrateIx = getMigrateMintIx(provider, {
			owner,
			group,
			metaplexCollection: collection,
			metaplexMint: mint,
			wnsNft,
		});
		i++;
		ixs.push(migrateIx);
	}

	const resolvedIxs = await Promise.all(ixs);
	return resolvedIxs;
};
