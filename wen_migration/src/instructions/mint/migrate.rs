use anchor_lang::{prelude::*, solana_program::sysvar::instructions::ID as instructions_id};
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
    token_2022::Token2022,
};
use mpl_token_metadata::{accounts::Metadata, instructions::BurnCpiBuilder, types::BurnArgs};
use wen_new_standard::{
    cpi::{
        accounts::{AddGroup, AddRoyalties, CreateMintAccount},
        add_mint_to_group, add_royalties, create_mint_account,
    }, get_bump_in_seed_form, program::WenNewStandard, CreateMintAccountArgs, CreatorWithShare, UpdateRoyaltiesArgs
};

use crate::{MigrationAuthorityPda, MigrationMintPda};

#[derive(Accounts)]
#[instruction()]
pub struct MigrateMint<'info> {
    pub nft_owner: Signer<'info>,
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
    #[account(mut)]
    pub metaplex_nft_token: Account<'info, TokenAccount>,
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
    /// CHECK: constraint check
    pub metaplex_program: UncheckedAccount<'info>,
    pub wns_program: Program<'info, WenNewStandard>,
    pub system_program: Program<'info, System>,
    /// CHECK: constraint check
    #[account(
        constraint = sysvar_instructions.key() == instructions_id
    )]
    pub sysvar_instructions: UncheckedAccount<'info>,
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
            .sysvar_instructions(&self.sysvar_instructions.to_account_info())
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
            rent: self.rent.to_account_info(),
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
}

pub fn handler(ctx: Context<MigrateMint>) -> Result<()> {
    let metaplex_nft_metadata =
        Metadata::safe_deserialize(&ctx.accounts.metaplex_nft_metadata.data.borrow())?;

    let wns_group = ctx.accounts.wns_group.key();
    let signer_seeds = [
        wns_group.as_ref(),
        &get_bump_in_seed_form(&ctx.bumps.migration_authority_pda),
    ];
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

    Ok(())
}
