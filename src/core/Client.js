/**
 * @fileOverview Baileys Connection Core.
 * v1.2.5: Optimized for 24/7 Stability with ESM compatibility.
 * FIXED: Standardized makeInMemoryStore access to prevent boot crashes.
 */
import pkg from '@whiskeysockets/baileys';
const { 
  default: makeWASocket, 
  useMultiFileAuthState, 
  DisconnectReason, 
  Browsers,
  makeInMemoryStore
} = pkg;
import { Boom } from '@hapi/boom';
import path from 'path';
import fs from 'fs';
import pino from 'pino';

// Persistent store to handle decryption states
const logger = pino({ level: 'silent' });
const store = makeInMemoryStore({ logger });

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
      browser: Browsers.ubuntu('Chrome'),
      markOnlineOnConnect: true,
      syncFullHistory: false, // SOLVES 408 TIMEOUT
      shouldSyncHistoryMessage: () => false, // PREVENTS BAD MAC ERRORS
      generateHighQualityLinkPreview: true
    });

    // Bind store to events
    this.store.bind(this.sock.ev);

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
        
        console.log(`\n\x1b[32m┌──⌈ 🚀 ASTRAX ONLINE ⌋\x1b[0m`);
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

    const msg = `┌──⌈ 🌌 ASTRAX ⌋
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
