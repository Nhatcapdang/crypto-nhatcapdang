<!-- 86b73bff-5b14-4283-b5be-107d86bea4e5 effb14bb-58eb-418a-84e3-bdaa8ee245c3 -->
### Burn Tokens Page

We will implement a dashboard page to permanently burn SPL tokens the connected wallet owns. It follows `@/components/form` usage, zod validation, shadcn/ui, Tailwind, and the existing dashboard component patterns.

#### Files to add or update

- `src/app/(dashboard)/dashboard/burn-token/page.tsx`: Route that renders the component.
- `src/components/dashboard-layout/burn-token.tsx`: Main UI + logic (memoized, form, mutation, summary card).
- Optional helpers (inline first for speed): utility to load token accounts and format amounts.

#### Core UX

- Left: form with
- Select a token to burn (populated from wallet token accounts; fallback mock list if wallet disconnected)
- Amount input with available balance hint and max button
- Warning callout about irreversibility
- Submit button with loading state
- Right: summary card showing address, max supply (if retrievable), amount to burn, remaining supply

#### Validation and Types

- Zod schema: `{ mint: string, amount: number }` with Solana base58 check and `amount > 0`.
- Derive `BurnFormData` from schema.

#### Solana integration

- Read `connection` and `wallet` from existing `providers/solana-provider`/wallet adapter.
- Fetch SPL token accounts for wallet to populate the select (token mint, symbol/name if available).
- Burn via `@solana/spl-token` using `createBurnCheckedInstruction` and send transaction with wallet.
- Handle decimals properly; convert UI amount to smallest units.

#### Performance

- Component wrapped in `React.memo`, heavy computations wrapped in `useMemo`/`useCallback`.
- Form state separated from derived summaries to prevent re-renders.
- Disable submit until form valid and wallet connected.

#### Accessibility & styling

- All controls with labels, aria attributes; uses project’s shadcn/ui and color tokens to match theme.

#### Error/Success handling

- Toasts on success/failure; reset amount on success and refetch balances.

#### Routing integration

- Page file mirrors existing dashboard pages and imports the component.

#### Notes

- If we cannot fetch total supply quickly, we’ll omit it from summary or display “—”.

### To-dos

- [x] Create burn-token page route rendering BurnToken component
- [x] Implement memoized BurnToken component UI with form and summary
- [x] Load wallet SPL token accounts to populate select
- [x] Add zod schema and RHF wiring per @form.md
- [ ] Implement burn transaction using @solana/spl-token
- [x] Recompute balances and summary after burn
- [x] Ensure accessible labels and match color schema/styles