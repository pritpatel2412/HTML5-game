# Stardust Merge — Character Design Bible & Individual QA Review (`CHARACTER_DESIGN_QA.md`)

## 1. Master Art Direction Specification: "Kawaii Cosmic Fluff Universe"

| Visual Attribute | Master Design Specification |
| :--- | :--- |
| **Art Style Identity** | **Kawaii Cosmic Fluff Universe** — 3D-inspired collectible plush cosmic creatures with soft fur/velvet shaders, distinct outer silhouettes, and expressive living faces. |
| **Eye Proportions & Reflections** | Large glossy oval/round eyes (`21%–25%` of body radius) positioned along the `52%–55%` vertical midline, featuring dark plum outer irises, vibrant gem-toned inner irises, dual specular white highlights, and a 4-point golden star reflection. |
| **Mouth & Blush Rules** | Tiny centered expressive mouths (`w` cat-smile, open cheerful `D` laugh, sleepy `o` yawn, or gentle curved smile) flanked by soft pastel pink (`#FF9EBB`) elliptical cheek blushes immediately below the outer eye corners. |
| **Body Shading & Fur Material** | Top-left (`-35°`) warm starlight key gradient + bottom-right pastel rim lighting + multi-layered scalloped plush/fur edge tufts so no character looks like a flat geometric circle. |
| **Collision Boundary Discipline** | Matter.js physical bodies strictly match the core tier radius (`13px` to `110px`), while decorative plush fur tufts, comet tails, planetary rings, sun rays, and pulse beams render inside padded offscreen sprite canvases (`+22px` transparent padding) without altering physical collisions. |

---

## 2. Individual 12-Character Quality Audit

### Main Mascot — Mochi (The Fluffy Cloud Astronaut)
* **Face & Symmetry Verification:** Symmetrical violet-purple glossy eyes (`#5B2E91`) with triple star reflections, rosy pastel pink cheek blush (`#FF9EBB`), and centered cat-like `w` smile.
* **Silhouette & Accessories:** Chibi cloud-plush silhouette with lavender ear tufts, 3 top head puffs, tiny rounded arms and feet, purple astronaut scarf (`#7E52C2`) with golden star badge (`#FFE45E`), transparent bubble helmet with purple-blue rim light, and a special **Golden Star Crown** during Daily Challenge mode.
* **Expressions & Poses Verified (8 Expressions / 7 Poses):** `idle` (gentle smile & blink), `happy` (huge smile & star eyes), `excited` (open mouth & raised waving arms), `surprised` (wide eyes & `o` mouth), `sleepy` (half-closed eyes, yawning paw & `Zzz` bubbles), `thinking` (upward gaze), `disappointed` (lowered lavender ear tufts & gentle pout on Game Over), and `supernova` (rainbow-gold aura & jumping celebration pose).
* **Mobile & In-Game Readability:** Passed at `360×640` mobile and `1440×900` desktop viewports across Title Screen, Live Jar Header, Menu Sheet, Achievement Toasts, and Game Over Sheet.

### Tier 01 — Dusty (`Dust`, Radius `13px`, `#B8C4FF`)
* **Face & Symmetry Verification:** Glossy dark-purple eyes, tiny shy smile, and subtle pink blush spots positioned cleanly for `26px` diameter readability.
* **Silhouette & Special Features:** Scalloped powder-puff lavender-blue plush silhouette with a soft top fur tuft and 3 orbiting baby-star particles.
* **Animation & Gameplay Check:** Gentle floating wobble, blink cycle, drop bounce, and touch sparkle verified at small mobile scale.

### Tier 02 — Sparky (`Spark`, Radius `19px`, `#5EF2FF`)
* **Face & Symmetry Verification:** Large sparkling sapphire-blue eyes, cheerful smile, and yellow lightning-bolt forehead mark.
* **Silhouette & Special Features:** 8 soft pointed star-fur tufts around the perimeter plus two glowing antenna tips on top.
* **Animation & Gameplay Check:** Hyperactive micro-hops, antenna glow pulse, and electric sparkle burst on merge verified; non-aggressive and friendly.

### Tier 03 — Commy (`Comet`, Radius `26px`, `#7CFFB2`)
* **Face & Symmetry Verification:** Large emerald-green glossy eyes (with playful wink reaction), happy mouth, and mint forehead star.
* **Silhouette & Special Features:** Fluffy mint spherical body with a sweeping curved cream-mint comet tail tuft that trails behind without affecting the `26px` Matter.js circle body.
* **Animation & Gameplay Check:** Orbital tail sway, falling sparkle trail, and celebratory merge twirl verified.

