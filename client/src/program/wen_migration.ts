/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/wen_migration.json`.
 */
export type WenMigration = {
  "address": "Mgr8nJhQpzhC4mEnaqYvktGJRVEJPjXLhfGccLYTgFe",
  "metadata": {
    "name": "wenMigration",
    "version": "0.0.1-alpha",
    "spec": "0.1.0",
    "description": "Program for migrating from metaplex to WNS"
  },
  "instructions": [
    {
      "name": "migrateCollection",
      "docs": [
        "create a new wns group account"
      ],
      "discriminator": [
        23,
        210,
        133,
        21,
        57,
        239,
        124,
        148
      ],
      "accounts": [
        {
          "name": "collectionAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "migrationAuthorityPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "wnsGroup"
              }
            ]
          }
        },
        {
          "name": "wnsGroup",
          "writable": true
        },
        {
          "name": "wnsGroupMint",
          "writable": true,
          "signer": true
        },
        {
          "name": "wnsGroupMintTokenAccount",
          "writable": true
        },
        {
          "name": "rewardMint",
          "writable": true
        },
        {
          "name": "wnsManager"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "wnsProgram",
          "address": "wns1gDLt8fgLcGhWi5MqAqgXpwEP1JftKE9eZnXS1HM"
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
        },
        {
          "name": "rewardAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "migrateMint",
      "discriminator": [
        44,
        219,
        122,
        235,
        251,
        138,
        113,
        150
      ],
      "accounts": [
        {
          "name": "nftOwner",
          "writable": true,
          "signer": true
        },
        {
          "name": "userMigrationTracker",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "nftOwner"
              }
            ]
          }
        },
        {
          "name": "migrationAuthorityPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "wnsGroup"
              }
            ]
          }
        },
        {
          "name": "migrationMintPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "metaplexNftMint"
              },
              {
                "kind": "account",
                "path": "migrationAuthorityPda"
              }
            ]
          }
        },
        {
          "name": "metaplexCollectionMetadata",
          "writable": true
        },
        {
          "name": "metaplexNftMint",
          "writable": true
        },
        {
          "name": "metaplexNftToken",
          "writable": true
        },
        {
          "name": "metaplexNftMetadata",
          "writable": true
        },
        {
          "name": "metaplexNftEdition",
          "writable": true
        },
        {
          "name": "metaplexNftMasterEdition",
          "writable": true
        },
        {
          "name": "metaplexNftTokenRecord",
          "writable": true
        },
        {
          "name": "wnsManager"
        },
        {
          "name": "wnsGroup",
          "writable": true
        },
        {
          "name": "wnsNftMint",
          "writable": true,
          "signer": true
        },
        {
          "name": "wnsNftToken",
          "writable": true
        },
        {
          "name": "wnsNftMemberAccount",
          "writable": true
        },
        {
          "name": "extraMetasAccount",
          "writable": true
        },
        {
          "name": "rewardMint"
        },
        {
          "name": "rewardUserTa",
          "writable": true
        },
        {
          "name": "rewardProgramTa",
          "writable": true
        },
        {
          "name": "metaplexProgram"
        },
        {
          "name": "wnsProgram",
          "address": "wns1gDLt8fgLcGhWi5MqAqgXpwEP1JftKE9eZnXS1HM"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "instructionsProgram",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "tokenProgram2022",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": []
    },
    {
      "name": "updateCollection",
      "docs": [
        "create a new wns group account"
      ],
      "discriminator": [
        97,
        70,
        36,
        49,
        138,
        12,
        199,
        239
      ],
      "accounts": [
        {
          "name": "collectionAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "migrationAuthorityPda",
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "wnsGroup"
              }
            ]
          }
        },
        {
          "name": "wnsGroup",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amountPerMint",
          "type": "u64"
        }
      ]
    },
    {
      "name": "whitelistMint",
      "docs": [
        "create a pda representing a migration mint"
      ],
      "discriminator": [
        210,
        85,
        94,
        18,
        130,
        142,
        59,
        121
      ],
      "accounts": [
        {
          "name": "collectionAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "metaplexNftMint"
        },
        {
          "name": "migrationMintPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "metaplexNftMint"
              },
              {
                "kind": "account",
                "path": "migrationAuthorityPda"
              }
            ]
          }
        },
        {
          "name": "migrationAuthorityPda"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "migrationAuthorityPda",
      "discriminator": [
        116,
        36,
        29,
        71,
        202,
        91,
        188,
        67
      ]
    },
    {
      "name": "migrationMintPda",
      "discriminator": [
        229,
        82,
        238,
        151,
        113,
        169,
        211,
        29
      ]
    },
    {
      "name": "userTracker",
      "discriminator": [
        141,
        242,
        54,
        157,
        209,
        97,
        210,
        244
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidGroupAuthority",
      "msg": "Invalid Group Authority for collection account"
    },
    {
      "code": 6001,
      "name": "invalidCreatorPctAmount",
      "msg": "Invalid creator pct amount. Must add up to 100"
    },
    {
      "code": 6002,
      "name": "arithmeticOverflow",
      "msg": "Arithmetic overflow"
    }
  ],
  "types": [
    {
      "name": "migrationAuthorityPda",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "wnsGroup",
            "type": "pubkey"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "royalties",
            "type": "bool"
          },
          {
            "name": "rewardMint",
            "type": "pubkey"
          },
          {
            "name": "rewardPerMigration",
            "type": "u64"
          }
        ]
      }
    },
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
      "name": "userTracker",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "migrationCount",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
