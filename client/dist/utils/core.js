"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetaplexMetadata = exports.getMetaplexMasterEdition = exports.getMetaplexTokenRecord = exports.getExtraMetasAccountPda = exports.getMemberAccountPda = exports.getManagerAccountPda = exports.getWhitelistMintPda = exports.getMigrationAuthorityPda = exports.getAtaAddress = exports.getGroupAccountPda = exports.getProgramAddress = exports.getMigrationProgram = exports.getProvider = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("./constants");
const spl_token_1 = require("@solana/spl-token");
const program_1 = require("../program");
const getProvider = () => {
    var _a;
    const connection = new web3_js_1.Connection((_a = process.env.RPC_URL) !== null && _a !== void 0 ? _a : 'https://api.devnet.solana.com');
    const anchorProvider = anchor_1.AnchorProvider.local();
    const provider = new anchor_1.AnchorProvider(connection, anchorProvider.wallet, Object.assign(Object.assign({}, anchor_1.AnchorProvider.defaultOptions()), { commitment: 'processed' }));
    return provider;
};
exports.getProvider = getProvider;
const getMigrationProgram = (provider) => new anchor_1.Program(program_1.migrationIdl, constants_1.wnsProgramId, provider);
exports.getMigrationProgram = getMigrationProgram;
const getProgramAddress = (seeds, programId) => {
    const [key] = web3_js_1.PublicKey.findProgramAddressSync(seeds, programId);
    return key;
};
exports.getProgramAddress = getProgramAddress;
const getGroupAccountPda = (mint) => {
    const [groupAccount] = web3_js_1.PublicKey.findProgramAddressSync([anchor_1.utils.bytes.utf8.encode('group'), new web3_js_1.PublicKey(mint).toBuffer()], constants_1.wnsProgramId);
    return groupAccount;
};
exports.getGroupAccountPda = getGroupAccountPda;
const getAtaAddress = (mint, owner) => (0, exports.getProgramAddress)([new web3_js_1.PublicKey(owner).toBuffer(), constants_1.tokenProgramId.toBuffer(), new web3_js_1.PublicKey(mint).toBuffer()], spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID);
exports.getAtaAddress = getAtaAddress;
const getMigrationAuthorityPda = (group) => {
    const [migrationAuthority] = web3_js_1.PublicKey.findProgramAddressSync([new web3_js_1.PublicKey(group).toBuffer()], constants_1.wnsProgramId);
    return migrationAuthority;
};
exports.getMigrationAuthorityPda = getMigrationAuthorityPda;
const getWhitelistMintPda = (mint, group) => {
    const migrationAuthority = (0, exports.getMigrationAuthorityPda)(group);
    const [migrationMint] = web3_js_1.PublicKey.findProgramAddressSync([new web3_js_1.PublicKey(mint).toBuffer(), migrationAuthority.toBuffer()], constants_1.wnsProgramId);
    return migrationMint;
};
exports.getWhitelistMintPda = getWhitelistMintPda;
const getManagerAccountPda = () => {
    const [managerAccount] = web3_js_1.PublicKey.findProgramAddressSync([anchor_1.utils.bytes.utf8.encode('manager')], constants_1.wnsProgramId);
    return managerAccount;
};
exports.getManagerAccountPda = getManagerAccountPda;
const getMemberAccountPda = (mint) => {
    const [groupAccount] = web3_js_1.PublicKey.findProgramAddressSync([anchor_1.utils.bytes.utf8.encode('member'), new web3_js_1.PublicKey(mint).toBuffer()], constants_1.wnsProgramId);
    return groupAccount;
};
exports.getMemberAccountPda = getMemberAccountPda;
const getExtraMetasAccountPda = (mint) => {
    const [extraMetasAccount] = web3_js_1.PublicKey.findProgramAddressSync([anchor_1.utils.bytes.utf8.encode('extra-account-metas'), new web3_js_1.PublicKey(mint).toBuffer()], constants_1.wnsProgramId);
    return extraMetasAccount;
};
exports.getExtraMetasAccountPda = getExtraMetasAccountPda;
const getMetaplexTokenRecord = (mint, ata) => {
    const [tokenRecord] = web3_js_1.PublicKey.findProgramAddressSync([
        Buffer.from(anchor_1.utils.bytes.utf8.encode('metadata')),
        constants_1.mplTokenProgramId.toBytes(),
        new web3_js_1.PublicKey(mint).toBytes(),
        Buffer.from(anchor_1.utils.bytes.utf8.encode('token_record')),
        new web3_js_1.PublicKey(ata).toBytes(),
    ], constants_1.mplTokenProgramId);
    return tokenRecord;
};
exports.getMetaplexTokenRecord = getMetaplexTokenRecord;
const getMetaplexMasterEdition = (mint) => {
    const [nftMasterEdition] = web3_js_1.PublicKey.findProgramAddressSync([
        Buffer.from(anchor_1.utils.bytes.utf8.encode('metadata')),
        constants_1.mplTokenProgramId.toBytes(),
        new web3_js_1.PublicKey(mint).toBytes(),
        Buffer.from(anchor_1.utils.bytes.utf8.encode('edition')),
    ], constants_1.mplTokenProgramId);
    return nftMasterEdition;
};
exports.getMetaplexMasterEdition = getMetaplexMasterEdition;
const getMetaplexMetadata = (mint) => {
    const [nftMetadata] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from(anchor_1.utils.bytes.utf8.encode('metadata')),
        constants_1.mplTokenProgramId.toBytes(),
        new web3_js_1.PublicKey(mint).toBytes()], constants_1.mplTokenProgramId);
    return nftMetadata;
};
exports.getMetaplexMetadata = getMetaplexMetadata;
//# sourceMappingURL=core.js.map