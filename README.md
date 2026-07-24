# Pay to Par — Phase 4.2 Repair

This build corrects the inconsistent Phase 4.1 package.

## Corrected

- Home screen now identifies Phase Four.
- The hero **Start a round** button uses the same working route as the lower New Round card.
- Rules now opens to a real **How to Play** overview.
- Overview, Cheats, The Nark, and Wheel are separate tabs.
- Comedy-weighted Wheel of Shame remains enabled.
- `gameplay.js` and `nark.js` are included in the offline asset list.
- App files now load network-first, using the cache only when offline.
- CSS and JavaScript references include a version marker to force browsers to request the repaired files.

## Upload

Replace every matching file in the GitHub repository with this package, including:

- `index.html`
- `sw.js`
- `css/main.css`
- all files in `js/`

After GitHub Pages finishes deploying, open the site once with:

`?v=42`

Example:

`https://YOUR-NAME.github.io/pay-to-par/?v=42`

The new service worker should then take control and future deployments should update much more reliably.
