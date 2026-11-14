/**
 * Stardust Merge - 1080x1350 PNG Share Card Generator
 * Creates a viral high-resolution cel-shaded score card and shares via Web Share API or download fallback.
 */

import { CONFIG } from './config.js';

export const ShareCard = {
  async generateAndShare(score, highestTier = 1, gameCanvas = null) {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');

    // 1. Solid cel-shaded background from palette (#14303A)
    ctx.fillStyle = '#14303A';
    ctx.fillRect(0, 0, 1080, 1350);

    // 2. Heavy sticker border
    ctx.lineWidth = 16;
    ctx.strokeStyle = '#1E2B33';
    ctx.strokeRect(30, 30, 1020, 1290);

    // Inner card background
    ctx.fillStyle = '#1A3C48';
    ctx.fillRect(40, 40, 1000, 1270);
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#1E2B33';
    ctx.strokeRect(40, 40, 1000, 1270);

    // Header badge
    ctx.fillStyle = '#FFC145';
    ctx.fillRect(140, 90, 800, 110);
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#1E2B33';
    ctx.strokeRect(140, 90, 800, 110);

    ctx.font = '900 64px "Lilita One", sans-serif';
    ctx.fillStyle = '#1E2B33';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('STARDUST MERGE', 540, 145);

    // Subtitle
    ctx.font = '800 34px "Nunito", sans-serif';
    ctx.fillStyle = '#F4E9D4';
    ctx.fillText('Cosmic Physics Merge Odyssey', 540, 240);

    // Score Card Box
    ctx.fillStyle = '#214A58';
    ctx.fillRect(140, 290, 800, 240);
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#1E2B33';
    ctx.strokeRect(140, 290, 800, 240);

    ctx.font = '800 32px "Nunito", sans-serif';
    ctx.fillStyle = '#FF6B57';
    ctx.fillText('FINAL COSMIC SCORE', 540, 350);

    ctx.font = '900 96px "Lilita One", sans-serif';
    ctx.fillStyle = '#FFC145';
    ctx.fillText(Number(score || 0).toLocaleString(), 540, 440);

    // Tier Display Box
    const tierObj = CONFIG.TIERS[Math.min(10, Math.max(0, highestTier - 1))];
    ctx.fillStyle = '#14303A';
    ctx.fillRect(140, 560, 800, 160);
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#1E2B33';
    ctx.strokeRect(140, 560, 800, 160);

    // Draw orb circle
    ctx.beginPath();
    ctx.arc(240, 640, 55, 0, Math.PI * 2);
    ctx.fillStyle = tierObj.color;
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = tierObj.stroke || '#1E2B33';
    ctx.stroke();

    ctx.font = '800 32px "Nunito", sans-serif';
    ctx.fillStyle = '#5ED3B0';
    ctx.textAlign = 'left';
    ctx.fillText('HIGHEST CREATURE REACHED', 330, 615);

    ctx.font = '900 48px "Lilita One", sans-serif';
    ctx.fillStyle = '#F4E9D4';
    ctx.fillText(`${tierObj.charName} (Tier ${tierObj.tier} ${tierObj.name})`, 330, 670);

    // Mini Jar Snapshot if canvas passed
    if (gameCanvas) {
      ctx.fillStyle = '#14303A';
      ctx.fillRect(290, 750, 500, 420);
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#1E2B33';
      ctx.strokeRect(290, 750, 500, 420);

      // Draw scaled snapshot
      ctx.drawImage(gameCanvas, 0, 100, gameCanvas.width, gameCanvas.height - 100, 310, 770, 460, 380);
    }

    // Call-to-action Footer
    ctx.textAlign = 'center';
    ctx.fillStyle = '#5ED3B0';
    ctx.fillRect(140, 1200, 800, 75);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#1E2B33';
    ctx.strokeRect(140, 1200, 800, 75);

    ctx.font = '900 32px "Lilita One", sans-serif';
    ctx.fillStyle = '#1E2B33';
    ctx.fillText('CAN YOU BEAT MY SCORE? PLAY FREE AT:', 540, 1240);

    ctx.font = '800 22px "Nunito", sans-serif';
    ctx.fillStyle = '#FFC145';
    ctx.fillText(CONFIG.SITE_URL, 540, 1315);

    // Convert to Blob and Share
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], 'stardust-merge-score.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: 'Stardust Merge High Score!',
            text: `I just scored ${Number(score).toLocaleString()} points in Stardust Merge reaching ${tierObj.charName}! Can you beat me?`,
            url: CONFIG.SITE_URL,
            files: [file]
          });
          return;
        } catch (e) {
          console.log('[ShareCard] Share cancelled or failed, falling back to download');
        }
      }

      // Download Fallback
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `stardust-merge-${score}-score.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  }
};

if (typeof window !== 'undefined') {
  window.ShareCard = ShareCard;
}
