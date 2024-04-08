"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDL = void 0;
exports.IDL = {
    "version": "0.0.1-alpha",
    "name": "wen_migration",
    "instructions": [
        {
            "name": "migrateCollection",
            "docs": [
                "create a new wns group account"
            ],
            "accounts": [
                {
                    "name": "collectionAuthority",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "migrationAuthorityPda",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "wnsGroup",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "wnsGroupMint",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "wnsGroupMintTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "wnsManager",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rent",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "associatedTokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "wnsProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "name",
                    "type": "string"
                },
                {
                    "name": "symbol",
                    "type": "string"
                },
                {
                    "name": "uri",
                    "type": "string"
                },
                {
                    "name": "maxSize",
                    "type": "u32"
                },
                {
                    "name": "royalties",
                    "type": "bool"
                }
            ]
        },
        {
            "name": "whitelistMint",
            "docs": [
                "create a pda representing a migration mint"
            ],
            "accounts": [
                {
                    "name": "collectionAuthority",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "metaplexNftMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "migrationMintPda",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "migrationAuthorityPda",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "migrateMint",
            "accounts": [
                {
                    "name": "nftOwner",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "migrationAuthorityPda",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "migrationMintPda",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "metaplexCollectionMetadata",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "metaplexNftMint",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "metaplexNftToken",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "metaplexNftMetadata",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "metaplexNftEdition",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "metaplexNftMasterEdition",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "metaplexNftTokenRecord",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "wnsManager",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "wnsGroup",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "wnsNftMint",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "wnsNftToken",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "wnsNftMemberAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "extraMetasAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "metaplexProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "wnsProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "sysvarInstructions",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rent",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "associatedTokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram2022",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        }
    ],
    "accounts": [
        {
            "name": "migrationMintPda",
            "docs": [
                "empty struct representing an nft mint that's part of a collection to be burned"
            ],
            "type": {
                "kind": "struct",
                "fields": []
            }
        },
        {
            "name": "migrationAuthorityPda",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "wnsGroup",
                        "type": "publicKey"
                    },
                    {
                        "name": "authority",
                        "type": "publicKey"
                    },
                    {
                        "name": "royalties",
                        "type": "bool"
                    }
                ]
            }
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "InvalidGroupAuthority",
            "msg": "Invalid Group Authority for collection account"
        },
        {
            "code": 6001,
            "name": "InvalidCreatorPctAmount",
            "msg": "Invalid creator pct amount. Must add up to 100"
        },
        {
            "code": 6002,
            "name": "ArithmeticOverflow",
            "msg": "Arithmetic overflow"
        }
    ]
};
//# sourceMappingURL=wen_migration.js.map