# How to Create a Liquidity Pool for Your Token

This guide explains how to create a liquidity pool for your token so users can buy and trade it on Solana.

## Overview

The process involves three main steps:

1. **Create Your Token** (already implemented)
2. **Create a Liquidity Pool** (Splash pool on Orca Whirlpool)
3. **Add Liquidity to the Pool** (so users can trade)

## Step-by-Step Process

### Step 1: Create Your Token

You already have token creation functionality. After creating your token, you'll receive a mint address (token address).

### Step 2: Create a Splash Pool

A Splash pool is a type of liquidity pool on Orca Whirlpool that allows you to create a new pool for your token.

**Requirements:**
- Your token mint address
- Pair token (usually SOL or USDC)
- Initial price (ratio of your token to the pair token)
- Whirlpools config address (devnet: `FcrweFY1G9HJAHG5inkGB6pKg1HZ6x9UC2WioAfWrGkR`)

**Example:**
```typescript
const { poolKey, tx } = await client.createSplashPool(
  whirlpoolsConfig,
  yourTokenAddress,  // Your token
  solAddress,        // SOL (or USDC)
  initialPrice,      // e.g., 0.01 (1 yourToken = 0.01 SOL)
  wallet.publicKey
)

const txId = await tx.buildAndExecute()
```

### Step 3: Add Liquidity

After creating the pool, you need to add liquidity so users can trade.

**Requirements:**
- Pool address (from step 2)
- Amount of your token to add
- Amount of pair token (SOL/USDC) to add
- Token decimals

**Important:** You need to have both tokens in your wallet:
- Your created token
- SOL or USDC (for the pair)

### Step 4: Users Can Now Trade

Once liquidity is added, users can:
- Buy your token using SOL or USDC
- Sell your token for SOL or USDC
- Trade on DEXs like Orca, Raydium, etc.

## Common Token Addresses (Devnet)

- **SOL (Wrapped SOL):** `So11111111111111111111111111111111111111112`
- **USDC (Devnet):** `BRjpCHtyQLNCo8gqRUr8jtdAj5AjPYQaoqbvcZiHok1k`

## Important Notes

1. **Initial Price:** Set this carefully - it determines the starting price of your token
2. **Liquidity Amount:** Add enough liquidity to prevent high slippage
3. **Token Supply:** Ensure you have tokens to add to the pool
4. **SOL Balance:** You need SOL for transaction fees and for the pair token

## Example Workflow

1. Create token → Get token mint address
2. Create pool → Get pool address
3. Add liquidity → Pool is now tradeable
4. Share pool address → Users can buy your token

## Troubleshooting

- **Version Conflict:** The Orca SDK requires Anchor ~0.29.0, but your project uses 0.32.1
  - Solution: Use `--legacy-peer-deps` when installing, or downgrade Anchor
- **Wallet Not Connected:** Ensure wallet is connected before creating pool
- **Insufficient Balance:** Make sure you have enough tokens and SOL
- **Transaction Failed:** Check that you have enough SOL for fees

