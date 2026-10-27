# Public-payload packaging

This recipe is mirrored into `cashualcall/darkbrowser-releases`. It uses free standard GitHub-hosted runners in that public distribution repository, not billed runners in the private source repository.

The input is the already-public Windows installer, pinned by SHA-256. The recipe extracts its shipped application payload and packages that same version with native macOS/Linux Electron runtimes. It never checks out the private repository, receives a source-access token, or uploads development source. The only public files added to the repository are packaging instructions. The application JavaScript is already distributed inside the Windows installer, as with ordinary Electron apps; repository privacy is not a claim of binary obfuscation.

macOS packages are ad-hoc signed for local integrity, not Developer ID signed or notarized. The workflow builds and tests Apple Silicon and Intel artifacts on their respective native hosts, and verifies DMG integrity. Linux tests install the Debian package and run the extracted AppImage under Xvfb with the SUID sandbox helper correctly configured, without disabling Chromium's sandbox. Every package must pass its native navigation smoke test before publication. This is not a complete OS compatibility certification.

The release job only adds new platform assets and a separate checksum manifest to the existing preview. It does not overwrite the Windows installer or its checksum. A failed job publishes no platform assets. Input version/hash updates require review of a newly verified public Windows preview.

Keep `prepare.cjs`, `builder.json`, `smoke.cjs` and `packages.yml` synchronized with their copies in the distribution repository (`packages.yml` lives under `.github/workflows/` there).
