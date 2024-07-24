use anchor_lang::prelude::*;
use anchor_spl::associated_token::spl_associated_token_account::{self, instruction::create_associated_token_account};
use spl_pod::solana_program::program::invoke;

use crate::DistributionErrors;

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

#[inline(never)]
pub fn create_ata<'info>(
    ata: &AccountInfo<'info>,
    payer: &AccountInfo<'info>,
    mint: &AccountInfo<'info>,
    owner: &AccountInfo<'info>,
    system_program: &AccountInfo<'info>,
    token_program: &AccountInfo<'info>,
) -> Result<()> {
    if ata.key()
        != spl_associated_token_account::get_associated_token_address(&owner.key(), &mint.key())
    {
        return Err(DistributionErrors::InvalidAta.into());
    }

    if !ata.to_account_info().data_is_empty() {
        return Ok(());
    }

    let ix = create_associated_token_account(
        &payer.key(),
        &owner.key(),
        &mint.key(),
        &anchor_spl::token::ID,
    );

    invoke(
        &ix,
        &vec![
            payer.to_account_info(),
            ata.to_account_info(),
            owner.to_account_info(),
            mint.to_account_info(),
            system_program.to_account_info(),
            token_program.to_account_info(),
        ],
    )?;

    Ok(())
}