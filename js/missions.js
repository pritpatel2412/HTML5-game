/**
 * Stardust Merge - Daily Missions & 7-Day Streak Engine
 * Generates 3 deterministic daily missions per calendar date and tracks consecutive streaks with streak freeze.
 */

const STORAGE_KEY = 'stardust_missions_v1';
const STREAK_KEY = 'stardust_streak_v1';

export const Missions = {
  data: {
    date: '',
    missions: [],
    streak: 0,
    lastPlayDate: '',
    hasStreakFreeze: true
  },

  getTodayString() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },

  getYesterdayString() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },

  init() {
    this.load();
    const today = this.getTodayString();
    if (this.data.date !== today) {
      this.generateNewMissions(today);
      this.updateStreak(today);
    }
  },

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.data = JSON.parse(raw);
      }
    } catch (e) {}
  },

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {}
  },

  generateNewMissions(dateStr) {
    // Generate deterministic hash from dateStr
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash);

    const templates = [
      { id: 'merges_30', desc: 'Perform 30 Cosmic Merges', target: 30, type: 'merges', reward: 60 },
      { id: 'reach_luna', desc: 'Synthesize Luna the Moon (Tier 5)', target: 1, type: 'reach_tier', tier: 5, reward: 80 },
      { id: 'combo_4', desc: 'Trigger a 4x Merge Combo', target: 4, type: 'combo', reward: 100 },
      { id: 'merges_50', desc: 'Perform 50 Total Merges', target: 50, type: 'merges', reward: 120 },
      { id: 'reach_sunny', desc: 'Synthesize Sunny (Tier 9)', target: 1, type: 'reach_tier', tier: 9, reward: 150 },
      { id: 'score_10k', desc: 'Score 10,000 points in a single run', target: 10000, type: 'score', reward: 100 },
      { id: 'supernova_1', desc: 'Trigger 1 Supernova Ascension', target: 1, type: 'supernova', reward: 200 }
    ];

    const m1 = templates[seed % 2]; // merge target
    const m2 = templates[2 + ((seed >> 2) % 3)]; // tier/combo target
    const m3 = templates[5 + ((seed >> 4) % 2)]; // high score / supernova target

    this.data.date = dateStr;
    this.data.missions = [
      { ...m1, current: 0, completed: false, claimed: false },
      { ...m2, current: 0, completed: false, claimed: false },
      { ...m3, current: 0, completed: false, claimed: false }
    ];
    this.save();
  },

  updateStreak(today) {
    const yesterday = this.getYesterdayString();
    if (!this.data.lastPlayDate) {
      this.data.streak = 1;
      this.data.hasStreakFreeze = true;
    } else if (this.data.lastPlayDate === yesterday) {
      this.data.streak = (this.data.streak || 0) + 1;
    } else if (this.data.lastPlayDate !== today) {
      // Missed a day: use streak freeze if available
      if (this.data.hasStreakFreeze) {
        this.data.hasStreakFreeze = false;
        console.log('[Missions] Streak freeze consumed! Consecutive streak preserved at', this.data.streak);
      } else {
        this.data.streak = 1;
        this.data.hasStreakFreeze = true; // refreshed for new cycle
      }
    }
    this.data.lastPlayDate = today;
    this.save();
  },

  onEvent(type, value) {
    let changed = false;
    this.data.missions.forEach((m) => {
      if (m.completed) return;
      if (m.type === type) {
        if (type === 'reach_tier') {
          if (value >= m.tier) {
            m.current = 1;
            m.completed = true;
            changed = true;
          }
        } else if (type === 'combo' || type === 'score') {
          if (value >= m.target) {
            m.current = value;
            m.completed = true;
            changed = true;
          }
        } else if (type === 'merges') {
          m.current += (value || 1);
          if (m.current >= m.target) {
            m.current = m.target;
            m.completed = true;
            changed = true;
          }
        } else if (type === 'supernova') {
          m.current += 1;
          if (m.current >= m.target) {
            m.completed = true;
            changed = true;
          }
        }
      }
    });

    if (changed) {
      this.save();
      this.render();
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('stardust:mission-updated'));
      }
    }
  },

  claimReward(idx) {
    const m = this.data.missions[idx];
    if (m && m.completed && !m.claimed) {
      m.claimed = true;
      this.save();

      // Add coins to game save
      try {
        const raw = localStorage.getItem('stardust_merge_save_v1');
        if (raw) {
          const s = JSON.parse(raw);
          s.coins = (s.coins || 0) + m.reward;
          localStorage.setItem('stardust_merge_save_v1', JSON.stringify(s));
          if (window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('stardust:coins-updated', { detail: { coins: s.coins } }));
          }
        }
      } catch (e) {}

      if (window.Analytics) {
        window.Analytics.track('mission_complete', { mission_id: m.id, reward: m.reward });
      }
      this.render();
    }
  },

  render() {
    const container = document.getElementById('missionsContainer');
    if (!container) return;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; background:var(--night-3); padding:10px 14px; border:2px solid var(--ink); border-radius:var(--radius-md);">
        <div>
          <span style="font-family:var(--font-display); color:var(--mustard);">Daily Streak: ${this.data.streak} Days 🔥</span>
          <div style="font-size:11px; opacity:0.85;">Streak Freeze: ${this.data.hasStreakFreeze ? '🛡️ Available' : '❄️ Used'}</div>
        </div>
        <div style="font-size:12px; color:var(--mint); font-weight:800;">7-Day Goal: +500 Coins</div>
      </div>
      <div style="display:flex; flex-direction:column; gap:10px;">
        ${this.data.missions.map((m, idx) => `
          <div style="background:var(--night-2); border:2px solid var(--ink); border-radius:var(--radius-md); padding:12px; display:flex; justify-content:space-between; align-items:center; box-shadow:var(--hard-shadow-sm);">
            <div>
              <div style="font-family:var(--font-display); font-size:14px; color:${m.completed ? 'var(--mint)' : 'var(--cream)'};">
                ${m.desc} ${m.completed ? '✓' : `(${m.current}/${m.target})`}
              </div>
              <div style="font-size:11px; color:var(--mustard);">Reward: +${m.reward} Coins</div>
            </div>
            ${m.completed && !m.claimed ?
              `<button class="btn-primary" onclick="window.Missions.claimReward(${idx})" style="padding:4px 10px; font-size:12px;">Claim</button>` :
              (m.claimed ? `<span style="font-size:12px; color:var(--mint); font-weight:800;">Claimed</span>` : `<span style="font-size:11px; opacity:0.7;">In Progress</span>`)
            }
          </div>
        `).join('')}
      </div>
    `;
  }
};

if (typeof window !== 'undefined') {
  window.Missions = Missions;
}
