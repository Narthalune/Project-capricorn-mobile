# Capri 2D artwork and animation (v0.5)

The public mobile app now bundles an **original generated Capri character illustration** at `base.webp` (380 × 390 px, transparent). This is a fan interpretation of Capri/Capricorn from *Cyberpunk: Edgerunners 2*, not official show artwork, a ripped show frame, or another artist's sprite. The character IP belongs to its respective rights holders.

The character stage displays the sprite by default. Idle motion and thinking/talking state transitions are driven by the existing HTML/CSS and voice/chat events. This is currently **one illustrated frame**, not a rigged Live2D model or frame-by-frame speaking animation. Overlay slots remain available for future face-animation assets.

Optional additional assets must use the same 380 × 390 canvas dimensions and visual coordinates:
- `eyes-closed.png`: transparent aligned eyelids only, for blinking.
- `mouth-open.png`: transparent aligned mouth only, for speaking.

If the image is missing, the built-in fallback silhouette is still available, and Gemini connectivity is untouched.

For a future different art style, replace `base.webp` with a properly licensed sprite and refresh the web app. Do not copy third-party art into the public repository without rights to publish it.
