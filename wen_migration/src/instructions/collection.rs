use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token_2022::Token2022};
use wen_new_standard::{
    cpi::{accounts::CreateGroupAccount, create_group_account},
    get_bump_in_seed_form,
    program::WenNewStandard,
    CreateGroupAccountArgs,
};

use crate::MigrationAuthorityPda;

#[derive(Accounts)]
#[instruction()]
pub struct MigrateCollection<'info> {
    #[account(mut)]
    pub collection_authority: Signer<'info>,
    #[account(
        init,
        space = 8,
        payer = collection_authority,
        seeds = [wns_group.key().as_ref()],
        bump,
    )]
    pub migration_authority_pda: Box<Account<'info, MigrationAuthorityPda>>,
    /// CHECK: cpi checks
    #[account(mut)]
    pub wns_group: Signer<'info>,
    #[account(mut)]
    /// CHECK: cpi checks
    pub wns_group_mint: UncheckedAccount<'info>,
    #[account(mut)]
    /// CHECK: cpi checks
    pub wns_group_mint_token_account: UncheckedAccount<'info>,
    /// CHECK: cpi checks
    pub wns_manager: UncheckedAccount<'info>,
    pub rent: Sysvar<'info, Rent>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
    pub wns_program: Program<'info, WenNewStandard>,
}

impl<'info> MigrateCollection<'info> {
    fn create_wns_collection(
        &self,
        args: CreateGroupAccountArgs,
        signer_seeds: &[&[&[u8]]],
    ) -> Result<()> {
        let cpi_accounts = CreateGroupAccount {
            payer: self.collection_authority.to_account_info(),
            authority: self.migration_authority_pda.to_account_info(),
            receiver: self.collection_authority.to_account_info(),
            group: self.wns_group.to_account_info(),
            mint: self.wns_group_mint.to_account_info(),
            mint_token_account: self.wns_group_mint_token_account.to_account_info(),
            manager: self.wns_manager.to_account_info(),
            system_program: self.system_program.to_account_info(),
            rent: self.rent.to_account_info(),
            associated_token_program: self.associated_token_program.to_account_info(),
            token_program: self.token_program.to_account_info(),
        };
        let cpi_program = self.wns_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        create_group_account(cpi_ctx, args)
    }
}

pub fn handler(
    ctx: Context<MigrateCollection>,
    args: CreateGroupAccountArgs,
    royalties: bool,
) -> Result<()> {
    ctx.accounts.migration_authority_pda.authority = ctx.accounts.collection_authority.key();
    ctx.accounts.migration_authority_pda.wns_group = ctx.accounts.wns_group.key();
    ctx.accounts.migration_authority_pda.royalties = royalties;
    let wns_group = ctx.accounts.wns_group.key();
    let signer_seeds = [
        wns_group.as_ref(),
        &get_bump_in_seed_form(&ctx.bumps.migration_authority_pda),
    ];
    ctx.accounts
        .create_wns_collection(args, &[&signer_seeds[..]])?;
    Ok(())
}
