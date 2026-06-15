/**
 * @fileOverview Main entry point for AstraX Enterprise.
 * Differentiates between Bot Mode (SESSION_ID) and Generator Mode.
 */
import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pino from 'pino';
import fs from 'fs';
import os from 'os';
import qrcode from 'qrcode';
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  Browsers,
  fetchLatestBaileysVersion
} from '@whiskeysockets/baileys';

// Import Bot Core
import bot from './src/core/Bot.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_SESSION_DIR = './sessions';
const MAX_RAM_PERCENT = 75;
const SESSION_TIMEOUT_MINUTES = 15;
const QR_TIMEOUT_SECONDS = 60;
const POST_OPEN_WAIT_MS = 10000;

const BOT_NAME = process.env.BOT_NAME || 'AstraX';
const BOT_THUMBNAIL = 'https://i.ibb.co/QvGY7dqB/file-00000000e1107243ad54749c06fe2d80.png';
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbCBgLmCMY0GES5inT3p';
const CHANNEL_NAME = 'ASTRAX';
const FORWARD_SCORE = 430;
const CHANNEL_JID = ''; 

if (!fs.existsSync(BASE_SESSION_DIR)) {
  fs.mkdirSync(BASE_SESSION_DIR, { recursive: true });
}

/**
 * SESSION_ID BOOT LOGIC
 * If a SESSION_ID is provided in the environment, decode it and setup the session folder.
 */
if (process.env.SESSION_ID) {
  const sessionName = process.env.SESSION_NAME || 'AstraX-Main';
  const targetDir = join(BASE_SESSION_DIR, sessionName);
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    try {
      const decoded = Buffer.from(process.env.SESSION_ID.split('~')[1] || process.env.SESSION_ID, 'base64').toString();
      fs.writeFileSync(join(targetDir, 'creds.json'), decoded);
      console.log(`==> AstraX: Session creds restored to ${targetDir}`);
    } catch (e) {
      console.error('==> AstraX: Failed to decode SESSION_ID. Ensure it is a valid base64 string.');
    }
  }

  // Boot the bot engine
  console.log('==> AstraX: Bot Mode Active. Initializing...');
  bot.init().catch(err => {
    console.error('==> AstraX: Bot boot failed:', err);
  });
}

/**
 * SESSION GENERATOR SERVER
 * Runs only if SESSION_ID is not present or if specifically configured to run alongside.
 */
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
  transports: ['websocket', 'polling']
});
const PORT = process.env.PORT || 10000;

app.use(express.static(join(__dirname, 'public')));
app.use(express.json());

app.get('/status', (req, res) => {
  const memUsage = process.memoryUsage();
  const totalMem = os.totalmem();
  const usedMem = memUsage.rss;
  const ramPercent = ((usedMem / totalMem) * 100).toFixed(2);

  res.json({
    status: 'alive',
    bot: BOT_NAME,
    ramUsage: `${ramPercent}%`,
    uptime: Math.floor(process.uptime())
  });
});

const activeSessions = new Map();

function getOldStyleChannelContext() {
  return {
    forwardingScore: FORWARD_SCORE,
    isForwarded: true,
    externalAdReply: {
      title: 'WhatsApp',
      body: `Contact: ${CHANNEL_NAME}`,
      mediaType: 1,
      thumbnailUrl: BOT_THUMBNAIL,
      mediaUrl: CHANNEL_LINK,
      sourceUrl: CHANNEL_LINK,
      showAdAttribution: true,
      renderLargerThumbnail: false,
      verifiedBizName: 'WhatsApp'
    },
    forwardedNewsletterMessageInfo: {
      newsletterJid: CHANNEL_JID,
      newsletterName: CHANNEL_NAME,
      serverMessageId: Math.floor(Math.random() * 100000)
    }
  };
}

async function createNewSession(userId, socket) {
  const sessionDir = join(BASE_SESSION_DIR, userId);
  if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: 'silent' }),
    browser: Browsers.ubuntu('Chrome'),
    markOnlineOnConnect: true,
    qrTimeout: QR_TIMEOUT_SECONDS * 1000
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, qr } = update;

    if (qr) {
      const qrImage = await qrcode.toDataURL(qr, { width: 400 });
      socket.emit('qr', qrImage);
      socket.emit('status', 'Scan QR Code or Use Pair Code');
    }

    if (connection === 'open') {
      socket.emit('status', 'Connected! Preparing Session ID...');
      await new Promise(r => setTimeout(r, POST_OPEN_WAIT_MS));

      const welcomeText = `┌──⌈ ${BOT_NAME.toUpperCase()} CORE ⌋
┃ Engine: Active
┃ AI Core: Online
┃ Status: Running
┃ Plugins: 500+
└────────────────

Connection successful! Subscribed to ${CHANNEL_NAME}.
Preparing your Session ID...`;

      await sock.sendMessage(sock.user.id, { 
        text: welcomeText,
        contextInfo: getOldStyleChannelContext()
      });

      const credsString = JSON.stringify(state.creds);
      const base64Session = Buffer.from(credsString).toString('base64');
      const finalSessionId = `ASTRAX~${base64Session}`;

      await sock.sendMessage(sock.user.id, { text: finalSessionId });
      
      const instructionsText = `┌──⌈ DEPLOYMENT GUIDE ⌋
┃ 1. FORK REPOSITORY
┃ 2. SETUP PLATFORM
┃ 3. SET ENV SESSION_ID
┃ 4. START ENGINE
└────────────────

*Step 1: Fork Repository*
github.com/astrax-enterprise/astrax

*Step 2: Choose Platform*
Render / Railway / VPS

*Step 3: Environment Variable*
Name: SESSION_ID
Value: (Paste the code above)

Need help? View channel for updates.`;

      await sock.sendMessage(sock.user.id, { 
        text: instructionsText,
        contextInfo: getOldStyleChannelContext()
      });

      socket.emit('success', finalSessionId);
      
      setTimeout(async () => {
        await sock.end();
        fs.rmSync(sessionDir, { recursive: true, force: true });
      }, SESSION_TIMEOUT_MINUTES * 60000);
    }
  });

  socket.on('request-pair-code', async (phoneNumber) => {
    const formattedNumber = phoneNumber.replace(/[^0-9]/g, '');
    const code = await sock.requestPairingCode(formattedNumber);
    socket.emit('pair-code', code);
  });
}

// Only run the socket server if we are in generator mode (no session ID)
if (!process.env.SESSION_ID) {
  io.on('connection', (socket) => {
    const userId = `user_${Date.now()}`;
    createNewSession(userId, socket);
  });

  server.listen(PORT, async () => {
    console.log(`==> AstraX: Generator Mode Active on port ${PORT}`);
  });
}