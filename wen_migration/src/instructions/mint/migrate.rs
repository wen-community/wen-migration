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
    },
    program::WenNewStandard,
    CreateMintAccountArgs, CreatorWithShare, UpdateRoyaltiesArgs,
};

use crate::{MigrationAuthorityPda, MigrationMintPda};

#[derive(Accounts)]
#[instruction()]
pub struct MigrateMint<'info> {
    pub nft_owner: Signer<'info>,
    /// CHECK: cpi checks
    pub migration_authority_pda: Account<'info, MigrationAuthorityPda>,
    #[account(
        mut,
        seeds = [metaplex_nft_mint.key().as_ref(), migration_authority_pda.key().as_ref()],
        bump,
        close = nft_owner,
    )]
    pub migration_mint_pda: Account<'info, MigrationMintPda>,
    /// CHECK: cpi checks
    pub metaplex_collection: UncheckedAccount<'info>,
    /// CHECK: cpi checks
    pub metaplex_collection_metadata: UncheckedAccount<'info>,
    #[account(mut)]
    pub metaplex_nft_mint: Account<'info, Mint>,
    #[account(mut)]
    pub metaplex_nft_token: Account<'info, TokenAccount>,
    /// CHECK: cpi checks
    pub metaplex_nft_metadata: UncheckedAccount<'info>,
    /// CHECK: cpi checks
    pub metaplex_nft_master_edition: UncheckedAccount<'info>,
    /// CHECK: cpi checks
    pub metaplex_nft_token_record: UncheckedAccount<'info>,
    /// CHECK: cpi checks
    pub wns_manager: UncheckedAccount<'info>,
    /// CHECK: cpi checks
    pub wns_group: UncheckedAccount<'info>,
    /// CHECK: cpi checks
    pub wns_nft_mint: UncheckedAccount<'info>,
    /// CHECK: cpi checkss
    pub wns_nft_token: UncheckedAccount<'info>,
    /// CHECK: cpi checks
    pub wns_nft_member_account: UncheckedAccount<'info>,
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
        BurnCpiBuilder::new(&self.metaplex_program.to_account_info())
            .authority(&self.nft_owner.to_account_info())
            .collection_metadata(Some(&self.metaplex_collection_metadata.to_account_info()))
            .metadata(&self.metaplex_nft_metadata.to_account_info())
            .edition(Some(&self.metaplex_nft_master_edition.to_account_info()))
            .mint(&self.metaplex_nft_mint.to_account_info())
            .token(&self.metaplex_nft_token.to_account_info())
            .master_edition(Some(&self.metaplex_nft_master_edition.to_account_info()))
            .master_edition_mint(Some(&self.metaplex_nft_master_edition.to_account_info()))
            .token_record(Some(&self.metaplex_nft_token_record.to_account_info()))
            .system_program(&self.system_program.to_account_info())
            .sysvar_instructions(&self.sysvar_instructions.to_account_info())
            .spl_token_program(&self.token_program.to_account_info())
            .burn_args(BurnArgs::V1 { amount: 1 })
            .invoke()?;
        Ok(())
    }

    fn mint_wns_nft(&self, args: CreateMintAccountArgs) -> Result<()> {
        let cpi_accounts = CreateMintAccount {
            payer: self.nft_owner.to_account_info(),
            authority: self.nft_owner.to_account_info(),
            receiver: self.nft_owner.to_account_info(),
            mint: self.wns_nft_mint.to_account_info(),
            mint_token_account: self.wns_nft_token.to_account_info(),
            manager: self.wns_manager.to_account_info(),
            system_program: self.system_program.to_account_info(),
            rent: self.rent.to_account_info(),
            associated_token_program: self.associated_token_program.to_account_info(),
            token_program: self.token_program.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(self.wns_program.to_account_info(), cpi_accounts);
        create_mint_account(cpi_ctx, args)?;
        Ok(())
    }

    fn add_wns_nft_member(&self) -> Result<()> {
        let cpi_accounts = AddGroup {
            payer: self.nft_owner.to_account_info(),
            group: self.wns_group.to_account_info(),
            manager: self.wns_manager.to_account_info(),
            authority: self.migration_authority_pda.to_account_info(),
            mint: self.wns_nft_mint.to_account_info(),
            member: self.wns_nft_member_account.to_account_info(),
            token_program: self.token_program.to_account_info(),
            system_program: self.system_program.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(self.wns_program.to_account_info(), cpi_accounts);
        add_mint_to_group(cpi_ctx)?;
        Ok(())
    }

    fn add_wns_royalties(&self, args: UpdateRoyaltiesArgs) -> Result<()> {
        let cpi_accounts = AddRoyalties {
            payer: self.nft_owner.to_account_info(),
            authority: self.migration_authority_pda.to_account_info(),
            mint: self.wns_nft_mint.to_account_info(),
            extra_metas_account: self.extra_metas_account.to_account_info(),
            system_program: self.system_program.to_account_info(),
            token_program: self.token_program_2022.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(self.token_program.to_account_info(), cpi_accounts);
        add_royalties(cpi_ctx, args)?;
        Ok(())
    }
}

pub fn handler(ctx: Context<MigrateMint>) -> Result<()> {
    let metaplex_nft_metadata =
        Metadata::safe_deserialize(&ctx.accounts.metaplex_nft_metadata.data.borrow())?;
    // create wns nft
    ctx.accounts.mint_wns_nft(CreateMintAccountArgs {
        name: metaplex_nft_metadata.name,
        symbol: metaplex_nft_metadata.symbol,
        uri: metaplex_nft_metadata.uri,
    })?;

    // add wns nft to group
    ctx.accounts.add_wns_nft_member()?;

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

    if ctx.accounts.migration_authority_pda.royalties {
        // add wns nft royalties
        ctx.accounts.add_wns_royalties(UpdateRoyaltiesArgs {
            royalty_basis_points: metaplex_nft_metadata.seller_fee_basis_points,
            creators,
        })?;
    }

    // burn metaplex nft
    ctx.accounts.burn_metaplex_nft()?;

    Ok(())
}
