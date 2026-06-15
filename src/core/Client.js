/**
 * @fileOverview Baileys socket wrapper with v1.2.5 Absolute Stability.
 * v1.2.5-EXPERT: Optimized for 24/7 Cloud Persistence.
 * Version: Baileys 6.7.22 (Enforced)
 */
import makeWASocket, { 
  useMultiFileAuthState, 
  DisconnectReason, 
  Browsers,
  fetchLatestBaileysVersion,
  makeInMemoryStore
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
    this.store = makeInMemoryStore({ logger: pino({ level: 'silent' }) });
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

    this.sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      logger: pino({ level: 'silent' }),
      browser: Browsers.ubuntu('Chrome'),
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true,
      syncFullHistory: false, // PREVENT 408 TIMEOUTS & BAD MAC
      shouldSyncHistoryMessage: () => false, // PREVENT 408 TIMEOUTS
      patchMessageBeforeSending: (message) => {
        const requiresPatch = !!(
          message.buttonsMessage ||
          message.templateMessage ||
          message.listMessage
        );
        if (requiresPatch) {
          message = {
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadataVersion: 2,
                  deviceListMetadata: {},
                },
                ...message,
              },
            },
          };
        }
        return message;
      },
    });

    this.store?.bind(this.sock.ev);
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
        this.bot.config.owners = [myNum];

        console.log(`\n┌──⌈ 🚀 ASTRAX ONLINE ⌋`);
        console.log(`┃ Account: ${this.sock.user.name || 'AstraX Node'}`);
        console.log(`┃ Owner ID: ${myNum}`);
        console.log(`┃ Engine: Baileys 6.7.22`);
        console.log(`┃ Status: SYSTEM_STABLE_24/7`);
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
    const prefix = await this.bot.managers.settings.get('core', 'prefix') || '!';
    const uniqueCount = new Set(this.bot.commands.values()).size;
    const thumbnail = this.bot.config.thumbnail;

    const msg = `┌──⌈ 🌌 ASTRAX ENTERPRISE ⌋
┃
┃ Status: NODE_SYNCHRONIZED
┃ Account: @${myNum}
┃ Prefix: [ ${prefix} ]
┃ 
├─⊷ Modules: ${uniqueCount} Logic Blocks
├─⊷ Warden: ARMED
├─⊷ Mode: PUBLIC_ACTIVE
┃
┃ Use ${prefix}help to begin.
└────────────────`;

    if (thumbnail) {
      await this.sock.sendMessage(jid, { 
        image: { url: thumbnail },
        caption: msg,
        mentions: [jid]
      }).catch(() => {});
    } else {
      await this.sock.sendMessage(jid, { text: msg, mentions: [jid] }).catch(() => {});
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