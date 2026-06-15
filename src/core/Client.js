/**
 * @fileOverview Wrapper for the Baileys socket connection.
 * Enhanced with Session ID Injection for Cloud Portability.
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

    // CLOUD SESSION INJECTION: If SESSION_ID env exists, use it to restore state
    const cloudSession = process.env.SESSION_ID;
    if (cloudSession && cloudSession.startsWith('ASTRAX~')) {
      try {
        const base64Data = cloudSession.split('ASTRAX~')[1];
        const credsData = Buffer.from(base64Data, 'base64').toString('utf-8');
        fs.writeFileSync(path.join(sessionDir, 'creds.json'), credsData);
        console.log(`==> AUTH: Session ID restored from cloud environment.`);
      } catch (e) {
        console.error(`==> AUTH: Failed to inject cloud session:`, e.message);
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
        this.bot.isReady = true;
        console.log(`==> SOCKET: Authenticated as ${this.sock.user.name || 'AstraX Node'}`);
        if (this.bot.io) this.bot.io.emit('auth.status', { status: 'connected' });
        
        // Notify Owner of Online Status
        await this._notifyOwner();
      }
    });

    this.sock.ev.process(async (events) => {
      await this.bot.handlers.event.handle(events);
    });

    return this.sock;
  }

  async _notifyOwner() {
    const owner = this.bot.config.owners[0];
    if (owner) {
      const jid = owner.includes('@') ? owner : `${owner}@s.whatsapp.net`;
      const msg = `┌──⌈ 🌌 ASTRAX ONLINE ⌋\n┃\n┃ Status: SYSTEM_STABLE\n┃ Host: CLOUD-RENDER\n┃ Time: ${new Date().toLocaleTimeString()}\n┃\n┃ Framework is now ready.\n└────────────────`;
      await this.sock.sendMessage(jid, { text: msg }).catch(() => {});
    }
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