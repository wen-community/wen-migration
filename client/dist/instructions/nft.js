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
exports.getMigrateMintIx = exports.getWhitelistMintIx = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
const core_1 = require("../utils/core");
const web3_js_1 = require("@solana/web3.js");
const utils_1 = require("../utils");
const spl_token_1 = require("@solana/spl-token");
const getWhitelistMintIx = (provider, args) => __awaiter(void 0, void 0, void 0, function* () {
    const { authority, group, metaplexMint } = args;
    const migrationProgram = (0, core_1.getMigrationProgram)(provider);
    const migrationAuthorityPda = (0, core_1.getMigrationAuthorityPda)(group);
    const migrationMintPda = (0, core_1.getWhitelistMintPda)(metaplexMint, group);
    const ix = yield migrationProgram.methods
        .whitelistMint()
        .accountsStrict({
        collectionAuthority: authority,
        migrationAuthorityPda,
        systemProgram: web3_js_1.SystemProgram.programId,
        metaplexNftMint: args.metaplexMint,
        migrationMintPda,
    })
        .instruction();
    return ix;
});
exports.getWhitelistMintIx = getWhitelistMintIx;
const getMigrateMintIx = (provider, args) => __awaiter(void 0, void 0, void 0, function* () {
    const { owner, group, metaplexCollection, metaplexMint } = args;
    const migrationProgram = (0, core_1.getMigrationProgram)(provider);
    const migrationAuthorityPda = (0, core_1.getMigrationAuthorityPda)(group);
    const migrationMintPda = (0, core_1.getWhitelistMintPda)(metaplexMint, group);
    const manager = (0, core_1.getManagerAccountPda)();
    const mintAta = (0, core_1.getAtaAddress)(args.metaplexMint, spl_token_1.TOKEN_PROGRAM_ID.toString());
    const wnsNftMint = new web3_js_1.Keypair();
    const ix = yield migrationProgram.methods
        .migrateMint()
        .accountsStrict({
        migrationAuthorityPda,
        wnsGroup: group,
        wnsManager: manager,
        rent: web3_js_1.SYSVAR_RENT_PUBKEY,
        associatedTokenProgram: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: utils_1.tokenProgramId,
        systemProgram: web3_js_1.SystemProgram.programId,
        wnsProgram: utils_1.wnsProgramId,
        metaplexNftMint: metaplexMint,
        migrationMintPda,
        nftOwner: owner,
        metaplexCollection,
        metaplexCollectionMetadata: (0, core_1.getMetaplexMetadata)(metaplexCollection),
        metaplexNftToken: mintAta,
        metaplexNftMetadata: (0, core_1.getMetaplexMetadata)(metaplexMint),
        metaplexNftMasterEdition: (0, core_1.getMetaplexMasterEdition)(metaplexMint),
        metaplexNftTokenRecord: (0, core_1.getMetaplexTokenRecord)(metaplexMint, mintAta.toString()),
        wnsNftMint: wnsNftMint.publicKey,
        wnsNftToken: (0, core_1.getAtaAddress)(wnsNftMint.publicKey.toString(), utils_1.tokenProgramId.toString()),
        wnsNftMemberAccount: (0, core_1.getMemberAccountPda)(wnsNftMint.publicKey.toString()),
        extraMetasAccount: (0, core_1.getExtraMetasAccountPda)(args.metaplexMint),
        metaplexProgram: utils_1.mplTokenProgramId,
        sysvarInstructions: web3_js_1.SYSVAR_INSTRUCTIONS_PUBKEY,
        tokenProgram2022: utils_1.tokenProgramId,
    })
        .instruction();
    return ix;
});
exports.getMigrateMintIx = getMigrateMintIx;
//# sourceMappingURL=nft.js.map