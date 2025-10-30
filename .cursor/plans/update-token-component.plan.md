<!-- da5f9d3a-d0f1-4e3a-858a-f53883c3e5f9 8a340e24-2871-4aed-83ef-fa6a31dc4098 -->
# Update Token Component Implementation

## Overview

Build an UpdateTokenComponent that mirrors CreateTokenComponent's UI but adds token selection functionality and pre-fills form with existing token data.

## Implementation Steps

### 1. Update Token Selection Schema & UI

**File**: `src/components/dashboard-layout/update-token.tsx`

- Create extended schema with `tokenMintAddress` field (required string, validated as Solana public key)
- Add `tokenSelectionMethod` field ('select' | 'manual')
- Reuse `tokenFormSchema` from create-token but make `tokenImage` optional since users may not want to update it
- Add token selection section at the top with:
- Toggle between dropdown and manual input
- Dropdown: fetch user's tokens (mock for now, add TODO for actual Solana integration)
- Manual input: text field with validation for Solana address format

### 2. Token Metadata Fetching

**File**: `src/components/dashboard-layout/update-token.tsx`

- Add `useEffect` that triggers when `tokenMintAddress` changes
- Fetch current token metadata (mock data initially)
- Pre-fill form fields with fetched data using `form.reset()`
- Show loading state while fetching
- Display current token image as preview

### 3. Form Layout & UI

**File**: `src/components/dashboard-layout/update-token.tsx`

Copy the exact structure from `CreateTokenComponent`:

- Token Information section (name, symbol, totalSupply, decimals, description)
- Authority Settings section (revokeFreezeAuthority, revokeMintAuthority, revokeUpdateAuthority)
- Token Image section (make optional with note "Leave empty to keep current image")
- Social Links collapsible section (website, telegram, twitter, discord)

Update differences:

- Change title to "Update Token"
- Change description to "Update your existing token metadata and settings on Solana"
- Submit button text: "Update Token" instead of "Create Token"
- Add info message showing which fields are being updated

### 4. Form Submission Handler

**File**: `src/components/dashboard-layout/update-token.tsx`

- Implement `onSubmit` with update logic (TODO: actual Solana update call)
- Show success toast on completion
- Don't reset form after success (keep current values visible)
- Handle errors with descriptive toast notifications

## Key Technical Details

- Use `React.memo` for optimization
- Use `useMemo` for default values
- Import form components from `@/components/form`
- Use same icons from `lucide-react` as CreateTokenComponent
- Follow project's Tailwind styling and color schema
- Ensure proper TypeScript types derived from Zod schemas
- Add accessibility attributes (aria-labels where needed)

## Files to Modify

- `src/components/dashboard-layout/update-token.tsx` (main component)
- `src/app/(dashboard)/dashboard/update-token/page.tsx` (already set up correctly)

### To-dos

- [x] Build UpdateTokenComponent with token selection UI, schema validation, and form structure matching CreateTokenComponent
- [x] Implement token metadata fetching and form pre-filling when token is selected
- [x] Add form submission handler with update logic and proper error handling