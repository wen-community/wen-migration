"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computePerMigration = exports.mplTokenProgramId = exports.migrationProgramId = exports.wnsProgramId = exports.distributionProgramId = exports.token22ProgramId = exports.tokenTradProgramId = void 0;
const web3_js_1 = require("@solana/web3.js");
exports.tokenTradProgramId = new web3_js_1.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
exports.token22ProgramId = new web3_js_1.PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');
exports.distributionProgramId = new web3_js_1.PublicKey('diste3nXmK7ddDTs1zb6uday6j4etCa9RChD8fJ1xay');
exports.wnsProgramId = new web3_js_1.PublicKey('wns1gDLt8fgLcGhWi5MqAqgXpwEP1JftKE9eZnXS1HM');
exports.migrationProgramId = new web3_js_1.PublicKey('Mgr8nJhQpzhC4mEnaqYvktGJRVEJPjXLhfGccLYTgFe');
exports.mplTokenProgramId = new web3_js_1.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
exports.computePerMigration = 200000;
//# sourceMappingURL=constants.js.map