/**
 * @fileOverview Wrapper for the Baileys socket connection.
 * Enhanced with Real-Time Pairing (QR/Code) broadcasting for Dashboard.
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

    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    const { version } = await fetchLatestBaileysVersion();

    this.sock = makeWASocket({
      auth: state,
      version,
      printQRInTerminal: true,
      logger: pino({ level: 'silent' }),
      browser: Browsers.ubuntu('Chrome'),
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true
    });

    this.sock.ev.on('creds.update', saveCreds);

    this.sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;
      
      // Broadcast QR to Dashboard
      if (qr && this.bot.io) {
        this.bot.io.emit('auth.qr', qr);
      }

      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect.error instanceof Boom) 
          ? lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut 
          : true;
        
        this.bot.logger.error(`Connection closed. Reconnecting: ${shouldReconnect}`);
        if (shouldReconnect) this.connect();
      } else if (connection === 'open') {
        this.bot.isReady = true;
        this.bot.logger.info('WhatsApp connection opened successfully.');
        if (this.bot.io) this.bot.io.emit('auth.status', { status: 'connected' });
      }
    });

    // Pipe events to the central EventHandler
    this.sock.ev.process(async (events) => {
      await this.bot.handlers.event.handle(events);
    });

    return this.sock;
  }

  /**
   * Generates a pairing code for Linking via Phone Number.
   * Emits to Dashboard when ready.
   */
  async getPairingCode(phoneNumber) {
    if (!this.sock) await this.connect();
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    const code = await this.sock.requestPairingCode(cleanNumber);
    return code;
  }

  async sendMessage(jid, content, options = {}) {
    return await this.sock.sendMessage(jid, content, options);
  }
}

export default Client;