import math
from PIL import Image, ImageDraw, ImageFilter, ImageFont

def draw_star(draw, cx, cy, r_outer, r_inner, fill, outline=None, width=1):
    points = []
    for i in range(10):
        r = r_outer if i % 2 == 0 else r_inner
        angle = -math.pi / 2 + i * (math.pi / 5)
        points.append((cx + math.cos(angle) * r, cy + math.sin(angle) * r))
    draw.polygon(points, fill=fill, outline=outline, width=width)

def create_preview_banner():
    # 1200 x 630 OpenGraph / Twitter preview banner
    W, H = 1200, 630
    img = Image.new("RGBA", (W, H), (14, 6, 36, 255))
    draw = ImageDraw.Draw(img)

    # Cosmic gradient background
    for y in range(H):
        t = y / H
        r = int(24 + (14 - 24) * t)
        g = int(10 + (6 - 10) * t)
        b = int(58 + (34 - 58) * t)
        draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

    # Add nebula glow blobs
    nebula = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    n_draw = ImageDraw.Draw(nebula)
    # Magenta blob
    n_draw.ellipse([80, 80, 520, 520], fill=(216, 70, 166, 60))
    # Cyan blob
    n_draw.ellipse([650, 100, 1150, 600], fill=(92, 225, 230, 55))
    # Purple blob
    n_draw.ellipse([350, 250, 850, 750], fill=(138, 43, 226, 70))
    nebula = nebula.filter(ImageFilter.GaussianBlur(80))
    img = Image.alpha_composite(img, nebula)
    draw = ImageDraw.Draw(img)

    # Stars
    import random
    random.seed(42)
    for _ in range(120):
        sx = random.randint(10, W - 10)
        sy = random.randint(10, H - 10)
        sr = random.uniform(1, 3.2)
        sa = random.randint(140, 255)
        draw.ellipse([sx - sr, sy - sr, sx + sr, sy + sr], fill=(255, 255, 255, sa))
        if random.random() > 0.8:
            draw_star(draw, sx, sy, sr * 2.5, sr * 0.8, fill=(255, 240, 180, sa))

    # Left: Mascot Mochi Showcase
    # Draw Mochi Cape
    draw.ellipse([140, 280, 360, 500], fill=(76, 29, 149, 230))
    draw.ellipse([160, 300, 340, 480], fill=(109, 40, 217, 255))

    # Cloud body puffs
    # Lower body
    draw.ellipse([180, 320, 320, 460], fill=(237, 233, 254, 255))
    draw.ellipse([185, 315, 315, 450], fill=(255, 255, 255, 255))
    # Feet
    draw.ellipse([180, 440, 225, 480], fill=(255, 255, 255, 255), outline=(221, 214, 254, 255), width=2)
    draw.ellipse([275, 440, 320, 480], fill=(255, 255, 255, 255), outline=(221, 214, 254, 255), width=2)

    # Head Cloud Puffs
    draw.ellipse([140, 160, 360, 360], fill=(237, 233, 254, 255))
    # Fluff ears
    draw.ellipse([130, 140, 210, 220], fill=(255, 255, 255, 255))
    draw.ellipse([290, 140, 370, 220], fill=(255, 255, 255, 255))
    # Fluff cheeks
    draw.ellipse([125, 220, 205, 300], fill=(255, 255, 255, 255))
    draw.ellipse([295, 220, 375, 300], fill=(255, 255, 255, 255))
    # Center head
    draw.ellipse([150, 155, 350, 345], fill=(255, 255, 255, 255))

    # Eyes (Glossy purple with star highlights)
    # Left eye
    draw.ellipse([190, 220, 230, 275], fill=(30, 10, 52, 255))
    draw_star(draw, 205, 238, 9, 3.5, fill=(255, 255, 255, 255))
    draw.ellipse([214, 256, 220, 262], fill=(255, 255, 255, 220))
    # Right eye
    draw.ellipse([270, 220, 310, 275], fill=(30, 10, 52, 255))
    draw_star(draw, 285, 238, 9, 3.5, fill=(255, 255, 255, 255))
    draw.ellipse([294, 256, 300, 262], fill=(255, 255, 255, 220))

    # Rosy Cheeks
    draw.ellipse([162, 260, 192, 282], fill=(255, 112, 166, 140))
    draw.ellipse([308, 260, 338, 282], fill=(255, 112, 166, 140))

    # Cute Smiling Mouth
    draw.arc([238, 248, 262, 272], start=10, end=170, fill=(30, 10, 52, 255), width=3)

    # Scarf collar in front
    draw.ellipse([185, 320, 315, 360], fill=(124, 58, 237, 255), outline=(196, 181, 253, 255), width=2)
    draw_star(draw, 250, 340, 9, 4, fill=(255, 224, 71, 255))

    # Transparent Astronaut Bubble Helmet
    # Glow ring
    draw.ellipse([115, 115, 385, 385], outline=(216, 180, 254, 180), width=5)
    # Highlight arc
    draw.arc([125, 125, 375, 375], start=200, end=290, fill=(255, 255, 255, 220), width=4)

    # Headphone pods
    draw.ellipse([98, 230, 132, 280], fill=(55, 48, 163, 255), outline=(165, 180, 252, 255), width=3)
    draw.ellipse([368, 230, 402, 280], fill=(55, 48, 163, 255), outline=(165, 180, 252, 255), width=3)

    # Antenna & Golden Light
    draw.arc([110, 80, 190, 160], start=170, end=260, fill=(203, 213, 225, 255), width=4)
    draw.ellipse([115, 85, 145, 115], fill=(255, 224, 71, 255), outline=(254, 240, 138, 255), width=2)

    # Golden Star held in hands
    draw_star(draw, 250, 400, 38, 16, fill=(255, 224, 71, 255), outline=(245, 158, 11, 255), width=3)
    # Paws
    draw.ellipse([208, 385, 238, 415], fill=(255, 255, 255, 255), outline=(221, 214, 254, 255), width=2)
    draw.ellipse([262, 385, 292, 415], fill=(255, 255, 255, 255), outline=(221, 214, 254, 255), width=2)

    # Right: Kawaii Cosmic Orbs in Jar / Showcase
    # Frosted Jar Outline
    jar_box = [820, 120, 1120, 560]
    draw.rounded_rectangle(jar_box, radius=36, outline=(216, 180, 254, 160), width=4)
    # Jar lid rim
    draw.rounded_rectangle([840, 95, 1100, 130], radius=14, outline=(255, 255, 255, 190), width=3)

    # Draw cute orbs inside Jar
    # 1. Golden Sun with petal rays (center right)
    sun_cx, sun_cy, sun_r = 970, 310, 52
    for i in range(12):
        a = i * (math.pi / 6)
        px = sun_cx + math.cos(a) * (sun_r + 10)
        py = sun_cy + math.sin(a) * (sun_r + 10)
        draw.ellipse([px - 9, py - 9, px + 9, py + 9], fill=(253, 224, 71, 255))
    draw.ellipse([sun_cx - sun_r, sun_cy - sun_r, sun_cx + sun_r, sun_cy + sun_r], fill=(254, 240, 138, 255), outline=(251, 191, 36, 255), width=3)
    # Sun face
    draw.ellipse([sun_cx - 18, sun_cy - 10, sun_cx - 8, sun_cy + 4], fill=(30, 10, 52, 255))
    draw.ellipse([sun_cx + 8, sun_cy - 10, sun_cx + 18, sun_cy + 4], fill=(30, 10, 52, 255))
    draw.ellipse([sun_cx - 15, sun_cy - 8, sun_cx - 12, sun_cy - 4], fill=(255, 255, 255, 255))
    draw.ellipse([sun_cx + 11, sun_cy - 8, sun_cx + 14, sun_cy - 4], fill=(255, 255, 255, 255))
    draw.ellipse([sun_cx - 24, sun_cy + 4, sun_cx - 14, sun_cy + 14], fill=(255, 112, 166, 160))
    draw.ellipse([sun_cx + 14, sun_cy + 4, sun_cx + 24, sun_cy + 14], fill=(255, 112, 166, 160))
    draw.arc([sun_cx - 8, sun_cy + 2, sun_cx + 8, sun_cy + 16], start=0, end=180, fill=(30, 10, 52, 255), width=3)

    # 2. Ringed Giant (Lavender planet with ring)
    sat_cx, sat_cy, sat_r = 910, 440, 42
    draw.ellipse([sat_cx - 62, sat_cy - 16, sat_cx + 62, sat_cy + 16], outline=(243, 232, 255, 220), width=4)
    draw.ellipse([sat_cx - sat_r, sat_cy - sat_r, sat_cx + sat_r, sat_cy + sat_r], fill=(192, 132, 252, 255), outline=(243, 232, 255, 255), width=2)
    # Face
    draw.ellipse([sat_cx - 14, sat_cy - 6, sat_cx - 6, sat_cy + 4], fill=(30, 10, 52, 255))
    draw.ellipse([sat_cx + 6, sat_cy - 6, sat_cx + 14, sat_cy + 4], fill=(30, 10, 52, 255))
    draw.arc([sat_cx - 6, sat_cy + 2, sat_cx + 6, sat_cy + 12], start=0, end=180, fill=(30, 10, 52, 255), width=2)

    # 3. Winking Moon (Cream white)
    m_cx, m_cy, m_r = 1030, 450, 36
    draw.ellipse([m_cx - m_r, m_cy - m_r, m_cx + m_r, m_cy + m_r], fill=(226, 232, 240, 255), outline=(255, 255, 255, 255), width=2)
    # Winking eye
    draw.arc([m_cx - 14, m_cy - 8, m_cx - 4, m_cy + 2], start=200, end=340, fill=(30, 10, 52, 255), width=2)
    # Normal eye
    draw.ellipse([m_cx + 5, m_cy - 6, m_cx + 12, m_cy + 3], fill=(30, 10, 52, 255))
    draw.ellipse([m_cx + 7, m_cy - 5, m_cx + 9, m_cy - 2], fill=(255, 255, 255, 255))
    draw.arc([m_cx - 4, m_cy + 3, m_cx + 5, m_cy + 11], start=0, end=180, fill=(30, 10, 52, 255), width=2)

    # 4. Black Hole with accretion ring
    bh_cx, bh_cy, bh_r = 980, 515, 30
    draw.ellipse([bh_cx - 48, bh_cy - 12, bh_cx + 48, bh_cy + 12], outline=(251, 146, 60, 240), width=4)
    draw.ellipse([bh_cx - bh_r, bh_cy - bh_r, bh_cx + bh_r, bh_cy + bh_r], fill=(30, 18, 56, 255), outline=(251, 146, 60, 255), width=2)
    # Tiny glowing face
    draw.ellipse([bh_cx - 8, bh_cy - 3, bh_cx - 3, bh_cy + 3], fill=(255, 255, 255, 255))
    draw.ellipse([bh_cx + 3, bh_cy - 3, bh_cx + 8, bh_cy + 3], fill=(255, 255, 255, 255))
    draw.arc([bh_cx - 3, bh_cy + 2, bh_cx + 3, bh_cy + 7], start=0, end=180, fill=(255, 255, 255, 255), width=1)

    # 5. Mint comet & Cyan spark
    draw.ellipse([880 - 20, 230 - 20, 880 + 20, 230 + 20], fill=(74, 222, 128, 255), outline=(220, 252, 231, 255), width=2)
    draw.ellipse([1020 - 15, 210 - 15, 1020 + 15, 210 + 15], fill=(56, 189, 248, 255), outline=(186, 230, 253, 255), width=2)

    # Center Title & Typography
    # Try default font or load truetype
    try:
        font_title = ImageFont.truetype("arial.ttf", 64)
        font_sub = ImageFont.truetype("arial.ttf", 26)
        font_badge = ImageFont.truetype("arial.ttf", 20)
    except:
        font_title = font_sub = font_badge = ImageFont.load_default()

    # Title Banner
    draw.text((450, 130), "Stardust Merge", fill=(255, 224, 71, 255), font=font_title)
    draw.text((452, 210), "Merge • Relax • Reach for the Stars!", fill=(233, 213, 255, 255), font=font_sub)

    # Badges
    badges = [
        ("⭐ 11 Cosmic Tiers", 450, 280),
        ("⚡ Cosmic Perks", 630, 280),
        ("👑 Endless & Zen", 450, 340),
        ("🎮 Free Online Game", 630, 340)
    ]
    for text, bx, by in badges:
        draw.rounded_rectangle([bx, by, bx + 165, by + 44], radius=14, fill=(55, 32, 105, 210), outline=(216, 180, 254, 120), width=1)
        draw.text((bx + 12, by + 11), text, fill=(243, 232, 255, 255), font=font_badge)

    # Cute Play Button
    draw.rounded_rectangle([450, 420, 680, 485], radius=26, fill=(255, 112, 166, 255), outline=(255, 224, 71, 255), width=3)
    draw.text((485, 436), "▶ PLAY NOW FREE", fill=(255, 255, 255, 255), font=font_sub)

    img.save("og-preview.png")
    print("Successfully generated og-preview.png")

if __name__ == "__main__":
    create_preview_banner()
