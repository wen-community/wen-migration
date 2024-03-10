use anchor_lang::{prelude::*, solana_program::entrypoint::ProgramResult};
use mpl_token_metadata::{accounts::Metadata, instructions::BurnCpiBuilder, types::BurnArgs};
use wen_new_standard::{
    cpi::{
        accounts::{AddGroup, AddMetadata, AddRoyalties, CreateMintAccount},
        add_metadata, add_mint_to_group, add_royalties, create_mint_account,
    },
    AddMetadataArgs, CreateMintAccountArgs, CreatorWithShare, UpdateRoyaltiesArgs,
};

use crate::MigrationAuthorityPda;

#[derive(Accounts)]
#[instruction()]
pub struct BurnMint<'info> {
    pub migration_authority_pda: Account<'info, MigrationAuthorityPda>,
    pub migration_mint_pda: AccountInfo<'info>,
    pub nft_owner: AccountInfo<'info>,
    pub metaplex_collection: AccountInfo<'info>,
    pub metaplex_collection_metadata: AccountInfo<'info>,
    pub metaplex_nft_mint: AccountInfo<'info>,
    pub metaplex_nft_token: AccountInfo<'info>,
    pub metaplex_nft_metadata: AccountInfo<'info>,
    pub metaplex_nft_master_edition: AccountInfo<'info>,
    pub metaplex_nft_token_record: AccountInfo<'info>,
    pub wns_manager: AccountInfo<'info>,
    pub wns_group: AccountInfo<'info>,
    pub wns_nft_mint: AccountInfo<'info>,
    pub wns_nft_token: AccountInfo<'info>,
    pub wns_nft_member_account: AccountInfo<'info>,
    pub extra_metas_account: AccountInfo<'info>,
    pub metaplex_program: AccountInfo<'info>,
    pub wns_program: AccountInfo<'info>,
    pub system_program: AccountInfo<'info>,
    pub sysvar_instructions: AccountInfo<'info>,
    pub rent: AccountInfo<'info>,
    pub associated_token_program: AccountInfo<'info>,
    pub token_program: AccountInfo<'info>,
    pub token_program_2022: AccountInfo<'info>,
}

impl<'info> BurnMint<'info> {
    fn burn_metaplex_nft(&self) -> ProgramResult {
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

    fn mint_wns_nft(&self, args: CreateMintAccountArgs) -> ProgramResult {
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
        let cpi_ctx = CpiContext::new(self.wns_program.clone(), cpi_accounts);
        create_mint_account(cpi_ctx, args)?;
        Ok(())
    }

    fn add_wns_nft_member(&self) -> ProgramResult {
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
        let cpi_ctx = CpiContext::new(self.wns_program.clone(), cpi_accounts);
        add_mint_to_group(cpi_ctx)?;
        Ok(())
    }

    fn add_wns_royalties(&self, args: UpdateRoyaltiesArgs) -> ProgramResult {
        let cpi_accounts = AddRoyalties {
            payer: self.nft_owner.to_account_info(),
            authority: self.migration_authority_pda.to_account_info(),
            mint: self.wns_nft_mint.to_account_info(),
            extra_metas_account: self.extra_metas_account.to_account_info(),
            system_program: self.system_program.to_account_info(),
            token_program: self.token_program_2022.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(self.token_program.clone(), cpi_accounts);
        add_royalties(cpi_ctx, args)?;
        Ok(())
    }

    fn add_wns_nft_extra_metadata(&self, args: Vec<AddMetadataArgs>) -> ProgramResult {
        let cpi_accounts = AddMetadata {
            payer: self.nft_owner.to_account_info(),
            authority: self.wns_manager.to_account_info(),
            mint: self.wns_nft_mint.to_account_info(),
            system_program: self.system_program.to_account_info(),
            token_program: self.token_program_2022.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(self.wns_program.clone(), cpi_accounts);
        add_metadata(cpi_ctx, args)?;
        Ok(())
    }
}

pub fn handler(ctx: Context<BurnMint>) -> Result<()> {
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

    // add wns nft royalties
    ctx.accounts.add_wns_royalties(UpdateRoyaltiesArgs {
        royalty_basis_points: metaplex_nft_metadata.seller_fee_basis_points,
        creators,
    })?;

    // burn metaplex nft
    ctx.accounts.burn_metaplex_nft()?;

    Ok(())
}
