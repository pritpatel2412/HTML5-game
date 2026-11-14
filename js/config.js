/**
 * Stardust Merge - Master Configuration & Global Placeholders
 * All paths must be relative ("./") to support GitHub Pages subpath and custom domains.
 */
export const CONFIG = {
  // --- REQUIRED PLACEHOLDERS ---
  SITE_URL: 'https://pritpatel2412.github.io/HTML5-game/',
  GAME_NAME: 'Stardust Merge',
  OWNER_NAME: 'Prit Patel',
  CONTACT_EMAIL: 'pritpatel2412@gmail.com',
  FORM_ENDPOINT: 'https://api.web3forms.com/submit', // PLACEHOLDER: Replace with your actual Web3Forms or Formspree access key / URL
  COUNTRY_FOR_TERMS: 'India',
  GA4_ID: 'G-XXXXXXXXXX', // PLACEHOLDER: Replace with your Google Analytics 4 Measurement ID, e.g. 'G-1234567890'

  // --- VERSIONING & STORAGE ---
  APP_VERSION: '1.0.0',
  CACHE_NAME: 'stardust-v1.0.0',
  STORAGE_KEY: 'stardust_merge_save_v1',
  RUNS_COUNT_KEY: 'stardust_runs_count_v1',
  INSTALL_PROMPT_KEY: 'stardust_install_dismissed_v1',
  CONSENT_STORAGE_KEY: 'stardust_consent_v1',
  SCHEMA_VERSION: 2,

  // --- GAMEPLAY CONSTANTS ---
  LOGICAL_WIDTH: 400,
  LOGICAL_HEIGHT: 700,
  EVENT_HORIZON_Y: 146,
  DROP_SPAWN_Y: 84,
  DROP_COOLDOWN_MS: 350,
  BASE_GRACE_MS: 2500,
  SLOW_ORBIT_BONUS_MS: 1500,
  BASE_COMBO_WINDOW_MS: 1200,
  COMBO_KEEPER_BONUS_MS: 1000,
  MAX_COMBO: 8,
  WALL_THICKNESS: 60,

  // --- ADS & MONETIZATION POLICY FLAGS ---
  // Google AdSense policy: No standard display ads in standalone app windows lacking browser navigation.
  ADS_IN_STANDALONE: 'off',
  ADS_STANDALONE_H5: true, // Rewarded / interstitial via H5 Games Ad Placement API permitted in game context

  ADS: {
    ENABLED: true,
    PUBLISHER_ID: 'ca-pub-8074288228358823',
    SLOTS: {
      LEFT_RAIL: '1111111111',
      RIGHT_RAIL: '2222222222',
      LEADERBOARD: '3333333333',
      MOBILE_BANNER: '4444444444',
      CONTENT_RESPONSIVE: '5555555555'
    },
    INTERSTITIAL_MIN_RUNS: 3,
    INTERSTITIAL_COOLDOWN_MS: 120000,
    FIRST_SESSION_GRACE_MS: 90000,
    SIMULATED_DURATION_SEC: 3
  },

  // --- 11 COSMIC ORB CREATURE TIERS ---
  TIERS: [
    { tier: 1, id: 'dust', charName: 'Dusty', name: 'Dust', radius: 13, color: '#C9D6E3', stroke: '#1E2B33', pattern: 'dots', lore: 'A gentle fleck of cosmic stardust dreaming of becoming a star.' },
    { tier: 2, id: 'spark', charName: 'Sparky', name: 'Spark', radius: 19, color: '#FFD84D', stroke: '#1E2B33', pattern: 'diamond', lore: 'Bursting with playful electricity and boundless cheer.' },
    { tier: 3, id: 'comet', charName: 'Commy', name: 'Comet', radius: 26, color: '#7FD6E8', stroke: '#1E2B33', pattern: 'tail', lore: 'Racing across frozen orbits with icy curiosity and a wagging tail.' },
    { tier: 4, id: 'asteroid', charName: 'Rocky', name: 'Asteroid', radius: 33, color: '#B58B6B', stroke: '#1E2B33', pattern: 'polygon', lore: 'A sturdy, thoughtful pebble wandering the celestial belt.' },
    { tier: 5, id: 'moon', charName: 'Luna', name: 'Moon', radius: 41, color: '#EDE6D6', stroke: '#1E2B33', pattern: 'craters', lore: 'Softly reflecting distant starlight with a serene sleepy smile.' },
    { tier: 6, id: 'ember', charName: 'Emberly', name: 'Ember', radius: 50, color: '#FF7A59', stroke: '#1E2B33', pattern: 'swirl', lore: 'A cozy molten heart crackling with warm cosmic energy.' },
    { tier: 7, id: 'ocean-world', charName: 'Bubbly', name: 'Ocean World', radius: 60, color: '#3C8DDE', stroke: '#1E2B33', pattern: 'waves', lore: 'Enormous deep-space tides singing harmonic planetary lullabies.' },
    { tier: 8, id: 'ringed-giant', charName: 'Saturny', name: 'Ringed Giant', radius: 71, color: '#F29CB7', stroke: '#1E2B33', pattern: 'ring', lore: 'Sporting magnificent dusty hula hoops and pastel elegance.' },
    { tier: 9, id: 'sun', charName: 'Sunny', name: 'Sun', radius: 83, color: '#FFB300', stroke: '#1E2B33', pattern: 'rays', lore: 'Radiant cosmic cheerfulness powering the entire galaxy with warmth.' },
    { tier: 10, id: 'neutron-star', charName: 'Neutry', name: 'Neutron Star', radius: 96, color: '#2FB7A3', stroke: '#1E2B33', pattern: 'pulsar', lore: 'Ultra-dense, rhythmic heartbeat spinning hundreds of times per second.' },
    { tier: 11, id: 'black-hole', charName: 'Coco', name: 'Black Hole', radius: 110, color: '#1E2B33', stroke: '#F4E9D4', ringColor: '#FF6B57', pattern: 'accretion', lore: 'The cuddliest void in space, hugging starlight with infinite affection.' }
  ],

  // Base drop weights (tiers 1-4)
  SPAWN_WEIGHTS: [
    { tier: 1, weight: 42 },
    { tier: 2, weight: 30 },
    { tier: 3, weight: 19 },
    { tier: 4, weight: 9 }
  ]
};

// Also attach to window for scripts that do not use ES modules
if (typeof window !== 'undefined') {
  window.APP_CONFIG = CONFIG;
}