### Tier 04 — Rocky (`Asteroid`, Radius `33px`, `#FFD166`)
* **Face & Symmetry Verification:** Warm amber-brown glossy eyes, loyal friendly smile, and rosy cheek blush.
* **Silhouette & Special Features:** Soft bumpy plush space-rock silhouette with 3 shaded round craters and a faceted golden crystal embedded on its right cheek.
* **Animation & Gameplay Check:** Heavy cushioned landing bounce, dust puff on impact, and happy post-merge wobble verified.

### Tier 05 — Luna (`Moon`, Radius `41px`, `#E8E6FF`)
* **Face & Symmetry Verification:** Dreamy violet eyes with slow-blink/sleepy-eyelash state, peaceful smile, and lavender crescent moon forehead mark.
* **Silhouette & Special Features:** Creamy lavender-white plush moon with soft round craters, silver-white aura, and a tethered tiny golden star companion orbiting its upper right side.
* **Animation & Gameplay Check:** Slow dreamy float, sleepy yawn in Zen mode, and orbiting star companion verified.

### Tier 06 — Emberly (`Ember`, Radius `50px`, `#FF8A5B`)
* **Face & Symmetry Verification:** Big dark-brown glossy eyes, warm cheerful mouth, and rosy peach cheeks.
* **Silhouette & Special Features:** Coral-orange plush body crowned with 3 soft, rounded flame-shaped fur tufts on top and golden glow spots.
* **Animation & Gameplay Check:** Warm flickering aura, upward cheerful hops, and flame-pulse merge celebration verified; looks like a cozy plush creature rather than hazardous fire.

### Tier 07 — Bubbly (`Ocean World`, Radius `60px`, `#3D9BFF`)
* **Face & Symmetry Verification:** Large glossy ocean-blue eyes, open happy smile, and pink cheek blush.
* **Silhouette & Special Features:** Ocean-blue plush globe with turquoise island patches, two fluffy white cloud puffs on the left and right sides, a curled wave crest on top, and floating water bubbles.
* **Animation & Gameplay Check:** Gentle swimming wobble, rising bubble particles, and wave crest bounce verified.

### Tier 08 — Saturny (`Ringed Giant`, Radius `71px`, `#C77DFF`)
* **Face & Symmetry Verification:** Sparkling violet eyes, confident cat-like smile, and lilac striped plush body.
* **Silhouette & Special Features:** Tilted pastel lilac-and-gold orbital ring with embedded tiny stars wrapping behind and in front of the plush body (visually separate from the `71px` collision circle).
* **Animation & Gameplay Check:** Smooth ring tilt oscillation, impact ring sparkle, and proud spin celebration verified.

### Tier 09 — Sunny (`Sun`, Radius `83px`, `#FFE45E`)
* **Face & Symmetry Verification:** Huge dark-brown sparkling eyes, wide open joyful smile with pink tongue, and warm orange inner blush gradient.
* **Silhouette & Special Features:** 10 soft, rounded plush sun-ray petals framing the golden-yellow core with floating golden star sparkles.
* **Animation & Gameplay Check:** Radial sun-ray breathing, cheerful bounce, and bright golden merge pulse verified.

### Tier 10 — Neutry (`Neutron Star`, Radius `96px`, `#FF5DA2`)
* **Face & Symmetry Verification:** Sparkling violet eyes, intelligent friendly smile, and tiny star markings on both cheeks.
* **Silhouette & Special Features:** Pink-magenta plush sphere with two symmetrical, rounded luminous pastel energy beams extending diagonally from opposite sides.
* **Animation & Gameplay Check:** Gentle beam glow pulse, expanding light rings, and merge sparkle burst verified.

### Tier 11 — Coco (`Black Hole`, Radius `110px`, `#0B0B14`, Ring `#FF9E3D → #8A2BE2`)
* **Face & Symmetry Verification:** Near-black velvet plush core (`#0B0B14`) with huge expressive glossy purple-pink eyes, rosy blush, and adorable cuddle smile.
* **Silhouette & Special Features:** Glowing orange-to-purple (`#FF9E3D` → `#8A2BE2`) accretion ring studded with star-shaped highlights and inward-drifting starlight particles.
* **Special Supernova Transformation Check:** When two Coco characters touch, both widen their eyes in excitement, spin their accretion rings rapidly as they pull together, flash into a giant magical star, trigger a pastel shockwave + stardust shower, make Mochi perform her Supernova celebration dance, display `"SUPERNOVA!"`, and boost the run multiplier by `×1.5`.
