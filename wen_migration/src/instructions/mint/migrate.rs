use anchor_lang::{prelude::*, solana_program::sysvar};
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{transfer, Mint, Token, Transfer},
    token_2022::Token2022,
    token_interface::TokenAccount,
};
use mpl_token_metadata::{accounts::Metadata, instructions::BurnCpiBuilder, types::BurnArgs};
use wen_new_standard::{
    cpi::{
        accounts::{AddGroup, AddRoyalties, CreateMintAccount},
        add_mint_to_group, add_royalties, create_mint_account,
    }, get_bump_in_seed_form, program::WenNewStandard, CreateMintAccountArgs, CreatorWithShare, UpdateRoyaltiesArgs
};

use crate::{create_ata, MigrationAuthorityPda, MigrationMintPda, UserTracker};

#[derive(Accounts)]
#[instruction()]
pub struct MigrateMint<'info> {
    #[account(mut)]
    pub nft_owner: Signer<'info>,
    #[account(
        init_if_needed,
        space = 8 + UserTracker::INIT_SPACE,
        payer = nft_owner,
        seeds = [nft_owner.key().as_ref()],
        bump
    )]
    pub user_migration_tracker: Account<'info, UserTracker>,
    #[account(
        mut,
        seeds = [wns_group.key().as_ref()],
        bump
    )]
    pub migration_authority_pda: Account<'info, MigrationAuthorityPda>,
    #[account(
        mut,
        seeds = [metaplex_nft_mint.key().as_ref(), migration_authority_pda.key().as_ref()],
        bump,
        close = nft_owner,
    )]
    pub migration_mint_pda: Account<'info, MigrationMintPda>,
    #[account(mut)]
    /// CHECK: cpi checks
    pub metaplex_collection_metadata: UncheckedAccount<'info>,
    #[account(mut)]
    pub metaplex_nft_mint: Account<'info, Mint>,
    #[account(
        mut, 
        token::mint = metaplex_nft_mint, 
        token::authority = nft_owner, 
        token::token_program = token_program
    )]
    pub metaplex_nft_token: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    /// CHECK: cpi checks
    pub metaplex_nft_metadata: UncheckedAccount<'info>,
    #[account(mut)]
    /// CHECK: cpi checks
    pub metaplex_nft_edition: UncheckedAccount<'info>,
    #[account(mut)]
    /// CHECK: cpi checks
    pub metaplex_nft_master_edition: UncheckedAccount<'info>,
    #[account(mut)]
    /// CHECK: cpi checks
    pub metaplex_nft_token_record: UncheckedAccount<'info>,
    /// CHECK: cpi checks
    pub wns_manager: UncheckedAccount<'info>,
    #[account(mut)]
    /// CHECK: cpi checks
    pub wns_group: UncheckedAccount<'info>,
    #[account(mut)]
    /// CHECK: cpi checks
    pub wns_nft_mint: Signer<'info>,
    #[account(mut)]
    /// CHECK: cpi checkss
    pub wns_nft_token: UncheckedAccount<'info>,
    #[account(mut)]
    /// CHECK: cpi checks
    pub wns_nft_member_account: UncheckedAccount<'info>,
    #[account(mut)]
    /// CHECK: cpi checks
    pub extra_metas_account: UncheckedAccount<'info>,
    #[account(constraint = reward_mint.key() == migration_authority_pda.reward_mint)]
    pub reward_mint: Account<'info, Mint>,
    #[account(
        mut, 
        token::mint = reward_mint, 
        token::authority = nft_owner, 
        token::token_program = token_program
    )]
    pub reward_user_ta: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(
        mut, 
        token::mint = reward_mint, 
        token::authority = migration_authority_pda, 
        token::token_program = token_program
    )]
    pub reward_program_ta: Box<InterfaceAccount<'info, TokenAccount>>,
    /// CHECK: constraint check
    pub metaplex_program: UncheckedAccount<'info>,
    pub wns_program: Program<'info, WenNewStandard>,
    pub system_program: Program<'info, System>,
    /// CHECK: constraint check
    #[account(address = sysvar::instructions::id())]
    pub instructions_program: UncheckedAccount<'info>,
    pub rent: Sysvar<'info, Rent>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
    pub token_program_2022: Program<'info, Token2022>,
}

