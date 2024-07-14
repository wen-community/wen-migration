use anchor_lang::prelude::*;

#[account()]
/// empty struct representing an nft mint that's part of a collection to be burned
pub struct MigrationMintPda {}

#[account()]
#[derive(InitSpace)]
pub struct MigrationAuthorityPda {
    pub wns_group: Pubkey,
    pub authority: Pubkey,
    pub royalties: bool,
    pub reward_mint: Pubkey,
    pub reward_per_migration: u64,
}

#[account()]
#[derive(InitSpace)]
pub struct UserTracker {
    pub migration_count: u64,
}
