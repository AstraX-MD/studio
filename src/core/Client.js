/**
 * AstraX - Client.js
 * Standardized ESM library access logic.
 */
import baileys from '@whiskeysockets/baileys';
import { logger } from './logger.js';

class Client {
  constructor(bot) {
    this.bot = bot;
    this.sock = null;
    this.sessionId = bot.config.sessionName || 'AstraX-Main';
  }

  /**
   * Defensive Swarm Probe
   * Finds functions in any ESM library structure.
   */
  probe(name) {
    const source = baileys?.default || baileys;
    if (source && source[name]) return source[name];
    if (source && typeof source === 'object') {
      const keys = Object.keys(source);
      const match = keys.find(k => k.toLowerCase() === name.toLowerCase());
      if (match) return source[match];
    }
    return null;
  }

  // Placeholder for auxiliary client logic.
  // Connection handling moved to index.js for better Render port-binding.
}

export default Client;
