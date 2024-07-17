use anchor_lang::prelude::*;

use crate::MigrationAuthorityPda;

#[derive(Accounts)]
#[instruction()]
pub struct UpdateCollection<'info> {
    #[account(mut)]
    pub collection_authority: Signer<'info>,
    #[account(
        seeds = [wns_group.key().as_ref()],
        bump,
    )]
    pub migration_authority_pda: Box<Account<'info, MigrationAuthorityPda>>,
    /// CHECK: cpi checks
    #[account(mut)]
    pub wns_group: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<UpdateCollection>,
    amount_per_mint: u64,
) -> Result<()> {
    let migration_authority_pda = &mut ctx.accounts.migration_authority_pda;
    migration_authority_pda.reward_per_migration = amount_per_mint;

    Ok(())
}
