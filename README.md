# 🌌 Stardust Merge — Cozy Cosmic Physics Puzzle

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen.svg)](https://pritpatel2412.github.io/HTML5-game/)
[![Game Engine](https://img.shields.io/badge/physics-Matter.js%20v0.20.0-blue.svg)](https://brm.io/matter-js/)
[![Audio](https://img.shields.io/badge/sound-Web%20Audio%20API-orange.svg)]()
[![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Mobile%20%7C%20Desktop-purple.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A cozy, atmospheric physics puzzle game set inside a floating glass jar. Drop glowing celestial bodies, chain cosmic merges, unlock stackable roguelite perks, and trigger a Supernova Ascension!

🎮 **[Play Live in Browser](https://pritpatel2412.github.io/HTML5-game/)**

---

## ✨ Features

- **Tactile Physics Simulation**: Powered by Matter.js with fixed multi-substep integration for consistent 60/120/144Hz performance without tunneling.
- **11 Cosmic Evolution Tiers**: From microscopic Stardust particles to supermassive Black Holes.
- **Supernova Ascension**: Merging two Tier-11 Black Holes triggers a screen-clearing Supernova with permanent score multipliers.
- **Roguelite Cosmic Perks**: Stackable run modifiers chosen at score milestones (localized gravity wells, explosive shockwaves, and combo enhancers).
- **Daily Challenge Mode**: Seeded daily runs via deterministic Mulberry32 PRNG so players worldwide compete on the exact same orb sequences.
- **Procedural Audio**: 100% synthesized audio via the browser's Web Audio API—no external audio assets or load latency.
- **Accessibility & Contrast Modes**: Every orb features distinct silhouette geometry, surface patterns, and optional numeral overlays for color-vision accessibility.
- **Cross-Platform Responsive Design**: Optimized for desktop mouse, full-screen touch devices, and keyboard navigation with haptic feedback.
- **Zero-Build Architecture**: Single-file static build with CDN-pinned dependencies for instant loading (<1s) and zero maintenance.

---

## 🪐 The 11 Celestial Tiers

| Tier | Celestial Body | Visual Signature | Surface Motif |
| :--: | :--- | :--- | :--- |
| **1** | **Dust** | Soft Periwinkle (`#B8C4FF`) | Concentric Dots |
| **2** | **Spark** | Electric Cyan (`#5EF2FF`) | Diamond Sparkle |
| **3** | **Comet** | Aurora Mint (`#7CFFB2`) | Trailing Tail |
| **4** | **Asteroid** | Golden Ochre (`#FFD166`) | Crystalline Polygon |
| **5** | **Moon** | Lunar Pearl (`#E8E6FF`) | Impact Craters |
| **6** | **Ember** | Solar Coral (`#FF8A5B`) | Thermal Swirl |
| **7** | **Ocean World** | Deep Azure (`#3D9BFF`) | Tidal Waves |
| **8** | **Ringed Giant** | Nebula Violet (`#C77DFF`) | Planetary Rings |
| **9** | **Sun** | Corona Gold (`#FFE45E`) | Radiant Solar Rays |
| **10** | **Neutron Star** | Pulsar Magenta (`#FF5DA2`) | High-Energy Pulsar |
| **11** | **Black Hole** | Singularity Void (`#0B0B14`) | Blazing Accretion Disk |

---

## 🎮 How to Play

### Objective
Drop cosmic orbs into the celestial jar. When two identical bodies collide, they fuse into the next tier. Prevent the jar from overflowing past the cosmic containment barrier!

### Controls

| Action | Mouse | Touch | Keyboard |
| :--- | :--- | :--- | :--- |
| **Aim** | Move cursor horizontally | Drag finger across screen | `←` / `→` or `A` / `D` |
| **Drop Orb** | Left Click / Release | Lift finger / Tap Drop button | `Space` or `Enter` or `↓` |
| **Nudge Left / Right** | On-screen nudge arrows | Thumb buttons | `Q` / `E` |
| **Pause Game** | Pause button | Pause icon | `Esc` or `P` |

---

## 🛠️ Tech Stack & Architecture

- **Rendering**: Vanilla HTML5 Canvas (`CanvasRenderingContext2D`) with double-buffered particle systems and dynamic bloom.
- **Physics**: [Matter.js 0.20.0](https://brm.io/matter-js/) pinned via CDN.
- **Sound**: Native HTML5 Web Audio API oscillators and gain envelopes (zero audio MP3/WAV download overhead).
- **Fonts**: Preconnected Google Fonts (`Fredoka` & `Nunito`).
- **Monetization**: Google AdSense & H5 Game Placement API ready with full `ads.txt` support.
- **Storage**: Browser `localStorage` for high scores, daily run records, and player preferences (sound, haptics, theme).

---

## 🚀 Local Development

No build tools or node modules required! You can run the game directly:

```bash
# Clone the repository
git clone https://github.com/pritpatel2412/HTML5-game.git
cd HTML5-game

# Serve locally using any static server:
# Using Python:
python -m http.server 8080

# Or using Node.js:
npx serve .
```

Open `http://localhost:8080` in your web browser.

---

## 📦 Deployment

### GitHub Pages (Configured)
1. In your GitHub repository, navigate to **Settings** > **Pages**.
2. Under **Build and deployment**:
   - **Source**: Deploy from a branch
   - **Branch**: `main`
   - **Folder**: `/ (root)`
3. Click **Save**. The game will automatically deploy to:
   `https://<username>.github.io/<repo>/`

### Alternative Hosts
- **Netlify**: Drag and drop the repository folder into [app.netlify.com/drop](https://app.netlify.com/drop).
- **Cloudflare Pages**: Connect your Git repository (Build command: None, Output directory: `/`).

---

## 📄 License

Distributed under the [MIT License](LICENSE). Feel free to use, modify, and build upon this project.
