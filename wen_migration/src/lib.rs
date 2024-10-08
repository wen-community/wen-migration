use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;

pub use errors::*;
pub use instructions::*;
pub use state::*;

declare_id!("Mgr8nJhQpzhC4mEnaqYvktGJRVEJPjXLhfGccLYTgFe");
#[program]
pub mod wen_migration {

    use super::*;

    /// create a new wns group account
    pub fn migrate_collection(
        ctx: Context<MigrateCollection>,
        name: String,
        symbol: String,
        uri: String,
        max_size: u32,
        royalties: bool,
        reward_amount: u64
    ) -> Result<()> {
        instructions::collection::handler(ctx, name, symbol, uri, max_size, royalties, reward_amount)
    }

    /// create a new wns group account
    pub fn update_collection(
        ctx: Context<UpdateCollection>,
        amount_per_mint: u64,
    ) -> Result<()> {
        instructions::update_collection::handler(ctx, amount_per_mint)
    }

    /// create a pda representing a migration mint
    pub fn whitelist_mint(_ctx: Context<WhitelistMint>) -> Result<()> {
        // empty function because pda is created in the instruction
        Ok(())
    }

    pub fn migrate_mint(ctx: Context<MigrateMint>) -> Result<()> {
        instructions::mint::migrate::handler(ctx)
    }
}
