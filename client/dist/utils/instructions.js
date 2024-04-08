"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMigrateNftsIx = void 0;
const instructions_1 = require("../instructions");
/*
    @params
        provider: anchor provider
        nfts
*/
const getMigrateNftsIx = (provider, nfts, wnsNfts, group) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = provider.wallet.publicKey.toString();
    const ixs = [];
    let i = 0;
    // Batch in fives
    for (const nft of nfts) {
        const { mint, metaplexCollection: collection } = nft;
        const wnsNft = wnsNfts[i];
        const migrateIx = (0, instructions_1.getMigrateMintIx)(provider, {
            owner,
            group,
            metaplexCollection: collection,
            metaplexMint: mint,
            wnsNft,
        });
        i++;
        ixs.push(migrateIx);
    }
    const resolvedIxs = yield Promise.all(ixs);
    return resolvedIxs;
});
exports.getMigrateNftsIx = getMigrateNftsIx;
//# sourceMappingURL=instructions.js.map