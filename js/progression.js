/**
 * Stardust Merge - Player Progression, 24 Achievements & Cosmic Codex
 */

import { CONFIG } from './config.js';

const STORAGE_KEY = 'stardust_progression_v1';

export const Progression = {
  data: {
    level: 1,
    xp: 0,
    discoveredTiers: [1, 2, 3, 4], // Tiers 1-4 unlocked by default
    achievements: {}
  },

  ACHIEVEMENTS_LIST: [
    { id: 'first_merge', name: 'First Fusion', desc: 'Perform your very first cosmic merge', xp: 50 },
    { id: 'reach_luna', name: 'Moonchild', desc: 'Synthesize Luna the Moon (Tier 5)', xp: 100 },
    { id: 'reach_sunny', name: 'Solar Flare', desc: 'Synthesize Sunny the Sun (Tier 9)', xp: 200 },
    { id: 'reach_coco', name: 'Into the Abyss', desc: 'Synthesize Coco the Black Hole (Tier 11)', xp: 400 },
    { id: 'supernova_1', name: 'Supernova Pioneer', desc: 'Trigger your first Supernova Ascension', xp: 500 },
    { id: 'supernova_3', name: 'Galactic Architect', desc: 'Achieve Ascension Level 3 in a single run', xp: 800 },
    { id: 'combo_4', name: 'Cascade Spark', desc: 'Hit a 4x merge combo', xp: 100 },
    { id: 'combo_8', name: 'Harmonic Resonance', desc: 'Reach the maximum 8x combo cap', xp: 300 },
    { id: 'score_10k', name: 'Rising Nebula', desc: 'Score 10,000 points in any mode', xp: 150 },
    { id: 'score_50k', name: 'Stellar Sovereign', desc: 'Score 50,000 points in any mode', xp: 350 },
    { id: 'score_100k', name: 'Centurion 100k', desc: 'Cross 100,000 cosmic points', xp: 600 },
    { id: 'merges_100', name: 'Merger Apprentice', desc: 'Perform 100 total merges', xp: 150 },
    { id: 'merges_500', name: 'Merger Master', desc: 'Perform 500 total merges', xp: 400 },
    { id: 'perks_3', name: 'Perk Enthusiast', desc: 'Stack 3 active cosmic perks in one run', xp: 150 },
    { id: 'perks_6', name: 'Cosmic Synergist', desc: 'Stack 6 active perks simultaneously', xp: 300 },
    { id: 'daily_first', name: 'Daily Explorer', desc: 'Complete a Daily Challenge run', xp: 100 },
    { id: 'zen_relax', name: 'Cosmic Calm', desc: 'Play 5 minutes in Sleepy Zen Mode', xp: 100 },
    { id: 'time_attack_20k', name: 'Blitz Commander', desc: 'Score 20,000 points in 90s Time Attack', xp: 250 },
    { id: 'hold_tactics', name: 'Tactical Vault', desc: 'Use the Hold pocket 10 times in a run', xp: 100 },
    { id: 'shake_it', name: 'Seismic Pilot', desc: 'Use the Shake power-up to rescue a jam', xp: 100 },
    { id: 'star_bomb_use', name: 'Supernova in a Bottle', desc: 'Deploy a Star Bomb', xp: 100 },
    { id: 'installed_pwa', name: 'Cosmic Resident', desc: 'Install Stardust Merge to your device', xp: 200 },
    { id: 'streak_3', name: 'Devoted Stargazer', desc: 'Build a 3-day consecutive login streak', xp: 200 },
    { id: 'codex_complete', name: 'Omniscient Astronomer', desc: 'Discover all 11 creatures in the Cosmic Codex', xp: 1000 }
  ],

  init() {
    this.load();
  },

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.data = Object.assign(this.data, JSON.parse(raw));
      }
    } catch (e) {}
  },

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {}
  },

  getXPForLevel(lvl) {
    return Math.round(150 * Math.pow(1.35, lvl - 1));
  },

  addXP(amount) {
    this.data.xp += amount;
    let req = this.getXPForLevel(this.data.level);
    while (this.data.xp >= req) {
      this.data.xp -= req;
      this.data.level += 1;
      this.onLevelUp(this.data.level);
      req = this.getXPForLevel(this.data.level);
    }
    this.save();
    this.updateHUD();
  },

  onLevelUp(newLevel) {
    const rewardCoins = 100 + newLevel * 20;
    try {
      const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        s.coins = (s.coins || 0) + rewardCoins;
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(s));
        if (window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('stardust:coins-updated', { detail: { coins: s.coins } }));
        }
      }
    } catch (e) {}

    // Show celebration toast
    if (window.UI && window.UI.showToast) {
      window.UI.showToast(`LEVEL UP! Now Level ${newLevel} (+${rewardCoins} Coins)`);
    }
  },

  discoverTier(tier) {
    if (!this.data.discoveredTiers.includes(tier)) {
      this.data.discoveredTiers.push(tier);
      this.addXP(tier * 25);
      if (this.data.discoveredTiers.length === 11) {
        this.unlockAchievement('codex_complete');
      }
      this.save();
    }
  },

  unlockAchievement(id) {
    if (!this.data.achievements[id]) {
      this.data.achievements[id] = new Date().toISOString();
      const ach = this.ACHIEVEMENTS_LIST.find(a => a.id === id);
      if (ach) {
        this.addXP(ach.xp);
        if (window.UI && window.UI.showToast) {
          window.UI.showToast(`ACHIEVEMENT: ${ach.name} (+${ach.xp} XP)`);
        }
      }
      this.save();
    }
  },

  updateHUD() {
    const lvlEl = document.getElementById('playerLevelDisplay');
    const xpBar = document.getElementById('playerXpBar');
    if (lvlEl) lvlEl.textContent = `LVL ${this.data.level}`;
    if (xpBar) {
      const req = this.getXPForLevel(this.data.level);
      const pct = Math.min(100, Math.round((this.data.xp / req) * 100));
      xpBar.style.width = `${pct}%`;
    }
  },

  renderCodex(containerId = 'codexContainer') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap:12px;">
        ${CONFIG.TIERS.map(t => {
          const unlocked = this.data.discoveredTiers.includes(t.tier);
          return `
            <div style="background:var(--night-3); border:2px solid var(--ink); border-radius:var(--radius-md); padding:10px; text-align:center; box-shadow:var(--hard-shadow-sm); opacity:${unlocked ? '1' : '0.45'};">
              <div style="width:48px; height:48px; margin:0 auto 8px; border-radius:50%; background:${unlocked ? t.color : '#2A3C48'}; border:2px solid ${unlocked ? (t.stroke || 'var(--ink)') : 'var(--ink)'}; display:flex; align-items:center; justify-content:center;">
                <span style="font-family:var(--font-display); font-size:16px; color:${unlocked ? 'var(--ink)' : 'var(--cream)'};">${unlocked ? t.tier : '?'}</span>
              </div>
              <div style="font-family:var(--font-display); font-size:13px; color:var(--mustard);">${unlocked ? t.charName : 'Unknown'}</div>
              <div style="font-size:11px; opacity:0.85;">Tier ${t.tier} (${unlocked ? t.name : '???'})</div>
              <div style="font-size:10px; margin-top:6px; line-height:1.3; color:var(--cream);">${unlocked ? t.lore : 'Synthesize in game to discover!'}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  renderAchievements(containerId = 'achievementsGrid') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap:10px;">
        ${this.ACHIEVEMENTS_LIST.map(a => {
          const unlocked = !!this.data.achievements[a.id];
          return `
            <div style="background:var(--night-3); border:2px solid var(--ink); border-radius:var(--radius-sm); padding:10px; box-shadow:var(--hard-shadow-sm); opacity:${unlocked ? '1' : '0.5'};">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <strong style="font-family:var(--font-display); font-size:12px; color:${unlocked ? 'var(--mint)' : 'var(--cream)'};">${a.name}</strong>
                <span>${unlocked ? '✓' : '🔒'}</span>
              </div>
              <div style="font-size:10px; line-height:1.3; margin-bottom:6px; opacity:0.9;">${a.desc}</div>
              <div style="font-size:10px; color:var(--mustard); font-weight:800;">+${a.xp} XP</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
};

if (typeof window !== 'undefined') {
  window.Progression = Progression;
}
