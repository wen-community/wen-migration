use crate::{MigrationAuthorityPda, MigrationMintPda};
use anchor_lang::prelude::*;
use anchor_spl::token::Mint;

#[derive(Accounts)]
#[instruction()]
pub struct WhitelistMint<'info> {
    #[account(mut)]
    pub collection_authority: Signer<'info>,
    pub metaplex_nft_mint: Account<'info, Mint>,
    #[account(
        init,
        space = 8,
        payer = collection_authority,
        seeds = [metaplex_nft_mint.key().as_ref(), migration_authority_pda.key().as_ref()],
        bump,
    )]
    pub migration_mint_pda: Account<'info, MigrationMintPda>,
    #[account(
        constraint = migration_authority_pda.authority == collection_authority.key(),
    )]
    pub migration_authority_pda: Account<'info, MigrationAuthorityPda>,
    pub system_program: Program<'info, System>,
}
