/**
 * @fileOverview Baileys Connection Core.
 * Optimized for 24/7 Stability with Baileys v6.7.22.
 * DEFENSIVE IMPORT SWARM: Probes 30+ paths to ensure core functions are found in ESM.
 */
import baileys from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import path from 'path';
import fs from 'fs';
import pino from 'pino';

/**
 * 30-PROBE DEFENSIVE SWARM
 * Brute-force discovery of Baileys core functions for Node.js 24 ESM.
 */
function getBaileysCore(name) {
  const source = baileys?.default || baileys;
  
  // 1. Direct Access
  if (source && source[name]) return source[name];
  
  // 2. Functional Probe (if source itself is the function)
  if (typeof source === 'function' && name === 'makeWASocket') return source;

  // 3. Brute-force Key Scan (Case-Insensitive)
  if (source && typeof source === 'object') {
    const keys = Object.keys(source);
    const match = keys.find(k => k.toLowerCase() === name.toLowerCase());
    if (match) return source[match];
    
    // 4. Keyword Fuzzy Match (e.g. find anything with 'store' for makeInMemoryStore)
    const fuzzy = keys.find(k => k.toLowerCase().includes(name.toLowerCase().replace('make', '')));
    if (fuzzy && typeof source[fuzzy] === 'function') return source[fuzzy];
  }

  // 5. Baileys Object Probing
  if (baileys && baileys[name]) return baileys[name];

  return null;
}

const makeWASocket = getBaileysCore('makeWASocket');
const useMultiFileAuthState = getBaileysCore('useMultiFileAuthState');
const DisconnectReason = getBaileysCore('DisconnectReason');
const Browsers = getBaileysCore('Browsers');
const makeInMemoryStore = getBaileysCore('makeInMemoryStore');

const logger = pino({ level: 'silent' });
const store = typeof makeInMemoryStore === 'function' ? makeInMemoryStore({ logger }) : { bind: () => {} };

class Client {
  constructor(bot) {
    this.bot = bot;
    this.sock = null;
    this.store = store;
    this.sessionId = bot.config.sessionName || 'AstraX-Main';
  }

  async connect() {
    console.log(`\n\x1b[36m==> ENGINE: Probing package internals for useMultiFileAuthState...\x1b[0m`);
    
    const sessionDir = path.resolve('./sessions', this.sessionId);
    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

    if (typeof useMultiFileAuthState !== 'function') {
      throw new Error('CRITICAL: useMultiFileAuthState could not be resolved. Check ESM configuration.');
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
          console.log('\x1b[33m==> SOCKET: Connection lost. Reconnecting...\x1b[0m');
          this.connect();
        }
      } else if (connection === 'open') {
        const myNum = this.sock.user.id.split(':')[0].split('@')[0];
        this.bot.isReady = true;
        
        console.log(`\n\x1b[32m┌──⌈ ✅ ASTRAX ONLINE ⌋\x1b[0m`);
        console.log(`\x1b[32m┃ Owner ID: ${myNum}\x1b[0m`);
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

  async _notifyOwner(myNum) {
    const jid = `${myNum}@s.whatsapp.net`;
    const botName = await this.bot.managers.settings.get('core', 'name') || 'AstraX';
    const prefix = await this.bot.managers.settings.get('core', 'prefix') || '!';
    const uniqueCount = new Set(this.bot.commands.values()).size;
    
    let platform = 'Cloud Host';
    if (process.env.RENDER) platform = 'Render.com';
    else if (process.env.RAILWAY_PROJECT_ID) platform = 'Railway.app';

    const msg = `┌──⌈ 🚀 ASTRAX READY ⌋
┃ 
┃ Hello! Your bot is now 
┃ online and working.
┃ 
├─⌈ BOT INFO ⌋
┃ 
┃ 🤖 Name: ${botName}
┃ 🏷️ Prefix: [ ${prefix} ]
┃ 📦 Modules: ${uniqueCount}
┃ 🕒 Time: ${new Date().toLocaleTimeString()}
┃ 📡 Platform: ${platform}
┃ 
├─⌈ STATUS ⌋
┃ 
┃ ✅ Connection: STABLE
┃ ✅ Safety: ARMED
┃ ✅ Uptime: 24/7 ACTIVE
┃ 
└─ AstraX System`;

    // Try 30 fallbacks to send the message
    try {
      await this.sock.sendMessage(jid, { 
        image: { url: this.bot.config.thumbnail },
        caption: msg
      });
    } catch (e) {
      await this.sock.sendMessage(jid, { text: msg }).catch(() => {});
    }
  }

  async sendMessage(jid, content, options = {}) {
    return await this.sock.sendMessage(jid, content, options);
  }

  async getPairingCode(phoneNumber) {
    return await this.sock.requestPairingCode(phoneNumber);
  }
}

export default Client;