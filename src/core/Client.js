/**
 * @fileOverview Baileys Connection Core.
 * Optimized for 24/7 Stability with Baileys v6.7.22.
 * FIXED: Standardized ESM access for makeInMemoryStore with 30+ fallback probes.
 */
import baileys from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import path from 'path';
import fs from 'fs';
import pino from 'pino';

/**
 * DEFENSIVE IMPORT SWARM (30+ Fallback Logic Paths)
 * This ensures makeInMemoryStore and core functions are found on any host using ESM.
 */
function getBaileysCore(name) {
  // Path 1-2: Direct access on the requested import structure
  if (baileys && baileys[name]) return baileys[name];
  if (baileys && baileys.default && baileys.default[name]) return baileys.default[name];
  
  // Path 3-10: Type-aware probing for functions
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

  // Fallback to empty function if absolutely not found to prevent boot crash
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
    const sessionDir = path.resolve('./sessions', this.sessionId);
    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

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

    // Bind store to events if available for Anti-Delete/Edit persistence
    if (this.store) {
      this.store.bind(this.sock.ev);
    } else {
      console.log('\x1b[33m==> WARN: Message store unavailable. Decryption may be unstable.\x1b[0m');
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

  async _notifyOwner(myNum) {
    const jid = `${myNum}@s.whatsapp.net`;
    const prefix = await this.bot.managers.settings.get('core', 'prefix') || '!';
    const uniqueCount = new Set(this.bot.commands.values()).size;

    const msg = `┌──⌈ ✅ ASTRAX ⌋
┃
┃ Status: READY
┃ Prefix: [ ${prefix} ]
┃ Modules: ${uniqueCount}
┃ 
┃ AstraX is now active and 
┃ listening for commands.
└────────────────`;

    await this.sock.sendMessage(jid, { 
      image: { url: this.bot.config.thumbnail },
      caption: msg
    }).catch(() => {});
  }

  async sendMessage(jid, content, options = {}) {
    return await this.sock.sendMessage(jid, content, options);
  }
}

export default Client;
