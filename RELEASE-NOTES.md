# DARKBROWSER 0.1.0 preview

Working Chromium browser preview for Windows x64, macOS Apple Silicon/Intel, and Linux x64.

## Downloads

- Windows: `DARKBROWSER-Setup-0.1.0-preview.1.exe`.
- macOS: choose `arm64` for Apple Silicon or `x64` for Intel; DMG and ZIP formats are provided.
- Linux: Debian package (`amd64.deb`) or AppImage (`x86_64.AppImage`). Prefer the Debian package on Ubuntu. AppImage launching depends on the distribution's FUSE and user-namespace policy; its extracted payload was tested with a correctly configured SUID sandbox helper.
- Verify the Windows file using `SHA256SUMS`; verify macOS/Linux files using `SHA256SUMS-macOS-Linux`.

Windows is unsigned. macOS packages are ad-hoc signed for integrity, **not Developer ID signed or Apple-notarized**. This is preview software, not a trusted signed production release.

## Verification and provenance

The Windows packaged browser passed navigation, isolation, download and bookmark checks. macOS packages were built and navigation-tested on separate native Apple Silicon and Intel runners; DMG integrity was checked with hdiutil. Linux tests installed the actual Debian package and launched the extracted AppImage with Chromium sandboxing enabled. Machine-readable platform verification files are attached.

macOS/Linux packages reuse the SHA-256-pinned application payload already distributed inside the public Windows installer, with native Electron 44.9.3 runtimes. The free public packaging workflow never checks out or authenticates to the private development repository. This repository contains distribution recipes and installer assets, not the private source checkout.

Read-only chain balances, DEX Screener search and opt-in compatible AI chat are included. Native wallet custody, integrated swaps, autonomous browsing and signed automatic updates remain unimplemented.

Website and downloads: https://darkbrowser.vercel.app/download
