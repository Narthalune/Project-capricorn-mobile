# Capricorn Mobile | Capri Desktop sprite stage v0.6

This app uses the full-body animated Capri sprite sheets from the **Capri Desktop** project by Lachy:
https://github.com/lachydotmcg/capri-desktop

The mobile implementation references the author's own hosted sprite sheets at
`https://lachydotmcg.github.io/capri-desktop/assets/sprites/`, including:

- `idle.webp` — 16 frames, 8 frames per second
- `blink.webp` — 4 frames, 8 FPS
- `mouth.webp` — 5 mouth-shape frames, 12 FPS
- `glitch.webp` — 10 frames, 15 FPS

This is the same **Capri Desktop art pipeline**, not the generated Capri-inspired portrait formerly used in the mobile v0.5 build. The PNG/WebP sprite artwork is **not republished** in this repository. Mobile requires network connectivity to load it. If the original host goes offline the app shows its built-in silhouette rather than a broken-image icon.

This is an unofficial, noncommercial fan companion project, not affiliated with the rights holders. Source: https://github.com/lachydotmcg/capri-desktop . The source project publishes PolyForm Noncommercial 1.0.0 for its software; artwork may have separate character and art rights. Refer to the original creator for reproduction or redistribution permissions.

Animations follow the `idle`, `thinking`, and `talking` states from Capri Mobile's current chat/voice handlers. A Live2D rig, synced lip animation, and cross-device memory are not part of this build.
