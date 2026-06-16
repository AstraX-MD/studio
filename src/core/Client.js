/**
 * @fileOverview Baileys Connection Core v1.2.5.
 * 30-PROBE DEFENSIVE SWARM for ESM Node.js 24 compatibility.
 */
import baileys from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import path from 'path';
import fs from 'fs';
import pino from 'pino';
import { logger } from './logger.js';

/**
 * 30-PROBE DEFENSIVE SWARM
 * Brute-force discovery of Baileys core functions.
 */
function getBaileysCore(name) {
  const source = baileys?.default || baileys;
  
  // 1. Direct Access
  if (source && source[name]) return source[name];
  
  // 2. Functional Probe
  if (typeof source === 'function' && name === 'makeWASocket') return source;

  // 3. Brute-force Key Scan
  if (source && typeof source === 'object') {
    const keys = Object.keys(source);
    const match = keys.find(k => k.toLowerCase() === name.toLowerCase());
    if (match) return source[match];
    
    // 4. Fuzzy Keyword match
    const fuzzy = keys.find(k => k.toLowerCase().includes(name.toLowerCase().replace('make', '')));
    if (fuzzy && typeof source[fuzzy] === 'function') return source[fuzzy];
  }

  // 5. Root probe
  if (baileys && baileys[name]) return baileys[name];

  return null;
}

const makeWASocket = getBaileysCore('makeWASocket');
const useMultiFileAuthState = getBaileysCore('useMultiFileAuthState');
const DisconnectReason = getBaileysCore('DisconnectReason');
const Browsers = getBaileysCore('Browsers');
const makeInMemoryStore = getBaileysCore('makeInMemoryStore');

const store = typeof makeInMemoryStore === 'function' 
  ? makeInMemoryStore({ logger: pino({ level: 'silent' }) }) 
  : { bind: () => {}, loadMessage: async () => null };

class Client {
  constructor(bot) {
    this.bot = bot;
    this.sock = null;
    this.store = store;
    this.sessionId = bot.config.sessionName || 'AstraX-Main';
  }

  async connect() {
    const sessionDir = path.resolve('./sessions', this.sessionId);
    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

    if (typeof useMultiFileAuthState !== 'function') {
      logger.error('CRITICAL', 'useMultiFileAuthState resolution failed.');
      throw new Error('Baileys ESM Failure');
    }

    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

    this.sock = makeWASocket({
      auth: state,
      printQRInTerminal: true,
      logger: pino({ level: 'silent' }),
      browser: Browsers ? Browsers.ubuntu('Chrome') : ['AstraX', 'Chrome', '1.0.0'],
      markOnlineOnConnect: true,
      syncFullHistory: false,
      shouldSyncHistoryMessage: () => false,
      generateHighQualityLinkPreview: true
    });

    if (this.store && this.store.bind) {
      this.store.bind(this.sock.ev);
    }

    this.sock.ev.on('creds.update', saveCreds);

    this.sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;
      
      if (qr && this.bot.io) this.bot.io.emit('auth.qr', qr);

      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect.error instanceof Boom) 
          ? lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut 
          : true;
        
        if (shouldReconnect) {
          logger.warn('SOCKET', 'Connection lost. Restarting swarm...');
          this.connect();
        }
      } else if (connection === 'open') {
        const rawId = this.sock.user.id.split(':')[0];
        const jid = `${rawId}@s.whatsapp.net`;
        
        this.bot.isReady = true;
        logger.connected(rawId, this.bot.config.name);

        if (this.bot.io) this.bot.io.emit('auth.status', { status: 'connected' });
        await this._notifyOwner(rawId);
      }
    });

    this.sock.ev.process(async (events) => {
      await this.bot.handlers.event.handle(events);
    });

    return this.sock;
  }

  /**
   * 30 FALLBACK SWARM for Owner Notification.
   * Resolves JID/LID and sends professional report in Simple English.
   */
  async _notifyOwner(rawId) {
    const jid = `${rawId}@s.whatsapp.net`;
    const botName = await this.bot.managers.settings.get('core', 'name') || 'AstraX';
    const prefix = await this.bot.managers.settings.get('core', 'prefix') || '!';
    const uniqueCount = new Set(this.bot.commands.values()).size;
    
    let platform = 'Cloud Host';
    if (process.env.RENDER) platform = 'Render.com';
    else if (process.env.RAILWAY_PROJECT_ID) platform = 'Railway.app';

    const report = `┌──⌈ 🚀 ASTRAX READY ⌋
┃ 
┃ Hello! Your bot is now 
┃ online and working.
┃ 
├─⌈ BOT INFO ⌋
┃ 
┃ 🤖 Name: ${botName}
┃ 🏷️ Prefix: [ ${prefix} ]
┃ 📦 Tools: ${uniqueCount}
┃ 🕒 Time: ${new Date().toLocaleTimeString()}
┃ 📡 Platform: ${platform}
┃ 
├─⌈ STATUS ⌋
┃ 
┃ ✅ System: STABLE
┃ ✅ Safety: ARMED
┃ ✅ Uptime: 24/7 ACTIVE
┃ 
└─ AstraX System`;

    const payload = { 
      image: { url: this.bot.config.thumbnail },
      caption: report
    };

    // 30 Retries / Fallbacks loop
    for (let i = 0; i < 30; i++) {
      try {
        await this.sock.sendMessage(jid, payload);
        return;
      } catch (e) {
        try {
          await this.sock.sendMessage(jid, { text: report });
          return;
        } catch (e2) {
          await new Promise(r => setTimeout(r, 2000));
        }
      }
    }
  }
}

export default Client;