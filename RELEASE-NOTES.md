# DARKBROWSER 0.4.0-preview.1

Working preview. Source repository remains private.

- Zen-style desktop sidebar, vertical tabs, system fonts and native controls, alongside the refreshed website.
- Solana token sales to SOL and token-to-token swaps, alongside SOL purchases.
- Token-2022 support for transfer-fee, mint-close-authority, metadata and group extensions. Mint-specific decimals, correct token-program ATAs, locally built setup/cleanup, and fee-adjusted minimum output.
- Native approval before every wallet transaction. The exact reviewed message is simulated again before signing; changed mint configuration, fee epoch, wallet lock, cancellation or expiry invalidates the review. No persistent token approvals are created.
- Existing custody, browsing automation and authenticated update downloads remain available.

Provide your own session-only Jupiter API key. No live funded swap was performed during tests. Transfer hooks, permanent delegates, confidential/non-transferable tokens, interest/scaled-UI amounts, memo/CPI-guard accounts, unknown extensions, existing wrapped SOL accounts and bridges remain rejected. Robinhood swaps remain ETH-to-token only.

Windows x64, macOS arm64/x64 and Linux x64 installers are published after native build tests. Update manifests are Ed25519-signed; Windows publisher signing and Apple notarization remain unavailable. Installation is manual.
