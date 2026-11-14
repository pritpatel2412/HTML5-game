/**
 * Stardust Merge - Gamepad API Controller
 * Supports standard gamepads (Xbox, PlayStation, Generic HID)
 * - D-Pad / Left Stick: aim dropper horizontally
 * - Button A / Cross: drop orb
 * - Button B / Circle: hold / swap
 * - Button Start / Menu: pause / resume
 */

export const GamepadController = {
  lastDropTime: 0,
  connected: false,

  init() {
    window.addEventListener('gamepadconnected', (e) => {
      console.log('[Gamepad] Controller connected:', e.gamepad.id);
      this.connected = true;
      if (window.UI && window.UI.showToast) {
        window.UI.showToast(`Gamepad Connected: ${e.gamepad.id.split('(')[0]}`);
      }
    });

    window.addEventListener('gamepaddisconnected', () => {
      console.log('[Gamepad] Controller disconnected');
      this.connected = false;
    });
  },

  poll(game) {
    if (!game || game.isGameOver) return;
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    if (!gamepads || !gamepads[0]) return;

    const pad = gamepads[0];
    if (!pad) return;

    // 1. Horizontal Aiming via Left Analog Stick (Axis 0) or D-Pad (Buttons 14 & 15)
    let moveX = 0;
    if (Math.abs(pad.axes[0]) > 0.15) {
      moveX = pad.axes[0] * 6;
    }
    if (pad.buttons[14] && pad.buttons[14].pressed) moveX = -4; // D-pad left
    if (pad.buttons[15] && pad.buttons[15].pressed) moveX = 4;  // D-pad right

    if (moveX !== 0 && game.dropperX !== undefined) {
      game.dropperX = Math.max(30, Math.min(370, game.dropperX + moveX));
    }

    const now = Date.now();

    // 2. Drop Orb: Button 0 (A on Xbox, Cross on PS)
    if (pad.buttons[0] && pad.buttons[0].pressed) {
      if (now - this.lastDropTime > 400) {
        this.lastDropTime = now;
        if (!game.isPaused && game.triggerDrop) {
          game.triggerDrop();
        }
      }
    }

    // 3. Hold / Swap: Button 1 (B on Xbox, Circle on PS)
    if (pad.buttons[1] && pad.buttons[1].pressed) {
      if (now - this.lastDropTime > 400) {
        this.lastDropTime = now;
        if (game.handleHoldSwap) {
          game.handleHoldSwap();
        }
      }
    }

    // 4. Pause / Menu: Button 9 (Start)
    if (pad.buttons[9] && pad.buttons[9].pressed) {
      if (now - this.lastDropTime > 500) {
        this.lastDropTime = now;
        if (window.UI && window.UI.toggleMenuSheet) {
          window.UI.toggleMenuSheet();
        }
      }
    }
  }
};

if (typeof window !== 'undefined') {
  window.GamepadController = GamepadController;
}
