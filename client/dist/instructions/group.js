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
exports.getMigrateCollectionIx = void 0;
const spl_token_1 = require("@solana/spl-token");
const constants_1 = require("../utils/constants");
const core_1 = require("../utils/core");
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@coral-xyz/anchor");
const getMigrateCollectionIx = (provider, args) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const migrationProgram = (0, core_1.getMigrationProgram)(provider);
    const groupMint = new web3_js_1.PublicKey(args.group);
    const group = (0, core_1.getGroupAccountPda)(args.group);
    const migrationAuthorityPda = (0, core_1.getMigrationAuthorityPda)(group.toString());
    const authority = (_a = provider.publicKey) !== null && _a !== void 0 ? _a : web3_js_1.PublicKey.default;
    const collectionSize = new anchor_1.BN(args.maxSize);
    const ix = yield migrationProgram.methods
        .migrateCollection(args.name, args.symbol, args.uri, collectionSize, args.royalties)
        .accountsStrict({
        systemProgram: web3_js_1.SystemProgram.programId,
        rent: web3_js_1.SYSVAR_RENT_PUBKEY,
        associatedTokenProgram: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: constants_1.token22ProgramId,
        collectionAuthority: authority,
        wnsGroup: group,
        wnsGroupMint: groupMint,
        wnsGroupMintTokenAccount: (0, core_1.getWnsAtaAddress)(args.group, authority.toString()),
        wnsManager: (0, core_1.getManagerAccountPda)(),
        wnsProgram: constants_1.wnsProgramId,
        migrationAuthorityPda,
    })
        .instruction();
    return ix;
});
exports.getMigrateCollectionIx = getMigrateCollectionIx;
//# sourceMappingURL=group.js.map