impl<'info> MigrateMint<'info> {
    fn burn_metaplex_nft(&self) -> Result<()> {
        let metadata_account_info = &self.metaplex_collection_metadata.to_account_info();
        let metaplex_collection_metadata = self.metaplex_collection_metadata.key();

        let collection_metadata_account_info = if metaplex_collection_metadata != Pubkey::default().key() {
            Some(metadata_account_info)
        } else {
            None
        };
        let edition_account = &self.metaplex_nft_edition.to_account_info();
        let edition_key = self.metaplex_nft_edition.key();
        let edition_account_info = if edition_key != Pubkey::default().key() {
            Some(edition_account)
        } else {
            None
        };
        msg!("{:?}", edition_key);
        // let master_edition_account = &self.metaplex_nft_master_edition.to_account_info();
        // let master_edition_key = self.metaplex_nft_master_edition.key();
        // let master_edition_account_info = if master_edition_key != Pubkey::default().key() {
        //     Some(master_edition_account)
        // } else {
        //     None
        // };
        // let token_record_account = &self.metaplex_nft_token_record.to_account_info();
        // let token_record_key = self.metaplex_nft_token_record.key();
        // let token_record_account_info = if token_record_key != Pubkey::default().key() {
        //     Some(token_record_account)
        // } else {
        //     None
        // };
        BurnCpiBuilder::new(&self.metaplex_program.to_account_info())
            .authority(&self.nft_owner.to_account_info())
            .collection_metadata(collection_metadata_account_info)
            .metadata(&self.metaplex_nft_metadata.to_account_info())
            .edition(edition_account_info)
            .mint(&self.metaplex_nft_mint.to_account_info())
            .token(&self.metaplex_nft_token.to_account_info())
            .system_program(&self.system_program.to_account_info())
            .sysvar_instructions(&self.instructions_program.to_account_info())
            .spl_token_program(&self.token_program.to_account_info())
            .burn_args(BurnArgs::V1 { amount: 1 })
            .invoke()?;
        Ok(())
    }

    fn mint_wns_nft(&self, args: CreateMintAccountArgs, signer_seeds: &[&[&[u8]]]) -> Result<()> {
        let cpi_accounts = CreateMintAccount {
            payer: self.nft_owner.to_account_info(),
            authority: self.migration_authority_pda.to_account_info(),
            receiver: self.nft_owner.to_account_info(),
            mint: self.wns_nft_mint.to_account_info(),
            mint_token_account: self.wns_nft_token.to_account_info(),
            manager: self.wns_manager.to_account_info(),
            system_program: self.system_program.to_account_info(),
            associated_token_program: self.associated_token_program.to_account_info(),
            token_program: self.token_program_2022.to_account_info(),
        };
        let cpi_program = self.wns_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        create_mint_account(cpi_ctx, args)?;
        Ok(())
    }

    fn add_wns_nft_member(&self, signer_seeds: &[&[&[u8]]]) -> Result<()> {
        let cpi_accounts = AddGroup {
            payer: self.nft_owner.to_account_info(),
            group: self.wns_group.to_account_info(),
            manager: self.wns_manager.to_account_info(),
            authority: self.migration_authority_pda.to_account_info(),
            mint: self.wns_nft_mint.to_account_info(),
            member: self.wns_nft_member_account.to_account_info(),
            token_program: self.token_program_2022.to_account_info(),
            system_program: self.system_program.to_account_info(),
        };
        let cpi_program = self.wns_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        add_mint_to_group(cpi_ctx)?;
        Ok(())
    }

