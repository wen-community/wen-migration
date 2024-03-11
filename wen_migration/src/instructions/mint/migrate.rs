use crate::{MigrationAuthorityPda, MigrationMintPda};
use anchor_lang::prelude::*;
use anchor_spl::token::Mint;

#[derive(Accounts)]
#[instruction()]
pub struct MigrateMint<'info> {
    #[account(mut)]
    pub collection_authority: Signer<'info>,
    pub metaplex_nft_mint: Account<'info, Mint>,
    #[account(
        init,
        space = 8,
        payer = collection_authority,
        seeds = [metaplex_nft_mint.key().as_ref()],
        bump,
    )]
    pub migration_mint_pda: Account<'info, MigrationMintPda>,
    pub migration_authority: Account<'info, MigrationAuthorityPda>,
    pub system_program: Program<'info, System>,
}
