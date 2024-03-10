use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;

pub use errors::*;
pub use instructions::*;
pub use state::*;

declare_id!("diste3nXmK7ddDTs1zb6uday6j4etCa9RChD8fJ1xay");

#[program]
pub mod wen_migration {

    use super::*;

    /// create a new wns group account
    pub fn migrate_collection(
        ctx: Context<MigrateCollection>,
        args: wen_new_standard::CreateGroupAccountArgs,
    ) -> Result<()> {
        instructions::collection::handler(ctx, args)
    }

    /// create a pda representing a migration mint
    pub fn migrate_mint(ctx: Context<MigrateMint>) -> Result<()> {
        // empty function because pda is created in the instruction
        Ok(())
    }

    pub fn burn_mint(ctx: Context<BurnMint>) -> Result<()> {
        instructions::mint::burn::handler(ctx)
    }
}
