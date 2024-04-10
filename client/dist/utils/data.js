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
exports.fetchWhitelistForMint = void 0;
const core_1 = require("./core");
const fetchWhitelistForMint = (provider, mint, wnsGroup) => __awaiter(void 0, void 0, void 0, function* () {
    const migrationProgram = (0, core_1.getMigrationProgram)(provider);
    const whitelistAddress = (0, core_1.getWhitelistMintPda)(mint, wnsGroup);
    try {
        const whitelistAccount = yield migrationProgram.account.migrationMintPda.fetch(whitelistAddress);
        return whitelistAccount;
    }
    catch (e) {
        return undefined;
    }
});
exports.fetchWhitelistForMint = fetchWhitelistForMint;
//# sourceMappingURL=data.js.map