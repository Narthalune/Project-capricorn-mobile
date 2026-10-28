# Capri 2D character art slot (v0.4)

The iPhone app currently shows a lightweight built-in animated silhouette. No third-party character art is bundled.

To replace the silhouette, add a rights-cleared character image as **`base.png`** in this folder. The app automatically switches to it after the image loads. If it is absent or broken, the silhouette remains visible.

## Optional aligned overlays

- `base.png`: transparent full character, with open eyes and resting/closed mouth. REQUIRED for custom artwork.
- `eyes-closed.png`: transparent *full-canvas* image with only the closed eyelid/eye details placed at their exact original coordinates. Used for blink frames.
- `mouth-open.png`: transparent *full-canvas* image with only an open mouth at its original coordinates. Shown during speech synthesis.

Use the exact same width, height, canvas crop, and coordinate system for all layers. A **600 × 880** or **900 × 1320** portrait canvas is fine if all files match. Keep artwork comfortably inset from the edges.

Images are inserted as full-frame stacked elements with object-fit: contain. The base sprite floats and sways with CSS. Eyes and mouth overlays are synchronized to the same sprite. The effects are simple CSS animations, **not** a Live2D rig or audio-driven viseme analysis.

The character state follows the app: **idle** while resting, **thinking** during Gemini requests, and **talking** while system text-to-speech actually plays. Users with reduced-motion enabled see a static stage.

Only upload art that you're authorized to put in this public GitHub repository. Downloadable fan assets do not automatically include redistribution permission.

After uploading `base.png`, reload the GitHub Pages website. Existing chat history, stored access token and Gemini connection are unaffected.
