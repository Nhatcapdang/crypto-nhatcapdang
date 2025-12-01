# Use Case Diagram: Create Liquidity Pool

## Use Case Diagram (Mermaid)

```mermaid
graph TB
    User[👤 User/Token Creator]
    Wallet[💼 Solana Wallet]
    System[🏗️ Crowdfunding System]
    Orca[🐋 Orca Whirlpool DEX]
    Blockchain[⛓️ Solana Blockchain]
    
    %% Use Cases
    UC1[Create Token]
    UC2[Connect Wallet]
    UC3[Create Liquidity Pool]
    UC4[Add Liquidity]
    UC5[View Pool Details]
    UC6[Trade Token]
    
    %% User interactions
    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    
    %% System interactions
    UC1 --> Blockchain
    UC2 --> Wallet
    UC3 --> System
    UC3 --> Orca
    UC3 --> Blockchain
    UC4 --> System
    UC4 --> Orca
    UC4 --> Blockchain
    UC5 --> System
    UC5 --> Orca
    UC6 --> Orca
    UC6 --> Blockchain
    
    %% Dependencies
    UC3 -.->|requires| UC1
    UC3 -.->|requires| UC2
    UC4 -.->|requires| UC3
    UC6 -.->|requires| UC3
    UC6 -.->|requires| UC4
    
    style User fill:#e1f5ff
    style Wallet fill:#fff4e1
    style System fill:#e8f5e9
    style Orca fill:#f3e5f5
    style Blockchain fill:#fff9c4
    style UC3 fill:#ffebee
    style UC4 fill:#ffebee
```

## Detailed Use Case Description

### UC1: Create Token
- **Actor:** User
- **Preconditions:** User has Solana wallet
- **Main Flow:**
  1. User fills token creation form (name, symbol, supply, decimals, metadata)
  2. User uploads token image
  3. System creates SPL token on Solana
  4. System mints tokens to user's wallet
  5. User receives token mint address
- **Postconditions:** Token exists on Solana, user owns tokens

### UC2: Connect Wallet
- **Actor:** User
- **Preconditions:** User has Solana wallet (Phantom, Solflare, etc.)
- **Main Flow:**
  1. User clicks "Connect Wallet"
  2. Wallet extension prompts for connection
  3. User approves connection
  4. System receives wallet public key
- **Postconditions:** Wallet is connected, user can sign transactions

### UC3: Create Liquidity Pool
- **Actor:** User
- **Preconditions:** 
  - User has created token (UC1)
  - Wallet is connected (UC2)
  - User has token mint address
- **Main Flow:**
  1. User enters token mint address
  2. User selects pair token (SOL/USDC)
  3. User sets initial price
  4. User submits pool creation form
  5. System creates Splash pool on Orca Whirlpool
  6. System executes transaction on Solana
  7. User receives pool address
- **Postconditions:** Liquidity pool exists on Orca, pool address is available

### UC4: Add Liquidity
- **Actor:** User
- **Preconditions:**
  - Pool is created (UC3)
  - User has tokens in wallet
  - User has pair token (SOL/USDC) in wallet
- **Main Flow:**
  1. User enters pool address (auto-filled after creation)
  2. User enters token amounts to add
  3. User sets token decimals
  4. User submits liquidity form
  5. System calculates liquidity amount
  6. System opens position on Orca Whirlpool
  7. System executes transaction on Solana
  8. User receives position NFT
- **Postconditions:** Liquidity added to pool, pool is tradeable

### UC5: View Pool Details
- **Actor:** User
- **Preconditions:** Pool exists (UC3)
- **Main Flow:**
  1. User views pool address
  2. User clicks "View on Explorer" or "View on Solscan"
  3. System opens blockchain explorer
- **Postconditions:** User can see pool details on explorer

### UC6: Trade Token
- **Actor:** User (any user, not just creator)
- **Preconditions:**
  - Pool exists (UC3)
  - Liquidity is added (UC4)
- **Main Flow:**
  1. User connects wallet to DEX (Orca, Raydium)
  2. User selects token pair
  3. User enters trade amount
  4. User executes swap
  5. DEX executes trade on Solana
- **Postconditions:** Tokens are swapped, user receives new tokens

## Sequence Diagram: Create Pool Flow

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant System
    participant Wallet
    participant Orca
    participant Blockchain
    
    User->>UI: Fill pool creation form
    User->>UI: Submit form
    UI->>System: Validate form data
    UI->>Wallet: Request transaction signature
    Wallet->>User: Show transaction for approval
    User->>Wallet: Approve transaction
    Wallet->>System: Signed transaction
    System->>Orca: createSplashPool()
    Orca->>Blockchain: Execute pool creation transaction
    Blockchain-->>Orca: Transaction confirmed
    Orca-->>System: Pool address
    System-->>UI: Pool created successfully
    UI-->>User: Show pool address & success message
