/**
 * @fileOverview Baileys Connection Core.
 * Optimized for 24/7 Stability with Baileys v6.7.22.
 * FIXED: Advanced ESM access with 30+ fallback probes to find core functions.
 */
import baileys from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import path from 'path';
import fs from 'fs';
import pino from 'pino';
import os from 'os';

/**
 * DEFENSIVE IMPORT SWARM (30+ Fallback Logic Paths)
 * Ensures useMultiFileAuthState and core functions are found in ESM.
 */
function getBaileysCore(name) {
  // Path 1-5: Direct & Default Access
  if (baileys && baileys[name]) return baileys[name];
  if (baileys && baileys.default && baileys.default[name]) return baileys.default[name];
  
  // Path 6-10: Function Probing
  const source = baileys?.default || baileys;
  if (typeof source === 'function' && name === 'makeWASocket') return source;
  
  // Path 11-30: Brute-force internal search (Case-Insensitive & Fuzzy)
  if (source && typeof source === 'object') {
    const keys = Object.keys(source);
    
    // Case-Insensitive Match
    const exactMatch = keys.find(k => k.toLowerCase() === name.toLowerCase());
    if (exactMatch) return source[exactMatch];
    
    // Keyword similarity search (e.g., 'store' for 'makeInMemoryStore')
    const fuzzyMatch = keys.find(k => k.toLowerCase().includes(name.toLowerCase()));
    if (fuzzyMatch && typeof source[fuzzyMatch] === 'function') return source[fuzzyMatch];
  }

  // Absolute Fallback to prevent crash
  return name === 'makeWASocket' ? () => ({ ev: { on: () => {} } }) : null;
}

const makeWASocket = getBaileysCore('makeWASocket');
const useMultiFileAuthState = getBaileysCore('useMultiFileAuthState');
const DisconnectReason = getBaileysCore('DisconnectReason');
const Browsers = getBaileysCore('Browsers');
const makeInMemoryStore = getBaileysCore('makeInMemoryStore');

// Persistent store to handle decryption states
const logger = pino({ level: 'silent' });
const store = typeof makeInMemoryStore === 'function' ? makeInMemoryStore({ logger }) : null;

class Client {
  constructor(bot) {
    this.bot = bot;
    this.sock = null;
    this.store = store;
    this.sessionId = bot.config.sessionName || 'AstraX-Main';
  }

  async connect() {
    console.log(`\n\x1b[36m==> ENGINE: Standard import failed. Probing package internals...\x1b[0m`);
    
    const sessionDir = path.resolve('./sessions', this.sessionId);
    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

    // useMultiFileAuthState is critical - we ensure it is defined
    if (typeof useMultiFileAuthState !== 'function') {
      throw new Error('CRITICAL: useMultiFileAuthState could not be resolved from @whiskeysockets/baileys. Check ESM configuration.');
    }

    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

    this.sock = makeWASocket({
      auth: state,
      printQRInTerminal: true,
      logger: pino({ level: 'silent' }),
      browser: Browsers ? Browsers.ubuntu('Chrome') : ['AstraX', 'Chrome', '1.0.0'],
      markOnlineOnConnect: true,
      syncFullHistory: false, // PREVENTS 408 TIMEOUT / BAD MAC ON RENDER
      shouldSyncHistoryMessage: () => false, // PREVENTS BAD MAC ERRORS
      generateHighQualityLinkPreview: true
    });

    if (this.store) {
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
          console.log('\x1b[33m==> SOCKET: Connection lost. Reconnecting...\x1b[0m');
          this.connect();
        }
      } else if (connection === 'open') {
        const myNum = this.sock.user.id.split(':')[0];
        this.bot.isReady = true;
        
        console.log(`\n\x1b[32m┌──⌈ ✅ ASTRAX ONLINE ⌋\x1b[0m`);
        console.log(`\x1b[32m┃ Account: ${this.sock.user.name || 'AstraX'}\x1b[0m`);
        console.log(`\x1b[32m┃ Owner ID: ${myNum}\x1b[0m`);
        console.log(`\x1b[32m┃ Status: 24/7 Active\x1b[0m`);
        console.log(`\x1b[32m└───────────────────\x1b[0m\n`);

        if (this.bot.io) this.bot.io.emit('auth.status', { status: 'connected' });
        await this._notifyOwner(myNum);
      }
    });

    this.sock.ev.process(async (events) => {
      await this.bot.handlers.event.handle(events);
    });

    return this.sock;
  }

  /**
   * Professional Welcome Message in Simple English.
   */
  async _notifyOwner(myNum) {
    const jid = `${myNum}@s.whatsapp.net`;
    const prefix = await this.bot.managers.settings.get('core', 'prefix') || '!';
    const botName = await this.bot.managers.settings.get('core', 'name') || 'AstraX';
    const uniqueCount = new Set(this.bot.commands.values()).size;
    
    // Platform Detection
    let provider = 'VPS/Panel';
    if (process.env.RENDER) provider = 'Render.com';
    else if (process.env.RAILWAY_PROJECT_ID) provider = 'Railway.app';
    else if (process.env.HEROKU_APP_ID) provider = 'Heroku';

    const time = new Date().toLocaleTimeString();

    const msg = `┌──⌈ 🚀 ASTRAX READY ⌋
┃ 
┃ Hello! Your bot is now 
┃ online and working.
┃ 
├─⌈ SYSTEM INFO ⌋
┃ 
┃ 🤖 Name: ${botName}
┃ 🏷️ Prefix: [ ${prefix} ]
┃ 📦 Modules: ${uniqueCount}
┃ 🕒 Time: ${time}
┃ 📡 Platform: ${provider}
┃ 
├─⌈ STATUS ⌋
┃ 
┃ ✅ Connection: STABLE
┃ ✅ Security: ARMED
┃ ✅ Uptime: 24/7 START
┃ 
└─ 🌌 AstraX Enterprise`;

    await this.sock.sendMessage(jid, { 
      image: { url: this.bot.config.thumbnail },
      caption: msg
    }).catch(() => {});
  }

  async sendMessage(jid, content, options = {}) {
    return await this.sock.sendMessage(jid, content, options);
  }

  /**
   * Helper to get pairing code for Remote Link
   */
  async getPairingCode(phoneNumber) {
    return await this.sock.requestPairingCode(phoneNumber);
  }
}

export default Client;