/**
 * Stardust Merge - Power-Ups Engine
 * Supports: Shake, Undo, Star Bomb, Swap (with coin costs and rewarded ad refills)
 */

import { CONFIG } from './config.js';

export const PowerUps = {
  inventory: {
    shake: 2,
    undo: 1,
    bomb: 1,
    swap: 3
  },

  COSTS: {
    shake: 30,
    undo: 50,
    bomb: 40,
    swap: 25
  },

  init() {
    this.load();
    this.bindButtons();
    this.updateUI();
  },

  load() {
    try {
      const raw = localStorage.getItem('stardust_powerups_v1');
      if (raw) {
        this.inventory = Object.assign(this.inventory, JSON.parse(raw));
      }
    } catch (e) {}
  },

  save() {
    try {
      localStorage.setItem('stardust_powerups_v1', JSON.stringify(this.inventory));
    } catch (e) {}
  },

  use(type) {
    if (window.Game && (window.Game.isGameOver || window.Game.isPaused)) return false;

    // Check inventory
    if (this.inventory[type] > 0) {
      this.inventory[type]--;
      this.save();
      this.executePowerUp(type);
      this.updateUI();
      return true;
    }

    // If zero, prompt to buy with coins or watch ad
    const cost = this.COSTS[type];
    const canAfford = (window.Storage && window.Storage.data && window.Storage.data.coins >= cost);

    const buyOrAd = confirm(`Out of ${type.toUpperCase()}! Purchase 1 charge for ${cost} coins?\n(Click Cancel to watch a rewarded video ad instead)`);
    if (buyOrAd) {
      if (canAfford) {
        window.Storage.data.coins -= cost;
        window.Storage.save();
        this.executePowerUp(type);
        this.updateUI();
        if (window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('stardust:coins-updated', { detail: { coins: window.Storage.data.coins } }));
        }
        return true;
      } else {
        alert('Not enough coins! Watch a rewarded video ad to get a free charge.');
        this.watchAdForPowerUp(type);
      }
    } else {
      this.watchAdForPowerUp(type);
    }
    return false;
  },

  executePowerUp(type) {
    if (!window.Game || !window.Physics) return;

    if (type === 'shake') {
      // Apply upward and slight lateral impulse to all orbs in jar
      const orbs = window.Physics.activeOrbs || [];
      orbs.forEach(orb => {
        if (orb.body) {
          const impulseX = (Math.random() - 0.5) * 6;
          const impulseY = - (4 + Math.random() * 5);
          window.Matter.Body.setVelocity(orb.body, { x: impulseX, y: impulseY });
        }
      });
      if (window.AudioEngine) window.AudioEngine.playDrop();
      if (window.UI && window.UI.showToast) window.UI.showToast('JAR SHAKEN!');
      if (window.Progression) window.Progression.unlockAchievement('shake_it');
    } else if (type === 'undo') {
      // Remove the most recently dropped orb
      const orbs = window.Physics.activeOrbs;
      if (orbs && orbs.length > 0) {
        const lastOrb = orbs.pop();
        if (lastOrb && lastOrb.body) {
          window.Matter.World.remove(window.Physics.engine.world, lastOrb.body);
          if (window.UI && window.UI.showToast) window.UI.showToast('LAST DROP UNDONE!');
        }
      }
    } else if (type === 'bomb') {
      // Pop the 5 smallest orbs
      if (window.Game.triggerStarBomb) {
        window.Game.triggerStarBomb();
      }
      if (window.Progression) window.Progression.unlockAchievement('star_bomb_use');
    } else if (type === 'swap') {
      // Swap current dropper orb with Hold or Next
      if (window.Game.handleHoldSwap) {
        window.Game.handleHoldSwap(true);
        if (window.UI && window.UI.showToast) window.UI.showToast('ORB SWAPPED!');
      }
    }
  },

  watchAdForPowerUp(type) {
    if (window.AdsManager && window.AdsManager.showRewardedAd) {
      window.AdsManager.showRewardedAd(() => {
        this.inventory[type] = (this.inventory[type] || 0) + 1;
        this.save();
        this.updateUI();
        if (window.UI && window.UI.showToast) {
          window.UI.showToast(`+1 ${type.toUpperCase()} Granted!`);
        }
      });
    } else {
      // Simulated rewarded ad fallback
      setTimeout(() => {
        this.inventory[type] = (this.inventory[type] || 0) + 1;
        this.save();
        this.updateUI();
        alert(`Rewarded ad completed! +1 ${type.toUpperCase()} added to inventory.`);
      }, 1200);
    }
  },

  bindButtons() {
    const bind = (id, type) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => this.use(type));
    };

    bind('btnShakePowerUp', 'shake');
    bind('btnUndoPowerUp', 'undo');
    bind('btnStarBomb', 'bomb');
    bind('btnSwapPowerUp', 'swap');
  },

  updateUI() {
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setVal('shakeCountDisplay', this.inventory.shake);
    setVal('undoCountDisplay', this.inventory.undo);
    setVal('starBombCount', this.inventory.bomb);
    setVal('swapCountDisplay', this.inventory.swap);
  }
};

if (typeof window !== 'undefined') {
  window.PowerUps = PowerUps;
}
