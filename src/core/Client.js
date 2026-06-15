/**
 * @fileOverview Baileys socket wrapper with v1.2.5 Absolute Stability.
 */
import makeWASocket, { 
  useMultiFileAuthState, 
  DisconnectReason, 
  Browsers,
  fetchLatestBaileysVersion
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import path from 'path';
import fs from 'fs';
import pino from 'pino';

class Client {
  constructor(bot) {
    this.bot = bot;
    this.sock = null;
    this.sessionId = bot.config.sessionName || 'AstraX-Main';
  }

  async connect() {
    const sessionDir = path.resolve('./sessions', this.sessionId);
    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

    // Cloud Session Injection
    const cloudSession = process.env.SESSION_ID;
    if (cloudSession && cloudSession.startsWith('ASTRAX~')) {
      try {
        const base64Data = cloudSession.split('ASTRAX~')[1];
        const credsData = Buffer.from(base64Data, 'base64').toString('utf-8');
        fs.writeFileSync(path.join(sessionDir, 'creds.json'), credsData);
        console.log(`==> AUTH: Session ID injection successful.`);
      } catch (e) {
        console.log(`==> AUTH: Injection failed - ${e.message}`);
      }
    }

    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    const { version } = await fetchLatestBaileysVersion();

    this.sock = makeWASocket({
      auth: state,
      version,
      printQRInTerminal: false,
      logger: pino({ level: 'silent' }),
      browser: Browsers.ubuntu('Chrome'),
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true
    });

    this.sock.ev.on('creds.update', saveCreds);

    this.sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;
      
      if (qr && this.bot.io) {
        this.bot.io.emit('auth.qr', qr);
      }

      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect.error instanceof Boom) 
          ? lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut 
          : true;
        
        if (shouldReconnect) {
          console.log('==> SOCKET: Connection lost. Reconnecting...');
          this.connect();
        }
      } else if (connection === 'open') {
        const myNum = this.sock.user.id.split(':')[0];
        this.bot.isReady = true;
        
        // Auto-resolve Owner
        if (!this.bot.config.owners.includes(myNum)) {
          this.bot.config.owners.push(myNum);
        }

        console.log(`\n┌──⌈ 🚀 ASTRAX ONLINE ⌋`);
        console.log(`┃ Account: ${this.sock.user.name || 'AstraX Node'}`);
        console.log(`┃ Owner ID: ${myNum}`);
        console.log(`┃ Status: SYSTEM_STABLE`);
        console.log(`└───────────────────\n`);

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
    const msg = `┌──⌈ 🌌 ASTRAX ENTERPRISE ⌋\n┃\n┃ Status: NODE_SYNCHRONIZED\n┃ Identity: @${myNum}\n┃ Mode: SELF_AWARE_ACTIVE\n┃\n┃ Framework v1.2.5 is now ready.\n┃ All commands are functional.\n└────────────────`;
    await this.sock.sendMessage(jid, { text: msg, mentions: [jid] }).catch(() => {});
  }

  async getPairingCode(phoneNumber) {
    if (!this.sock) await this.connect();
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    return await this.sock.requestPairingCode(cleanNumber);
  }

  async sendMessage(jid, content, options = {}) {
    return await this.sock.sendMessage(jid, content, options);
  }
}

export default Client;
