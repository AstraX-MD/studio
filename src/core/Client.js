
/**
 * @fileOverview Wrapper for the Baileys socket connection.
 */
import makeWASocket, { 
  useMultiFileAuthState, 
  DisconnectReason, 
  Browsers 
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import path from 'path';
import fs from 'fs';

class Client {
  constructor(bot) {
    this.bot = bot;
    this.sock = null;
    this.sessionId = 'AstraX-Main';
  }

  async connect() {
    const sessionDir = path.resolve('./sessions', this.sessionId);
    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

    this.sock = makeWASocket({
      auth: state,
      printQRInTerminal: true,
      logger: this.bot.logger.child({ module: 'baileys' }),
      browser: Browsers.ubuntu('Chrome'),
      markOnlineOnConnect: true
    });

    this.sock.ev.on('creds.update', saveCreds);

    this.sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect } = update;
      
      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect.error instanceof Boom) 
          ? lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut 
          : true;
        
        this.bot.logger.error(`Connection closed. Reconnecting: ${shouldReconnect}`);
        if (shouldReconnect) this.connect();
      } else if (connection === 'open') {
        this.bot.logger.info('WhatsApp connection opened successfully.');
      }
    });

    // Pipe events to the central EventHandler
    this.sock.ev.process(async (events) => {
      await this.bot.handlers.event.handle(events);
    });

    return this.sock;
  }

  async sendMessage(jid, content, options = {}) {
    return await this.sock.sendMessage(jid, content, options);
  }
}

export default Client;
