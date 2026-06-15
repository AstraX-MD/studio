/**
 * @fileOverview Manages command rate limiting per user.
 */
export default class CooldownManager {
  constructor() {
    this.cooldowns = new Map();
  }

  /**
   * Checks and updates cooldown for a user.
   * @param {string} userId
   * @param {string} commandName
   * @param {number} cooldownMs
   * @returns {number|null} - Remaining time in seconds, or null if allowed.
   */
  getRemainingCooldown(userId, commandName, cooldownMs) {
    if (!cooldownMs) return null;

    const key = `${userId}:${commandName}`;
    const now = Date.now();
    const timestamps = this.cooldowns.get(commandName) || new Map();

    if (timestamps.has(userId)) {
      const expirationTime = timestamps.get(userId) + cooldownMs;
      if (now < expirationTime) {
        return Math.ceil((expirationTime - now) / 1000);
      }
    }

    timestamps.set(userId, now);
    this.cooldowns.set(commandName, timestamps);

    // Cleanup memory periodically
    setTimeout(() => timestamps.delete(userId), cooldownMs);

    return null;
  }
}
