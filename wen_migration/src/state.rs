use anchor_lang::prelude::*;

#[account()]
/// empty struct representing an nft mint that's part of a collection to be burned
pub struct MigrationMintPda {}

#[account()]
pub struct MigrationAuthorityPda {
    pub wns_group: Pubkey,
    pub authority: Pubkey,
    pub royalties: bool,
}
