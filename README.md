# Pay to Par — Phase One

**The score you'll tell everyone you shot anyway.**

This repository contains the Phase One foundation for the Pay to Par progressive web app.

## Included

- Mobile-first app shell
- Pay to Par branding and visual system
- Hash-based navigation
- Home, New Round, Rules, History and Settings screens
- Working cheat glossary
- The Nark and Wheel of Shame rules
- Installable PWA manifest
- Offline service worker
- Responsive layout for phone and desktop testing

Gameplay and round setup are intentionally marked as Phase Two work.

## Run locally

Because the app uses ES modules and a service worker, serve the folder over HTTP:

```bash
python3 -m http.server 8080
```

Then visit:

```text
http://localhost:8080
```

## GitHub Pages

1. Upload all files and folders to the root of your repository.
2. Open **Settings → Pages**.
3. Select **Deploy from a branch**.
4. Choose the `main` branch and `/root`.
5. Save.

The relative file paths are already configured for a project-site deployment.

## Structure

```text
pay-to-par/
├── index.html
├── manifest.webmanifest
├── sw.js
├── css/
│   └── main.css
├── js/
│   ├── app.js
│   ├── data.js
│   ├── router.js
│   └── views.js
└── assets/
    └── icons/
```
