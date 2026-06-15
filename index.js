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

if (!fs.existsSync(BASE_SESSION_DIR)) {
  fs.mkdirSync(BASE_SESSION_DIR, { recursive: true });
}

/**
 * BOT ENGINE BOOT
 * Runs only if SESSION_ID is present in environment variables.
 */
if (process.env.SESSION_ID) {
  const sessionName = process.env.SESSION_NAME || 'AstraX-Main';
  const targetDir = join(BASE_SESSION_DIR, sessionName);
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    try {
      const decoded = Buffer.from(process.env.SESSION_ID.split('~')[1] || process.env.SESSION_ID, 'base64').toString();
      fs.writeFileSync(join(targetDir, 'creds.json'), decoded);
      console.log(`==> ENGINE: Session credentials restored to ${targetDir}`);
    } catch (e) {
      console.error('==> ERROR: Failed to decode SESSION_ID. Ensure it is a valid base64 string.');
    }
  }

  bot.init().catch(err => {
    console.error('==> CRITICAL: Bot initialization failed:', err);
  });
}

/**
 * SESSION GENERATOR SERVER
 * Runs if SESSION_ID is missing or if explicitly requested.
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
    ramUsage: `${ramPercent}%`,
    uptime: Math.floor(process.uptime())
  });
});

const activeSessions = new Map();

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

      const credsString = JSON.stringify(state.creds);
      const base64Session = Buffer.from(credsString).toString('base64');
      const finalSessionId = `ASTRAX~${base64Session}`;

      await sock.sendMessage(sock.user.id, { text: finalSessionId });
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

// Start generator server if no session is active
if (!process.env.SESSION_ID) {
  io.on('connection', (socket) => {
    const userId = `user_${Date.now()}`;
    createNewSession(userId, socket);
  });

  server.listen(PORT, () => {
    console.log(`==> SERVER: Generator operational on port ${PORT}`);
  });
}
