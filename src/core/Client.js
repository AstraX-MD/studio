/**
 * @fileOverview Baileys Connection Core.
 * Optimized for 24/7 stability with store persistence.
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

// Persistent store to fix Anti-Delete/Edit
const store = makeInMemoryStore({ logger: pino({ level: 'silent' }) });
store.readFromFile('./database/baileys_store.json');
setInterval(() => {
  store.writeToFile('./database/baileys_store.json');
}, 10000);

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

    // Inject Session from ENV
    const cloudSession = process.env.SESSION_ID;
    if (cloudSession && cloudSession.startsWith('ASTRAX~')) {
      try {
        const base64Data = cloudSession.split('ASTRAX~')[1];
        const credsData = Buffer.from(base64Data, 'base64').toString('utf-8');
        fs.writeFileSync(path.join(sessionDir, 'creds.json'), credsData);
        console.log(`\x1b[32m==> AUTH: Session connected.\x1b[0m`);
      } catch (e) {}
    }

    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

    this.sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      logger: pino({ level: 'silent' }),
      browser: Browsers.ubuntu('Chrome'),
      markOnlineOnConnect: true,
      syncFullHistory: false,
      shouldSyncHistoryMessage: () => false,
      generateHighQualityLinkPreview: true
    });

    // Bind store to track messages
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
        this.bot.config.owners = [myNum];

        console.log(`\n\x1b[32m┌──⌈ 🚀 ASTRAX ONLINE ⌋\x1b[0m`);
        console.log(`\x1b[32m┃ Account: ${this.sock.user.name || 'AstraX'}\x1b[0m`);
        console.log(`\x1b[32m┃ Owner ID: ${myNum}\x1b[0m`);
        console.log(`\x1b[32m┃ Status: Active 24/7\x1b[0m`);
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
    const thumbnail = this.bot.config.thumbnail;

    const msg = `┌──⌈ 🌌 ASTRAX ⌋
┃
┃ Status: ACTIVE
┃ Account: @${myNum}
┃ Prefix: [ ${prefix} ]
┃ Commands: ${uniqueCount}
┃ 
┃ Use ${prefix}help to start.
└────────────────`;

    await this.sock.sendMessage(jid, { 
      image: { url: thumbnail },
      caption: msg,
      mentions: [jid]
    }).catch(() => {});
  }

  async getPairingCode(phoneNumber) {
    if (!this.sock) await this.connect();
    return await this.sock.requestPairingCode(phoneNumber.replace(/[^0-9]/g, ''));
  }

  async sendMessage(jid, content, options = {}) {
    return await this.sock.sendMessage(jid, content, options);
  }
}

export default Client;