```

## Sequence Diagram: Add Liquidity Flow

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant System
    participant Wallet
    participant Orca
    participant Blockchain
    
    User->>UI: Fill liquidity form
    User->>UI: Enter token amounts
    User->>UI: Submit form
    UI->>System: Validate form data
    System->>Orca: Get pool data
    Orca-->>System: Pool information
    System->>System: Calculate liquidity
    UI->>Wallet: Request transaction signature
    Wallet->>User: Show transaction for approval
    User->>Wallet: Approve transaction
    Wallet->>System: Signed transaction
    System->>Orca: openPosition()
    Orca->>Blockchain: Execute liquidity transaction
    Blockchain-->>Orca: Transaction confirmed
    Orca-->>System: Position NFT address
    System-->>UI: Liquidity added successfully
    UI-->>User: Show position NFT & success message
```

## Activity Diagram: Complete Flow

```mermaid
flowchart TD
    Start([Start]) --> CreateToken[Create Token]
    CreateToken --> HasToken{Has Token?}
    HasToken -->|No| End1([End: Cannot proceed])
    HasToken -->|Yes| ConnectWallet[Connect Wallet]
    ConnectWallet --> WalletConnected{Wallet Connected?}
    WalletConnected -->|No| End2([End: Cannot proceed])
    WalletConnected -->|Yes| CreatePool[Create Liquidity Pool]
    CreatePool --> PoolCreated{Pool Created?}
    PoolCreated -->|No| End3([End: Pool creation failed])
    PoolCreated -->|Yes| HasTokens{Has Tokens & SOL?}
    HasTokens -->|No| End4([End: Insufficient balance])
    HasTokens -->|Yes| AddLiquidity[Add Liquidity]
    AddLiquidity --> LiquidityAdded{Liquidity Added?}
    LiquidityAdded -->|No| End5([End: Liquidity add failed])
    LiquidityAdded -->|Yes| PoolReady[Pool is Ready]
    PoolReady --> Tradeable[Token is Tradeable]
    Tradeable --> End6([End: Success])
    
    style CreateToken fill:#e3f2fd
    style CreatePool fill:#fff3e0
    style AddLiquidity fill:#f3e5f5
    style PoolReady fill:#e8f5e9
    style Tradeable fill:#e8f5e9
```

## Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ TOKEN : creates
    USER ||--o{ POOL : creates
    USER ||--o{ POSITION : owns
    TOKEN ||--o{ POOL : "used in"
    POOL ||--o{ POSITION : contains
    POOL }o--|| TOKEN : "tokenA"
    POOL }o--|| TOKEN : "tokenB"
    
    USER {
        string publicKey
        string walletAddress
    }
    
    TOKEN {
        string mintAddress
        string name
        string symbol
        number decimals
        number totalSupply
    }
    
    POOL {
        string poolAddress
        string tokenA
        string tokenB
        number initialPrice
        string whirlpoolsConfig
    }
    
    POSITION {
        string positionMint
        string poolAddress
        number liquidity
        number tickLower
        number tickUpper
    }
```

## Component Diagram

```mermaid
graph LR
    subgraph "Frontend"
        UI[Create Liquidity Pool UI]
        Form1[Pool Creation Form]
        Form2[Liquidity Form]
    end
    
    subgraph "Hooks"
        Hook1[useCreatePoolMutation]
        Hook2[useAddLiquidityMutation]
        Hook3[useOrcaProvider]
    end
    
    subgraph "External Services"
        Orca[Orca Whirlpool SDK]
        Wallet[Solana Wallet Adapter]
        Blockchain[Solana Blockchain]
    end
    
    UI --> Form1
    UI --> Form2
    Form1 --> Hook1
    Form2 --> Hook2
    Hook1 --> Hook3
    Hook2 --> Hook3
    Hook3 --> Wallet
    Hook1 --> Orca
    Hook2 --> Orca
    Orca --> Blockchain
    Wallet --> Blockchain
```

## State Diagram: Pool Lifecycle

```mermaid
stateDiagram-v2
    [*] --> TokenCreated: Create Token
    TokenCreated --> WalletConnected: Connect Wallet
    WalletConnected --> PoolCreating: Submit Pool Form
    PoolCreating --> PoolCreated: Transaction Confirmed
    PoolCreated --> AddingLiquidity: Submit Liquidity Form
    AddingLiquidity --> LiquidityAdded: Transaction Confirmed
    LiquidityAdded --> Tradeable: Pool Ready
    Tradeable --> [*]
    
    PoolCreating --> PoolCreationFailed: Transaction Failed
    PoolCreationFailed --> WalletConnected: Retry
    
    AddingLiquidity --> LiquidityAddFailed: Transaction Failed
    LiquidityAddFailed --> PoolCreated: Retry
```

## Key Points

1. **Dependencies:** Creating a pool requires a token and wallet connection. Adding liquidity requires a pool to exist.

2. **Actors:** The main actor is the User (token creator), but the system also interacts with external systems (Orca, Solana Blockchain).

3. **Use Cases:** The main use cases are creating a pool and adding liquidity, which are sequential and dependent on each other.

4. **Error Handling:** Each use case can fail, and the system should handle errors gracefully.

5. **Postconditions:** After successful completion, the pool is tradeable on DEXs.