    fn add_wns_royalties(&self, args: UpdateRoyaltiesArgs, signer_seeds: &[&[&[u8]]]) -> Result<()> {
        let cpi_accounts = AddRoyalties {
            payer: self.nft_owner.to_account_info(),
            authority: self.migration_authority_pda.to_account_info(),
            mint: self.wns_nft_mint.to_account_info(),
            extra_metas_account: self.extra_metas_account.to_account_info(),
            system_program: self.system_program.to_account_info(),
            token_program: self.token_program_2022.to_account_info(),
        };
        let cpi_program = self.wns_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        add_royalties(cpi_ctx, args)?;
        Ok(())
    }

    fn transfer_rewards(&self, signer_seeds: &[&[&[u8]]], amount: u64) -> Result<()> {
        let cpi_ctx = CpiContext::new_with_signer(
            self.token_program.to_account_info(),
            Transfer {
                from: self.reward_program_ta.to_account_info(),
                to: self.reward_user_ta.to_account_info(),
                authority: self.migration_authority_pda.to_account_info(),
            },
            signer_seeds,
        );
        transfer(cpi_ctx, amount)
    }
}

pub fn handler(ctx: Context<MigrateMint>) -> Result<()> {
    let metaplex_nft_metadata =
        Metadata::safe_deserialize(&ctx.accounts.metaplex_nft_metadata.data.borrow())?;

    let wns_group = ctx.accounts.wns_group.key();
    let signer_seeds = [
        wns_group.as_ref(),
        &get_bump_in_seed_form(&ctx.bumps.migration_authority_pda),
    ];
    
    create_ata(
        &ctx.accounts.reward_user_ta.to_account_info(),
        &ctx.accounts.nft_owner.to_account_info(),
        &ctx.accounts.reward_mint.to_account_info(),
        &ctx.accounts.nft_owner.to_account_info(),
        &ctx.accounts.system_program.to_account_info(),
        &ctx.accounts.token_program.to_account_info(),
    )?;

    // create wns nft
    ctx.accounts.mint_wns_nft(CreateMintAccountArgs {
        name: metaplex_nft_metadata.name,
        symbol: metaplex_nft_metadata.symbol,
        uri: metaplex_nft_metadata.uri,
        permanent_delegate: None
    }, &[&signer_seeds[..]])?;
    // add wns nft to group
    ctx.accounts.add_wns_nft_member(&[&signer_seeds[..]])?;

    if ctx.accounts.migration_authority_pda.royalties {
        let creators = match metaplex_nft_metadata.creators {
            Some(creators) => creators
                .iter()
                .map(|creator| CreatorWithShare {
                    address: creator.address,
                    share: creator.share,
                })
                .collect(),
            None => vec![],
        };
    
        let bps = metaplex_nft_metadata.seller_fee_basis_points;
        // add wns nft royalties
        ctx.accounts.add_wns_royalties(UpdateRoyaltiesArgs {
            royalty_basis_points: bps,
            creators,
        }, &[&signer_seeds[..]])?;
    }

    // burn metaplex nft
    ctx.accounts.burn_metaplex_nft()?;

    let user_migration_tracker = &mut ctx.accounts.user_migration_tracker;
    let current_migrations = user_migration_tracker.migration_count;
    user_migration_tracker.migration_count = current_migrations + 1;

    let reward_amount = ctx.accounts.migration_authority_pda.reward_per_migration;
    let reward_mint = ctx.accounts.reward_mint.key();

    if reward_amount > 0 && reward_mint != ctx.accounts.system_program.key() {
        let scaled_rewards = if current_migrations + 1 % 20 == 0 {
            reward_amount * 50
        } else {
            reward_amount
        };
        ctx.accounts.transfer_rewards(&[&signer_seeds[..]], scaled_rewards)?;
    }

    Ok(())
}
