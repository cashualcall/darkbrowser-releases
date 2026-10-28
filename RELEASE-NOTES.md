# DARKBROWSER 0.3.0-preview.1

Working preview. Source repository remains private.

- SOL-to-original-SPL swaps through supported Jupiter v6 routes. Supply your Jupiter API key in the session-only field. Exact amounts, recipients, program, setup instructions, fees and unsigned simulations are checked before the native approval dialog. Signing happens only after approval; cancellation or locking invalidates reviews.
- Supervised interactive browsing: a visible isolated browser can navigate, click, fill ordinary text fields and select options. Every action requires approval. No native wallet access. Temporary sessions use a public-address HTTPS proxy and block downloads and private networks. Stop closes the run.
- Existing encrypted custody, ETH/SOL native transfers, Robinhood swaps, research and Ed25519-authenticated update downloads remain available.

Limits: no independent wallet audit or live funded execution claim. Jupiter API access needs your own key and was not exercised during fixture tests. Token-2022, existing wrapped SOL accounts, new unsupported route formats, token sales and bridges are rejected. Interactive mode does not automate sensitive fields, cross-origin frames, shadow DOM, files or CAPTCHAs. Windows publisher signing and Apple notarization remain unavailable; installation is manual.

Installers target Windows x64, macOS arm64/x64 and Linux x64. Public release assets and checksums are published as each native build passes.
